"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AppShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.7, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [25, 0]);

  return (
    <section ref={containerRef} className="py-12 md:py-16 pb-20 md:pb-32 w-full flex justify-center items-center lg:px-16 md:px-12 sm:px-8 px-4 relative perspective-1000">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        style={{
          scale,
          opacity,
          rotateX,
          transformPerspective: 1000,
        }}
        className="w-full max-w-6xl rounded-2xl border border-white/5 bg-black/60 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative"
      >
        <div className="absolute inset-0 rounded-2xl border-[0.5px] border-white/10 pointer-events-none z-20 mix-blend-overlay" />
        
        <div className="w-full bg-[#111] border-b border-white/5 p-4 flex items-center justify-between z-10 relative">
          <div className="flex gap-2 pl-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="bg-[#2d2d2d] text-muted-foreground text-xs px-24 py-1.5 rounded-md flex-1 max-w-sm text-center ml-auto mr-auto shadow-inner flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            fiscalflow.app
          </div>
          <div className="w-16"></div> {/* Spacer for symmetry */}
        </div>
        
        {/* Placeholder for the actual app interface. For now, an aesthetically pleasing dark dashboard mockup */}
        <div className="relative aspect-[16/9] w-full bg-[#0a0a0a]">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop" 
            alt="App Dashboard Mockup" 
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity filter contrast-125" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 opacity-90" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
              Feednances
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl drop-shadow-md">
              A beautifully crafted financial dashboard that gives you absolute control over your money, without the complexity.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
