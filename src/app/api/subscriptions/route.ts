import { db } from "@/db";
import { subscriptions, timeUnits } from "@/db/schema";
import { formatAmount } from "@/utils/format-data.utils";
import { findUserByKey } from "@/utils/user.utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { calculateNextRun } from "@/utils/subscriptions.utils";

interface CreateSubscriptionDTO {
  userKey: string;
  concept: string;
  amount: string;
  periodType: string;
  periodValue: number;
  categoryName: string;
  startsAt?: string;
}

export async function POST(req: Request) {
  try {
    const body: CreateSubscriptionDTO =
      (await req.json()) as CreateSubscriptionDTO;

    if (
      !body.userKey ||
      !body.concept ||
      !body.amount ||
      !body.periodType ||
      !body.periodValue ||
      !body.categoryName
    ) {
      return new Response(JSON.stringify({ error: "Missing input in body" }), {
        status: 400,
      });
    }

    const user = await findUserByKey(body.userKey);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const timeUnit = await db.query.timeUnits.findFirst({
      where: eq(timeUnits.value, body.periodType.toLowerCase()),
    });

    if (!timeUnit) {
      return NextResponse.json(
        { error: `Unidad de tiempo inválida: ${body.periodType}` },
        { status: 400 },
      );
    }

    const amountFormatted = formatAmount(body.amount);

    const nextRunDate = calculateNextRun(body.periodValue, body.periodType);
    const startsAtDate = body.startsAt ? new Date(body.startsAt) : new Date();

    await db.insert(subscriptions).values({
      userId: user.id,
      name: body.concept,
      amount: amountFormatted,
      timeUnitId: timeUnit.id,
      frequencyValue: body.periodValue,
      category: body.categoryName,
      nextRun: nextRunDate,
      active: true,
      startsAt: startsAtDate,
    });

    return NextResponse.json({
      success: true,
      message: `Suscripción creada. Próximo cobro: ${nextRunDate.toLocaleDateString()}`,
    });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
