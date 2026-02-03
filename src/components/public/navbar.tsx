import { Button } from "@/components/ui/button";
import Logo from "../shared/logo";
import Link from "next/link";
import MobileNav from "./mobile-nav";

export default function NavBar() {
  return (
    <nav className="w-full px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center border-b border-muted-foreground/20">
      <Link href="/">
        <Logo />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <li className="nav-link active cursor-pointer text-foreground hover:text-primary transition-colors">
          Home
        </li>
        <li className="nav-link cursor-pointer hover:text-foreground transition-colors">
          Features
        </li>
        <li className="nav-link cursor-pointer hover:text-foreground transition-colors">
          Installation
        </li>
      </ul>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <Link
          href="/login"
          className="nav-link text-sm cursor-pointer text-muted-foreground font-medium hover:text-foreground transition-colors"
        >
          Login
        </Link>
        <Button className="font-bold text-sm glow-primary" asChild>
          <Link href="/register">Get Started</Link>
        </Button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </nav>
  );
}
