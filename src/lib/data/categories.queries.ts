import { db } from "@/db";
import { categories, userHiddenCategories } from "@/db/schema";
import { eq, and, or, isNull, notExists } from "drizzle-orm";

export async function getActiveCategories(userId: string) {
  return await db
    .select()
    .from(categories)
    .where(
      and(
        or(isNull(categories.userId), eq(categories.userId, userId)),
        notExists(
          db.select()
            .from(userHiddenCategories)
            .where(
              and(
                eq(userHiddenCategories.categoryId, categories.id),
                eq(userHiddenCategories.userId, userId)
              )
            )
        )
      )
    );
}