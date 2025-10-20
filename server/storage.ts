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
  type LeavingCertificate,
  type InsertLeavingCertificate,
  type MarriageCertificate,
  type InsertMarriageCertificate,
  type Property,
  type InsertProperty,
  type PropertyPayment,
  type InsertPropertyPayment,
  type WaterPayment,
  type InsertWaterPayment,
  users,
  complaints,
  birthCertificates,
  deathCertificates,
  announcements,
  leavingCertificates,
  marriageCertificates,
  properties,
  propertyPayments,
  waterPayments
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;
import { eq, desc, and } from "drizzle-orm";

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
  
  // Property Tax methods
  getPropertyByNumber(propertyNumber: string): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  getPropertyPayments(propertyNumber: string): Promise<PropertyPayment[]>;
  createPropertyPayment(payment: InsertPropertyPayment): Promise<PropertyPayment>;
  getPendingPayments(): Promise<PropertyPayment[]>;
  getAllPayments(): Promise<PropertyPayment[]>;
  updatePaymentStatus(id: string, status: string, verifiedBy: string): Promise<PropertyPayment>;
  
  // Water Bill methods (uses properties table as master)
  getWaterPaymentsByProperty(propertyNumber: string): Promise<WaterPayment[]>;
  createWaterPayment(payment: InsertWaterPayment): Promise<WaterPayment>;
  getPendingWaterPayments(): Promise<WaterPayment[]>;
  getAllWaterPayments(): Promise<WaterPayment[]>;
  updateWaterPaymentStatus(id: string, status: string, verifiedBy: string, receiptNumber?: string, paymentDate?: string, paymentMethod?: string): Promise<WaterPayment>;
  getWaterPaymentByMonth(propertyNumber: string, paymentMonth: string): Promise<WaterPayment | undefined>;
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
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role || "user"
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updated: User = { ...user, ...updateData };
      this.users.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
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
      adminRemark: null,
      images: insertComplaint.images || null,
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

  // Property Tax stub methods (not used in production - using DbStorage)
  async getPropertyByNumber(propertyNumber: string): Promise<Property | undefined> {
    throw new Error("MemStorage not implemented for Property Tax");
  }
  async getAllProperties(): Promise<Property[]> {
    throw new Error("MemStorage not implemented for Property Tax");
  }
  async createProperty(property: InsertProperty): Promise<Property> {
    throw new Error("MemStorage not implemented for Property Tax");
  }
  async getPropertyPayments(propertyNumber: string): Promise<PropertyPayment[]> {
    throw new Error("MemStorage not implemented for Property Tax");
  }
  async createPropertyPayment(payment: InsertPropertyPayment): Promise<PropertyPayment> {
    throw new Error("MemStorage not implemented for Property Tax");
  }
  async getPendingPayments(): Promise<PropertyPayment[]> {
    throw new Error("MemStorage not implemented for Property Tax");
  }
  async getAllPayments(): Promise<PropertyPayment[]> {
    throw new Error("MemStorage not implemented for Property Tax");
  }
  async updatePaymentStatus(id: string, status: string, verifiedBy: string): Promise<PropertyPayment> {
    throw new Error("MemStorage not implemented for Property Tax");
  }

  // Water Bill stub methods (not used in production - using DbStorage)
  async getWaterPaymentsByProperty(propertyNumber: string): Promise<WaterPayment[]> {
    throw new Error("MemStorage not implemented for Water Bill");
  }
  async createWaterPayment(payment: InsertWaterPayment): Promise<WaterPayment> {
    throw new Error("MemStorage not implemented for Water Bill");
  }
  async getPendingWaterPayments(): Promise<WaterPayment[]> {
    throw new Error("MemStorage not implemented for Water Bill");
  }
  async getAllWaterPayments(): Promise<WaterPayment[]> {
    throw new Error("MemStorage not implemented for Water Bill");
  }
  async updateWaterPaymentStatus(id: string, status: string, verifiedBy: string, receiptNumber?: string, paymentDate?: string, paymentMethod?: string): Promise<WaterPayment> {
    throw new Error("MemStorage not implemented for Water Bill");
  }
  async getWaterPaymentByMonth(propertyNumber: string, paymentMonth: string): Promise<WaterPayment | undefined> {
    throw new Error("MemStorage not implemented for Water Bill");
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

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await this.db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
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

  async createLeavingCertificate(insertLeavingCertificate: InsertLeavingCertificate): Promise<LeavingCertificate> {
    const result = await this.db.insert(leavingCertificates).values(insertLeavingCertificate).returning();
    return result[0];
  }

  async getAllLeavingCertificates(): Promise<LeavingCertificate[]> {
    return this.db.select().from(leavingCertificates).orderBy(desc(leavingCertificates.createdAt));
  }

  async getLeavingCertificateById(id: string): Promise<LeavingCertificate | undefined> {
    const result = await this.db.select().from(leavingCertificates).where(eq(leavingCertificates.id, id));
    return result[0];
  }

  async deleteLeavingCertificate(id: string): Promise<boolean> {
    const result = await this.db.delete(leavingCertificates).where(eq(leavingCertificates.id, id)).returning();
    return result.length > 0;
  }

  // Marriage Certificates
  async createMarriageCertificate(insertMarriageCertificate: InsertMarriageCertificate): Promise<MarriageCertificate> {
    const result = await this.db.insert(marriageCertificates).values(insertMarriageCertificate).returning();
    return result[0];
  }

  async getAllMarriageCertificates(): Promise<MarriageCertificate[]> {
    return this.db.select().from(marriageCertificates).orderBy(desc(marriageCertificates.createdAt));
  }

  async getMarriageCertificateById(id: string): Promise<MarriageCertificate | undefined> {
    const result = await this.db.select().from(marriageCertificates).where(eq(marriageCertificates.id, id));
    return result[0];
  }

  async deleteMarriageCertificate(id: string): Promise<boolean> {
    const result = await this.db.delete(marriageCertificates).where(eq(marriageCertificates.id, id)).returning();
    return result.length > 0;
  }

  // Property Tax Methods
  async getPropertyByNumber(propertyNumber: string): Promise<Property | undefined> {
    const result = await this.db.select().from(properties).where(eq(properties.propertyNumber, propertyNumber));
    return result[0];
  }

  async getAllProperties(): Promise<Property[]> {
    return await this.db.select().from(properties);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await this.db.insert(properties).values(property).returning();
    return result[0];
  }

  async getPropertyPayments(propertyNumber: string): Promise<PropertyPayment[]> {
    return await this.db.select().from(propertyPayments)
      .where(eq(propertyPayments.propertyNumber, propertyNumber))
      .orderBy(propertyPayments.paymentYear);
  }

  async createPropertyPayment(payment: InsertPropertyPayment): Promise<PropertyPayment> {
    const result = await this.db.insert(propertyPayments).values(payment).returning();
    return result[0];
  }

  async getPendingPayments(): Promise<PropertyPayment[]> {
    return await this.db.select().from(propertyPayments)
      .where(eq(propertyPayments.status, 'pending'))
      .orderBy(desc(propertyPayments.createdAt));
  }

  async getAllPayments(): Promise<PropertyPayment[]> {
    return await this.db.select().from(propertyPayments)
      .orderBy(desc(propertyPayments.createdAt));
  }

  async updatePaymentStatus(id: string, status: string, verifiedBy: string): Promise<PropertyPayment> {
    const result = await this.db.update(propertyPayments)
      .set({ 
        status, 
        verifiedBy,
        verifiedAt: new Date()
      })
      .where(eq(propertyPayments.id, id))
      .returning();
    return result[0];
  }

  // Water Bill Methods (uses properties table as master)
  async getWaterPaymentsByProperty(propertyNumber: string): Promise<WaterPayment[]> {
    return await this.db.select().from(waterPayments)
      .where(eq(waterPayments.propertyNumber, propertyNumber))
      .orderBy(desc(waterPayments.paymentMonth));
  }

  async createWaterPayment(payment: InsertWaterPayment): Promise<WaterPayment> {
    const result = await this.db.insert(waterPayments).values(payment).returning();
    return result[0];
  }

  async getPendingWaterPayments(): Promise<WaterPayment[]> {
    return await this.db.select().from(waterPayments)
      .where(eq(waterPayments.status, 'pending'))
      .orderBy(desc(waterPayments.createdAt));
  }

  async getAllWaterPayments(): Promise<WaterPayment[]> {
    return await this.db.select().from(waterPayments)
      .orderBy(desc(waterPayments.createdAt));
  }

  async updateWaterPaymentStatus(id: string, status: string, verifiedBy: string, receiptNumber?: string, paymentDate?: string, paymentMethod?: string): Promise<WaterPayment> {
    const updateData: any = { 
      status, 
      verifiedBy,
      verifiedAt: new Date()
    };
    
    // Add receipt number and payment details if provided
    if (receiptNumber) updateData.receiptNumber = receiptNumber;
    if (paymentDate) updateData.paymentDate = paymentDate;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    
    const result = await this.db.update(waterPayments)
      .set(updateData)
      .where(eq(waterPayments.id, id))
      .returning();
    return result[0];
  }

  async getWaterPaymentByMonth(propertyNumber: string, paymentMonth: string): Promise<WaterPayment | undefined> {
    const result = await this.db.select().from(waterPayments)
      .where(
        and(
          eq(waterPayments.propertyNumber, propertyNumber),
          eq(waterPayments.paymentMonth, paymentMonth)
        )
      );
    return result[0];
  }
}

// Use DbStorage for database, or MemStorage for in-memory (development/testing)
export const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
