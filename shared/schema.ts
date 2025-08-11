import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const generations = pgTable("generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  designSpec: text("design_spec").notNull(),
  code: text("code").notNull(),
  outputFormat: text("output_format").notNull(),
  framework: text("framework").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGenerationSchema = createInsertSchema(generations).omit({
  id: true,
  createdAt: true,
});

export const generateRequestSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(1000, "Prompt must be less than 1000 characters"),
  outputFormat: z.enum(["html", "react", "vue"]),
  framework: z.enum(["tailwind", "bootstrap", "material", "chakra"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;
