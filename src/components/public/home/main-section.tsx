"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import IPhoneMockup from "./iphone-mockup";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MainSection() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-85px)] flex items-center justify-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[150px] rounded-[100%] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10 lg:px-16 md:px-12 sm:px-8 px-4 pt-24 md:pt-32 pb-8 md:pb-24 min-h-[60vh] md:min-h-[70vh]">

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center gap-8 max-w-5xl relative z-20"
        >
          <motion.div variants={item}>
            <Badge variant="outline" className="gap-2 text-sm w-fit px-5 py-2 border-primary/30 bg-primary/5 backdrop-blur-md rounded-full text-primary">
              <span className="bg-primary h-2 w-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(43,238,108,0.8)]"></span>
              The Ultimate Financial Dashboard
            </Badge>
          </motion.div>

          <motion.h1 variants={item} className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] drop-shadow-2xl">
            Financial Clarity,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-500">
              Zero Friction.
            </span>
          </motion.h1>

          <motion.p variants={item} className="text-md md:text-lg text-muted-foreground max-w-3xl font-medium mt-4">
            Stop fighting with spreadsheets and clunky banking apps. Log your expenses via iOS Shortcuts in seconds, and let our beautiful dashboard do the rest.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-8 px-4 sm:px-0">
            <Button className="rounded-lg text-lg px-10 py-7 font-semibold shadow-[0_0_40px_-10px_rgba(43,238,108,0.6)] hover:shadow-[0_0_50px_-10px_rgba(43,238,108,0.6)] transition-all bg-primary text-primary-foreground hover:bg-primary/90 duration-300 ease-in-out">
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg text-lg px-10 py-7 font-semibold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-300 ease-in-out" asChild>
              <Link href="/about">
                About the project
              </Link>
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
