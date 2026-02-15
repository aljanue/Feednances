import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
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

export async function updateUserTelegramChatId(userId: string, telegramChatId: string) {
  return await db
    .update(users)
    .set({ telegramChatId })
    .where(eq(users.id, userId));
}

export async function updateUserPassword(userId: string, hashedPassword: string) {
  return await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, userId));
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
