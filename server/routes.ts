import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import csv from "csv-parser";
import * as XLSX from "xlsx";
import { Readable } from "stream";
import { storage } from "./storage";
import { generateBirthCertificatePDF, generateDeathCertificatePDF } from "./pdfGenerator";
import { extractTextFromPDFBuffer, parseBirthCertificate } from "./ocrProcessor";
import { 
  insertComplaintSchema, 
  insertBirthCertificateSchema, 
  insertDeathCertificateSchema,
  insertAnnouncementSchema,
  insertLeavingCertificateSchema,
  insertMarriageCertificateSchema
} from "@shared/schema";

// Extend Express Session type
declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
    role?: string;
  }
}

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Admin authentication middleware
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

// Multer configuration for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Multer configuration for CSV and Excel uploads
const uploadCSV = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const hasValidMime = allowedMimes.includes(file.mimetype);
    const hasValidExtension = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    if (hasValidMime || hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check user in database
      const user = await storage.getUserByUsername(username);
      
      if (user && user.password === password) {
        // In production, use bcrypt.compare() for password verification
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        res.json({ message: "Login successful", username: user.username, role: user.role });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session.userId) {
      res.json({ username: req.session.username });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  // Complaint routes
  app.post("/api/complaints", async (req, res) => {
    try {
      console.log('Received complaint data:', {
        ...req.body,
        images: req.body.images?.map((img: string) => `[Image ${img.length} chars]`)
      });
      
      const validatedData = insertComplaintSchema.parse(req.body);
      console.log('Validation successful');
      
      const complaint = await storage.createComplaint(validatedData);
      console.log('Complaint created successfully:', complaint.trackingNumber);
      
      res.status(201).json(complaint);
    } catch (error: any) {
      console.error('Error in complaint creation:', error);
      res.status(400).json({ message: error.message || "Invalid complaint data" });
    }
  });

  app.get("/api/complaints", async (req, res) => {
    try {
      const complaints = await storage.getAllComplaints();
      res.json(complaints);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch complaints" });
    }
  });

  app.get("/api/complaints/:trackingNumber", async (req, res) => {
    try {
      const complaint = await storage.getComplaintByTrackingNumber(req.params.trackingNumber);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch complaint" });
    }
  });

  app.patch("/api/complaints/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const complaint = await storage.updateComplaintStatus(req.params.id, status);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update complaint status" });
    }
  });

  // Birth Certificate routes
  app.post("/api/birth-certificates/test", async (req, res) => {
    try {
      // Create a test certificate without validation for testing
      const testData = {
        certificateNumber: 'BC-2025-TEST',
        registrationNumber: 'REG123',
        childNameEn: 'Test Child',
        childNameMr: 'टेस्ट मूल',
        sex: 'male',
        dateOfBirth: '2025-01-01',
        dateOfRegistration: '2025-01-10',
        placeOfBirthEn: 'Mumbai',
        placeOfBirthMr: 'मुंबई',
        motherNameEn: 'Test Mother',
        motherNameMr: 'टेस्ट आई',
        motherAadhar: '123456789012',
        fatherNameEn: 'Test Father',
        fatherNameMr: 'टेस्ट वडील',
        fatherAadhar: '123456789013',
        permanentAddressEn: 'Test Address, Mumbai',
        permanentAddressMr: 'टेस्ट पत्ता, मुंबई',
        birthAddress: '',
        issueDate: '2025-01-15',
        issuingAuthority: 'ग्रामपंचायत किशोर',
        remarksEn: 'Test',
        remarksMr: 'टेस्ट'
      };
      const certificate = await storage.createBirthCertificate(testData as any);
      res.status(201).json(certificate);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create test certificate" });
    }
  });

  app.post("/api/birth-certificates", async (req, res) => {
    try {
      console.log('=== Birth Certificate Creation Request ===');
      console.log('Received data:', JSON.stringify(req.body, null, 2));
      
      // Validate the data
      const validatedData = insertBirthCertificateSchema.parse(req.body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
      
      // Create certificate
      const certificate = await storage.createBirthCertificate(validatedData);
      console.log('Created certificate:', JSON.stringify(certificate, null, 2));
      
      res.status(201).json(certificate);
    } catch (error: any) {
      console.error('=== Birth Certificate Creation Error ===');
      console.error('Error:', error);
      if (error.errors) {
        console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
      }
      res.status(400).json({ 
        message: error.message || "Invalid birth certificate data", 
        errors: error.errors || []
      });
    }
  });

  app.get("/api/birth-certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllBirthCertificates();
      res.json(certificates);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch birth certificates" });
    }
  });

  // IMPORTANT: More specific routes must come before generic ones
  app.get("/api/birth-certificates/id/:id", async (req, res) => {
    try {
      console.log('Fetching certificate by ID:', req.params.id);
      const certificate = await storage.getBirthCertificate(req.params.id);
      if (!certificate) {
        console.log('Certificate not found');
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      console.log('Certificate found:', certificate);
      res.json(certificate);
    } catch (error: any) {
      console.error('Error fetching certificate:', error);
      res.status(500).json({ message: error.message || "Failed to fetch birth certificate" });
    }
  });

  app.get("/api/birth-certificates/tracking/:trackingNumber", async (req, res) => {
    try {
      const certificate = await storage.getBirthCertificateByTrackingNumber(req.params.trackingNumber);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch birth certificate" });
    }
  });

  app.patch("/api/birth-certificates/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const certificate = await storage.updateBirthCertificateStatus(req.params.id, status);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update birth certificate status" });
    }
  });

  // PDF Download for Birth Certificate
  app.get("/api/birth-certificates/:id/pdf", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getBirthCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      
      const pdf = generateBirthCertificatePDF(certificate);
      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=birth-certificate-${certificate.trackingNumber}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to generate PDF" });
    }
  });

  // Death Certificate routes
  app.post("/api/death-certificates", async (req, res) => {
    try {
      console.log('Received death certificate data:', JSON.stringify(req.body, null, 2));
      const validatedData = insertDeathCertificateSchema.parse(req.body);
      const certificate = await storage.createDeathCertificate(validatedData);
      res.status(201).json(certificate);
    } catch (error: any) {
      console.error('Validation error:', error);
      res.status(400).json({ message: error.message || "Invalid death certificate data", errors: error.errors });
    }
  });

  app.get("/api/death-certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllDeathCertificates();
      res.json(certificates);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch death certificates" });
    }
  });

  // IMPORTANT: More specific routes must come before generic ones
  app.get("/api/death-certificates/id/:id", async (req, res) => {
    try {
      console.log('Fetching death certificate by ID:', req.params.id);
      const certificate = await storage.getDeathCertificate(req.params.id);
      if (!certificate) {
        console.log('Death certificate not found');
        return res.status(404).json({ message: "Death certificate not found" });
      }
      console.log('Death certificate found:', certificate);
      res.json(certificate);
    } catch (error: any) {
      console.error('Error fetching death certificate:', error);
      res.status(500).json({ message: error.message || "Failed to fetch death certificate" });
    }
  });

  app.get("/api/death-certificates/tracking/:trackingNumber", async (req, res) => {
    try {
      const certificate = await storage.getDeathCertificateByTrackingNumber(req.params.trackingNumber);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch death certificate" });
    }
  });

  app.patch("/api/death-certificates/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const certificate = await storage.updateDeathCertificateStatus(req.params.id, status);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update death certificate status" });
    }
  });

  // PDF Download for Death Certificate
  app.get("/api/death-certificates/:id/pdf", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getDeathCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      
      const pdf = generateDeathCertificatePDF(certificate);
      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=death-certificate-${certificate.trackingNumber}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to generate PDF" });
    }
  });

  // Announcement routes
  app.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid announcement data" });
    }
  });

  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch announcements" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAnnouncement(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json({ message: "Announcement deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete announcement" });
    }
  });

  // Leaving Certificate routes
  app.post("/api/leaving-certificates", async (req, res) => {
    try {
      const validatedData = insertLeavingCertificateSchema.parse(req.body);
      const certificate = await storage.createLeavingCertificate(validatedData);
      res.status(201).json(certificate);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid leaving certificate data" });
    }
  });

  app.get("/api/leaving-certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllLeavingCertificates();
      res.json(certificates);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch leaving certificates" });
    }
  });

  app.get("/api/leaving-certificates/:id", async (req, res) => {
    try {
      const certificate = await storage.getLeavingCertificateById(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Leaving certificate not found" });
      }
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch leaving certificate" });
    }
  });

  app.delete("/api/leaving-certificates/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLeavingCertificate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Leaving certificate not found" });
      }
      res.json({ message: "Leaving certificate deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete leaving certificate" });
    }
  });

  // Marriage Certificate routes
  app.post("/api/marriage-certificates", async (req, res) => {
    try {
      const validatedData = insertMarriageCertificateSchema.parse(req.body);
      const certificate = await storage.createMarriageCertificate(validatedData);
      res.status(201).json(certificate);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid marriage certificate data" });
    }
  });

  app.get("/api/marriage-certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllMarriageCertificates();
      res.json(certificates);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch marriage certificates" });
    }
  });

  app.get("/api/marriage-certificates/:id", async (req, res) => {
    try {
      const certificate = await storage.getMarriageCertificateById(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Marriage certificate not found" });
      }
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch marriage certificate" });
    }
  });

  app.delete("/api/marriage-certificates/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMarriageCertificate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Marriage certificate not found" });
      }
      res.json({ message: "Marriage certificate deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete marriage certificate" });
    }
  });

  // Admin routes - protected with authentication
  // Update complaint (admin only)
  app.put("/api/admin/complaints/:id", requireAuth, async (req, res) => {
    try {
      const complaint = await storage.getComplaint(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      const validatedData = insertComplaintSchema.parse(req.body);
      const updated = await storage.updateComplaint(req.params.id, validatedData);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update complaint" });
    }
  });

  app.delete("/api/admin/complaints/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteComplaint(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json({ message: "Complaint deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete complaint" });
    }
  });

  // Update birth certificate (admin only)
  app.put("/api/admin/birth-certificates/:id", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getBirthCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      
      const validatedData = insertBirthCertificateSchema.parse(req.body);
      const updated = await storage.updateBirthCertificate(req.params.id, validatedData);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update birth certificate" });
    }
  });

  app.delete("/api/admin/birth-certificates/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteBirthCertificate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      res.json({ message: "Birth certificate deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete birth certificate" });
    }
  });

  // Update death certificate (admin only)
  app.put("/api/admin/death-certificates/:id", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getDeathCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      
      const validatedData = insertDeathCertificateSchema.parse(req.body);
      const updated = await storage.updateDeathCertificate(req.params.id, validatedData);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update death certificate" });
    }
  });

  app.delete("/api/admin/death-certificates/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteDeathCertificate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      res.json({ message: "Death certificate deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete death certificate" });
    }
  });

  // OCR Routes - Extract text from Marathi PDFs
  app.post("/api/ocr/extract", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const result = await extractTextFromPDFBuffer(
        req.file.buffer,
        req.file.originalname
      );

      if (!result.success) {
        return res.status(500).json({ 
          message: result.error || "Failed to extract text from PDF" 
        });
      }

      res.json({
        success: true,
        totalPages: result.totalPages,
        extractedText: result.extractedText,
        pages: result.pages,
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to process PDF" 
      });
    }
  });

  // OCR Route - Extract and parse birth certificate
  app.post("/api/ocr/birth-certificate", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const result = await extractTextFromPDFBuffer(
        req.file.buffer,
        req.file.originalname
      );

      if (!result.success) {
        return res.status(500).json({ 
          message: result.error || "Failed to extract text from PDF" 
        });
      }

      // Parse the extracted text for birth certificate fields
      const parsedData = parseBirthCertificate(result.extractedText);

      res.json({
        success: true,
        totalPages: result.totalPages,
        extractedText: result.extractedText,
        parsedData,
        pages: result.pages,
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to process birth certificate" 
      });
    }
  });

  // User Management Routes
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const user = await storage.createUser({ username, password, role });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const user = await storage.updateUser(req.params.id, { username, password, role });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete user" });
    }
  });

  // Property Tax Routes
  app.get("/api/property-tax/:propertyNumber", async (req, res) => {
    try {
      const { propertyNumber } = req.params;
      const property = await storage.getPropertyByNumber(propertyNumber);
      
      if (!property) {
        return res.status(404).json({ 
          message: "Property not found" 
        });
      }

      // Get payment history
      const payments = await storage.getPropertyPayments(propertyNumber);
      
      // Calculate totals
      const currentYear = new Date().getFullYear();
      const yearsSinceRegistration = currentYear - property.registrationYear + 1;
      const totalDue = Number(property.annualTax) * yearsSinceRegistration;
      const totalPaid = payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
      
      res.json({
        ...property,
        totalPaid,
        totalDue: totalDue - totalPaid,
        payments: payments.map(p => ({
          year: p.paymentYear,
          amount: Number(p.amountPaid),
          date: p.paymentDate,
          receiptNumber: p.receiptNumber,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch property details" 
      });
    }
  });

  app.get("/api/admin/properties", requireAuth, async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch properties" 
      });
    }
  });

  app.post("/api/admin/properties", requireAuth, async (req, res) => {
    try {
      const property = await storage.createProperty(req.body);
      res.status(201).json(property);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Failed to create property" 
      });
    }
  });

  // Public payment recording (for QR code payments) - Status: Pending
  app.post("/api/property-payments", async (req, res) => {
    try {
      const paymentData = {
        ...req.body,
        status: 'pending', // Default status for public payments
      };
      const payment = await storage.createPropertyPayment(paymentData);
      res.status(201).json({ 
        success: true,
        message: "Payment submitted for verification",
        payment 
      });
    } catch (error: any) {
      console.error('Payment recording error:', error);
      res.status(400).json({ 
        success: false,
        message: error.message || "Failed to record payment" 
      });
    }
  });

  // Admin-only payment recording
  app.post("/api/admin/property-payments", requireAuth, async (req, res) => {
    try {
      const payment = await storage.createPropertyPayment(req.body);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Failed to record payment" 
      });
    }
  });

  // Get pending payments for verification
  app.get("/api/admin/pending-payments", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getPendingPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch pending payments" 
      });
    }
  });

  // Get all payments
  app.get("/api/admin/all-payments", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch payments" 
      });
    }
  });

  // Approve/Reject payment
  app.patch("/api/admin/payments/:id/status", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const verifiedBy = req.user?.username || 'admin';
      
      const payment = await storage.updatePaymentStatus(id, status, verifiedBy);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Failed to update payment status" 
      });
    }
  });

  // CSV/Excel Upload for bulk property import
  app.post("/api/admin/properties/upload", requireAuth, uploadCSV.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const results: any[] = [];
      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      // Determine file type and parse accordingly
      const isExcel = req.file.originalname.toLowerCase().endsWith('.xlsx') || 
                      req.file.originalname.toLowerCase().endsWith('.xls');

      if (isExcel) {
        // Parse Excel file
        console.log('Parsing Excel file:', req.file.originalname);
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false, // Get formatted strings instead of raw values
          defval: '' // Default value for empty cells
        });
        
        console.log('Excel parsed, total rows:', jsonData.length);
        if (jsonData.length > 0) {
          console.log('First row keys:', Object.keys(jsonData[0]));
          console.log('First row data:', jsonData[0]);
        }

        // Process Excel rows
        for (let i = 0; i < jsonData.length; i++) {
          const row: any = jsonData[i];
          try {
            // Skip empty rows
            if (!row.property_number && !row.owner_name) {
              continue;
            }

            // Validate required fields
            const missingFields = [];
            if (!row.property_number?.toString().trim()) missingFields.push('property_number');
            if (!row.owner_name?.toString().trim()) missingFields.push('owner_name');
            if (!row.address?.toString().trim()) missingFields.push('address');
            if (!row.area_sqft?.toString().trim()) missingFields.push('area_sqft');
            if (!row.annual_tax?.toString().trim()) missingFields.push('annual_tax');
            if (!row.registration_year?.toString().trim()) missingFields.push('registration_year');

            if (missingFields.length > 0) {
              errors.push(`Row ${i + 2}: Missing required fields: ${missingFields.join(', ')}`);
              failedCount++;
              continue;
            }

            // Create property object
            const propertyData = {
              propertyNumber: row.property_number.toString().trim(),
              ownerName: row.owner_name.toString().trim(),
              ownerNameMr: row.owner_name_mr?.toString().trim() || null,
              address: row.address.toString().trim(),
              addressMr: row.address_mr?.toString().trim() || null,
              areaSqft: parseInt(row.area_sqft.toString()),
              annualTax: parseFloat(row.annual_tax.toString()).toString(),
              registrationYear: parseInt(row.registration_year.toString()),
              status: 'active'
            };

            // Insert into database
            await storage.createProperty(propertyData);
            successCount++;
          } catch (error: any) {
            errors.push(`Row ${i + 2} (${row.property_number || 'unknown'}): ${error.message}`);
            failedCount++;
          }
        }

        // Send response
        res.json({
          success: successCount,
          failed: failedCount,
          errors: errors
        });

      } else {
        // Parse CSV - Remove BOM if present
        let csvContent = req.file.buffer.toString('utf8');
        // Remove UTF-8 BOM
        if (csvContent.charCodeAt(0) === 0xFEFF) {
          csvContent = csvContent.slice(1);
        }
        const stream = Readable.from(csvContent);
        
        stream
          .pipe(csv())
          .on('data', (row) => {
            results.push(row);
          })
          .on('end', async () => {
            console.log('CSV parsed, total rows:', results.length);
            if (results.length > 0) {
              console.log('First row keys:', Object.keys(results[0]));
              console.log('First row data:', results[0]);
            }

            // Process each row
            for (let i = 0; i < results.length; i++) {
              const row = results[i];
              try {
                // Skip empty rows
                if (!row.property_number && !row.owner_name) {
                  continue;
                }

                // Validate required fields
                const missingFields = [];
                if (!row.property_number?.trim()) missingFields.push('property_number');
                if (!row.owner_name?.trim()) missingFields.push('owner_name');
                if (!row.address?.trim()) missingFields.push('address');
                if (!row.area_sqft?.trim()) missingFields.push('area_sqft');
                if (!row.annual_tax?.trim()) missingFields.push('annual_tax');
                if (!row.registration_year?.trim()) missingFields.push('registration_year');

                if (missingFields.length > 0) {
                  errors.push(`Row ${i + 2}: Missing required fields: ${missingFields.join(', ')}`);
                  failedCount++;
                  continue;
                }

                // Create property object
                const propertyData = {
                  propertyNumber: row.property_number.trim(),
                  ownerName: row.owner_name.trim(),
                  ownerNameMr: row.owner_name_mr?.trim() || null,
                  address: row.address.trim(),
                  addressMr: row.address_mr?.trim() || null,
                  areaSqft: parseInt(row.area_sqft),
                  annualTax: parseFloat(row.annual_tax).toString(),
                  registrationYear: parseInt(row.registration_year),
                  status: 'active'
                };

                // Insert into database
                await storage.createProperty(propertyData);
                successCount++;
              } catch (error: any) {
                errors.push(`Row ${i + 2} (${row.property_number || 'unknown'}): ${error.message}`);
                failedCount++;
              }
            }

            // Send response
            res.json({
              success: successCount,
              failed: failedCount,
              errors: errors
            });
          })
          .on('error', (error) => {
            console.error('CSV parsing error:', error);
            res.status(500).json({ message: "Failed to parse CSV file" });
          });
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        message: error.message || "Failed to upload properties" 
      });
    }
  });

  // ==================== WATER BILL ROUTES ====================
  // Uses properties table as master - no separate water_connections table

  // Get property and water payments by property number (Public)
  app.get("/api/water/property/:propertyNumber", async (req, res) => {
    try {
      const { propertyNumber } = req.params;
      
      // Get property details from properties table
      const property = await storage.getPropertyByNumber(propertyNumber);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Get water payment history
      const payments = await storage.getWaterPaymentsByProperty(propertyNumber);
      
      res.json({
        property,
        payments
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch property details" 
      });
    }
  });

  // Record water payment (Admin)
  app.post("/api/admin/water/payments", requireAuth, async (req, res) => {
    try {
      const { propertyNumber, paymentMonth, amount, paymentDate, paymentMethod, remarks } = req.body;
      
      // Verify property exists
      const property = await storage.getPropertyByNumber(propertyNumber);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if payment already exists for this month
      const existingPayment = await storage.getWaterPaymentByMonth(propertyNumber, paymentMonth);
      if (existingPayment) {
        return res.status(400).json({ message: "Payment already recorded for this month" });
      }

      // Generate receipt number
      const receiptNumber = `WB/${new Date().getFullYear()}/${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const payment = await storage.createWaterPayment({
        propertyNumber,
        paymentMonth,
        amount: amount.toString(),
        paymentDate,
        receiptNumber,
        paymentMethod,
        remarks,
        status: 'paid',
        verifiedBy: req.session.username || 'admin',
        verifiedAt: new Date()
      });
      
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Failed to record payment" 
      });
    }
  });

  // Get pending water payments (Admin)
  app.get("/api/admin/water/payments/pending", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getPendingWaterPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch pending payments" 
      });
    }
  });

  // Get all water payments (Admin)
  app.get("/api/admin/water/payments", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getAllWaterPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch payments" 
      });
    }
  });

  // Update water payment status (Admin)
  app.patch("/api/admin/water/payments/:id/status", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const verifiedBy = req.session.username || 'admin';
      
      const payment = await storage.updateWaterPaymentStatus(id, status, verifiedBy);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Failed to update payment status" 
      });
    }
  });

  // Bulk payment allocation - pays oldest pending bills automatically
  app.post("/api/admin/water/payments/bulk", async (req, res) => {
    try {
      const { propertyNumber, amount, paymentDate, receiptNumber, paymentMethod, remarks } = req.body;
      
      // Get all pending bills for this property, sorted by oldest first
      const allPayments = await storage.getWaterPaymentsByProperty(propertyNumber);
      const pendingBills = allPayments
        .filter(p => p.status === 'pending')
        .sort((a, b) => a.paymentMonth.localeCompare(b.paymentMonth));
      
      if (pendingBills.length === 0) {
        return res.status(400).json({ message: "No pending bills found" });
      }

      let remainingAmount = parseFloat(amount);
      let billsPaid = 0;
      const monthlyCharge = 200; // Fixed monthly charge

      // Allocate payment to oldest bills first (FIFO)
      for (const bill of pendingBills) {
        if (remainingAmount >= monthlyCharge) {
          // Mark this bill as paid with receipt details
          await storage.updateWaterPaymentStatus(
            bill.id,
            'paid',
            req.session?.username || 'system',
            `${receiptNumber}-${billsPaid + 1}`, // Unique receipt for each month
            paymentDate,
            paymentMethod
          );

          remainingAmount -= monthlyCharge;
          billsPaid++;
        } else {
          break;
        }
      }

      res.json({
        success: true,
        billsPaid,
        amountUsed: parseFloat(amount) - remainingAmount,
        remainingAmount,
        message: `Successfully paid ${billsPaid} months`
      });
    } catch (error: any) {
      console.error('Bulk payment error:', error);
      res.status(400).json({ 
        message: error.message || "Failed to process bulk payment" 
      });
    }
  });

  // Bulk upload water bills (Excel/CSV)
  app.post("/api/admin/water/bills/upload", requireAuth, uploadCSV.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const results: any[] = [];
      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      // Determine file type
      const isExcel = req.file.originalname.toLowerCase().endsWith('.xlsx') || 
                      req.file.originalname.toLowerCase().endsWith('.xls');

      if (isExcel) {
        // Parse Excel file
        console.log('Parsing Excel file:', req.file.originalname);
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: ''
        });
        
        console.log('Excel parsed, total rows:', jsonData.length);

        // Process Excel rows
        for (let i = 0; i < jsonData.length; i++) {
          const row: any = jsonData[i];
          try {
            // Skip empty rows
            if (!row.property_number && !row.payment_month) {
              continue;
            }

            // Validate required fields
            const missingFields = [];
            if (!row.property_number?.toString().trim()) missingFields.push('property_number');
            if (!row.payment_month?.toString().trim()) missingFields.push('payment_month');
            if (!row.amount?.toString().trim()) missingFields.push('amount');

            if (missingFields.length > 0) {
              errors.push(`Row ${i + 2}: Missing required fields: ${missingFields.join(', ')}`);
              failedCount++;
              continue;
            }

            // Check if property exists
            const property = await storage.getPropertyByNumber(row.property_number.toString().trim());
            if (!property) {
              errors.push(`Row ${i + 2}: Property ${row.property_number} not found`);
              failedCount++;
              continue;
            }

            // Check if bill already exists
            const existing = await storage.getWaterPaymentByMonth(
              row.property_number.toString().trim(),
              row.payment_month.toString().trim()
            );
            if (existing) {
              errors.push(`Row ${i + 2}: Bill already exists for ${row.property_number} - ${row.payment_month}`);
              failedCount++;
              continue;
            }

            // Create water bill
            const billData = {
              propertyNumber: row.property_number.toString().trim(),
              paymentMonth: row.payment_month.toString().trim(),
              amount: parseFloat(row.amount.toString()).toString(),
              status: row.status?.toString().trim() || 'pending'
            };

            await storage.createWaterPayment(billData);
            successCount++;
          } catch (error: any) {
            errors.push(`Row ${i + 2} (${row.property_number || 'unknown'}): ${error.message}`);
            failedCount++;
          }
        }

        res.json({
          success: successCount,
          failed: failedCount,
          errors: errors
        });

      } else {
        // Parse CSV
        let csvContent = req.file.buffer.toString('utf8');
        if (csvContent.charCodeAt(0) === 0xFEFF) {
          csvContent = csvContent.slice(1);
        }
        const stream = Readable.from(csvContent);
        
        stream
          .pipe(csv())
          .on('data', (row) => {
            results.push(row);
          })
          .on('end', async () => {
            console.log('CSV parsed, total rows:', results.length);

            for (let i = 0; i < results.length; i++) {
              const row = results[i];
              try {
                if (!row.property_number && !row.payment_month) {
                  continue;
                }

                const missingFields = [];
                if (!row.property_number?.trim()) missingFields.push('property_number');
                if (!row.payment_month?.trim()) missingFields.push('payment_month');
                if (!row.amount?.trim()) missingFields.push('amount');

                if (missingFields.length > 0) {
                  errors.push(`Row ${i + 2}: Missing required fields: ${missingFields.join(', ')}`);
                  failedCount++;
                  continue;
                }

                // Check if property exists
                const property = await storage.getPropertyByNumber(row.property_number.trim());
                if (!property) {
                  errors.push(`Row ${i + 2}: Property ${row.property_number} not found`);
                  failedCount++;
                  continue;
                }

                // Check if bill already exists
                const existing = await storage.getWaterPaymentByMonth(
                  row.property_number.trim(),
                  row.payment_month.trim()
                );
                if (existing) {
                  errors.push(`Row ${i + 2}: Bill already exists for ${row.property_number} - ${row.payment_month}`);
                  failedCount++;
                  continue;
                }

                const billData = {
                  propertyNumber: row.property_number.trim(),
                  paymentMonth: row.payment_month.trim(),
                  amount: parseFloat(row.amount).toString(),
                  status: row.status?.trim() || 'pending'
                };

                await storage.createWaterPayment(billData);
                successCount++;
              } catch (error: any) {
                errors.push(`Row ${i + 2} (${row.property_number || 'unknown'}): ${error.message}`);
                failedCount++;
              }
            }

            res.json({
              success: successCount,
              failed: failedCount,
              errors: errors
            });
          })
          .on('error', (error) => {
            console.error('CSV parsing error:', error);
            res.status(500).json({ message: "Failed to parse CSV file" });
          });
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        message: error.message || "Failed to upload water bills" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
