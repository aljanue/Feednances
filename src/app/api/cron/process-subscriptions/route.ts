import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptions, expenses, timeUnits } from '@/db/schema';
import { eq, lte, and } from 'drizzle-orm';
import { calculateNextRun } from '@/utils/subscriptions.utils';

// Dynamic route: No cache, always fresh
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {

    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    const subsDue = await db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        name: subscriptions.name,
        amount: subscriptions.amount,
        category: subscriptions.category,
        frequencyValue: subscriptions.frequencyValue,
        timeUnitValue: timeUnits.value,
        nextRun: subscriptions.nextRun,
      })
      .from(subscriptions)
      .leftJoin(timeUnits, eq(subscriptions.timeUnitId, timeUnits.id))
      .where(
        and(
          eq(subscriptions.active, true),
          lte(subscriptions.nextRun, now)
        )
      );

    if (subsDue.length === 0) {
      return NextResponse.json({ message: '💤 Nada que procesar hoy.' });
    }

    const results: unknown[] = [];

    for (const sub of subsDue) {
      if (!sub.timeUnitValue) continue;

      // Atomic operations
      await db.transaction(async (tx) => {
        
        // A. Create the Expense
        await tx.insert(expenses).values({
          userId: sub.userId,
          concept: `${sub.name}`,
          amount: sub.amount,
          category: sub.category,
          date: new Date(),
          expenseDate: sub.nextRun,
          isRecurring: true,
        });

        // B. Calculate the next run date
        const newNextRun = calculateNextRun(sub.frequencyValue, sub.timeUnitValue!, sub.nextRun);

        // C. Update the subscription
        await tx.update(subscriptions)
          .set({ nextRun: newNextRun })
          .where(eq(subscriptions.id, sub.id));
          
        results.push(`Processed: ${sub.name} -> Next: ${newNextRun.toLocaleDateString()}`);
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results
    });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}