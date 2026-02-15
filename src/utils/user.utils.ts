import { getUserByToken } from '@/lib/data/users.queries';
import { NextRequest } from 'next/server';
import { hashUserKey } from '@/lib/crypto';

export async function validateRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const tokenRaw = authHeader.split(' ')[1];
  const tokenHash = hashUserKey(tokenRaw);

  const user = await getUserByToken(tokenHash);

  return user || null;
}

export async function findUserByKey(userKeyRaw: string) {
    const tokenHash = hashUserKey(userKeyRaw);
    return await getUserByToken(tokenHash);
}