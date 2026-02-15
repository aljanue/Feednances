import * as dotenv from "dotenv";
import path from "path";
import { getDefaultCategories } from "@/lib/data/categories.queries";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkColors() {
  const results = await getDefaultCategories();
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

checkColors();
