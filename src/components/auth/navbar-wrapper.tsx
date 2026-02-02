"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navbar";

export default function NavBarWrapper() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return <NavBar isLogin={isLogin} />;
}
