import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserById } from "@/lib/data/users.queries";
import {
  getLatestNotifications,
  markAllNotificationsRead,
} from "@/lib/services/notifications";
import { validateRequest } from "@/utils/user.utils";

async function resolveUser(req: NextRequest) {
  const session = await auth();

  if (session?.user?.id) {
    return await getUserById(session.user.id);
  }

  return await validateRequest(req);
}

export async function GET(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getLatestNotifications(user.id, 10);
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await markAllNotificationsRead(user.id);
  return NextResponse.json({ success: true, updated });
}
