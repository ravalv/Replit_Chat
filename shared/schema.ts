import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, decimal, integer, date } from "drizzle-orm/pg-core";
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

export const securities = pgTable("securities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  assetClass: text("asset_class").notNull(),
  currency: text("currency").notNull().default("USD"),
});

export const counterparties = pgTable("counterparties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  region: text("region").notNull(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  region: text("region").notNull(),
  aum: decimal("aum", { precision: 15, scale: 2 }),
});

export const funds = pgTable("funds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  inceptionDate: date("inception_date").notNull(),
});

export const tradeSettlements = pgTable("trade_settlements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tradeDate: date("trade_date").notNull(),
  settlementDate: date("settlement_date").notNull(),
  securityId: varchar("security_id").notNull().references(() => securities.id),
  counterpartyId: varchar("counterparty_id").notNull().references(() => counterparties.id),
  quantity: decimal("quantity", { precision: 15, scale: 2 }).notNull(),
  price: decimal("price", { precision: 15, scale: 4 }).notNull(),
  tradeValue: decimal("trade_value", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull(),
  failReason: text("fail_reason"),
  side: text("side").notNull(),
});

export const portfolioPositions = pgTable("portfolio_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  asOfDate: date("as_of_date").notNull(),
  fundId: varchar("fund_id").notNull().references(() => funds.id),
  securityId: varchar("security_id").notNull().references(() => securities.id),
  quantity: decimal("quantity", { precision: 15, scale: 2 }).notNull(),
  marketValue: decimal("market_value", { precision: 15, scale: 2 }).notNull(),
  costBasis: decimal("cost_basis", { precision: 15, scale: 2 }).notNull(),
  region: text("region").notNull(),
});

export const corporateActions = pgTable("corporate_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  securityId: varchar("security_id").notNull().references(() => securities.id),
  actionType: text("action_type").notNull(),
  exDate: date("ex_date").notNull(),
  paymentDate: date("payment_date"),
  amount: decimal("amount", { precision: 15, scale: 4 }),
  ratio: text("ratio"),
  status: text("status").notNull(),
  description: text("description"),
});

export const complianceExceptions = pgTable("compliance_exceptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exceptionDate: date("exception_date").notNull(),
  fundId: varchar("fund_id").notNull().references(() => funds.id),
  ruleType: text("rule_type").notNull(),
  severity: text("severity").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  resolvedDate: date("resolved_date"),
});

export const feeRevenue = pgTable("fee_revenue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  periodDate: date("period_date").notNull(),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  feeType: text("fee_type").notNull(),
  feeAmount: decimal("fee_amount", { precision: 15, scale: 2 }).notNull(),
  aum: decimal("aum", { precision: 15, scale: 2 }).notNull(),
  basisPoints: integer("basis_points").notNull(),
});

export const clientPayments = pgTable("client_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentDate: date("payment_date").notNull(),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull(),
  daysOverdue: integer("days_overdue").default(0),
});

export const navAdjustments = pgTable("nav_adjustments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  navDate: date("nav_date").notNull(),
  fundId: varchar("fund_id").notNull().references(() => funds.id),
  adjustmentType: text("adjustment_type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  approvedBy: text("approved_by"),
});

export const reconciliationExceptions = pgTable("reconciliation_exceptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exceptionDate: date("exception_date").notNull(),
  source: text("source").notNull(),
  exceptionType: text("exception_type").notNull(),
  securityId: varchar("security_id").references(() => securities.id),
  discrepancyAmount: decimal("discrepancy_amount", { precision: 15, scale: 2 }),
  status: text("status").notNull(),
  resolvedDate: date("resolved_date"),
  ageInDays: integer("age_in_days").notNull(),
});
