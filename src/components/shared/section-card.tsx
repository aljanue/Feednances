import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionPadding = "compact" | "default" | "spacious";

const paddingMap: Record<SectionPadding, string> = {
  compact: "p-4",
  default: "p-6",
  spacious: "p-8",
};

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  padding?: SectionPadding;
}

/**
 * Unified card wrapper for all dashboard sections (charts, tables, panels).
 * Provides consistent border-radius, background, border, and hover treatment.
 */
export default function SectionCard({
  children,
  className,
  padding = "default",
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "border border-border/50 bg-card/60 backdrop-blur-sm rounded-xl",
        "transition-all duration-300 hover:border-primary/20 hover:shadow-sm",
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
