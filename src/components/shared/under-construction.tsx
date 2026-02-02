"use client";

import { Construction } from "lucide-react";
import Logo from "./logo";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  showNotifyButton?: boolean;
}

export default function UnderConstruction({
  title = "En construcción",
  description = "Estamos trabajando duro para traerte algo increíble. ¡Vuelve pronto!",
}: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/40 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/2 right-1/4 w-2.5 h-2.5 bg-primary/15 rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Icon container with glow effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <Construction className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text content */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
          {title}
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          {description}
        </p>

        {/* Progress indicator */}
        <div className="w-full max-w-xs mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>Coming Soon</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full animate-pulse"
              style={{ width: "18%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
