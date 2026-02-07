"use client";

import { useMemo, useState } from "react";
import { Bell, BellDot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import useSWR from "swr";
import { useSWRConfig } from "swr";
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
import type { NotificationsResponseDTO } from "@/lib/dtos/notifications";
import { swrFetcher } from "@/lib/utils/swr";
import { notificationTypeMeta } from "@/lib/utils/notification-ui";
import { cn } from "@/lib/utils";

const NOTIFICATIONS_POLL_INTERVAL = 20000;

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const { data, isLoading } = useSWR<NotificationsResponseDTO>(
    "/api/notifications",
    swrFetcher,
    {
      refreshInterval: NOTIFICATIONS_POLL_INTERVAL,
      revalidateOnFocus: true,
    },
  );

  const notifications = useMemo(() => data?.items ?? [], [data?.items]);

  const hasUnread = useMemo(
    () => notifications.some((notification) => !notification.isRead),
    [notifications],
  );

  const markNotificationsRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
  };

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      if (!hasUnread) {
        return;
      }

      mutate(
        "/api/notifications",
        (current: NotificationsResponseDTO | undefined) => {
          if (!current) return current;
          return {
            ...current,
            items: current.items.map((item) => ({
              ...item,
              isRead: true,
            })),
          };
        },
        { revalidate: false },
      );

      await markNotificationsRead();
      mutate("/api/notifications");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Notifications"
          className="relative"
        >
          {hasUnread ? <BellDot /> : <Bell />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-72 max-w-sm"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem disabled>Loading notifications...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          <div className="flex flex-col gap-1.5">
            {notifications.map((notification) => {
              const meta = notificationTypeMeta[notification.type];
              const Icon = meta.icon;
              const timestamp = formatDistanceToNow(
                new Date(notification.createdAt),
                { addSuffix: true },
              );

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-xl p-3 cursor-default border border-transparent transition-all",
                    "focus:bg-accent/50 focus:text-accent-foreground",
                    meta.panelClass,
                    notification.isRead ? "bg-transparent!" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-sm",
                        "bg-background/80 border-border/50",
                      )}
                    >
                      <Icon className={cn("size-4", meta.iconClass)} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold leading-tight mb-1">
                        {notification.text}
                      </span>
                      <span className="text-[10px] font-medium opacity-60">
                        {timestamp}
                      </span>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <div className="flex items-center self-center shrink-0">
                      <Badge className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-tight bg-primary text-primary-foreground border-none">
                        New
                      </Badge>
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
