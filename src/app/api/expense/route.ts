import { NextRequest, NextResponse } from "next/server";
import { createExpense } from "@/lib/data/expenses.queries";
import { formatAmount } from "@/utils/format-data.utils";
import { validateRequest } from "@/utils/user.utils";

interface CreateExpenseDTO {
  amount: number | string;
  concept: string;
  categoryId: string;
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
      !body.categoryId ||
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

    await createExpense({
      amount: amountFormatted,
      concept: body.concept,
      categoryId: body.categoryId,
      userId: user.id,
      date: new Date(),
      expenseDate: body.expenseDate ? new Date(body.expenseDate) : new Date(),
      isRecurring: body.isRecurring || false,
    });

    return NextResponse.json(
      { success: true, message: "Expense saved" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving expense:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
