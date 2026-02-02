import { Button } from "@/components/ui/button";
import Logo from "../shared/logo";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full p-6 flex justify-between items-center border-b border-muted-foreground]">
      <Link href="/">
        <Logo />
      </Link>
      <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <li className="nav-link active cursor-pointer text-foreground">Home</li>
        <li className="nav-link cursor-pointer">Features</li>
        <li className="nav-link cursor-pointer">Installation</li>
      </ul>
      <div className="flex items-center gap-6 text-sm">
        <Link
          href="/login"
          className="nav-link text-sm cursor-pointer text-muted-foreground font-medium"
        >
          Login
        </Link>
        <Button className="font-bold text-sm glow-primary">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
}
