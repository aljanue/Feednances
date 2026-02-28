import { db } from "@/db";
import { users, expenses, subscriptions, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { UserSettingsDTO } from "@/lib/dtos/user";

export async function getUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function getSafeUserSettings(userId: string): Promise<UserSettingsDTO | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      accounts: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    image: user.image,
    currency: user.currency,
    timeZone: user.timeZone,
    telegramChatId: user.telegramChatId,
    hasPassword: !!user.password,
    hasApiKey: !!user.userKey,
    connectedProviders: user.accounts.map((a) => a.provider),
  };
}

export async function getUserByToken(tokenHash: string) {
  return await db.query.users.findFirst({
    where: eq(users.userKey, tokenHash),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function updateUserTelegramChatId(userId: string, telegramChatId: string | null) {
  return await db
    .update(users)
    .set({ telegramChatId })
    .where(eq(users.id, userId));
}

export async function updateUserKey(userId: string, hashedUserKey: string | null) {
  return await db
    .update(users)
    .set({ userKey: hashedUserKey })
    .where(eq(users.id, userId));
}

export async function updateUserPassword(userId: string, hashedPassword: string) {
  return await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, userId));
}

export async function updateUserProfile(userId: string, data: { username: string; fullName: string | null; email: string }) {
  return await db
    .update(users)
    .set({
      username: data.username,
      fullName: data.fullName,
      email: data.email,
    })
    .where(eq(users.id, userId))
    .returning();
}

export async function updateUserPreferences(userId: string, data: { currency: string; timeZone: string }) {
  return await db
    .update(users)
    .set({
      currency: data.currency,
      timeZone: data.timeZone,
    })
    .where(eq(users.id, userId))
    .returning();
}

export async function updateUserFirstLogin(userId: string, firstLogin: boolean) {
  return await db
    .update(users)
    .set({ firstLogin })
    .where(eq(users.id, userId));
}

export async function createUser(data: typeof users.$inferInsert) {
  return await db.insert(users).values(data).returning();
}

export async function deleteUserExpenses(userId: string) {
  return await db.delete(expenses).where(eq(expenses.userId, userId));
}

export async function deleteUserSubscriptions(userId: string) {
  return await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
}

export async function deleteUserCategories(userId: string) {
  return await db.delete(categories).where(eq(categories.userId, userId));
}

export async function deleteUserAccount(userId: string) {
  return await db.delete(users).where(eq(users.id, userId));
}
