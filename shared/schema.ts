import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  name: text("name").notNull(),
  nameMr: text("name_mr"),
  contact: text("contact").notNull(),
  address: text("address").notNull(),
  addressMr: text("address_mr"),
  category: text("category").notNull(),
  categoryMr: text("category_mr"),
  description: text("description").notNull(),
  descriptionMr: text("description_mr"),
  images: text("images").array(),
  adminRemark: text("admin_remark"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  status: true,
  adminRemark: true,
});

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;

export const birthCertificates = pgTable("birth_certificates", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBirthCertificateSchema = createInsertSchema(birthCertificates).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  status: true,
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
  remarksMr: z.string().optional(),
});

export type InsertBirthCertificate = z.infer<typeof insertBirthCertificateSchema>;
export type BirthCertificate = typeof birthCertificates.$inferSelect;

export const deathCertificates = pgTable("death_certificates", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeathCertificateSchema = z.object({
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
  remarksMr: z.string().optional(),
});

export type InsertDeathCertificate = z.infer<typeof insertDeathCertificateSchema>;
export type DeathCertificate = typeof deathCertificates.$inferSelect;

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleMr: text("title_mr").notNull(),
  description: text("description").notNull(),
  descriptionMr: text("description_mr").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull().default("normal"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export const leavingCertificates = pgTable("leaving_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateNumber: text("certificate_number").notNull(),
  dispatchNumber: text("dispatch_number").notNull(),
  dispatchDate: text("dispatch_date").notNull(),
  applicantNameEn: text("applicant_name_en").notNull(),
  applicantNameMr: text("applicant_name_mr").notNull(),
  aadharNumber: text("aadhar_number").notNull(),
  residentOfEn: text("resident_of_en").notNull(),
  residentOfMr: text("resident_of_mr").notNull(),
  taluka: text("taluka").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull().default("Maharashtra"),
  issuingAuthority: text("issuing_authority").notNull(),
  issueDate: text("issue_date").notNull(),
  placeOfIssue: text("place_of_issue").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeavingCertificateSchema = createInsertSchema(leavingCertificates).omit({
  id: true,
  createdAt: true,
});

export type InsertLeavingCertificate = z.infer<typeof insertLeavingCertificateSchema>;
export type LeavingCertificate = typeof leavingCertificates.$inferSelect;

// Marriage Certificates
export const marriageCertificates = pgTable("marriage_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateNumber: text("certificate_number").notNull(),
  registrationNumber: text("registration_number").notNull(),
  registrationDate: text("registration_date").notNull(),
  
  // Husband Details
  husbandNameEn: text("husband_name_en").notNull(),
  husbandNameMr: text("husband_name_mr").notNull(),
  husbandAadhar: text("husband_aadhar").notNull(),
  
  // Wife Details
  wifeNameEn: text("wife_name_en").notNull(),
  wifeNameMr: text("wife_name_mr").notNull(),
  wifeAadhar: text("wife_aadhar").notNull(),
  
  // Marriage Details
  marriageDate: text("marriage_date").notNull(),
  marriagePlace: text("marriage_place").notNull(),
  
  // Location
  taluka: text("taluka").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull().default("Maharashtra"),
  
  // Authority
  issuingAuthority: text("issuing_authority").notNull(),
  issueDate: text("issue_date").notNull(),
  placeOfIssue: text("place_of_issue").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMarriageCertificateSchema = createInsertSchema(marriageCertificates).omit({
  id: true,
  createdAt: true,
});

export type InsertMarriageCertificate = z.infer<typeof insertMarriageCertificateSchema>;
export type MarriageCertificate = typeof marriageCertificates.$inferSelect;
