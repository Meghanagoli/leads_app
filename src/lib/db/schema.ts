import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table (for authentication)
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Buyers table
export const buyers = sqliteTable('buyers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  city: text('city', { enum: ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] }).notNull(),
  propertyType: text('property_type', { enum: ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] }).notNull(),
  bhk: text('bhk', { enum: ['1', '2', '3', '4', 'Studio'] }),
  purpose: text('purpose', { enum: ['Buy', 'Rent'] }).notNull(),
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  timeline: text('timeline', { enum: ['0-3m', '3-6m', '>6m', 'Exploring'] }).notNull(),
  source: text('source', { enum: ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] }).notNull(),
  status: text('status', { enum: ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] }).default('New').notNull(),
  notes: text('notes'),
  tags: blob('tags', { mode: 'json' }).$type<string[]>(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Buyer history table
export const buyerHistory = sqliteTable('buyer_history', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  buyerId: text('buyer_id').notNull().references(() => buyers.id),
  changedBy: text('changed_by').notNull().references(() => users.id),
  changedAt: integer('changed_at', { mode: 'timestamp' }).notNull(),
  diff: blob('diff', { mode: 'json' }).$type<Record<string, { old: any; new: any }>>().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  buyers: many(buyers),
  buyerHistory: many(buyerHistory),
}));

export const buyersRelations = relations(buyers, ({ one, many }) => ({
  owner: one(users, {
    fields: [buyers.ownerId],
    references: [users.id],
  }),
  history: many(buyerHistory),
}));

export const buyerHistoryRelations = relations(buyerHistory, ({ one }) => ({
  buyer: one(buyers, {
    fields: [buyerHistory.buyerId],
    references: [buyers.id],
  }),
  changedByUser: one(users, {
    fields: [buyerHistory.changedBy],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Buyer = typeof buyers.$inferSelect;
export type NewBuyer = typeof buyers.$inferInsert;
export type BuyerHistory = typeof buyerHistory.$inferSelect;
export type NewBuyerHistory = typeof buyerHistory.$inferInsert;