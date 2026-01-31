import { db } from '@/db';
import { users } from '@/db/schema';
import { NextRequest } from 'next/server';
import { eq } from "drizzle-orm";
import { hashUserKey } from '@/lib/crypto';

export async function validateRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const tokenRaw = authHeader.split(' ')[1];

  const tokenHash = hashUserKey(tokenRaw);

  const user = await db.query.users.findFirst({
    where: eq(users.userKey, tokenHash)
  });

  return user || null;
}

export async function findUserByKey(userKeyRaw: string) {
    const tokenHash = hashUserKey(userKeyRaw);
    return await db.query.users.findFirst({
      where: eq(users.userKey, tokenHash),
    });
}