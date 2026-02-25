import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/utils/user.utils";
import { getActiveCategories } from "@/lib/data/categories.queries";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await validateRequest(req);
  console.log(user);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await getActiveCategories(user.id);

  return NextResponse.json(categories);
}