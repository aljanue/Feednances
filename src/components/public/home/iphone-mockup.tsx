"use client";

import { useEffect, useState, useRef } from "react";

interface IPhoneMockupProps {
  className?: string;
}

export default function IPhoneMockup({ className }: IPhoneMockupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setNotificationVisible(true), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDay = (date: Date) => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    return `${weekday}, ${month} ${day}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setGlowPosition({ x, y });
  };

  // Calculate glow color based on position
  const getGlowColor = () => {
    const { x, y } = glowPosition;
    // Map position to hue: 
    // Top-left: green (primary ~142), Top-right: cyan (~180)
    // Bottom-left: purple (~280), Bottom-right: blue (~220)
    const hue = 142 + (x - 50) * 0.8 + (y - 50) * 1.5;
    return `hsl(${hue}, 80%, 55%)`;
  };

  const glowColor = getGlowColor();

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Smoothly return to center
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative shrink-0 ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect behind phone - follows mouse with delay */}
      <div 
        className={`absolute w-48 h-48 blur-[60px] rounded-full transition-all duration-700 ease-out pointer-events-none ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovering ? "scale-110" : "scale-100"}`}
        style={{
          left: `${glowPosition.x}%`,
          top: `${glowPosition.y}%`,
          transform: `translate(-50%, -50%)`,
          backgroundColor: isHovering ? glowColor : "rgb(43, 238, 108, 0.25)",
          opacity: isVisible ? 0.4 : 0,
        }}
      />
      
      {/* Secondary larger glow with more delay */}
      <div 
        className={`absolute w-64 h-64 blur-[70px] rounded-full transition-all duration-1000 ease-out pointer-events-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${50 + (glowPosition.x - 50) * 0.5}%`,
          top: `${50 + (glowPosition.y - 50) * 0.5}%`,
          transform: `translate(-50%, -50%)`,
          backgroundColor: isHovering ? glowColor : "rgb(43, 238, 108, 0.1)",
          opacity: isVisible ? 0.2 : 0,
        }}
      />
      
      {/* Phone container with entrance animation */}
      <div 
        className={`relative w-50 md:w-60 lg:w-70 transition-all duration-700 ease-out ${
          isVisible 
            ? "opacity-100 translate-y-0 rotate-0" 
            : "opacity-0 translate-y-8 rotate-3"
        }`}
      >
        {/* Phone frame */}
        <div className="relative backdrop-blur-md border-[3px] border-white/50 rounded-[3rem] p-2 shadow-2xl shadow-black/30">
          
          {/* Inner bezel */}
          <div className="relative bg-black/20 backdrop-blur-xl rounded-[2.25rem] overflow-visible aspect-[9/19.5]">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-10 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-white/10 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-white/5 rounded-full border border-white/10" />
            </div>
            
            {/* Time and Date Display - iPhone Lock Screen Style */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-10 w-full px-4">
              <div className="text-[11px] text-white/70 font-medium tracking-wide mb-1">
                {formatDay(currentTime)}
              </div>
              <div className="text-5xl font-semibold text-white tracking-tight tabular-nums">
                {formatTime(currentTime)}
              </div>
            </div>
            
            {/* Screen content area */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
              {/* Floating notification with slide-in animation */}
              <div 
                className={`w-[250%] transition-all duration-500 ease-out ${
                  notificationVisible 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 -translate-y-4 scale-95"
                }`}
              >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl shadow-black/20 animate-pulse animation-duration-[3s]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white/90">Feednances</span>
                    </div>
                    <span className="text-[10px] text-white/40">now</span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    ✅ Expense Saved: Netflix
                  </div>
                  <div className="text-xs text-primary font-bold mt-0.5">
                    -$17.99 (Subscription)
                  </div>
                </div>
              </div>
            </div>
            
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
          </div>
          
          {/* Side buttons */}
          <div className="absolute top-24 -left-1.25 w-0.75 h-8 bg-white/30 rounded-l-full" />
          <div className="absolute top-36 -left-1.25 w-0.75 h-14 bg-white/30 rounded-l-full" />
          <div className="absolute top-52 -left-1.25 w-0.75 h-14 bg-white/30 rounded-l-full" />
          <div className="absolute top-32 -right-1.25 w-0.75 h-16 bg-white/30 rounded-r-full" />
        </div>
      </div>
      
      {/* Floating API element with delayed entrance */}
      <div 
        className={`absolute -bottom-1 -left-2 -translate-x-1/2 md:-bottom-4 md:-left-65 md:translate-x-0 bg-card/80 backdrop-blur-md border border-border/50 p-3 md:p-4 rounded-xl hidden sm:block transition-all duration-500 delay-500 ${
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-4"
        }`}
      >
        <div className="flex items-center gap-3 text-xs font-mono text-primary">
          <span className="text-muted-foreground">POST</span> /api/expense
        </div>
        <div className="mt-2 text-[10px] font-mono text-muted-foreground">
          {"{"} &quot;amount&quot;: 17.99, &quot;concept&quot;: &quot;Netflix&quot;, &quot;category&quot;: &quot;Entertaiment&quot;, ... {"}"}
        </div>
        
        {/* Typing cursor effect */}
        <span className="inline-block w-1.5 h-3 bg-primary/70 ml-1 animate-[blink_1s_steps(1)_infinite]" />
      </div>
    </div>
  );
}
