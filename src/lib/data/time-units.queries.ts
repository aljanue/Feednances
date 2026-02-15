import { db } from "@/db";
import { timeUnits } from "@/db/schema";

export async function bulkCreateTimeUnits(data: (typeof timeUnits.$inferInsert)[]) {
  return await db.insert(timeUnits).values(data).returning();
}
