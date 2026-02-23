import { db } from "../db";
import { timeUnits } from "../db/schema";

async function main() {
  console.log("Seeding base time units...");

  const baseUnits = [
    { name: "Day(s)", value: "day" },
    { name: "Week(s)", value: "week" },
    { name: "Month(s)", value: "month" },
    { name: "Year(s)", value: "year" },
  ];

  try {
    for (const unit of baseUnits) {
      await db.insert(timeUnits).values(unit).onConflictDoNothing();
    }
    console.log("✅ Time units seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding time units:", error);
    process.exit(1);
  }
}

main();
