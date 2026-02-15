"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import Logo from "../shared/logo";
import UserMenuItem from "./user-menu-item";
import MenuList from "./menu-list";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

interface DashboardNavbarProps {
  username: string;
  fullName: string;
  menuItems: { name: string; href: string }[];
}

export default function DashboardNavbar({
  username,
  fullName,
  menuItems,
}: DashboardNavbarProps) {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();

  if (isMobile) return null; // Logic handled by MobileNav separately

  return (
    <nav
      className={cn(
        "sticky top-0 h-screen border-r border-muted flex flex-col justify-between bg-background hidden lg:flex transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20 p-4" : "w-64 p-6"
      )}
    >
      <section className="flex flex-col gap-6">
        <div className={cn("flex items-center", isCollapsed && "justify-center")}>
          <Logo collapsed={isCollapsed} />
        </div>
        <MenuList items={menuItems} collapsed={isCollapsed} />
      </section>

      <div className="flex flex-col gap-2">
        <UserMenuItem
          username={username}
          fullName={fullName}
          collapsed={isCollapsed}
          className={cn(isCollapsed && "justify-center px-0")}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "w-full flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-2",
            isCollapsed && "justify-center"
          )}
        >
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!isCollapsed && <span className="text-xs">Collapse Sidebar</span>}
        </Button>
      </div>
    </nav>
  );
}