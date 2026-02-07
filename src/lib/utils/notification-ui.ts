import type { LucideIcon } from "lucide-react";
import { CircleCheck, Info, TriangleAlert, CircleX } from "lucide-react";

import type { NotificationType } from "@/lib/dtos/notifications";

interface NotificationTypeMeta {
  label: string;
  icon: LucideIcon;
  iconClass: string;
  badgeClass: string;
  panelClass: string;
}

export const notificationTypeMeta: Record<
  NotificationType,
  NotificationTypeMeta
> = {
  success: {
    label: "Success",
    icon: CircleCheck,
    iconClass: "text-emerald-400",
    badgeClass:
      "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    panelClass:
      "border-emerald-500/20 bg-emerald-500/5",
  },
  info: {
    label: "Info",
    icon: Info,
    iconClass: "text-(--info)",
    badgeClass: "border-(--info)/40 bg-(--info)/15 text-(--info)",
    panelClass: "border-(--info)/20 bg-(--info)/5",
  },
  warning: {
    label: "Warning",
    icon: TriangleAlert,
    iconClass: "text-amber-400",
    badgeClass: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    panelClass: "border-amber-500/20 bg-amber-500/5",
  },
  error: {
    label: "Error",
    icon: CircleX,
    iconClass: "text-red-400",
    badgeClass: "border-red-500/40 bg-red-500/15 text-red-300",
    panelClass: "border-red-500/20 bg-red-500/5",
  },
};
