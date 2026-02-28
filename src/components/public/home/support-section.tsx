"use client";

import { motion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SupportSection() {
  return (
    <section className="py-20 w-full flex justify-center items-center lg:px-16 md:px-12 sm:px-8 px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10 text-destructive" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-white/[0.15] transition-all duration-500 shadow-2xl"
      >
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Avatar className="size-16 border-2 border-[#1a1a1a] shadow-xl relative z-10">
              <AvatarImage src="https://avatars.githubusercontent.com/u/134947748?v=4" alt="Alberto Játiva" />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">AJ</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Heart className="size-3 fill-primary" />
              Independent Project
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
              Crafted with passion, supported by you.
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Feednances is a solo-developed project. No ads, no data selling—just code and coffee.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <Link
            href="https://buymeacoffee.com/feednances"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FFDD00] hover:bg-[#FFCC00] text-black font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
          >
            <Coffee className="size-4 fill-current" />
            Support development
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
