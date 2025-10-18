import { 
  type User, 
  type InsertUser,
  type Complaint,
  type InsertComplaint,
  type BirthCertificate,
  type InsertBirthCertificate,
  type DeathCertificate,
  type InsertDeathCertificate,
  type Announcement,
  type InsertAnnouncement,
  users,
  complaints,
  birthCertificates,
  deathCertificates,
  announcements
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Complaint methods
  getComplaint(id: string): Promise<Complaint | undefined>;
  getComplaintByTrackingNumber(trackingNumber: string): Promise<Complaint | undefined>;
  getAllComplaints(): Promise<Complaint[]>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: string, complaint: InsertComplaint): Promise<Complaint | undefined>;
  updateComplaintStatus(id: string, status: string): Promise<Complaint | undefined>;
  deleteComplaint(id: string): Promise<boolean>;
  
  // Birth Certificate methods
  getBirthCertificate(id: string): Promise<BirthCertificate | undefined>;
  getBirthCertificateByTrackingNumber(trackingNumber: string): Promise<BirthCertificate | undefined>;
  getAllBirthCertificates(): Promise<BirthCertificate[]>;
  createBirthCertificate(certificate: InsertBirthCertificate): Promise<BirthCertificate>;
  updateBirthCertificate(id: string, certificate: InsertBirthCertificate): Promise<BirthCertificate | undefined>;
  updateBirthCertificateStatus(id: string, status: string): Promise<BirthCertificate | undefined>;
  deleteBirthCertificate(id: string): Promise<boolean>;
  
  // Death Certificate methods
  getDeathCertificate(id: string): Promise<DeathCertificate | undefined>;
  getDeathCertificateByTrackingNumber(trackingNumber: string): Promise<DeathCertificate | undefined>;
  getAllDeathCertificates(): Promise<DeathCertificate[]>;
  createDeathCertificate(certificate: InsertDeathCertificate): Promise<DeathCertificate>;
  updateDeathCertificate(id: string, certificate: InsertDeathCertificate): Promise<DeathCertificate | undefined>;
  updateDeathCertificateStatus(id: string, status: string): Promise<DeathCertificate | undefined>;
  deleteDeathCertificate(id: string): Promise<boolean>;
  
  // Announcement methods
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private complaints: Map<string, Complaint>;
  private birthCertificates: Map<string, BirthCertificate>;
  private deathCertificates: Map<string, DeathCertificate>;
  private announcements: Map<string, Announcement>;

  constructor() {
    this.users = new Map();
    this.complaints = new Map();
    this.birthCertificates = new Map();
    this.deathCertificates = new Map();
    this.announcements = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Complaint methods
  async getComplaint(id: string): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }

  async getComplaintByTrackingNumber(trackingNumber: string): Promise<Complaint | undefined> {
    return Array.from(this.complaints.values()).find(
      (complaint) => complaint.trackingNumber === trackingNumber,
    );
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return Array.from(this.complaints.values());
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const trackingNumber = `CMP${Date.now().toString().slice(-8)}`;
    const complaint: Complaint = {
      ...insertComplaint,
      id,
      trackingNumber,
      status: "pending",
      createdAt: new Date(),
    };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async updateComplaint(id: string, insertComplaint: InsertComplaint): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (complaint) {
      const updated: Complaint = {
        ...complaint,
        ...insertComplaint,
      };
      this.complaints.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async updateComplaintStatus(id: string, status: string): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (complaint) {
      complaint.status = status;
      this.complaints.set(id, complaint);
      return complaint;
    }
    return undefined;
  }

  async deleteComplaint(id: string): Promise<boolean> {
    return this.complaints.delete(id);
  }

  // Birth Certificate methods
  async getBirthCertificate(id: string): Promise<BirthCertificate | undefined> {
    return this.birthCertificates.get(id);
  }

  async getBirthCertificateByTrackingNumber(trackingNumber: string): Promise<BirthCertificate | undefined> {
    return Array.from(this.birthCertificates.values()).find(
      (cert) => cert.trackingNumber === trackingNumber,
    );
  }

  async getAllBirthCertificates(): Promise<BirthCertificate[]> {
    return Array.from(this.birthCertificates.values());
  }

  async createBirthCertificate(insertCertificate: InsertBirthCertificate): Promise<BirthCertificate> {
    const id = randomUUID();
    const trackingNumber = `BRT${Date.now().toString().slice(-8)}`;
    const certificate: BirthCertificate = {
      ...insertCertificate,
      id,
      trackingNumber,
      status: "pending",
      createdAt: new Date(),
    };
    this.birthCertificates.set(id, certificate);
    return certificate;
  }

  async updateBirthCertificate(id: string, insertCertificate: InsertBirthCertificate): Promise<BirthCertificate | undefined> {
    const certificate = this.birthCertificates.get(id);
    if (certificate) {
      const updated: BirthCertificate = {
        ...certificate,
        ...insertCertificate,
      };
      this.birthCertificates.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async updateBirthCertificateStatus(id: string, status: string): Promise<BirthCertificate | undefined> {
    const certificate = this.birthCertificates.get(id);
    if (certificate) {
      certificate.status = status;
      this.birthCertificates.set(id, certificate);
      return certificate;
    }
    return undefined;
  }

  async deleteBirthCertificate(id: string): Promise<boolean> {
    return this.birthCertificates.delete(id);
  }

  // Death Certificate methods
  async getDeathCertificate(id: string): Promise<DeathCertificate | undefined> {
    return this.deathCertificates.get(id);
  }

  async getDeathCertificateByTrackingNumber(trackingNumber: string): Promise<DeathCertificate | undefined> {
    return Array.from(this.deathCertificates.values()).find(
      (cert) => cert.trackingNumber === trackingNumber,
    );
  }

  async getAllDeathCertificates(): Promise<DeathCertificate[]> {
    return Array.from(this.deathCertificates.values());
  }

  async createDeathCertificate(insertCertificate: InsertDeathCertificate): Promise<DeathCertificate> {
    const id = randomUUID();
    const trackingNumber = `DTH${Date.now().toString().slice(-8)}`;
    const certificate: DeathCertificate = {
      ...insertCertificate,
      id,
      trackingNumber,
      status: "pending",
      createdAt: new Date(),
    };
    this.deathCertificates.set(id, certificate);
    return certificate;
  }

  async updateDeathCertificate(id: string, insertCertificate: InsertDeathCertificate): Promise<DeathCertificate | undefined> {
    const certificate = this.deathCertificates.get(id);
    if (certificate) {
      const updated: DeathCertificate = {
        ...certificate,
        ...insertCertificate,
      };
      this.deathCertificates.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async updateDeathCertificateStatus(id: string, status: string): Promise<DeathCertificate | undefined> {
    const certificate = this.deathCertificates.get(id);
    if (certificate) {
      certificate.status = status;
      this.deathCertificates.set(id, certificate);
      return certificate;
    }
    return undefined;
  }

  async deleteDeathCertificate(id: string): Promise<boolean> {
    return this.deathCertificates.delete(id);
  }

  // Announcement methods
  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = {
      id,
      title: insertAnnouncement.title,
      titleMr: insertAnnouncement.titleMr,
      description: insertAnnouncement.description,
      descriptionMr: insertAnnouncement.descriptionMr,
      category: insertAnnouncement.category,
      priority: insertAnnouncement.priority || "normal",
      date: insertAnnouncement.date,
      createdAt: new Date(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    return this.announcements.delete(id);
  }
}

// PostgreSQL Storage Implementation
export class DbStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set!");
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    try {
      console.log("🔌 Connecting to database...");
      // Don't log the full URL for security, just show it's set
      console.log("📍 DATABASE_URL is set (length:", process.env.DATABASE_URL.length, "chars)");
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      this.db = drizzle(pool);
      console.log("✅ Database connection initialized successfully");
    } catch (error: any) {
      console.error("❌ Failed to initialize database connection:", error.message);
      throw error;
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Complaint methods
  async getComplaint(id: string): Promise<Complaint | undefined> {
    const result = await this.db.select().from(complaints).where(eq(complaints.id, id));
    return result[0];
  }

  async getComplaintByTrackingNumber(trackingNumber: string): Promise<Complaint | undefined> {
    const result = await this.db.select().from(complaints).where(eq(complaints.trackingNumber, trackingNumber));
    return result[0];
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return await this.db.select().from(complaints);
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const trackingNumber = `CMP${Date.now().toString().slice(-8)}`;
    const result = await this.db.insert(complaints).values({
      ...insertComplaint,
      trackingNumber,
      status: "pending"
    }).returning();
    return result[0];
  }

  async updateComplaint(id: string, insertComplaint: InsertComplaint): Promise<Complaint | undefined> {
    const result = await this.db.update(complaints)
      .set(insertComplaint)
      .where(eq(complaints.id, id))
      .returning();
    return result[0];
  }

  async updateComplaintStatus(id: string, status: string): Promise<Complaint | undefined> {
    const result = await this.db.update(complaints)
      .set({ status })
      .where(eq(complaints.id, id))
      .returning();
    return result[0];
  }

  async deleteComplaint(id: string): Promise<boolean> {
    const result = await this.db.delete(complaints).where(eq(complaints.id, id)).returning();
    return result.length > 0;
  }

  // Birth Certificate methods
  async getBirthCertificate(id: string): Promise<BirthCertificate | undefined> {
    const result = await this.db.select().from(birthCertificates).where(eq(birthCertificates.id, id));
    return result[0];
  }

  async getBirthCertificateByTrackingNumber(trackingNumber: string): Promise<BirthCertificate | undefined> {
    const result = await this.db.select().from(birthCertificates).where(eq(birthCertificates.trackingNumber, trackingNumber));
    return result[0];
  }

  async getAllBirthCertificates(): Promise<BirthCertificate[]> {
    return await this.db.select().from(birthCertificates);
  }

  async createBirthCertificate(insertCertificate: InsertBirthCertificate): Promise<BirthCertificate> {
    const trackingNumber = `BRT${Date.now().toString().slice(-8)}`;
    const result = await this.db.insert(birthCertificates).values({
      ...insertCertificate,
      trackingNumber,
      status: "pending"
    }).returning();
    return result[0];
  }

  async updateBirthCertificate(id: string, insertCertificate: InsertBirthCertificate): Promise<BirthCertificate | undefined> {
    const result = await this.db.update(birthCertificates)
      .set(insertCertificate)
      .where(eq(birthCertificates.id, id))
      .returning();
    return result[0];
  }

  async updateBirthCertificateStatus(id: string, status: string): Promise<BirthCertificate | undefined> {
    const result = await this.db.update(birthCertificates)
      .set({ status })
      .where(eq(birthCertificates.id, id))
      .returning();
    return result[0];
  }

  async deleteBirthCertificate(id: string): Promise<boolean> {
    const result = await this.db.delete(birthCertificates).where(eq(birthCertificates.id, id)).returning();
    return result.length > 0;
  }

  // Death Certificate methods
  async getDeathCertificate(id: string): Promise<DeathCertificate | undefined> {
    const result = await this.db.select().from(deathCertificates).where(eq(deathCertificates.id, id));
    return result[0];
  }

  async getDeathCertificateByTrackingNumber(trackingNumber: string): Promise<DeathCertificate | undefined> {
    const result = await this.db.select().from(deathCertificates).where(eq(deathCertificates.trackingNumber, trackingNumber));
    return result[0];
  }

  async getAllDeathCertificates(): Promise<DeathCertificate[]> {
    return await this.db.select().from(deathCertificates);
  }

  async createDeathCertificate(insertCertificate: InsertDeathCertificate): Promise<DeathCertificate> {
    const trackingNumber = `DTH${Date.now().toString().slice(-8)}`;
    const result = await this.db.insert(deathCertificates).values({
      ...insertCertificate,
      trackingNumber,
      status: "pending"
    }).returning();
    return result[0];
  }

  async updateDeathCertificate(id: string, insertCertificate: InsertDeathCertificate): Promise<DeathCertificate | undefined> {
    const result = await this.db.update(deathCertificates)
      .set(insertCertificate)
      .where(eq(deathCertificates.id, id))
      .returning();
    return result[0];
  }

  async updateDeathCertificateStatus(id: string, status: string): Promise<DeathCertificate | undefined> {
    const result = await this.db.update(deathCertificates)
      .set({ status })
      .where(eq(deathCertificates.id, id))
      .returning();
    return result[0];
  }

  async deleteDeathCertificate(id: string): Promise<boolean> {
    const result = await this.db.delete(deathCertificates).where(eq(deathCertificates.id, id)).returning();
    return result.length > 0;
  }

  // Announcement methods
  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    const result = await this.db.select().from(announcements).where(eq(announcements.id, id));
    return result[0];
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await this.db.select().from(announcements);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const result = await this.db.insert(announcements).values(insertAnnouncement).returning();
    return result[0];
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const result = await this.db.delete(announcements).where(eq(announcements.id, id)).returning();
    return result.length > 0;
  }
}

// Use DbStorage for database, or MemStorage for in-memory (development/testing)
export const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
