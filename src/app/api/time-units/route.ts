import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/utils/user.utils";
import { getAllTimeUnits } from "@/lib/data/time-units.queries";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await validateRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timeUnits = await getAllTimeUnits();

  return NextResponse.json(timeUnits);
}