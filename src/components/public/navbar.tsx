import { Button } from "@/components/ui/button";
import Logo from "../shared/logo";
import Link from "next/link";
import MobileNav from "./mobile-nav";
import { auth } from "@/auth";
import { getUserById } from "@/lib/data/users.queries";
import UserMenuItem from "../dashboard/user-menu-item";
import DesktopNav from "./desktop-nav";

export default async function NavBar() {
  const session = await auth();
  const user = session?.user?.id ? await getUserById(session.user.id) : null;

  return (
    <nav className="w-full px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center border-b border-muted-foreground/20">
      <Link href="/">
        <Logo />
      </Link>

      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center gap-4 text-sm">
        {user ? (
          <div className="flex items-center gap-4">
            <Button className="font-semibold text-sm glow-primary" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <div className="h-6 w-px bg-muted-foreground/20 mx-1" />
            <UserMenuItem
              username={user.username}
              fullName={user.fullName ?? ""}
              image={user.image ?? null}
              variant="compact"
            />
          </div>
        ) : (
          <>
            <Link
              href="/login"
                className="nav-link text-sm cursor-default text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
              Login
            </Link>
              <Button className="font-semibold text-sm glow-primary cursor-default" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav user={user ? { username: user.username, fullName: user.fullName, image: user.image } : null} />
    </nav>
  );
}
