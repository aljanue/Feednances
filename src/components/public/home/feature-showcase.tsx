"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Deep-dive analytics for every transaction.",
  "Customizable date ranges & granular filters.",
  "Detailed breakdowns of recurring vs. one-time expenses.",
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="py-12 md:py-24 w-full flex justify-center items-center lg:px-16 md:px-12 sm:px-8 px-4 relative">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            Powerful Insights
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            See the big picture,<br />down to the last cent.
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore highly detailed, functional charts that break down your financial data. Analyze spending patterns and filter by complex categories for complete clarity.
          </p>
          
          <ul className="flex flex-col gap-3 mt-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Image Side - Animated Entrance with 3D Rotation */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 25, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, rotateY: -15, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative perspective-1000 origin-right"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl">
            {/* Using a generic mockup image for the feature showcase, rotating perfectly with no additional background container */}
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop"
              alt="Feature Dashboard Mockup"
              className="w-full h-full object-cover opacity-90 mix-blend-screen shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            />
            {/* Gradient overlay to enhance the 3D depth effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
