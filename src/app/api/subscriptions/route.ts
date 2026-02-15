import { formatAmount } from "@/utils/format-data.utils";
import { validateRequest } from "@/utils/user.utils";
import type { CreateSubscriptionDTO } from "@/lib/dtos/subscription";
import {
  createSubscriptionWithTransaction,
  getTimeUnitByValue,
} from "@/lib/data/subscriptions.queries";
import { getUserById } from "@/lib/data/users.queries";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { calculateNextRun } from "@/utils/subscriptions.utils";
import { createNotificationForUser } from "@/lib/services/notifications";

export async function POST(req: NextRequest) {
  let userId: string | undefined;
  try {
    const body: CreateSubscriptionDTO =
      (await req.json()) as CreateSubscriptionDTO;

    if (
      !body.concept ||
      !body.amount ||
      !body.periodType ||
      !body.periodValue ||
      !body.categoryId
    ) {
      return NextResponse.json(
        { error: "Missing input in body" },
        {
          status: 400,
        },
      );
    }

    const session = await auth();
    const user = session?.user?.id
      ? await getUserById(session.user.id)
      : await validateRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        {
          status: 404,
        },
      );
    }

    userId = user.id;

    const timeUnit = await getTimeUnitByValue(body.periodType);

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
    let expenseData = null;

    if (shouldChargeNow) {
      expenseData = {
        userId: user.id,
        concept: `🔄 ${body.concept}`,
        amount: amountFormatted,
        categoryId: body.categoryId,
        date: new Date(),
        expenseDate: startsAtDate,
        isRecurring: true,
      };

      initialNextRun = calculateNextRun(
        Number(body.periodValue),
        body.periodType,
        startsAtDate,
      );
    } else {
      initialNextRun = startsAtDate;
    }

    await createSubscriptionWithTransaction(
      {
        userId: user.id,
        name: body.concept,
        amount: amountFormatted,
        timeUnitId: timeUnit.id,
        frequencyValue: body.periodValue,
        categoryId: body.categoryId,
        nextRun: initialNextRun,
        active: true,
        startsAt: startsAtDate,
      },
      expenseData,
    );

    revalidatePath("/dashboard");

    try {
      await createNotificationForUser(user.id, {
        text: shouldChargeNow
          ? `Subscription created: ${body.concept}`
          : `Subscription scheduled: ${body.concept}`,
        type: "success",
      });
    } catch {
      // Notification failures should not block the request.
    }

    return NextResponse.json({
      success: true,
      message: shouldChargeNow
        ? `✅ Created subscription and first payment of ${amountFormatted}€ registered.`
        : `✅ Subscription scheduled. First charge on ${startsAtDate.toLocaleDateString()}.`,
    });
  } catch (error) {
    console.error("Error saving subscription:", error);

    if (userId) {
      try {
        await createNotificationForUser(userId, {
          text: "Subscription creation failed.",
          type: "error",
        });
      } catch {
        // Ignore notification failures.
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
