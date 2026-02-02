import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "../shared/logo";

interface NavBarProps {
  isLogin?: boolean;
}

export default function NavBar({ isLogin = false }: NavBarProps) {
  return (
    <nav className="w-full p-6 flex justify-between items-center border-b border-muted-foreground]">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <span className="text-sm text-muted-foreground font-medium sm:block hidden">
          {isLogin ? "New to Feednances?" : "Already have an account?"}
        </span>
        <Button variant="outline" className="font-bold glow-primary" asChild>
          <Link href={isLogin ? "/register" : "/login"}>
            {isLogin ? "Create Account" : "Login"}
          </Link>
        </Button>
      </div>
    </nav>
  );
}
