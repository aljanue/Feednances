import { pgTable, uuid, text, decimal, timestamp, boolean, integer, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * TABLE: users
 * Purpose: Centralize identity.
 * Design: We include 'user_key' here to quickly validate mobile requests.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(), // E.g., "alex"
  fullName: text('full_name'), // Full name (Name & Surname)
  email: text('email').unique().notNull(), // Optional, for future web login
  userKey: text('secret_key').unique(), // THE KEY for shortcuts (generated separately)
  password: text('password'), // Hashed password for web login (null for OAuth users)
  deleted: boolean('deleted').default(false), // Soft delete flag
  firstLogin: boolean('first_login').default(true).notNull(), // True until first login completed
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  telegramChatId: text('telegram_chat_id') // For Telegram notifications
});


/**
 * TABLE: time_units
 * Purpose: Define valid periods for business logic.
 */
export const timeUnits = pgTable('time_units', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(), // E.g., "Months"
  value: text('value').notNull().unique(), // E.g., "months"
});

/**
 * TABLE: expenses
 * Purpose: Immutable history.
 */
export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  concept: text('concept').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date', { mode: 'date' }).defaultNow().notNull(),
  expenseDate: date('expense_date', { mode: 'date' }).notNull(),
  
  // RELATIONS (Foreign Keys)
  userId: uuid('user_id').notNull().references(() => users.id),
  category: text('category').notNull(),  

  // Traceability
  isRecurring: boolean('is_recurring').default(false),
});

/**
 * TABLE: subscriptions
 * Purpose: Configuration for the automation engine.
 */
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  
  // RELATIONS
  userId: uuid('user_id').notNull().references(() => users.id),
  category: text('category').notNull(),
  
  // Recurrence Logic (Value + Unit)
  frequencyValue: integer('frequency_value').notNull().default(1),
  timeUnitId: uuid('time_unit_id').notNull().references(() => timeUnits.id),
  
  // Status
  nextRun: timestamp('next_run', { mode: 'date' }).notNull(),
  active: boolean('active').default(true),

  startsAt: timestamp('starts_at', { mode: 'date' }).defaultNow().notNull(),
});

// RELATION DEFINITIONS
export const usersRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
  subscriptions: many(subscriptions),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  timeUnit: one(timeUnits, {
    fields: [subscriptions.timeUnitId],
    references: [timeUnits.id],
  }),
}));