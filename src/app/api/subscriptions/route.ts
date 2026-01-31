import { db } from "@/db";
import { expenses, subscriptions, timeUnits } from "@/db/schema";
import { formatAmount } from "@/utils/format-data.utils";
import { validateRequest } from "@/utils/user.utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { calculateNextRun } from "@/utils/subscriptions.utils";

interface CreateSubscriptionDTO {
  concept: string;
  amount: string;
  periodType: string;
  periodValue: number;
  categoryName: string;
  startsAt?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateSubscriptionDTO =
      (await req.json()) as CreateSubscriptionDTO;

    if (
      !body.concept ||
      !body.amount ||
      !body.periodType ||
      !body.periodValue ||
      !body.categoryName
    ) {
      return NextResponse.json({ error: "Missing input in body" }, {
        status: 400,
      });
    }

    const user = await validateRequest(req);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, {
        status: 404,
      });
    }

    const timeUnit = await db.query.timeUnits.findFirst({
      where: eq(timeUnits.value, body.periodType.toLowerCase()),
    });

    if (!timeUnit) {
      return NextResponse.json(
        { error: `Invalid time unit: ${body.periodType}` },
        { status: 400 },
      );
    }

    const amountFormatted = formatAmount(body.amount);
const today = new Date();
    const startsAtDate = body.startsAt ? new Date(body.startsAt) : today;

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const startMidnight = new Date(startsAtDate);
    startMidnight.setHours(0, 0, 0, 0);

    const shouldChargeNow = startMidnight <= todayMidnight;

    let initialNextRun: Date;

    await db.transaction(async (tx) => {
      if (shouldChargeNow) {
        await tx.insert(expenses).values({
          userId: user.id,
          concept: `🔄 ${body.concept}`,
          amount: amountFormatted,
          category: body.categoryName,
          date: new Date(),
          expenseDate: startsAtDate,
          isRecurring: true,
        });

        initialNextRun = calculateNextRun(
          body.periodValue,
          body.periodType,
          startsAtDate
        );
      } else {
        initialNextRun = startsAtDate;
      }

      await tx.insert(subscriptions).values({
        userId: user.id,
        name: body.concept,
        amount: amountFormatted,
        timeUnitId: timeUnit.id,
        frequencyValue: body.periodValue,
        category: body.categoryName,
        nextRun: initialNextRun,
        active: true,
        startsAt: startsAtDate,
      });
    });

    return NextResponse.json({
      success: true,
      message: shouldChargeNow
        ? `✅ Created subscription and first payment of ${amountFormatted}€ registered.`
        : `✅ Subscription scheduled. First charge on ${startsAtDate.toLocaleDateString()}.`,
    });

  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}