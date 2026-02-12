import { db } from "@/db";
import { categories, expenses, userHiddenCategories } from "@/db/schema";
import { eq, and, or, isNull, notExists, sql, asc, desc } from "drizzle-orm";

export async function getActiveCategories(userId: string) {
  return await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.active, true),
        or(isNull(categories.userId), eq(categories.userId, userId)),
        notExists(
          db
            .select()
            .from(userHiddenCategories)
            .where(
              and(
                eq(userHiddenCategories.categoryId, categories.id),
                eq(userHiddenCategories.userId, userId),
                eq(userHiddenCategories.deleted, true)
              )
            )
        )
      )
    );
  }




export async function getUserCategories(userId: string) {
  return await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));
}

export async function createCategory(data: typeof categories.$inferInsert) {
  return await db.insert(categories).values(data).returning();
}

export async function updateCategory(
  id: string,
  data: Partial<typeof categories.$inferInsert>
) {
  return await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();
}

export async function deleteCategory(id: string) {
  return await db.delete(categories).where(eq(categories.id, id)).returning();
}

export async function getCategoryById(id: string) {
  return await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
}

export async function hideCategory(
  userId: string,
  categoryId: string,
  deleted: boolean = true
) {
  return await db
    .insert(userHiddenCategories)
    .values({
      userId,
      categoryId,
      deleted,
    })
    .onConflictDoUpdate({
      target: [userHiddenCategories.userId, userHiddenCategories.categoryId],
      set: { deleted },
    });
}

export async function unhideCategory(userId: string, categoryId: string) {
  return await db
    .delete(userHiddenCategories)
    .where(
      and(
        eq(userHiddenCategories.userId, userId),
        eq(userHiddenCategories.categoryId, categoryId)
      )
    );
}

export async function getManagementCategories(userId: string) {
  const results = await db
    .select({
      id: categories.id,
      name: categories.name,
      hexColor: categories.hexColor,
      userId: categories.userId,
      active: categories.active,
      isHidden: userHiddenCategories.categoryId,
      expenseCount: sql<number>`count(${expenses.id})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(
      userHiddenCategories,
      and(
        eq(userHiddenCategories.categoryId, categories.id),
        eq(userHiddenCategories.userId, userId)
      )
    )
    .leftJoin(
      expenses,
      and(
        eq(expenses.categoryId, categories.id),
        eq(expenses.userId, userId)
      )
    )
    .where(
      and(
        or(isNull(categories.userId), eq(categories.userId, userId)),
        or(
          isNull(userHiddenCategories.deleted),
          eq(userHiddenCategories.deleted, false)
        )
      )
    )
    .groupBy(categories.id, userHiddenCategories.categoryId, userHiddenCategories.deleted)
    .orderBy(
      // Sort: Default categories (userId is null) first, then alphabetical
      sql`${categories.userId} IS NOT NULL`, // False (0/Default) comes before True (1/User)
      asc(categories.name)
    );

  return results.map((cat) => ({
    ...cat,
    active: cat.userId === null ? true : cat.active,
  }));
}