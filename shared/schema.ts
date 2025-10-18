import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
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
  contact: text("contact").notNull(),
  address: text("address").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  status: true,
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
