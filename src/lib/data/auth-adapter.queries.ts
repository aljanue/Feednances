import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createAdapterUser(data: {
  id?: string;
  email: string;
  fullName: string | null;
  username: string;
  emailVerified: Date | null;
  image: string | null;
}) {
  return await db
    .insert(users)
    .values({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      username: data.username,
      emailVerified: data.emailVerified,
      image: data.image,
    })
    .returning();
}

export async function getAdapterUser(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function getAdapterUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function getUserByAccountProvider(provider: string, providerAccountId: string) {
  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.provider, provider),
      eq(accounts.providerAccountId, providerAccountId),
    ),
  });
  
  if (!account) return null;

  return await db.query.users.findFirst({
    where: eq(users.id, account.userId),
  });
}

export async function updateAdapterUser(id: string, data: {
  email?: string;
  fullName?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
}) {
  return await db
    .update(users)
    .set({
      email: data.email,
      fullName: data.fullName,
      emailVerified: data.emailVerified,
      image: data.image,
    })
    .where(eq(users.id, id))
    .returning();
}

export async function deleteAdapterUser(id: string) {
  return await db.delete(users).where(eq(users.id, id));
}

export async function linkAdapterAccount(data: typeof accounts.$inferInsert) {
  return await db.insert(accounts).values(data);
}

export async function unlinkAdapterAccount(provider: string, providerAccountId: string) {
  return await db
    .delete(accounts)
    .where(
      and(
        eq(accounts.provider, provider),
        eq(accounts.providerAccountId, providerAccountId),
      ),
    );
}
