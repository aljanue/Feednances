import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { expenses, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { validateRequest } from "@/utils/user.utils";

export async function DELETE(req: NextRequest) {
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

    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: `🗑️ Deleted: ${lastExpense.concept} (${lastExpense.amount}€)`,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
