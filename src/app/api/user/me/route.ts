import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/utils/user.utils";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await validateRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ 
    id: user.id,
    username: user.username,
    hasTelegram: !!user.telegramChatId 
  });
}