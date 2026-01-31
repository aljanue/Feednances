import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { formatAmount } from "@/utils/format-data.utils";
import { findUserByKey } from "@/utils/user.utils";

// DTO (Data Transfer Object): Contrato de lo que esperamos recibir del móvil
interface CreateExpenseDTO {
  amount: number | string;
  concept: string;
  categoryName: string;
  userKey: string; /// User API Key
  expenseDate: string;
  isRecurring?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateExpenseDTO = (await req.json()) as CreateExpenseDTO;

    if (
      !body.amount ||
      !body.concept ||
      !body.categoryName ||
      !body.userKey ||
      !body.expenseDate
    ) {
      return NextResponse.json(
        { error: "Missing input in body" },
        { status: 400 },
      );
    }

    const user = await findUserByKey(body.userKey);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const amountFormatted = formatAmount(body.amount);

    await db.insert(expenses).values({
      amount: amountFormatted,
      concept: body.concept,
      category: body.categoryName,
      userId: user.id,
      date: body.expenseDate ? new Date(body.expenseDate) : new Date(),
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
