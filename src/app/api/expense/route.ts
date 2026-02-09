import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { createNotificationForUser } from "@/lib/services/notifications";
import { formatAmount } from "@/utils/format-data.utils";
import { validateRequest } from "@/utils/user.utils";

interface CreateExpenseDTO {
  amount: number | string;
  concept: string;
  categoryName: string;
  expenseDate: string;
  isRecurring?: boolean;
}

export async function POST(req: NextRequest) {
  let userId: string | undefined;
  try {
    const body: CreateExpenseDTO = (await req.json()) as CreateExpenseDTO;

    if (
      !body.amount ||
      !body.concept ||
      !body.categoryName ||
      !body.expenseDate
    ) {
      return NextResponse.json(
        { error: "Missing input in body" },
        { status: 400 },
      );
    }

    const user = await validateRequest(req);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    userId = user.id;

    const amountFormatted = formatAmount(body.amount);

    await db.insert(expenses).values({
      amount: amountFormatted,
      concept: body.concept,
      category: body.categoryName,
      userId: user.id,
      date: new Date(),
      expenseDate: body.expenseDate ? new Date(body.expenseDate) : new Date(),
      isRecurring: body.isRecurring || false,
    });

    try {
      await createNotificationForUser(user.id, {
        text: `Expense created: ${body.concept}`,
        type: "success",
      });
    } catch {
    }

    return NextResponse.json(
      { success: true, message: "Expense saved" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving expense:", error);

    if (userId) {
      try {
        await createNotificationForUser(userId, {
          text: "Expense creation failed.",
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
