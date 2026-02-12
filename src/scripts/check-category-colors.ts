import * as dotenv from "dotenv";
import path from "path";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { isNull } from "drizzle-orm";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkColors() {
  const results = await db.select().from(categories).where(isNull(categories.userId));
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

checkColors();
