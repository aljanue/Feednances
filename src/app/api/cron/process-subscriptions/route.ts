import { NextRequest, NextResponse } from "next/server";
import {
  getSubscriptionsDue,
  processSubscriptionCharge,
  getUpcomingSubscriptions,
} from "@/lib/data/subscriptions.queries";
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

    const subsDue = await getSubscriptionsDue(now);

    for (const sub of subsDue) {
      if (!sub.timeUnitValue || !sub.categoryId) continue;

      try {
        const newNextRun = calculateNextRun(
          sub.frequencyValue,
          sub.timeUnitValue as string,
          sub.nextRun,
        );

        await processSubscriptionCharge(
          {
            userId: sub.userId,
            name: sub.name,
            amount: sub.amount,
            categoryId: sub.categoryId,
            nextRun: sub.nextRun,
            id: sub.id,
          },
          newNextRun
        );

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

    const subsUpcoming = await getUpcomingSubscriptions(startOfTarget, endOfTarget);

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
