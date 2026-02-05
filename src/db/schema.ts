import { 
  pgTable, 
  uuid, 
  text, 
  decimal, 
  timestamp, 
  boolean, 
  integer, 
  date, 
  primaryKey, 
  index 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * TABLE: user
 * Core identity table. 
 * 'userKey' stores the SHA-256 hash of the API key for secure mobile access.
 * 'emailVerified' and 'image' are required for Auth.js compatibility.
 */
export const users = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  fullName: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  
  userKey: text('secret_key').unique(),
  password: text('password'),
  deleted: boolean('deleted').default(false),
  firstLogin: boolean('first_login').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  telegramChatId: text('telegram_chat_id')
});

/**
 * TABLE: account
 * Manages OAuth provider links (Google, GitHub).
 * Indexed by 'userId' to speed up session lookups and account linking.
 */
export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(table.userId),
  })
);

/**
 * TABLE: time_units
 * Reference table for subscription intervals (e.g., monthly, yearly).
 */
export const timeUnits = pgTable('time_units', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  value: text('value').notNull().unique(),
});

/**
 * TABLE: expenses
 * Individual transaction history.
 * Indexed by 'userId' to ensure high performance on the main Dashboard view.
 */
export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  concept: text('concept').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date', { mode: 'date' }).defaultNow().notNull(),
  expenseDate: date('expense_date', { mode: 'date' }).notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text('category').notNull(),  
  isRecurring: boolean('is_recurring').default(false),
}, (table) => ({
  userIdIdx: index("expenses_userId_idx").on(table.userId),
}));

/**
 * TABLE: subscriptions
 * Recurring expense definitions for the automation engine.
 * Indexed by 'userId' to optimize the cron processing and user management.
 */
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text('category').notNull(),
  frequencyValue: integer('frequency_value').notNull().default(1),
  timeUnitId: uuid('time_unit_id').notNull().references(() => timeUnits.id),
  nextRun: timestamp('next_run', { mode: 'date' }).notNull(),
  active: boolean('active').default(true),
  startsAt: timestamp('starts_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("subscriptions_userId_idx").on(table.userId),
}));

/* --- RELATIONS DEFINITIONS (Drizzle ORM Typed Relations) --- */

export const usersRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
  subscriptions: many(subscriptions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
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