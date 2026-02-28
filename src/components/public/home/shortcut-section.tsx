"use client";

import { motion } from "framer-motion";
import IPhoneMockup from "./iphone-mockup";
import { Mic, Zap, CheckCircle2 } from "lucide-react";

const steps = [
  "Tap the home screen Shortcut",
  "Enter the expense amount and concept",
  "Feednances saves it securely to the cloud",
];

export default function ShortcutSection() {
  return (
    <section id="shortcut" className="py-12 md:py-24 w-full relative flex items-center justify-center lg:px-16 md:px-12 sm:px-8 px-4 overflow-hidden scroll-mt-20">
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-16 lg:gap-12">
        
        {/* Left Side: Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotateY: 15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
          className="w-full relative flex justify-center perspective-1000 order-2 lg:order-1 mt-8 lg:mt-0"
        >
          <IPhoneMockup className="transform-gpu drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] scale-110 lg:scale-[1.2]" />
        </motion.div>

        {/* Right Side: Text & Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col gap-6 order-1 lg:order-2"
        >
          <div className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Zap className="w-4 h-4 mr-2" /> iOS Shortcuts Integration
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Log expenses at the speed of thought.
          </h2>
          
          <p className="text-lg text-muted-foreground mt-2 max-w-xl">
            Forget about opening the app and navigating through menus. With our dedicated iOS Shortcut, you can add transactions directly from your home screen in a matter of seconds.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">{idx + 1}</span>
                </div>
                <span className="text-lg font-medium text-white/90">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
