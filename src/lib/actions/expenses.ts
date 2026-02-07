"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import type { NotificationItemDTO } from "@/lib/dtos/notifications";
import { createNotificationForUser } from "@/lib/services/notifications";
import { formatAmount } from "@/utils/format-data.utils";
import { validateExpenseForm } from "@/lib/validations/expense";

export interface CreateExpenseActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  actionId?: number;
  notification?: NotificationItemDTO;
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

  try {
    await db.insert(expenses).values({
      amount: amountFormatted,
      concept,
      category,
      userId: session.user.id,
      date: new Date(),
      expenseDate: new Date(expenseDate),
      isRecurring: false,
    });

    const notification = await createNotificationForUser(session.user.id, {
      text: `Expense created: ${concept}`,
      type: "success",
    });

    revalidatePath("/dashboard");

    return { success: true, actionId: Date.now(), notification };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create expense.";

    let notification: NotificationItemDTO | undefined;
    try {
      notification = await createNotificationForUser(session.user.id, {
        text: "Expense creation failed.",
        type: "error",
      });
    } catch {
      notification = undefined;
    }

    return { error: message, actionId: Date.now(), notification };
  }
}
