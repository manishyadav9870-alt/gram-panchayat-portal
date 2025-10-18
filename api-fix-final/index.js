// server/index.ts
import "dotenv/config";
import express2 from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import path4 from "path";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  address: text("address").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  status: true
});
var birthCertificates = pgTable("birth_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateNumber: text("certificate_number").notNull(),
  registrationNumber: text("registration_number"),
  trackingNumber: text("tracking_number").notNull().unique(),
  childNameEn: text("child_name_en").notNull(),
  childNameMr: text("child_name_mr"),
  sex: text("sex").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  dateOfRegistration: text("date_of_registration").notNull(),
  placeOfBirthEn: text("place_of_birth_en").notNull(),
  placeOfBirthMr: text("place_of_birth_mr"),
  motherNameEn: text("mother_name_en").notNull(),
  motherNameMr: text("mother_name_mr"),
  motherAadhar: text("mother_aadhar").notNull(),
  fatherNameEn: text("father_name_en").notNull(),
  fatherNameMr: text("father_name_mr"),
  fatherAadhar: text("father_aadhar").notNull(),
  permanentAddressEn: text("permanent_address_en").notNull(),
  permanentAddressMr: text("permanent_address_mr"),
  birthAddress: text("birth_address"),
  issueDate: text("issue_date").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  remarksEn: text("remarks_en"),
  remarksMr: text("remarks_mr"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertBirthCertificateSchema = createInsertSchema(birthCertificates).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  status: true
}).extend({
  certificateNumber: z.string(),
  registrationNumber: z.string().optional(),
  childNameEn: z.string(),
  childNameMr: z.string().optional(),
  sex: z.string(),
  dateOfBirth: z.string(),
  dateOfRegistration: z.string(),
  placeOfBirthEn: z.string(),
  placeOfBirthMr: z.string().optional(),
  motherNameEn: z.string(),
  motherNameMr: z.string().optional(),
  motherAadhar: z.string(),
  fatherNameEn: z.string(),
  fatherNameMr: z.string().optional(),
  fatherAadhar: z.string(),
  permanentAddressEn: z.string(),
  permanentAddressMr: z.string().optional(),
  birthAddress: z.string().optional(),
  issueDate: z.string(),
  issuingAuthority: z.string(),
  remarksEn: z.string().optional(),
  remarksMr: z.string().optional()
});
var deathCertificates = pgTable("death_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  certificateNumber: text("certificate_number").notNull(),
  registrationNumber: text("registration_number"),
  deceasedNameEn: text("deceased_name_en").notNull(),
  deceasedNameMr: text("deceased_name_mr"),
  sex: text("sex").notNull(),
  dateOfDeath: text("date_of_death").notNull(),
  dateOfRegistration: text("date_of_registration").notNull(),
  placeOfDeathEn: text("place_of_death_en").notNull(),
  placeOfDeathMr: text("place_of_death_mr"),
  ageAtDeath: text("age_at_death").notNull(),
  fatherHusbandNameEn: text("father_husband_name_en").notNull(),
  fatherHusbandNameMr: text("father_husband_name_mr"),
  permanentAddressEn: text("permanent_address_en").notNull(),
  permanentAddressMr: text("permanent_address_mr"),
  issueDate: text("issue_date").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  remarksEn: text("remarks_en"),
  remarksMr: text("remarks_mr"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertDeathCertificateSchema = z.object({
  certificateNumber: z.string(),
  registrationNumber: z.string().optional(),
  deceasedNameEn: z.string(),
  deceasedNameMr: z.string().optional(),
  sex: z.string(),
  dateOfDeath: z.string(),
  dateOfRegistration: z.string(),
  placeOfDeathEn: z.string(),
  placeOfDeathMr: z.string().optional(),
  ageAtDeath: z.string(),
  fatherHusbandNameEn: z.string(),
  fatherHusbandNameMr: z.string().optional(),
  permanentAddressEn: z.string(),
  permanentAddressMr: z.string().optional(),
  issueDate: z.string(),
  issuingAuthority: z.string(),
  remarksEn: z.string().optional(),
  remarksMr: z.string().optional()
});
var announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleMr: text("title_mr").notNull(),
  description: text("description").notNull(),
  descriptionMr: text("description_mr").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull().default("normal"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true
});

// server/storage.ts
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
var MemStorage = class {
  users;
  complaints;
  birthCertificates;
  deathCertificates;
  announcements;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.complaints = /* @__PURE__ */ new Map();
    this.birthCertificates = /* @__PURE__ */ new Map();
    this.deathCertificates = /* @__PURE__ */ new Map();
    this.announcements = /* @__PURE__ */ new Map();
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Complaint methods
  async getComplaint(id) {
    return this.complaints.get(id);
  }
  async getComplaintByTrackingNumber(trackingNumber) {
    return Array.from(this.complaints.values()).find(
      (complaint) => complaint.trackingNumber === trackingNumber
    );
  }
  async getAllComplaints() {
    return Array.from(this.complaints.values());
  }
  async createComplaint(insertComplaint) {
    const id = randomUUID();
    const trackingNumber = `CMP${Date.now().toString().slice(-8)}`;
    const complaint = {
      ...insertComplaint,
      id,
      trackingNumber,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.complaints.set(id, complaint);
    return complaint;
  }
  async updateComplaint(id, insertComplaint) {
    const complaint = this.complaints.get(id);
    if (complaint) {
      const updated = {
        ...complaint,
        ...insertComplaint
      };
      this.complaints.set(id, updated);
      return updated;
    }
    return void 0;
  }
  async updateComplaintStatus(id, status) {
    const complaint = this.complaints.get(id);
    if (complaint) {
      complaint.status = status;
      this.complaints.set(id, complaint);
      return complaint;
    }
    return void 0;
  }
  async deleteComplaint(id) {
    return this.complaints.delete(id);
  }
  // Birth Certificate methods
  async getBirthCertificate(id) {
    return this.birthCertificates.get(id);
  }
  async getBirthCertificateByTrackingNumber(trackingNumber) {
    return Array.from(this.birthCertificates.values()).find(
      (cert) => cert.trackingNumber === trackingNumber
    );
  }
  async getAllBirthCertificates() {
    return Array.from(this.birthCertificates.values());
  }
  async createBirthCertificate(insertCertificate) {
    const id = randomUUID();
    const trackingNumber = `BRT${Date.now().toString().slice(-8)}`;
    const certificate = {
      ...insertCertificate,
      id,
      trackingNumber,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.birthCertificates.set(id, certificate);
    return certificate;
  }
  async updateBirthCertificate(id, insertCertificate) {
    const certificate = this.birthCertificates.get(id);
    if (certificate) {
      const updated = {
        ...certificate,
        ...insertCertificate
      };
      this.birthCertificates.set(id, updated);
      return updated;
    }
    return void 0;
  }
  async updateBirthCertificateStatus(id, status) {
    const certificate = this.birthCertificates.get(id);
    if (certificate) {
      certificate.status = status;
      this.birthCertificates.set(id, certificate);
      return certificate;
    }
    return void 0;
  }
  async deleteBirthCertificate(id) {
    return this.birthCertificates.delete(id);
  }
  // Death Certificate methods
  async getDeathCertificate(id) {
    return this.deathCertificates.get(id);
  }
  async getDeathCertificateByTrackingNumber(trackingNumber) {
    return Array.from(this.deathCertificates.values()).find(
      (cert) => cert.trackingNumber === trackingNumber
    );
  }
  async getAllDeathCertificates() {
    return Array.from(this.deathCertificates.values());
  }
  async createDeathCertificate(insertCertificate) {
    const id = randomUUID();
    const trackingNumber = `DTH${Date.now().toString().slice(-8)}`;
    const certificate = {
      ...insertCertificate,
      id,
      trackingNumber,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.deathCertificates.set(id, certificate);
    return certificate;
  }
  async updateDeathCertificate(id, insertCertificate) {
    const certificate = this.deathCertificates.get(id);
    if (certificate) {
      const updated = {
        ...certificate,
        ...insertCertificate
      };
      this.deathCertificates.set(id, updated);
      return updated;
    }
    return void 0;
  }
  async updateDeathCertificateStatus(id, status) {
    const certificate = this.deathCertificates.get(id);
    if (certificate) {
      certificate.status = status;
      this.deathCertificates.set(id, certificate);
      return certificate;
    }
    return void 0;
  }
  async deleteDeathCertificate(id) {
    return this.deathCertificates.delete(id);
  }
  // Announcement methods
  async getAnnouncement(id) {
    return this.announcements.get(id);
  }
  async getAllAnnouncements() {
    return Array.from(this.announcements.values());
  }
  async createAnnouncement(insertAnnouncement) {
    const id = randomUUID();
    const announcement = {
      id,
      title: insertAnnouncement.title,
      titleMr: insertAnnouncement.titleMr,
      description: insertAnnouncement.description,
      descriptionMr: insertAnnouncement.descriptionMr,
      category: insertAnnouncement.category,
      priority: insertAnnouncement.priority || "normal",
      date: insertAnnouncement.date,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.announcements.set(id, announcement);
    return announcement;
  }
  async deleteAnnouncement(id) {
    return this.announcements.delete(id);
  }
};
var DbStorage = class {
  db;
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const sql2 = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql2);
  }
  // User methods
  async getUser(id) {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(insertUser) {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }
  // Complaint methods
  async getComplaint(id) {
    const result = await this.db.select().from(complaints).where(eq(complaints.id, id));
    return result[0];
  }
  async getComplaintByTrackingNumber(trackingNumber) {
    const result = await this.db.select().from(complaints).where(eq(complaints.trackingNumber, trackingNumber));
    return result[0];
  }
  async getAllComplaints() {
    return await this.db.select().from(complaints);
  }
  async createComplaint(insertComplaint) {
    const trackingNumber = `CMP${Date.now().toString().slice(-8)}`;
    const result = await this.db.insert(complaints).values({
      ...insertComplaint,
      trackingNumber,
      status: "pending"
    }).returning();
    return result[0];
  }
  async updateComplaint(id, insertComplaint) {
    const result = await this.db.update(complaints).set(insertComplaint).where(eq(complaints.id, id)).returning();
    return result[0];
  }
  async updateComplaintStatus(id, status) {
    const result = await this.db.update(complaints).set({ status }).where(eq(complaints.id, id)).returning();
    return result[0];
  }
  async deleteComplaint(id) {
    const result = await this.db.delete(complaints).where(eq(complaints.id, id)).returning();
    return result.length > 0;
  }
  // Birth Certificate methods
  async getBirthCertificate(id) {
    const result = await this.db.select().from(birthCertificates).where(eq(birthCertificates.id, id));
    return result[0];
  }
  async getBirthCertificateByTrackingNumber(trackingNumber) {
    const result = await this.db.select().from(birthCertificates).where(eq(birthCertificates.trackingNumber, trackingNumber));
    return result[0];
  }
  async getAllBirthCertificates() {
    return await this.db.select().from(birthCertificates);
  }
  async createBirthCertificate(insertCertificate) {
    const trackingNumber = `BRT${Date.now().toString().slice(-8)}`;
    const result = await this.db.insert(birthCertificates).values({
      ...insertCertificate,
      trackingNumber,
      status: "pending"
    }).returning();
    return result[0];
  }
  async updateBirthCertificate(id, insertCertificate) {
    const result = await this.db.update(birthCertificates).set(insertCertificate).where(eq(birthCertificates.id, id)).returning();
    return result[0];
  }
  async updateBirthCertificateStatus(id, status) {
    const result = await this.db.update(birthCertificates).set({ status }).where(eq(birthCertificates.id, id)).returning();
    return result[0];
  }
  async deleteBirthCertificate(id) {
    const result = await this.db.delete(birthCertificates).where(eq(birthCertificates.id, id)).returning();
    return result.length > 0;
  }
  // Death Certificate methods
  async getDeathCertificate(id) {
    const result = await this.db.select().from(deathCertificates).where(eq(deathCertificates.id, id));
    return result[0];
  }
  async getDeathCertificateByTrackingNumber(trackingNumber) {
    const result = await this.db.select().from(deathCertificates).where(eq(deathCertificates.trackingNumber, trackingNumber));
    return result[0];
  }
  async getAllDeathCertificates() {
    return await this.db.select().from(deathCertificates);
  }
  async createDeathCertificate(insertCertificate) {
    const trackingNumber = `DTH${Date.now().toString().slice(-8)}`;
    const result = await this.db.insert(deathCertificates).values({
      ...insertCertificate,
      trackingNumber,
      status: "pending"
    }).returning();
    return result[0];
  }
  async updateDeathCertificate(id, insertCertificate) {
    const result = await this.db.update(deathCertificates).set(insertCertificate).where(eq(deathCertificates.id, id)).returning();
    return result[0];
  }
  async updateDeathCertificateStatus(id, status) {
    const result = await this.db.update(deathCertificates).set({ status }).where(eq(deathCertificates.id, id)).returning();
    return result[0];
  }
  async deleteDeathCertificate(id) {
    const result = await this.db.delete(deathCertificates).where(eq(deathCertificates.id, id)).returning();
    return result.length > 0;
  }
  // Announcement methods
  async getAnnouncement(id) {
    const result = await this.db.select().from(announcements).where(eq(announcements.id, id));
    return result[0];
  }
  async getAllAnnouncements() {
    return await this.db.select().from(announcements);
  }
  async createAnnouncement(insertAnnouncement) {
    const result = await this.db.insert(announcements).values(insertAnnouncement).returning();
    return result[0];
  }
  async deleteAnnouncement(id) {
    const result = await this.db.delete(announcements).where(eq(announcements.id, id)).returning();
    return result.length > 0;
  }
};
var storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();

// server/pdfGenerator.ts
import { jsPDF } from "jspdf";
function generateBirthCertificatePDF(certificate) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Shasan Nirnay Kramank: ARTIPES-2015/Pr.Kr.32/Pa.Ra-5, Dinank 14 Julai, 2015", 20, 10);
  doc.setLineWidth(1);
  doc.line(15, 14, pageWidth - 15, 14);
  doc.setLineWidth(0.8);
  doc.rect(15, 18, pageWidth - 30, pageHeight - 30);
  doc.setFontSize(8);
  doc.text("Pramanpatra Kr./Certificate No.", 18, 24);
  doc.text("Namuna 4/ Form 4", pageWidth - 50, 24);
  doc.setLineWidth(0.5);
  doc.rect(18, 28, 45, 45);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("Satyameva Jayate", 40.5, 52, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Maharashtra Shasan", pageWidth / 2, 38, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Government of Maharashtra", pageWidth / 2, 45, { align: "center" });
  doc.setFontSize(11);
  doc.text("Arogya Vibhag", pageWidth / 2, 52, { align: "center" });
  doc.text("Health Department", pageWidth / 2, 58, { align: "center" });
  doc.setLineWidth(0.8);
  doc.line(15, 75, pageWidth - 15, 75);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const localBody = certificate.localBodyName || "Kishore Gram Panchayat";
  doc.text(`Pramanpatra Nirgamit Karanara Sthanik Kshetre che Nav _______________`, 18, 80);
  doc.text(`Name of the local body issuing Certificate_______________`, 18, 84);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Janma Pramanpatra / BIRTH CERTIFICATE", pageWidth / 2, 94, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("(Janma va Mrutyu Nondani Adhiniyam, 1969 chya Kalam 12/17 ani Maharashtra Janma va Mrutyu Niyam 2000 che Niyam 8/13 Anusar Deyat Ahe.)", 18, 100);
  doc.text("(Issued under section 12/17 of the Registration of Births & Deaths Act, 1969 and rule 8/13 of the Maharashtra Registration of Births and", 18, 104);
  doc.text("Death Rules 2000)", 18, 108);
  doc.setFontSize(8);
  let yPos = 115;
  doc.text("Pramanit Kuranyat Yeil Ahi Ki Khalil Mahiti Janmachya Mul Abhilekhatun Ghetleli Ahe Jyala (Sthanik Kshetre/", 18, yPos);
  yPos += 4;
  doc.text("Taluka) _______________. Maharashtra Rajyachya Nondnichi Uddesh Ahe.", 18, yPos);
  yPos += 4;
  doc.text("This is to certify that the following information has been taken from the original record of birth which is the registrar (local area / local body)", 18, yPos);
  yPos += 4;
  doc.text("of tehsil / block _______________. _______________of Maharashtra State.", 18, yPos);
  yPos += 10;
  const leftCol = 20;
  const rightCol = pageWidth / 2 + 5;
  const lineHeight = 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Aadharkard Kramank:", leftCol, yPos);
  doc.text("Adhar Card", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Balache Purn Nav:", leftCol, yPos);
  doc.text("Number:", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Name of Child:", leftCol, yPos);
  doc.text("Ling:", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(certificate.childName || certificate.childName || "", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text("Sex:", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Janma Tarekh:", leftCol, yPos);
  doc.text("Janma Dinanank:", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Date of Birth:", leftCol, yPos);
  doc.text("Place of Birth:", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(certificate.dateOfBirth || "", leftCol, yPos);
  doc.text(certificate.placeOfBirth || certificate.placeOfBirth || "", rightCol, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Aiche Purn Nav:", leftCol, yPos);
  doc.text("Vadilanche Purn Nav", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Full Name of Mother:", leftCol, yPos);
  doc.text("Full Name of", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(certificate.motherName || "", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text("Father:", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(certificate.fatherName || "", rightCol, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Balache Janmavelechya Ai", leftCol, yPos);
  doc.text("Ai Vadilanche", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Vadilanche Patta:", leftCol, yPos);
  doc.text("Kayamcha Patta:", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Address of parents at the", leftCol, yPos);
  doc.text("Permanent", rightCol, yPos);
  yPos += lineHeight;
  doc.text("time of birth of the child:", leftCol, yPos);
  doc.text("Address of the parents:", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(certificate.addressAtBirth || certificate.address || "", leftCol, yPos, { maxWidth: 85 });
  doc.text(certificate.permanentAddress || certificate.address || "", rightCol, yPos, { maxWidth: 85 });
  doc.setFont("helvetica", "normal");
  yPos += lineHeight + 5;
  doc.text("Nondani Kramank:", leftCol, yPos);
  doc.text("Nondani Dinank:", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Registration No.:", leftCol, yPos);
  doc.text("Date of", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(certificate.trackingNumber || "", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text("Registration:", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(new Date(certificate.createdAt).toLocaleDateString("en-IN"), rightCol, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight + 5;
  doc.text("Shera:", leftCol, yPos);
  yPos += lineHeight;
  doc.text("Remarks (if any):", leftCol, yPos);
  yPos += lineHeight + 5;
  doc.text("Pramanpatra Vistyacha Dinank:", leftCol, yPos);
  doc.text("Nirgamak, Janma-Mrutyu Nondani Adhikari, Gramapanchayat", rightCol, yPos);
  yPos += lineHeight;
  doc.text("Certificate Issue Date:", leftCol, yPos);
  doc.text("________, Ta.______, Ji. ________", rightCol, yPos);
  yPos += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text((/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"), leftCol, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight + 10;
  doc.text("Shikka / Seal", pageWidth / 2, yPos, { align: "center" });
  doc.setFontSize(7);
  yPos = pageHeight - 15;
  doc.text("Pratyek Janma Ani Mrutyu Pratyacha Nondanivarya Suchi Kara", 18, yPos);
  doc.text("Ensure Registration of Every Birth & Death", pageWidth - 18, yPos, { align: "right" });
  yPos += 4;
  doc.text("Sadar Sahayaki Seveta Tapasunyachi Aslyachi https://aaplesarkar.mahaonline.gov.in/Certificate Validation.aspx ya Maharashtra Shashan", 18, yPos);
  doc.text("2015-Year of Digitized & Time Bound Services", pageWidth - 18, yPos, { align: "right" });
  return doc;
}
function generateDeathCertificatePDF(certificate) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica");
  doc.setFontSize(10);
  doc.text("\u0936\u093E\u0938\u0928 \u0928\u093F\u0930\u094D\u0923\u092F \u0915\u094D\u0930\u092E\u093E\u0902\u0915: \u0906\u0930\u091F\u0940\u090F\u0938-\u0968\u0966\u0967\u096B/\u092A\u094D\u0930.\u0915\u094D\u0930.\u0969\u0968/\u092A\u0902.\u0930\u093E-\u096B, \u0926\u093F\u0928\u093E\u0902\u0915 \u0967\u096A \u091C\u0941\u0932\u0948, \u0968\u0966\u0967\u096B", pageWidth / 2, 15, { align: "center" });
  doc.setLineWidth(0.5);
  doc.line(15, 20, pageWidth - 15, 20);
  doc.setFontSize(9);
  doc.text(`\u092A\u094D\u0930\u092E\u093E\u0923\u092A\u0924\u094D\u0930 \u0915\u094D\u0930./Certificate No.`, 20, 30);
  doc.text(`\u0928\u092E\u0941\u0928\u093E \u0968/ Form 2`, pageWidth - 60, 30);
  doc.rect(20, 35, 50, 50);
  doc.setFontSize(8);
  doc.text("\u0938\u0924\u094D\u092F\u092E\u0947\u0935 \u091C\u092F\u0924\u0947", 35, 80, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0936\u093E\u0938\u0928", pageWidth / 2, 45, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Government of Maharashtra", pageWidth / 2, 52, { align: "center" });
  doc.setFontSize(11);
  doc.text("\u0906\u0930\u094B\u0917\u094D\u092F \u0935\u093F\u092D\u093E\u0917", pageWidth / 2, 59, { align: "center" });
  doc.text("Health Department", pageWidth / 2, 66, { align: "center" });
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("\u092E\u0943\u0924\u094D\u092F\u0942 \u092A\u094D\u0930\u092E\u093E\u0923\u092A\u0924\u094D\u0930 / DEATH CERTIFICATE", pageWidth / 2, 110, { align: "center" });
  let yPos = 130;
  const leftCol = 25;
  const lineHeight = 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("\u092E\u0943\u0924 \u0935\u094D\u092F\u0915\u094D\u0924\u0940\u091A\u0947 \u0928\u093E\u0935:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.deceasedName || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Name of Deceased:", leftCol, yPos);
  yPos += lineHeight;
  doc.text("\u092E\u0943\u0924\u094D\u092F\u0942\u091A\u0940 \u0924\u093E\u0930\u0940\u0916:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.dateOfDeath || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Date of Death:", leftCol, yPos);
  yPos += lineHeight;
  doc.text("\u092E\u0943\u0924\u094D\u092F\u0942\u091A\u0947 \u0920\u093F\u0915\u093E\u0923:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.placeOfDeath || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Place of Death:", leftCol, yPos);
  yPos += lineHeight;
  doc.text("\u0935\u092F:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.age || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Age:", leftCol, yPos);
  yPos += lineHeight;
  doc.text("\u092E\u0943\u0924\u094D\u092F\u0942\u091A\u0947 \u0915\u093E\u0930\u0923:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.causeOfDeath || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Cause of Death:", leftCol, yPos);
  yPos += lineHeight + 5;
  doc.text("\u0905\u0930\u094D\u091C\u0926\u093E\u0930\u093E\u091A\u0947 \u0928\u093E\u0935:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.applicantName || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Applicant Name:", leftCol, yPos);
  yPos += lineHeight;
  doc.text("\u0938\u0902\u092C\u0902\u0927:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.relation || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Relation:", leftCol, yPos);
  yPos += lineHeight;
  doc.text("\u0928\u094B\u0902\u0926\u0923\u0940 \u0915\u094D\u0930\u092E\u093E\u0902\u0915:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.trackingNumber || "", leftCol + 50, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Registration No.:", leftCol, yPos);
  yPos += lineHeight + 10;
  doc.text("\u092A\u094D\u0930\u092E\u093E\u0923\u092A\u0924\u094D\u0930 \u0935\u093F\u0938\u094D\u0924\u094D\u092F\u093E\u091A\u093E \u0926\u093F\u0928\u093E\u0902\u0915:", leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text((/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"), leftCol + 60, yPos);
  doc.setFont("helvetica", "normal");
  yPos += lineHeight;
  doc.text("Certificate Issue Date:", leftCol, yPos);
  yPos += lineHeight + 10;
  doc.text("\u0936\u093F\u0915\u094D\u0915\u093E / Seal", pageWidth / 2, yPos, { align: "center" });
  doc.setLineWidth(0.5);
  doc.rect(15, 25, pageWidth - 30, pageHeight - 35);
  return doc;
}

// server/ocrProcessor.ts
import tesseract from "node-tesseract-ocr";
import { fromPath } from "pdf2pic";
import fs from "fs";
import path from "path";
import os from "os";
var OCR_CONFIG = {
  lang: "mar+eng",
  // Marathi + English
  oem: 1,
  // LSTM OCR Engine Mode
  psm: 3
  // Fully automatic page segmentation
};
var PDF_TO_IMAGE_CONFIG = {
  density: 300,
  // DPI - higher = better quality
  saveFilename: "page",
  savePath: os.tmpdir(),
  format: "png",
  width: 2480,
  // A4 at 300 DPI
  height: 3508
};
async function extractTextFromImage(imagePath) {
  try {
    const text2 = await tesseract.recognize(imagePath, OCR_CONFIG);
    return text2.trim();
  } catch (error) {
    console.error(`Error extracting text from image: ${imagePath}`, error);
    throw error;
  }
}
async function extractTextFromPDF(pdfPath) {
  const tempImages = [];
  try {
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }
    const convert = fromPath(pdfPath, PDF_TO_IMAGE_CONFIG);
    const pages = [];
    let pageNumber = 1;
    let hasMorePages = true;
    while (hasMorePages) {
      try {
        const pageResult = await convert(pageNumber, { responseType: "image" });
        if (pageResult && pageResult.path) {
          tempImages.push(pageResult.path);
          const text2 = await extractTextFromImage(pageResult.path);
          pages.push({
            text: text2,
            pageNumber
          });
          pageNumber++;
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        hasMorePages = false;
      }
    }
    const extractedText = pages.map((p) => p.text).join("\n\n");
    return {
      success: true,
      totalPages: pages.length,
      extractedText,
      pages
    };
  } catch (error) {
    console.error("Error processing PDF with OCR:", error);
    return {
      success: false,
      totalPages: 0,
      extractedText: "",
      pages: [],
      error: error.message || "Failed to process PDF"
    };
  } finally {
    tempImages.forEach((imagePath) => {
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error(`Failed to delete temp file: ${imagePath}`, error);
      }
    });
  }
}
function parseBirthCertificate(text2) {
  const data = {};
  const patterns = {
    certificateNo: /प्रमाणपत्र क्र[\.\/]?\s*[:\/]?\s*([^\n]+)/i,
    name: /नाव\s*[:\/]?\s*([^\n]+)/i,
    nameOfChild: /Name of Child\s*[:\/]?\s*([^\n]+)/i,
    sex: /लिंग\s*[:\/]?\s*([^\n]+)/i,
    dateOfBirth: /जन्म तारीख\s*[:\/]?\s*([^\n]+)/i,
    placeOfBirth: /जन्म स्थळ\s*[:\/]?\s*([^\n]+)/i,
    motherName: /आईचे पूर्ण नाव\s*[:\/]?\s*([^\n]+)/i,
    fatherName: /वडिलांचे पूर्ण नाव\s*[:\/]?\s*([^\n]+)/i,
    address: /पत्ता\s*[:\/]?\s*([^\n]+)/i,
    registrationNo: /नोंदणी क्रमांक\s*[:\/]?\s*([^\n]+)/i,
    registrationDate: /नोंदणी दिनांक\s*[:\/]?\s*([^\n]+)/i
  };
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text2.match(pattern);
    if (match && match[1]) {
      data[key] = match[1].trim();
    }
  }
  return data;
}
async function extractTextFromPDFBuffer(buffer, originalFilename) {
  const tempPdfPath = path.join(os.tmpdir(), `temp-${Date.now()}-${originalFilename}`);
  try {
    fs.writeFileSync(tempPdfPath, buffer);
    const result = await extractTextFromPDF(tempPdfPath);
    return result;
  } catch (error) {
    console.error("Error processing PDF buffer:", error);
    return {
      success: false,
      totalPages: 0,
      extractedText: "",
      pages: [],
      error: error.message || "Failed to process PDF buffer"
    };
  } finally {
    try {
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
    } catch (error) {
      console.error(`Failed to delete temp PDF: ${tempPdfPath}`, error);
    }
  }
}

// server/routes.ts
var requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username === "admin" && password === "admin123") {
        req.session.userId = "admin-id";
        req.session.username = username;
        res.json({ message: "Login successful", username });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/auth/me", (req, res) => {
    if (req.session.userId) {
      res.json({ username: req.session.username });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  app2.post("/api/complaints", async (req, res) => {
    try {
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      res.status(201).json(complaint);
    } catch (error) {
      res.status(400).json({ message: error.message || "Invalid complaint data" });
    }
  });
  app2.get("/api/complaints", async (req, res) => {
    try {
      const complaints2 = await storage.getAllComplaints();
      res.json(complaints2);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch complaints" });
    }
  });
  app2.get("/api/complaints/:trackingNumber", async (req, res) => {
    try {
      const complaint = await storage.getComplaintByTrackingNumber(req.params.trackingNumber);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch complaint" });
    }
  });
  app2.patch("/api/complaints/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const complaint = await storage.updateComplaintStatus(req.params.id, status);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update complaint status" });
    }
  });
  app2.post("/api/birth-certificates/test", async (req, res) => {
    try {
      const testData = {
        certificateNumber: "BC-2025-TEST",
        registrationNumber: "REG123",
        childNameEn: "Test Child",
        childNameMr: "\u091F\u0947\u0938\u094D\u091F \u092E\u0942\u0932",
        sex: "male",
        dateOfBirth: "2025-01-01",
        dateOfRegistration: "2025-01-10",
        placeOfBirthEn: "Mumbai",
        placeOfBirthMr: "\u092E\u0941\u0902\u092C\u0908",
        motherNameEn: "Test Mother",
        motherNameMr: "\u091F\u0947\u0938\u094D\u091F \u0906\u0908",
        motherAadhar: "123456789012",
        fatherNameEn: "Test Father",
        fatherNameMr: "\u091F\u0947\u0938\u094D\u091F \u0935\u0921\u0940\u0932",
        fatherAadhar: "123456789013",
        permanentAddressEn: "Test Address, Mumbai",
        permanentAddressMr: "\u091F\u0947\u0938\u094D\u091F \u092A\u0924\u094D\u0924\u093E, \u092E\u0941\u0902\u092C\u0908",
        birthAddress: "",
        issueDate: "2025-01-15",
        issuingAuthority: "\u0917\u094D\u0930\u093E\u092E\u092A\u0902\u091A\u093E\u092F\u0924 \u0915\u093F\u0936\u094B\u0930",
        remarksEn: "Test",
        remarksMr: "\u091F\u0947\u0938\u094D\u091F"
      };
      const certificate = await storage.createBirthCertificate(testData);
      res.status(201).json(certificate);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to create test certificate" });
    }
  });
  app2.post("/api/birth-certificates", async (req, res) => {
    try {
      console.log("Received birth certificate data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertBirthCertificateSchema.parse(req.body);
      const certificate = await storage.createBirthCertificate(validatedData);
      res.status(201).json(certificate);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ message: error.message || "Invalid birth certificate data", errors: error.errors });
    }
  });
  app2.get("/api/birth-certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllBirthCertificates();
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch birth certificates" });
    }
  });
  app2.get("/api/birth-certificates/id/:id", async (req, res) => {
    try {
      console.log("Fetching certificate by ID:", req.params.id);
      const certificate = await storage.getBirthCertificate(req.params.id);
      if (!certificate) {
        console.log("Certificate not found");
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      console.log("Certificate found:", certificate);
      res.json(certificate);
    } catch (error) {
      console.error("Error fetching certificate:", error);
      res.status(500).json({ message: error.message || "Failed to fetch birth certificate" });
    }
  });
  app2.get("/api/birth-certificates/tracking/:trackingNumber", async (req, res) => {
    try {
      const certificate = await storage.getBirthCertificateByTrackingNumber(req.params.trackingNumber);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch birth certificate" });
    }
  });
  app2.patch("/api/birth-certificates/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const certificate = await storage.updateBirthCertificateStatus(req.params.id, status);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update birth certificate status" });
    }
  });
  app2.get("/api/birth-certificates/:id/pdf", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getBirthCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      const pdf = generateBirthCertificatePDF(certificate);
      const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=birth-certificate-${certificate.trackingNumber}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to generate PDF" });
    }
  });
  app2.post("/api/death-certificates", async (req, res) => {
    try {
      console.log("Received death certificate data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertDeathCertificateSchema.parse(req.body);
      const certificate = await storage.createDeathCertificate(validatedData);
      res.status(201).json(certificate);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ message: error.message || "Invalid death certificate data", errors: error.errors });
    }
  });
  app2.get("/api/death-certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllDeathCertificates();
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch death certificates" });
    }
  });
  app2.get("/api/death-certificates/id/:id", async (req, res) => {
    try {
      console.log("Fetching death certificate by ID:", req.params.id);
      const certificate = await storage.getDeathCertificate(req.params.id);
      if (!certificate) {
        console.log("Death certificate not found");
        return res.status(404).json({ message: "Death certificate not found" });
      }
      console.log("Death certificate found:", certificate);
      res.json(certificate);
    } catch (error) {
      console.error("Error fetching death certificate:", error);
      res.status(500).json({ message: error.message || "Failed to fetch death certificate" });
    }
  });
  app2.get("/api/death-certificates/tracking/:trackingNumber", async (req, res) => {
    try {
      const certificate = await storage.getDeathCertificateByTrackingNumber(req.params.trackingNumber);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch death certificate" });
    }
  });
  app2.patch("/api/death-certificates/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const certificate = await storage.updateDeathCertificateStatus(req.params.id, status);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update death certificate status" });
    }
  });
  app2.get("/api/death-certificates/:id/pdf", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getDeathCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      const pdf = generateDeathCertificatePDF(certificate);
      const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=death-certificate-${certificate.trackingNumber}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to generate PDF" });
    }
  });
  app2.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: error.message || "Invalid announcement data" });
    }
  });
  app2.get("/api/announcements", async (req, res) => {
    try {
      const announcements2 = await storage.getAllAnnouncements();
      res.json(announcements2);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch announcements" });
    }
  });
  app2.delete("/api/announcements/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAnnouncement(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete announcement" });
    }
  });
  app2.put("/api/admin/complaints/:id", requireAuth, async (req, res) => {
    try {
      const complaint = await storage.getComplaint(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      const validatedData = insertComplaintSchema.parse(req.body);
      const updated = await storage.updateComplaint(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update complaint" });
    }
  });
  app2.delete("/api/admin/complaints/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteComplaint(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json({ message: "Complaint deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete complaint" });
    }
  });
  app2.put("/api/admin/birth-certificates/:id", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getBirthCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      const validatedData = insertBirthCertificateSchema.parse(req.body);
      const updated = await storage.updateBirthCertificate(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update birth certificate" });
    }
  });
  app2.delete("/api/admin/birth-certificates/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteBirthCertificate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Birth certificate not found" });
      }
      res.json({ message: "Birth certificate deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete birth certificate" });
    }
  });
  app2.put("/api/admin/death-certificates/:id", requireAuth, async (req, res) => {
    try {
      const certificate = await storage.getDeathCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      const validatedData = insertDeathCertificateSchema.parse(req.body);
      const updated = await storage.updateDeathCertificate(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update death certificate" });
    }
  });
  app2.delete("/api/admin/death-certificates/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteDeathCertificate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Death certificate not found" });
      }
      res.json({ message: "Death certificate deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete death certificate" });
    }
  });
  app2.post("/api/ocr/extract", upload.single("pdf"), async (req, res) => {
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
        pages: result.pages
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to process PDF"
      });
    }
  });
  app2.post("/api/ocr/birth-certificate", upload.single("pdf"), async (req, res) => {
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
      const parsedData = parseBirthCertificate(result.extractedText);
      res.json({
        success: true,
        totalPages: result.totalPages,
        extractedText: result.extractedText,
        parsedData,
        pages: result.pages
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to process birth certificate"
      });
    }
  });
  app2.get("/api/admin/users", requireAuth, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch users" });
    }
  });
  app2.post("/api/admin/users", requireAuth, async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const user = await storage.createUser({ username, password, role });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  });
  app2.put("/api/admin/users/:id", requireAuth, async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const user = await storage.updateUser(req.params.id, { username, password, role });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update user" });
    }
  });
  app2.delete("/api/admin/users/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete user" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use("/images", express2.static(path4.join(process.cwd(), "public", "images")));
var MemoryStoreSession = MemoryStore(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "gram-panchayat-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 864e5
      // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }
  })
);
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
