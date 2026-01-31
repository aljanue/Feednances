import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { encryptUserKey } from '@/lib/crypto';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userKey = searchParams.get('userKey');

    if (!userKey) {
      return NextResponse.json({ error: 'Missing userKey' }, { status: 400 });
    }

    const encryptedKey = encryptUserKey(userKey);
    const user = await db.query.users.findFirst({
      where: eq(users.userKey, encryptedKey),
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized user' }, { status: 403 });
    }

    const lastExpense = await db.query.expenses.findFirst({
      where: eq(expenses.userId, user.id),
      orderBy: [desc(expenses.date)],
    });

    if (!lastExpense) {
      return NextResponse.json({ error: 'No expenses to delete' }, { status: 404 });
    }

    await db.delete(expenses).where(eq(expenses.id, lastExpense.id));

    return NextResponse.json({ 
      success: true, 
      message: `🗑️ Deleted: ${lastExpense.concept} (${lastExpense.amount}€)` 
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}