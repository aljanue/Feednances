"use client";

import { EllipsisVertical } from "lucide-react";

import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface EllipsisMenuItem {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

interface EllipsisMenuProps {
  items: EllipsisMenuItem[];
  className?: string;
  align?: "start" | "center" | "end";
}

export default function EllipsisMenu({
  items,
  className,
  align = "end",
}: EllipsisMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn("text-muted-foreground", className)}
          aria-label="Open options"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-44">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            disabled={item.disabled}
            variant={item.variant}
            onSelect={(event) => {
              if (!item.onSelect) {
                return;
              }
              event.preventDefault();
              item.onSelect();
            }}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
