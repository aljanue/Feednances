import { db } from '@/db';
import { users } from '@/db/schema';
import { encryptUserKey } from "@/lib/crypto";
import { eq } from "drizzle-orm";

export async function findUserByKey(userKey: string) {
    const encryptedUserKey = encryptUserKey(userKey);

    return await db.query.users.findFirst({
      where: eq(users.userKey, encryptedUserKey),
    });
}