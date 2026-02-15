import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function checkDatabaseHealth() {
  return await db.execute(sql`SELECT 1`);
}
