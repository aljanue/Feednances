"use client";

import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ReceiptText,
  CalendarClock,
  LineChart,
  Settings,
} from "lucide-react";
import MenuItem from "./menu-item";

const menuIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Dashboard: LayoutGrid,
  Expenses: ReceiptText,
  Subscriptions: CalendarClock,
  Reports: LineChart,
  Settings: Settings,
};

interface MenuListProps {
  items: { name: string; href: string }[];
}

export default function MenuList({ items }: MenuListProps) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.name}>
          <MenuItem 
            item={{ ...item, icon: menuIcons[item.name] ?? LayoutGrid }}
            isActive={pathname === item.href} 
          />
        </li>
      ))}
    </ul>
  );
}