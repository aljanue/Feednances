"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative w-full py-32 flex flex-col items-center justify-center border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-[100%] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-8 max-w-3xl px-4 relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
          Ready for absolute<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">
            control?
          </span>
        </h2>
        
        <p className="text-xl text-muted-foreground font-medium">
          Start tracking your expenses and income today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 px-4 sm:px-0">
          <Link href="/register">
            <Button size="lg" className="px-10 py-7 text-lg font-semibold shadow-[0_0_40px_-10px_rgba(43,238,108,0.5)] hover:shadow-[0_0_60px_-10px_rgba(43,238,108,0.8)] transition-all duration-300 ease-in-out">
              Get started
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
