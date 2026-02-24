"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
      <li>
        <Link 
          href="/" 
          className={`nav-link transition-colors ${pathname === "/" ? "active text-foreground hover:text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Home
        </Link>
      </li>
      <li>
        <Link 
          href="/about" 
          className={`nav-link transition-colors ${pathname === "/about" ? "active text-foreground hover:text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          About
        </Link>
      </li>
    </ul>
  );
}
