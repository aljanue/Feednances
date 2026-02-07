export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationItemDTO {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponseDTO {
  items: NotificationItemDTO[];
  unreadCount: number;
  latestNotifications: NotificationItemDTO[]; 
}
