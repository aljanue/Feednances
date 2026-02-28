"use client";

import { Smartphone, Zap, Cloud, Sparkles, Shield, BarChart3 } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function PerksSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <section className="py-12 md:py-24 w-full relative flex flex-col items-center lg:px-16 md:px-12 sm:px-8 px-4 scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-[800px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-3xl mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Designed for absolute <span className="text-primary">clarity</span>.
        </h2>
        <p className="text-lg text-muted-foreground">
          Every tool you need to master your finances, beautifully packaged in an intuitive dashboard that stays out of your way.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Large Feature 1 */}
        <motion.div id="telegram" variants={itemVariants} className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 min-h-[250px] flex flex-col justify-end group hover:bg-white/[0.07] transition-colors scroll-mt-24">
          <div className="absolute top-0 right-0 p-8 text-primary/20 group-hover:text-primary/40 transition-colors">
            <Smartphone className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Powerful Integrations</h3>
            <p className="text-muted-foreground max-w-md">Log expenses instantly with a simple setup on iOS Shortcuts. Sync your account with our Telegram Bot to receive proactive billing alerts and completely avoid unwanted auto-renewals.</p>
          </div>
        </motion.div>

        {/* Small Feature 1 */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-blue-500/5 border border-blue-500/20 p-8 min-h-[220px] flex flex-col justify-end group hover:bg-blue-500/10 transition-colors">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Seamless Access</h3>
            <p className="text-sm text-muted-foreground">Link your GitHub or Google accounts for instant access. Your dashboard syncs in real-time across all your devices.</p>
          </div>
        </motion.div>

        {/* Small Feature 2 */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-purple-500/5 border border-purple-500/20 p-8 min-h-[220px] flex flex-col justify-end group hover:bg-purple-500/10 transition-colors">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">100% Custom Categories</h3>
            <p className="text-sm text-muted-foreground">Create, edit, and organize unlimited personalized categories perfectly tailored to your unique lifestyle.</p>
          </div>
        </motion.div>

        {/* Large Feature 2 */}
        <motion.div variants={itemVariants} className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 min-h-[250px] flex flex-col justify-end group hover:bg-white/[0.07] transition-colors">
          <div className="absolute top-0 right-0 p-8 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
            <BarChart3 className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Privacy First</h3>
            <p className="text-muted-foreground max-w-md">Your credentials and connection keys are encrypted and securely stored. We respect your privacy—your financial data is yours alone, and we will never sell it to third parties.</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
