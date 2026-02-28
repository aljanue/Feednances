import Link from "next/link";
import { Github, Twitter, Mail, ArrowUpRight, Linkedin, Coffee } from "lucide-react";
import Logo from "../shared/logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-muted/30 bg-background/50 backdrop-blur-3xl pt-16 pb-8 px-6 lg:px-12 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The smartest way to take control of your digital spend. Automated expense tracking, powerful integrations with iOS Shortcuts, and Telegram alerts so you never pay for a forgotten subscription again.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="https://www.linkedin.com/in/alberto-j%C3%A1tiva-375156234/" target="_blank" className="p-2.5 rounded-full bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground border border-border/50">
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://github.com/aljanue" target="_blank" className="p-2.5 rounded-full bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground border border-border/50">
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="mailto:feednances@gmail.com" className="p-2.5 rounded-full bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground border border-border/50">
                <Mail className="w-4 h-4" />
                <span className="sr-only">Email</span>
              </Link>
              <Link href="https://buymeacoffee.com/feednances" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black transition-all hover:scale-105 border border-black/5 font-bold text-xs shadow-sm ml-2">
                <Coffee className="w-4 h-4 fill-current" />
                Buy me a coffee
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground tracking-tight">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-primary transition-colors inline-block">Features</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors inline-block">About Us</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors inline-block">Login</Link>
              </li>
            </ul>
          </div>

          {/* Integrations Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground tracking-tight">Integrations</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#shortcut" className="hover:text-foreground transition-colors group flex items-center gap-1.5">
                  iOS Shortcuts 
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/#telegram" className="hover:text-foreground transition-colors group flex items-center gap-1.5">
                  Telegram Bot
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                </Link>
              </li>
              <li>
                <p className="opacity-50 cursor-not-allowed">Bank Sync (Soon)</p>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4 lg:pl-6">
            <h4 className="font-semibold text-foreground tracking-tight">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors inline-block">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors inline-block">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors inline-block">Cookie Policy</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Fiscal Flow. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">Systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
