"use client";

import { usePathname } from "next/navigation";
import NotificationsMenu from "./notifications-menu";
import NewExpenseModal from "./new-expense-modal";
import MobileNav from "./mobile-nav";

interface DashboardTopbarProps {
  menuItems: { name: string; href: string }[];
  title?: string;
  username: string;
  fullName: string;
}

export default function DashboardTopbar({
  menuItems,
  title = "Dashboard",
  username,
  fullName,
}: DashboardTopbarProps) {
  const pathname = usePathname();

  const matchedTitle =
    menuItems
      .slice()
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname.startsWith(item.href))?.name ?? title;

  return (
    <div className="w-full border-b border-muted flex items-center justify-between px-4 sm:px-6 py-4 bg-background">
      <div className="flex items-center gap-3">
        <MobileNav username={username} fullName={fullName} menuItems={menuItems} />
        <h1 className="text-lg sm:text-xl font-semibold">{matchedTitle}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationsMenu />
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-6 w-px bg-muted-foreground/20 mx-1" />
        </div>
        <NewExpenseModal />
      </div>
    </div>
  );
}

