import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("external_client"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  isBookmarked: boolean("is_bookmarked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  hasTable: boolean("has_table").default(false),
  hasChart: boolean("has_chart").default(false),
  data: jsonb("data"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const updateConversationSchema = createInsertSchema(conversations).pick({
  title: true,
  isBookmarked: true,
}).partial();

export const updateMessageFeedbackSchema = z.object({
  feedback: z.enum(["up", "down"]).nullable(),
});

// Message data schemas
export const tableDataSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.union([z.string(), z.number()]))),
});

export const chartDataSchema = z.object({
  type: z.enum(["bar", "line", "pie"]),
  data: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })),
});

export const messageDataSchema = z.object({
  table: tableDataSchema.optional(),
  chart: chartDataSchema.optional(),
}).optional();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type UpdateConversation = z.infer<typeof updateConversationSchema>;
export type UpdateMessageFeedback = z.infer<typeof updateMessageFeedbackSchema>;
export type TableData = z.infer<typeof tableDataSchema>;
export type ChartData = z.infer<typeof chartDataSchema>;
export type MessageData = z.infer<typeof messageDataSchema>;
