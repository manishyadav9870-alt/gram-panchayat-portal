import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import cors from "cors";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { runMigrations } from "./migrate";

// Log startup information
console.log("🚀 Starting Gram Panchayat Portal Server...");
console.log("📝 Environment:", process.env.NODE_ENV || "development");
console.log("🔧 Port:", process.env.PORT || "5000");
console.log("🗄️  Database URL set:", !!process.env.DATABASE_URL);

const app = express();

// CORS configuration - only needed in development when frontend and backend are separate
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve static files from public folder
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

// Session configuration
let sessionStore;
// Use PostgreSQL session store if DATABASE_URL is available (production or staging)
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
  const PgSession = connectPgSimple(session);
  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  sessionStore = new PgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true,
  });
  console.log("✅ Using PostgreSQL session store for persistent sessions");
} else {
  // Use MemoryStore for local development
  const MemoryStoreSession = MemoryStore(session);
  sessionStore = new MemoryStoreSession({
    checkPeriod: 86400000, // prune expired entries every 24h
  });
  console.log("⚠️  Using MemoryStore (local development only - sessions will be lost on restart)");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "gram-panchayat-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run database migrations before starting server
  await runMigrations();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
