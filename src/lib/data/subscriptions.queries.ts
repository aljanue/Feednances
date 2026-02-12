import { db } from "@/db";
import { expenses, subscriptions } from "@/db/schema";
import { CreateSubscriptionDTO } from "@/lib/dtos/subscription";
import { and, desc, eq } from "drizzle-orm";

export async function createSubscriptionWithTransaction(
  subscriptionData: typeof subscriptions.$inferInsert,
  expenseData: typeof expenses.$inferInsert | null,
) {
  return await db.transaction(async (tx) => {
    if (expenseData) {
      await tx.insert(expenses).values(expenseData);
    }
    await tx.insert(subscriptions).values(subscriptionData);
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
