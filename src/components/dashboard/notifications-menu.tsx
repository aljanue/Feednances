"use client";

import { useMemo, useState } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  isRead: boolean;
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "expense-1",
      title: "Expense imported",
      description: "3 items added",
      isRead: false,
    },
    {
      id: "subscription-1",
      title: "Subscription renewed",
      description: "Netflix - $9.99",
      isRead: false,
    },
  ]);

  const hasUnread = useMemo(
    () => notifications.some((n) => !n.isRead),
    [notifications]
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Mark all notifications as read when dropdown closes
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Notifications" className="relative">
          {hasUnread ? <BellDot /> : <Bell />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-72 max-w-sm" align="end" sideOffset={8}>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{notification.title}</span>
                {notification.description && (
                  <span className="text-xs text-muted-foreground">
                    {notification.description}
                  </span>
                )}
              </div>
              {!notification.isRead && (
                <Badge variant="default">
                  New
                </Badge>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
