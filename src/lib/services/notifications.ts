import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { notifications, userNotifications } from "@/db/schema";
import type {
  NotificationItemDTO,
  NotificationType,
} from "@/lib/dtos/notifications";

interface CreateNotificationInput {
  text: string;
  type: NotificationType;
}

export async function getLatestNotifications(
  userId: string,
  limit = 10,
): Promise<NotificationItemDTO[]> {
  const rows = await db.query.userNotifications.findMany({
    where: eq(userNotifications.userId, userId),
    with: {
      notification: true,
    },
    orderBy: [desc(userNotifications.createdAt)],
    limit,
  });

  return rows.map((row) => ({
    id: row.id,
    text: row.notification.text,
    type: row.notification.type,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function createNotificationForUser(
  userId: string,
  input: CreateNotificationInput,
): Promise<NotificationItemDTO> {
  return db.transaction(async (tx) => {
    const [notificationRow] = await tx
      .insert(notifications)
      .values({
        text: input.text,
        type: input.type,
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
      id: userNotificationRow.id,
      text: notificationRow.text,
      type: notificationRow.type,
      isRead: userNotificationRow.isRead,
      createdAt: userNotificationRow.createdAt.toISOString(),
    };
  });
}

export async function markAllNotificationsRead(userId: string) {
  const now = new Date();
  const result = await db
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

  return result.length;
}
