import { ReactNode } from "react";

interface CardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
}

// Map color classes to their glow equivalents
const getGlowStyles = (color: string): string => {
  if (color.includes("text-primary")) {
    return "shadow-[0_0_20px_rgba(43,238,108,0.2)] border-primary/30";
  }
  if (color.includes("text-blue")) {
    return "shadow-[0_0_20px_rgba(59,130,246,0.2)] border-blue-400/30";
  }
  if (color.includes("text-purple")) {
    return "shadow-[0_0_20px_rgba(168,85,247,0.2)] border-purple-400/30";
  }
  return "shadow-[0_0_20px_rgba(43,238,108,0.2)] border-primary/30";
};

export default function Card({ icon, title, description, color = "bg-primary/10 text-primary" }: CardProps) {
  const glowStyles = getGlowStyles(color);
  
  return (
    <div className="group relative p-8 rounded-2xl border border-white/5 bg-slate-900/50 transition-all flex flex-col">
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border ${glowStyles}`} />
      
      <div className={`size-12 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ease-in-out`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}