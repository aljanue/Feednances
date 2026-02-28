import { db } from "@/db";
import { shortcuts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentShortcut = await db
      .select()
      .from(shortcuts)
      .where(eq(shortcuts.isCurrent, true))
      .limit(1);

    if (currentShortcut.length === 0) {
      return NextResponse.json(
        { error: "No current shortcut found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentShortcut[0]);
  } catch (error) {
    console.error("Error fetching current shortcut:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
