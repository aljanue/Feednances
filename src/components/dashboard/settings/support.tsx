"use client";

import { Coffee, Heart, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Support() {
  return (
    <Card className="border border-white/10 bg-white/[0.02] overflow-hidden relative group transition-all duration-300 hover:border-white/20">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Coffee className="size-48 -rotate-12" />
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
          <Heart className="size-3 fill-primary animate-pulse" />
          Support & Development
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Enjoying Feednances?</CardTitle>
        <CardDescription className="text-base max-w-xl">
          Feednances is an independent project built with love to help you master your finances. 
          Your support helps keep the platform **100% free**, ad-free, and private for everyone.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5">
            <Globe className="size-4 text-primary mb-1" />
            <span className="text-xs font-bold text-white">Infrastructure</span>
            <span className="text-[10px] text-muted-foreground">High-speed, secure servers and database 24/7.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5">
            <Sparkles className="size-4 text-emerald-400 mb-1" />
            <span className="text-xs font-bold text-white">New Features</span>
            <span className="text-[10px] text-muted-foreground">Telegram Bot, iOS Shortcuts, and AI categorization.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex-shrink-0 justify-center items-center text-center">
            <span className="text-sm font-black text-emerald-400">100% FREE</span>
            <span className="text-[10px] text-emerald-400/60 leading-none">Subscription-free app</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link 
            href="https://buymeacoffee.com/feednances" 
            target="_blank"
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#FFDD00] hover:bg-[#FFCC00] text-black font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg group-hover:shadow-[#FFDD00]/10"
          >
            <Coffee className="size-5 fill-current" />
            Buy me a coffee
          </Link>
          <p className="text-xs text-muted-foreground max-w-[200px] text-center sm:text-left">
            Thank you for helping me keep this project alive. Every coffee counts!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
