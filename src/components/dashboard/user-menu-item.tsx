"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, User } from "lucide-react";

interface UserProps {
  username: string;
  fullName: string;
  image?: string | null;
  className?: string;
  variant?: "default" | "compact";
  collapsed?: boolean;
}

export default function UserMenuItem({ username, fullName, image, className, variant = "default", collapsed }: UserProps) {
  const initials = fullName
    ? fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : username.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {collapsed ? (
          <Button
            variant="ghost"
            className={cn("size-10 p-0 flex items-center justify-center hover:bg-muted/50 rounded-full", className)}
          >
            <Avatar className="size-9 border border-primary/20">
              <AvatarImage src={image ?? undefined} alt={username} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        ) : variant === "default" ? (
            <Button
              variant="outline"
              className={cn("w-full items-center px-4 py-8 justify-between text-left group", className)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="size-9 border border-primary/20 group-hover:opacity-80 transition-opacity">
                  <AvatarImage src={image ?? undefined} alt={username} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs group-hover:bg-primary/20 transition-colors">{initials}</AvatarFallback>
                </Avatar>
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate">{username}</span>
                  <span className="text-xs text-muted-foreground truncate">{fullName}</span>
                </span>
              </div>
              <ChevronDown className="shrink-0 size-4 text-muted-foreground group-hover:text-foreground transition-colors ml-2" />
            </Button>
        ) : (
          <Button
            variant="ghost"
            className={cn("h-10 px-2 flex items-center gap-2 hover:bg-muted/50 rounded-full", className)}
          >
                <Avatar className="size-8 border border-primary/20">
                  <AvatarImage src={image ?? undefined} alt={username} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
            <span className="text-sm font-medium hidden sm:inline-block">{username}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={collapsed ? "start" : "end"} side={collapsed ? "right" : "bottom"} sideOffset={8}>
        <DropdownMenuLabel className="font-normal flex items-center gap-3">
          <Avatar className="size-8 border border-primary/20">
            <AvatarImage src={image ?? undefined} alt={username} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {fullName}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onSelect={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

