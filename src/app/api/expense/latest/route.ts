import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { expenses, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createNotificationForUser } from "@/lib/services/notifications";
import { validateRequest } from "@/utils/user.utils";

export async function DELETE(req: NextRequest) {
  let userId: string | undefined;
  try {
    const session = await auth();
    const sessionUser = session?.user?.id
      ? await db.query.users.findFirst({
          where: eq(users.id, session.user.id),
        })
      : null;

    const user = sessionUser ?? (await validateRequest(req));

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 403 });
    }

    userId = user.id;

    const lastExpense = await db.query.expenses.findFirst({
      where: eq(expenses.userId, user.id),
      orderBy: [desc(expenses.date)],
    });

    if (!lastExpense) {
      return NextResponse.json(
        { error: "No expenses to delete" },
        { status: 404 },
      );
    }

    await db.delete(expenses).where(eq(expenses.id, lastExpense.id));

    try {
      await createNotificationForUser(user.id, {
        text: `Expense deleted: ${lastExpense.concept}`,
        type: "warning",
      });
    } catch {
      // Notification failures should not block the request.
    }

    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: `🗑️ Deleted: ${lastExpense.concept} (${lastExpense.amount}€)`,
    });
  } catch (error) {
    console.error("Delete error:", error);

    if (userId) {
      try {
        await createNotificationForUser(userId, {
          text: "Expense deletion failed.",
          type: "error",
        });
      } catch {
        // Ignore notification failures.
      }
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
