import { db } from "@/db";
import { timeUnits } from "@/db/schema";

export async function bulkCreateTimeUnits(data: (typeof timeUnits.$inferInsert)[]) {
  return await db.insert(timeUnits).values(data).returning();
}

export async function getAllTimeUnits() {
  return await db.query.timeUnits.findMany({
    orderBy: (timeUnits, { asc }) => [asc(timeUnits.name)],
  });
}

export async function getTimeUnitById(id: string) {
  return await db.query.timeUnits.findFirst({
    where: (timeUnits, { eq }) => eq(timeUnits.id, id),
  });
}
