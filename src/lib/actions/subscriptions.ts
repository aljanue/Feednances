"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { deleteSubscription, toggleSubscriptionStatus, createSubscriptionWithTransaction, updateSubscriptionDetails } from "@/lib/data/subscriptions.queries";
import { validateSubscriptionForm, validateEditSubscriptionForm } from "@/lib/validations/subscription";
import { formatAmount } from "@/utils/format-data.utils";
import { calculateFutureNextRuns, normalizeToUTCMidnight } from "@/utils/subscriptions.utils";
import { getTimeUnitById } from "@/lib/data/time-units.queries";
export interface SubscriptionActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  actionId?: number;
}

export async function createSubscriptionAction(
  _prevState: SubscriptionActionState,
  formData: FormData,
): Promise<SubscriptionActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized.", actionId: Date.now() };
  }

  const validation = validateSubscriptionForm(formData);
  if (!validation.success) {
    return {
      fieldErrors: validation.fieldErrors,
      actionId: Date.now(),
    };
  }

  const { name, amount, category, timeUnitId, frequencyValue, startsAt, recordPastPayment } = validation.data;

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
    const parsedStartsAt = new Date(startsAt);
    const parsedFrequency = Number(frequencyValue);

    const dbTimeUnit = await getTimeUnitById(timeUnitId);
    if (!dbTimeUnit) {
      return { error: "Invalid billing period.", actionId: Date.now() };
    }

    const now = new Date();
    
    // Normalize dates to start of day for comparison to avoid timezone issues
    const startsAtNormalized = normalizeToUTCMidnight(parsedStartsAt);
    const nowNormalized = normalizeToUTCMidnight(now);

    let nextRun = startsAtNormalized;
    let initialExpenses: any[] = [];

    if (startsAtNormalized <= nowNormalized) {
      const { nextRun: computedNextRun, pastRuns } = calculateFutureNextRuns(parsedFrequency, dbTimeUnit.value, startsAtNormalized);
      nextRun = computedNextRun;
      
      if (recordPastPayment && pastRuns.length > 0) {
        initialExpenses = pastRuns.map((pastDate) => ({
          amount: amountFormatted,
          concept: name,
          categoryId: category,
          userId: session.user!.id,
          date: new Date(), 
          expenseDate: pastDate,
          isRecurring: true,
        }));
      }
    }

    await createSubscriptionWithTransaction(
      {
        name,
        amount: amountFormatted,
        userId: session.user.id,
        categoryId: category,
        frequencyValue: parsedFrequency,
        timeUnitId: timeUnitId,
        active: true,
        startsAt: startsAtNormalized,
        nextRun: nextRun,
      },
      initialExpenses
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscriptions");

    return { success: true, actionId: Date.now() };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create subscription.";

    return { error: message, actionId: Date.now() };
  }
}

export async function deleteSubscriptionAction(id: string): Promise<SubscriptionActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const deleted = await deleteSubscription(id, session.user.id);
    
    if (!deleted || deleted.length === 0) {
      return { error: "Subscription not found or not authorized to delete" };
    }

    revalidatePath("/dashboard/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return { error: "Failed to delete subscription" };
  }
}

export async function toggleSubscriptionAction(
  id: string,
  isActive: boolean
): Promise<SubscriptionActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const updated = await toggleSubscriptionStatus(id, session.user.id, isActive);
    
    if (!updated || updated.length === 0) {
       return { error: "Subscription not found or not authorized to update" };
    }

    revalidatePath("/dashboard/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Error toggling subscription:", error);
    return { error: "Failed to toggle subscription" };
  }
}

export async function editSubscriptionAction(
  _prevState: SubscriptionActionState,
  formData: FormData,
): Promise<SubscriptionActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized.", actionId: Date.now() };
  }

  const validation = validateEditSubscriptionForm(formData);
  if (!validation.success) {
    return {
      fieldErrors: validation.fieldErrors,
      actionId: Date.now(),
    };
  }

  const { id, name, amount, category, timeUnitId, frequencyValue, startsAt } = validation.data;

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
    const parsedStartsAt = new Date(startsAt);
    const parsedFrequency = Number(frequencyValue);

    const dbTimeUnit = await getTimeUnitById(timeUnitId);
    if (!dbTimeUnit) {
      return { error: "Invalid billing period.", actionId: Date.now() };
    }

    const startsAtNormalized = normalizeToUTCMidnight(parsedStartsAt);
    const nowNormalized = normalizeToUTCMidnight(new Date());

    let nextRun = startsAtNormalized;

    if (startsAtNormalized <= nowNormalized) {
      const { nextRun: computedNextRun } = calculateFutureNextRuns(parsedFrequency, dbTimeUnit.value, startsAtNormalized);
      nextRun = computedNextRun;
    }

    const updated = await updateSubscriptionDetails(id, session.user.id, {
      name,
      amount: amountFormatted,
      categoryId: category,
      frequencyValue: parsedFrequency,
      timeUnitId: timeUnitId,
      startsAt: startsAtNormalized,
      nextRun: nextRun,
    });

    if (!updated || updated.length === 0) {
      return { error: "Subscription not found or not authorized to edit", actionId: Date.now() };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscriptions");

    return { success: true, actionId: Date.now() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to edit subscription.";
    return { error: message, actionId: Date.now() };
  }
}
