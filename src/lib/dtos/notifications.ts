export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationItemDTO {
  id: string;
  text: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponseDTO {
  items: NotificationItemDTO[];
}
