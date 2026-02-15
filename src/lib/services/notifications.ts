import {
  getLatestNotifications as getLatestNotificationsQuery,
  createNotificationWithUser,
  markAllNotificationsRead as markAllNotificationsReadQuery,
} from "@/lib/data/notifications.queries";
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
  const rows = await getLatestNotificationsQuery(userId, limit);

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
  const { notification, userNotification } = await createNotificationWithUser(
    userId,
    input.text,
    input.type,
  );

  return {
    id: userNotification.id,
    text: notification.text,
    type: notification.type,
    isRead: userNotification.isRead,
    createdAt: userNotification.createdAt.toISOString(),
  };
}

export async function markAllNotificationsRead(userId: string) {
  const result = await markAllNotificationsReadQuery(userId);
  return result.length;
}
