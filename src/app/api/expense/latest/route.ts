import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getLatestExpenseForUser,
  deleteExpense,
} from "@/lib/data/expenses.queries";
import { getUserById } from "@/lib/data/users.queries";
import { validateRequest } from "@/utils/user.utils";

export async function DELETE(req: NextRequest) {
  let userId: string | undefined;
  try {
    const session = await auth();
    const user = session?.user?.id
      ? await getUserById(session.user.id)
      : await validateRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 403 });
    }

    userId = user.id;

    const lastExpense = await getLatestExpenseForUser(user.id);

    if (!lastExpense) {
      return NextResponse.json(
        { error: "No expenses to delete" },
        { status: 404 },
      );
    }

    await deleteExpense(lastExpense.id);

    await deleteExpense(lastExpense.id);

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
