import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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
  trackingNumber: text("tracking_number").notNull().unique(),
  childName: text("child_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  fatherName: text("father_name").notNull(),
  motherName: text("mother_name").notNull(),
  address: text("address").notNull(),
  contact: text("contact").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBirthCertificateSchema = createInsertSchema(birthCertificates).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  status: true,
});

export type InsertBirthCertificate = z.infer<typeof insertBirthCertificateSchema>;
export type BirthCertificate = typeof birthCertificates.$inferSelect;

export const deathCertificates = pgTable("death_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  deceasedName: text("deceased_name").notNull(),
  dateOfDeath: text("date_of_death").notNull(),
  placeOfDeath: text("place_of_death").notNull(),
  age: text("age").notNull(),
  causeOfDeath: text("cause_of_death").notNull(),
  applicantName: text("applicant_name").notNull(),
  relation: text("relation").notNull(),
  contact: text("contact").notNull(),
  address: text("address").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeathCertificateSchema = createInsertSchema(deathCertificates).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  status: true,
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
