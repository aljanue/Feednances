import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { validateRequest } from '@/utils/user.utils';

export async function DELETE(req: NextRequest) {
  try {
    const user = await validateRequest(req);

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