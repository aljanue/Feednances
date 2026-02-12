import * as dotenv from "dotenv";
import path from "path";
import { db } from "@/db";
import { categories } from "@/db/schema";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DEFAULT_CATEGORIES = [
  { name: "Housing", hexColor: "#ef4444" },
  { name: "Food", hexColor: "#f97316" },
  { name: "Transportation", hexColor: "#f59e0b" },
  { name: "Utilities", hexColor: "#eab308" },
  { name: "Entertainment", hexColor: "#84cc16" },
  { name: "Health", hexColor: "#22c55e" },
  { name: "Shopping", hexColor: "#10b981" },
  { name: "Education", hexColor: "#14b8a6" },
  { name: "Personal Care", hexColor: "#06b6d4" },
  { name: "Savings", hexColor: "#0ea5e9" },
  { name: "Income", hexColor: "#3b82f6" },
  { name: "Other", hexColor: "#6366f1" },
];

async function seedCategories() {
  try {
    console.log("🌱 Seeding default categories...\n");

    const inserted = await db
      .insert(categories)
      .values(
        DEFAULT_CATEGORIES.map((cat) => ({
          ...cat,
          userId: null, // Default category
          active: true,
        })),
      )
      .returning();

    console.log(`✅ Successfully seeded ${inserted.length} categories!`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
