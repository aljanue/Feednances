import { Button } from "@/components/ui/button";
import Logo from "../shared/logo";
import Link from "next/link";
import MobileNav from "./mobile-nav";
import { auth } from "@/auth";
import { getUserById } from "@/lib/data/users.queries";
import UserMenuItem from "../dashboard/user-menu-item";

export default async function NavBar() {
  const session = await auth();
  const user = session?.user?.id ? await getUserById(session.user.id) : null;

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
      <div className="hidden md:flex items-center gap-4 text-sm">
        {user ? (
          <div className="flex items-center gap-4">
            <Button className="font-bold text-sm glow-primary" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <div className="h-6 w-px bg-muted-foreground/20 mx-1" />
            <UserMenuItem
              username={user.username}
              fullName={user.fullName ?? ""}
              variant="compact"
            />
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="nav-link text-sm cursor-pointer text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Button className="font-bold text-sm glow-primary" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav user={user ? { username: user.username, fullName: user.fullName } : null} />
    </nav>
  );
}
