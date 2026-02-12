import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, expenses, timeUnits, users } from "@/db/schema";
import { eq, lte, and, between } from "drizzle-orm";
import { calculateNextRun } from "@/utils/subscriptions.utils";
import { addDays, startOfDay, endOfDay } from "date-fns";
import {
  sendSubscriptionChargedNotification,
  sendUpcomingSubscriptionNotification,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const results: string[] = [];

    const subsDue = await db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        name: subscriptions.name,
        amount: subscriptions.amount,
        categoryId: subscriptions.categoryId,
        frequencyValue: subscriptions.frequencyValue,
        timeUnitValue: timeUnits.value,
        nextRun: subscriptions.nextRun,
        telegramChatId: users.telegramChatId,
      })
      .from(subscriptions)
      .leftJoin(timeUnits, eq(subscriptions.timeUnitId, timeUnits.id))
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(
        and(eq(subscriptions.active, true), lte(subscriptions.nextRun, now)),
      );

    for (const sub of subsDue) {
      if (!sub.timeUnitValue) continue;

      try {
        let newNextRun: Date | null = null;

        await db.transaction(async (tx) => {
          await tx.insert(expenses).values({
            userId: sub.userId,
            concept: `${sub.name}`,
            amount: sub.amount,
            categoryId: sub.categoryId,
            date: new Date(),
            expenseDate: sub.nextRun,
            isRecurring: true,
          });

          newNextRun = calculateNextRun(
            sub.frequencyValue,
            sub.timeUnitValue!,
            sub.nextRun,
          );

          await tx
            .update(subscriptions)
            .set({ nextRun: newNextRun })
            .where(eq(subscriptions.id, sub.id));
        });

        if (sub.telegramChatId && newNextRun) {
          await sendSubscriptionChargedNotification(
            sub.telegramChatId,
            sub.name,
            sub.amount.toString(),
            newNextRun,
          );
        }

        results.push(`✅ Charged: ${sub.name}`);
      } catch (innerError) {
        console.error(`❌ Subscription failed: ${sub.name}`, innerError);
      }
    }

    const targetDate = addDays(now, 2);
    const startOfTarget = startOfDay(targetDate);
    const endOfTarget = endOfDay(targetDate);

    const subsUpcoming = await db
      .select({
        name: subscriptions.name,
        amount: subscriptions.amount,
        nextRun: subscriptions.nextRun,
        telegramChatId: users.telegramChatId,
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(
        and(
          eq(subscriptions.active, true),
          between(subscriptions.nextRun, startOfTarget, endOfTarget),
        ),
      );

    for (const sub of subsUpcoming) {
      if (sub.telegramChatId) {
        await sendUpcomingSubscriptionNotification(
          sub.telegramChatId,
          sub.name,
          sub.amount.toString(),
          sub.nextRun,
        );
        results.push(`⚠️ Telegram sent: ${sub.name}`);
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
