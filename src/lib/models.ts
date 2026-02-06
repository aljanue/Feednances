import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  accounts,
  expenses,
  subscriptions,
  timeUnits,
  users,
} from "@/db/schema";

export type UserModel = InferSelectModel<typeof users>;
export type UserInsertModel = InferInsertModel<typeof users>;

export type AccountModel = InferSelectModel<typeof accounts>;
export type AccountInsertModel = InferInsertModel<typeof accounts>;

export type ExpenseModel = InferSelectModel<typeof expenses>;
export type ExpenseInsertModel = InferInsertModel<typeof expenses>;

export type SubscriptionModel = InferSelectModel<typeof subscriptions>;
export type SubscriptionInsertModel = InferInsertModel<typeof subscriptions>;

export type TimeUnitModel = InferSelectModel<typeof timeUnits>;
export type TimeUnitInsertModel = InferInsertModel<typeof timeUnits>;
