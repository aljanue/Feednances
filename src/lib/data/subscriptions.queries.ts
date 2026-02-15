import { db } from "@/db";
import { expenses, subscriptions, timeUnits, users } from "@/db/schema";
import { and, desc, eq, lte, between } from "drizzle-orm";

export async function createSubscriptionWithTransaction(
  subscriptionData: typeof subscriptions.$inferInsert,
  expenseData: typeof expenses.$inferInsert | null,
) {
  return await db.transaction(async (tx) => {
    if (expenseData) {
      await tx.insert(expenses).values(expenseData);
    }
    return await tx.insert(subscriptions).values(subscriptionData).returning();
  });
}


export async function getActiveSubscriptions(userId: string, limit?: number) {
  return await db.query.subscriptions.findMany({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.active, true),
    ),
    with: {
      timeUnit: true,
      category: true,
    },
    orderBy: [desc(subscriptions.amount)],
    limit: limit,
  });
}

export async function getSubscriptionsDue(now: Date) {
  return await db
    .select({
      id: subscriptions.id,
      userId: subscriptions.userId,
      name: subscriptions.name,
      amount: subscriptions.amount,
      categoryId: subscriptions.categoryId,
      frequencyValue: subscriptions.frequencyValue,
      timeUnitValue: timeUnits.value,
      nextRun: subscriptions.nextRun,
      telegramChatId: users.telegramChatId,
    })
    .from(subscriptions)
    .leftJoin(timeUnits, eq(subscriptions.timeUnitId, timeUnits.id))
    .leftJoin(users, eq(subscriptions.userId, users.id))
    .where(
      and(eq(subscriptions.active, true), lte(subscriptions.nextRun, now)),
    );
}

export async function getUpcomingSubscriptions(startOrTarget: Date, end?: Date) {
  const whereClause = end 
    ? between(subscriptions.nextRun, startOrTarget, end)
    : eq(subscriptions.nextRun, startOrTarget); // Fallback although between is preferred for range

  return await db
    .select({
      name: subscriptions.name,
      amount: subscriptions.amount,
      nextRun: subscriptions.nextRun,
      telegramChatId: users.telegramChatId,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id))
    .where(
      and(
        eq(subscriptions.active, true),
        whereClause,
      ),
    );
}

export async function updateSubscriptionNextRun(id: string, nextRun: Date) {
  return await db
    .update(subscriptions)
    .set({ nextRun })
    .where(eq(subscriptions.id, id));
}

export async function getTimeUnitByValue(value: string) {
  return await db.query.timeUnits.findFirst({
    where: eq(timeUnits.value, value.toLowerCase()),
  });
}

export async function processSubscriptionCharge(
  sub: { userId: string; name: string; amount: string; categoryId: string; nextRun: Date; id: string },
  newNextRun: Date
) {
  return await db.transaction(async (tx) => {
    await tx.insert(expenses).values({
      userId: sub.userId,
      concept: `${sub.name}`,
      amount: sub.amount,
      categoryId: sub.categoryId,
      date: new Date(),
      expenseDate: sub.nextRun,
      isRecurring: true,
    });

    await tx
      .update(subscriptions)
      .set({ nextRun: newNextRun })
      .where(eq(subscriptions.id, sub.id));
  });
}
