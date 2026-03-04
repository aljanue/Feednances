import * as dotenv from "dotenv";
import path from "path";
import { db } from "@/db";
import { users, categories, expenses, subscriptions, timeUnits } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { subMonths, startOfMonth, endOfMonth, addDays, format, subDays } from "date-fns";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const USER_NAME = "John Smith";
const USER_EMAIL = "john.smith@example.com";
const USER_USERNAME = "jsmith";
const PASSWORD = "Admin123!";

const CATEGORIES = [
  { name: "Housing", hexColor: "#ef4444" },
  { name: "Groceries", hexColor: "#f97316" },
  { name: "Dining Out", hexColor: "#f59e0b" },
  { name: "Utilities", hexColor: "#eab308" },
  { name: "Entertainment", hexColor: "#84cc16" },
  { name: "Health", hexColor: "#22c55e" },
  { name: "Shopping", hexColor: "#10b981" },
  { name: "Transport", hexColor: "#14b8a6" },
  { name: "Income", hexColor: "#3b82f6" },
  { name: "Savings", hexColor: "#0ea5e9" },
  { name: "Other", hexColor: "#6366f1" },
];

async function main() {
  try {
    console.log(`🌱 Seeding presentation data for ${USER_NAME}...`);

    // 1. Ensure User exists and has a password
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    let [user] = await db.select().from(users).where(eq(users.email, USER_EMAIL));
    if (!user) {
      console.log("Creating user...");
      [user] = await db.insert(users).values({
        fullName: USER_NAME,
        email: USER_EMAIL,
        username: USER_USERNAME,
        password: hashedPassword,
        currency: "EUR",
        timeZone: "Europe/Madrid",
        firstLogin: false,
      }).returning();
    } else {
      console.log("User already exists. Updating password...");
      await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));
    }

    const userId = user.id;

    // 2. Seed User Categories
    console.log("Seeding categories...");
    const userCategories = await Promise.all(
      CATEGORIES.map(async (cat) => {
        let [existing] = await db
          .select()
          .from(categories)
          .where(sql`${categories.userId} = ${userId} AND ${categories.name} = ${cat.name}`);
        
        if (!existing) {
          [existing] = await db.insert(categories).values({
            ...cat,
            userId,
          }).returning();
        }
        return existing;
      })
    );

    const catMap = Object.fromEntries(userCategories.map(c => [c.name, c.id]));

    // 3. Clear existing expenses and subscriptions for a clean slate (optional, but good for "refreshing" the demo)
    console.log("Cleaning up old demo data...");
    await db.delete(expenses).where(eq(expenses.userId, userId));
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));

    // 4. Get Time Units for Subscriptions
    const units = await db.select().from(timeUnits);
    const monthUnit = units.find(u => u.value === 'month')?.id;
    const yearUnit = units.find(u => u.value === 'year')?.id;

    if (!monthUnit || !yearUnit) {
        throw new Error("Time units (month/year) not found. Run seed-time-units first.");
    }

    // 5. Seed Subscriptions
    console.log("Seeding subscriptions...");
    await db.insert(subscriptions).values([
      { name: "Rent", amount: "1200.00", userId, categoryId: catMap["Housing"], frequencyValue: 1, timeUnitId: monthUnit, nextRun: new Date(), active: true },
      { name: "Netflix", amount: "17.99", userId, categoryId: catMap["Entertainment"], frequencyValue: 1, timeUnitId: monthUnit, nextRun: new Date(), active: true },
      { name: "Spotify", amount: "10.99", userId, categoryId: catMap["Entertainment"], frequencyValue: 1, timeUnitId: monthUnit, nextRun: new Date(), active: true },
      { name: "Internet", amount: "45.00", userId, categoryId: catMap["Utilities"], frequencyValue: 1, timeUnitId: monthUnit, nextRun: new Date(), active: true },
      { name: "Gym Membership", amount: "55.00", userId, categoryId: catMap["Health"], frequencyValue: 1, timeUnitId: monthUnit, nextRun: new Date(), active: true },
      { name: "Amazon Prime", amount: "49.90", userId, categoryId: catMap["Shopping"], frequencyValue: 1, timeUnitId: yearUnit, nextRun: new Date(), active: true },
    ]);

    // 6. Generate 6 months of Expenses
    console.log("Generating 6 months of expenses...");
    const startDate = subMonths(new Date(), 6);
    const endDate = new Date();

    const transactions = [];

    // Recurring Monthly Items (Manual entries to simulate processed subscriptions)
    for (let i = 0; i <= 6; i++) {
        const d = startOfMonth(subMonths(new Date(), i));
        
        // Income (Salary) - 25th of each month
        transactions.push({ concept: "Salary", amount: "3500.00", expenseDate: addDays(d, 24), userId, categoryId: catMap["Income"], isRecurring: true });

        // Rent - 1st of each month
        transactions.push({ concept: "Monthly Rent", amount: "1200.00", expenseDate: d, userId, categoryId: catMap["Housing"], isRecurring: true });

        // Utilities - Around the 5th
        transactions.push({ concept: "Electricity & Water", amount: (70 + Math.random() * 30).toFixed(2), expenseDate: addDays(d, 4), userId, categoryId: catMap["Utilities"], isRecurring: true });

        // Entertainment
        transactions.push({ concept: "Netflix subscription", amount: "17.99", expenseDate: addDays(d, 10), userId, categoryId: catMap["Entertainment"], isRecurring: true });
        transactions.push({ concept: "Spotify", amount: "10.99", expenseDate: addDays(d, 12), userId, categoryId: catMap["Entertainment"], isRecurring: true });
    }

    // Randomized Variable Expenses
    const concepts = {
        "Groceries": ["Lidl", "Mercadona", "Carrefour", "Local Market"],
        "Dining Out": ["Pizzeria", "Sushi Bar", "Burger Joint", "Coffee Shop", "Tapas Bar"],
        "Entertainment": ["Cinema", "Concert Ticket", "Bookstore", "Video Game"],
        "Shopping": ["Clothing Store", "Amazon", "IKEA", "Decathlon"],
        "Transport": ["Gas Station", "Uber/Cabify", "Public Transport Pass", "Train Ticket"],
        "Health": ["Pharmacy", "Dentist", "Skin care"],
        "Other": ["Laundry", "Hardware Store", "Bank Fees"]
    };

    let currentDate = startDate;
    while (currentDate <= endDate) {
        // Daily chance for small expenses
        // 70% chance of something small every day
        if (Math.random() > 0.3) {
            const catNames = Object.keys(concepts);
            const randomCat = catNames[Math.floor(Math.random() * catNames.length)];
            const conceptList = concepts[randomCat as keyof typeof concepts];
            const randomConcept = conceptList[Math.floor(Math.random() * conceptList.length)];
            
            let amount = (5 + Math.random() * 45).toFixed(2);
            if (randomCat === "Dining Out") amount = (15 + Math.random() * 60).toFixed(2);
            if (randomCat === "Groceries") amount = (20 + Math.random() * 80).toFixed(2);

            transactions.push({
                concept: randomConcept,
                amount,
                expenseDate: new Date(currentDate),
                userId,
                categoryId: catMap[randomCat],
                isRecurring: false
            });
        }

        // Weekend lifestyle expenses (Friday/Saturday)
        const day = currentDate.getDay();
        if (day === 5 || day === 6) {
             transactions.push({
                concept: "Dinner with friends",
                amount: (50 + Math.random() * 100).toFixed(2),
                expenseDate: new Date(currentDate),
                userId,
                categoryId: catMap["Dining Out"],
                isRecurring: false
            });
        }

        currentDate = addDays(currentDate, 1);
    }

    // Occasional Big Expenses
    transactions.push({ concept: "Weekend Trip to Berlin", amount: "450.00", expenseDate: subDays(new Date(), 45), userId, categoryId: catMap["Transport"], isRecurring: false });
    transactions.push({ concept: "New Monitor", amount: "320.00", expenseDate: subDays(new Date(), 100), userId, categoryId: catMap["Shopping"], isRecurring: false });
    transactions.push({ concept: "Annual Gym Insurance", amount: "120.00", expenseDate: subDays(new Date(), 180), userId, categoryId: catMap["Health"], isRecurring: false });

    console.log(`Inserting ${transactions.length} transactions...`);
    
    // Batch insert for performance
    const chunkSize = 50;
    for (let i = 0; i < transactions.length; i += chunkSize) {
        await db.insert(expenses).values(transactions.slice(i, i + chunkSize));
    }

    console.log("✅ Presentation data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding presentation data:", error);
    process.exit(1);
  }
}

main();
