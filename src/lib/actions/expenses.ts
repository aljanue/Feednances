"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import type { NotificationItemDTO } from "@/lib/dtos/notifications";
import { createNotificationForUser } from "@/lib/services/notifications";
import { formatAmount } from "@/utils/format-data.utils";
import { validateExpenseForm } from "@/lib/validations/expense";
import { createExpense, deleteExpense, updateExpense } from "@/lib/data/expenses.queries";


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
    await createExpense({
      amount: amountFormatted,
      concept,
      categoryId: category,
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

export interface DeleteExpenseActionState {
  success?: boolean;
  error?: string;
}

export async function deleteExpenseAction(
  expenseId: string,
): Promise<DeleteExpenseActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized." };
  }

  try {
    const deleted = await deleteExpense(expenseId);

    if (!deleted.length) {
      return { error: "Expense not found." };
    }

    await createNotificationForUser(session.user.id, {
      text: `Expense deleted: ${deleted[0].concept}`,
      type: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/expenses");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete expense.";
    return { error: message };
  }
}

export interface UpdateExpenseActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateExpenseAction(
  expenseId: string,
  formData: FormData,
): Promise<UpdateExpenseActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized." };
  }

  const validation = validateExpenseForm(formData);
  if (!validation.success) {
    return { fieldErrors: validation.fieldErrors };
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
    };
  }

  try {
    const updated = await updateExpense(expenseId, {
      concept,
      amount: amountFormatted,
      categoryId: category,
      expenseDate: new Date(expenseDate),
    });

    if (!updated.length) {
      return { error: "Expense not found." };
    }

    await createNotificationForUser(session.user.id, {
      text: `Expense updated: ${concept}`,
      type: "success",
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/expenses");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update expense.";
    return { error: message };
  }
}
