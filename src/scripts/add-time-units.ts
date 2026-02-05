import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { timeUnits } from '../db/schema';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  throw new Error('❌ DATABASE_URL is missing in environment variables');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  await db.insert(timeUnits).values([
    { name: 'Días', value: 'day' },
    { name: 'Semanas', value: 'week' },
    { name: 'Meses', value: 'month' },
    { name: 'Años', value: 'year' },
  ]).onConflictDoNothing();

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Fatal error in seeding:', err);
  process.exit(1);
});