"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { formatAmount } from "@/utils/format-data.utils";
import { validateExpenseForm } from "@/lib/validations/expense";

export interface CreateExpenseActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  actionId?: number;
}

export async function createExpenseAction(
  _prevState: CreateExpenseActionState,
  formData: FormData,
): Promise<CreateExpenseActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized.", actionId: Date.now() };
  }

  const validation = validateExpenseForm(formData);
  if (!validation.success) {
    return {
      fieldErrors: validation.fieldErrors,
      actionId: Date.now(),
    };
  }

  const { concept, amount, category, expenseDate } = validation.data;

  let amountFormatted: string;
  try {
    amountFormatted = formatAmount(amount);
  } catch (error) {
    return {
      fieldErrors: {
        amount: error instanceof Error ? error.message : "Invalid amount.",
      },
      actionId: Date.now(),
    };
  }

  await db.insert(expenses).values({
    amount: amountFormatted,
    concept,
    category,
    userId: session.user.id,
    date: new Date(),
    expenseDate: new Date(expenseDate),
    isRecurring: false,
  });

  revalidatePath("/dashboard");

  return { success: true, actionId: Date.now() };
}
