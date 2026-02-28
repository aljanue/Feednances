"use client";

import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Coffee, Heart, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
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
    <div className="relative w-full min-h-[calc(100vh-85px)] flex flex-col items-center overflow-hidden pb-8">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[180px] rounded-[100%] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto flex flex-col relative z-10 px-6 sm:px-8 pt-24 md:pt-32 pb-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-16 md:gap-24"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
            <motion.div variants={item}>
              <Badge variant="outline" className="gap-2 text-sm px-5 py-2 border-primary/20 bg-primary/5 backdrop-blur-md rounded-full text-primary shadow-[inset_0_0_20px_rgba(43,238,108,0.05)]">
                <span className="bg-primary h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(43,238,108,0.8)]"></span>
                The Vision
              </Badge>
            </motion.div>

            <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] drop-shadow-2xl">
              Redefining Personal <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-500">
                Finance Tracking
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-2xl text-muted-foreground max-w-2xl mt-4 font-medium leading-relaxed">
              We believe managing your money shouldn't be a chore. It should feel <span className="text-white font-semibold">seamless, instantaneous, and empowering.</span>
            </motion.p>
          </div>

          {/* Philosophy Section */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">Zero Friction Philosophy</h2>
              <div className="flex flex-col gap-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Feednances was born out of frustration with existing tools. They were either too complex, requiring manual data entry that felt like a second job, or too simplistic, lacking deep insights.
                </p>
                <p>
                  By leveraging native OS integrations and a meticulously crafted dashboard, we've eliminated the barriers between you and your financial clarity. Log an expense in seconds, and watch as our beautiful interface instantly transforms your data into actionable intelligence.
                </p>
              </div>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl flex items-center justify-center p-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 text-primary mb-6 shadow-[0_0_40px_rgba(43,238,108,0.3)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white max-w-[250px] mx-auto leading-tight">Master your money in seconds.</h3>
              </div>
            </div>
          </motion.div>

          {/* Core Capabilities Bento Grid */}
          <div className="flex flex-col gap-6">
            <motion.h2 variants={item} className="text-3xl font-bold text-white tracking-tight text-center mb-4">Core Capabilities</motion.h2>
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 - Large spanning across */}
              <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/[0.08] p-8 md:p-10 min-h-[300px] flex flex-col justify-end group hover:bg-white/[0.05] transition-all duration-500 shadow-lg">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/20 transition-all duration-700" />
                <div className="absolute top-8 right-8 text-primary/30 group-hover:text-primary transition-colors duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(43,238,108,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  </div>
                  <h4 className="text-white font-bold text-2xl md:text-3xl mb-3">Lightning Fast Logging</h4>
                  <p className="text-muted-foreground text-lg max-w-md">Add expenses directly from your Home Screen in seconds via our exclusive iOS Shortcuts integration. No need to even open the app to stay on track.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/[0.08] p-8 min-h-[300px] flex flex-col justify-end group hover:bg-white/[0.05] transition-all duration-500 shadow-lg">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                  </div>
                  <h4 className="text-white font-bold text-2xl mb-3">Deep Analytics</h4>
                  <p className="text-muted-foreground">Track daily spending pacing, perfectly categorize expenses, and analyze interactive charts.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/[0.08] p-8 min-h-[300px] flex flex-col justify-end group hover:bg-white/[0.05] transition-all duration-500 shadow-lg">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M2 10h20" /><path d="M3 6h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" /><path d="M12 14v4" /><path d="M8 14v4" /><path d="M16 14v4" /></svg>
                  </div>
                  <h4 className="text-white font-bold text-2xl mb-3">Unified Subs</h4>
                  <p className="text-muted-foreground">Manage all your recurring subscriptions in a single dashboard to avoid paying for ghost services.</p>
                </div>
              </div>

              {/* Minimal aesthetic filler block */}
              <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/5 p-8 flex items-center group">
                <div className="w-full flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Precision</div>
                  <div className="h-px bg-white/10 flex-1 mx-6" />
                  <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Clarity</div>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Developer Section Header */}
          <div className="flex flex-col gap-6 items-center">
            <motion.div variants={item}>
              <Badge variant="outline" className="gap-2 text-sm px-5 py-2 border-primary/20 bg-primary/5 backdrop-blur-md rounded-full text-primary shadow-[inset_0_0_20px_rgba(43,238,108,0.05)]">
                The Architect
              </Badge>
            </motion.div>
            <motion.h2 variants={item} className="text-5xl font-bold text-white tracking-tight text-center mb-4">Meet the Developer</motion.h2>

            <motion.div variants={item} className="w-full">
              <div className="w-full md:rounded-full rounded-4xl border border-white/[0.08] bg-black/40 backdrop-blur-2xl p-4 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6 md:gap-8 group transition-all duration-500 hover:border-white/[0.15]">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[3px] border-[#1a1a1a] shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src="https://avatars.githubusercontent.com/u/134947748?v=4"
                      alt="Alberto Játiva"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Alberto Játiva</h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mt-1">
                    Feednances is designed and built with passion by Alberto Játiva, a solo fullstack developer focused on creating intuitive, state-of-the-art web experiences. The core belief is that software should be as beautiful as it is functional—turning chores into joy.</p>
                </div>

                <div className="flex flex-row md:flex-col gap-3 justify-center md:pr-4 shrink-0">
                  <a href="https://github.com/aljanue" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-white border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/alberto-j%C3%A1tiva-375156234/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-all hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Donation Section */}
          <motion.div variants={item} className="w-full relative pt-6">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-[3rem] -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-16 backdrop-blur-3xl overflow-hidden relative group">
              {/* Background accent */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

              <div className="lg:col-span-3 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm tracking-wide">
                  <Heart className="size-4 animate-pulse fill-primary" />
                  Support the project
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight italic">
                  Keep Feednances <br />
                  <span className="text-primary not-italic">Independent & Free.</span>
                </h2>

                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed max-w-xl">
                  <p>
                    Feednances is 100% created and maintained by a solo developer. No big investors, no selling your data, and no subscription fees for the app itself—ever.
                  </p>
                  <p>
                    Your support directly covers the costs of our secure servers, databases, and the time needed to build new features like the Telegram Bot and iOS integrations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 pt-4">
                  <Link
                    href="https://buymeacoffee.com/feednances"
                    target="_blank"
                    className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-[#FFDD00] hover:bg-[#FFCC00] text-black font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_-10px_rgba(255,221,0,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,221,0,0.5)]"
                  >
                    <Coffee className="size-6 fill-current" />
                    Buy me a coffee
                  </Link>

                  <p className="text-sm text-muted-foreground italic font-medium max-w-[200px]">
                    Thank you for helping me keep this project alive. Every coffee counts!
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 gap-4 relative">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                    <Globe className="size-6 text-primary mb-3" />
                    <h4 className="text-white font-bold mb-1 italic">Server Uptime</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Keeping your data synced 24/7 across all devices instantly.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                    <Sparkles className="size-6 text-emerald-400 mb-3" />
                    <h4 className="text-white font-bold mb-1 italic">New Tech</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Developing advanced AI categorization and bank syncs.</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                    <Heart className="size-6 text-pink-500 mb-3" />
                    <h4 className="text-white font-bold mb-1 italic">Pure Passion</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Software built by a human for humans, not for profit.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors flex items-center justify-center italic text-primary/40 font-black text-2xl tracking-tighter">
                    100% FREE
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
