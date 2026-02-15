import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications, userNotifications } from "@/db/schema";
import type { NotificationType } from "@/lib/dtos/notifications";

export async function getLatestNotifications(
  userId: string,
  limit = 10,
) {
  return await db.query.userNotifications.findMany({
    where: eq(userNotifications.userId, userId),
    with: {
      notification: true,
    },
    orderBy: [desc(userNotifications.createdAt)],
    limit,
  });
}

export async function createNotificationWithUser(
  userId: string,
  text: string,
  type: NotificationType,
) {
  return db.transaction(async (tx) => {
    const [notificationRow] = await tx
      .insert(notifications)
      .values({
        text,
        type,
      })
      .returning();

    const [userNotificationRow] = await tx
      .insert(userNotifications)
      .values({
        userId,
        notificationId: notificationRow.id,
        isRead: false,
      })
      .returning();

    return {
      notification: notificationRow,
      userNotification: userNotificationRow,
    };
  });
}

export async function markAllNotificationsRead(userId: string) {
  const now = new Date();
  return await db
    .update(userNotifications)
    .set({
      isRead: true,
      readAt: now,
    })
    .where(
      and(
        eq(userNotifications.userId, userId),
        eq(userNotifications.isRead, false),
      ),
    );
}
