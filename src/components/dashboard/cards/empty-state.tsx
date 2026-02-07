import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted bg-muted/10 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-background/60 border border-border/40">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
