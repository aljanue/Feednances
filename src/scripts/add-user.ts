import * as dotenv from 'dotenv';
import path from 'path';
import { db } from '@/db';
import { users } from '@/db/schema';
import { generateUserKey, hashUserKey } from '@/lib/crypto'; // Importamos lo nuevo
import * as readline from 'readline';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function addUser() {
  try {
    console.log('👤 Add new user (Secure Mode)\n');
    
    const username = await question('👤 Username: ');
    if (!username) { console.log('❌ Username required'); process.exit(1); }

    const email = await question('📧 Email (optional): ');
    
    // Generación de clave
    const useCustom = await question('\n🔐 Use custom key? (y/n): ');
    let rawKey = "";

    if (useCustom.toLowerCase().startsWith('y')) {
      rawKey = await question('🔑 Enter your key: ');
    } else {
      rawKey = generateUserKey(); // Genera "ff_..."
    }
    
    // 🛡️ HASHEO: Guardamos el hash, mostramos la raw
    const hashedKey = hashUserKey(rawKey);
    
    await db.insert(users).values({
      username,
      email: email || null,
      userKey: hashedKey, // A la DB va el hash
    });
    
    console.log('\n✅ User created successfully!');
    console.log('------------------------------------------------');
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 API KEY:  ${rawKey}`); // ⚠️ ÚNICA VEZ QUE SE VE
    console.log('------------------------------------------------');
    console.log('⚠️  COPY THIS KEY NOW. You cannot see it again.');
    console.log('   (We only stored a secure hash of it)');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
  }
}

addUser();