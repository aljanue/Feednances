import 'dotenv/config';
import { bulkCreateTimeUnits } from '../lib/data/time-units.queries';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  await bulkCreateTimeUnits([
    { name: 'Días', value: 'day' },
    { name: 'Semanas', value: 'week' },
    { name: 'Meses', value: 'month' },
    { name: 'Años', value: 'year' },
  ]);

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Fatal error in seeding:', err);
  process.exit(1);
});