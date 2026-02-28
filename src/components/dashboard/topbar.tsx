"use client";

import { usePathname } from "next/navigation";
import NewExpenseModal from "./new-expense-modal";
import MobileNav from "./mobile-nav";
import { Coffee } from "lucide-react";
import Link from "next/link";

interface DashboardTopbarProps {
  menuItems: { name: string; href: string }[];
  title?: string;
  username: string;
  fullName: string;
  image: string | null;
}

export default function DashboardTopbar({
  menuItems,
  title = "Dashboard",
  username,
  fullName,
  image,
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
        <MobileNav username={username} fullName={fullName} image={image} menuItems={menuItems} />
        <Link
          href="https://buymeacoffee.com/feednances"
          target="_blank"
          className="flex lg:hidden items-center justify-center size-9 rounded-full bg-[#FFDD00]/10 border border-[#FFDD00]/20 text-[#FFDD00] hover:bg-[#FFDD00]/20 transition-all active:scale-90"
          title="Support development"
        >
          <Coffee className="size-4 fill-current" />
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold">{matchedTitle}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-6 w-px bg-muted-foreground/20 mx-1" />
        </div>
        <NewExpenseModal />
      </div>
    </div>
  );
}

