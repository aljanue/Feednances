"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItemProps {
    item: {
        name: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
    };
    isActive: boolean;
  collapsed?: boolean;
}

export default function MenuItem({ item, isActive, collapsed }: MenuItemProps) {
  const Icon = item.icon;
  
  const content = (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-4 px-3 py-6 transition-all duration-200",
        collapsed && "justify-center px-2",
        isActive 
          ? "bg-primary/10 text-primary border border-solid border-primary/20 hover:bg-primary/10 hover:border-primary/20" 
          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
      )}
    >
      <Link href={item.href}>
        <Icon className={cn("size-5", isActive ? "text-primary" : "text-muted-foreground")} />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    </Button>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}