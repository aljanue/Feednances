import { db } from "@/db";
import { expenses } from "@/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export async function getExpensesByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db.query.expenses.findMany({
    where: and(
      eq(expenses.userId, userId),
      gte(expenses.expenseDate, startDate),
      lte(expenses.expenseDate, endDate),
    ),
    with: {
      category: true,
    },
    orderBy: [desc(expenses.expenseDate)],
  });
}

export async function createExpense(data: typeof expenses.$inferInsert) {
  return await db.insert(expenses).values(data);
}
