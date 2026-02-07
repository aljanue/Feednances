import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/lib/dtos/notifications";
import { notificationTypeMeta } from "@/lib/utils/notification-ui";

interface NotificationToastProps {
  title: string;
  description?: string;
  type: NotificationType;
}

export function NotificationToast({
  title,
  description,
  type,
}: NotificationToastProps) {
  const meta = notificationTypeMeta[type];
  const Icon = meta.icon;

  return (
    <Alert
      className={cn(
        "relative w-[min(92vw,360px)] border shadow-lg",
        meta.panelClass,
      )}
    >
      <Icon className={cn("size-4", meta.iconClass)} />
      <div>
        <AlertTitle className="text-sm">{title}</AlertTitle>
        {description ? (
          <AlertDescription className="text-xs text-muted-foreground">
            {description}
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}
