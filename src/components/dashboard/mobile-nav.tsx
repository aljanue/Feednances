"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Logo from "../shared/logo";
import UserMenuItem from "./user-menu-item";
import MenuList from "./menu-list";

interface MobileNavProps {
  username: string;
  fullName: string;
  menuItems: { name: string; href: string }[];
}

export default function MobileNav({ username, fullName, menuItems }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-background pt-6 pb-2">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between h-full px-2 ">
          <MenuList items={menuItems} />
          <UserMenuItem username={username} fullName={fullName} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
