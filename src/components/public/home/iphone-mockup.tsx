"use client";

import { useEffect, useState, useRef } from "react";

interface IPhoneMockupProps {
  className?: string;
}

export default function IPhoneMockup({ className }: IPhoneMockupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
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

  return (
    <div 
      className={`relative shrink-0 ${className ?? ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background glow effect */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 blur-[80px] rounded-full transition-all duration-1000 ease-out pointer-events-none ${
          isVisible ? "opacity-100" : "opacity-0"
          } ${isHovering ? "scale-110 bg-primary/30" : "scale-100 bg-primary/10"}`}
      />

      {/* The Phone Container */}
      <div 
        className={`relative w-50 md:w-60 lg:w-70 transition-all duration-700 ease-out z-10 ${
          isVisible 
            ? "opacity-100 translate-y-0 rotate-0" 
          : "opacity-0 translate-y-8 rotate-6"
        }`}
      >
        <div className="relative backdrop-blur-md border border-white/10 rounded-[3rem] p-2 shadow-2xl bg-black">
          {/* Inner Screen */}
          <div className="relative bg-[#0a0a0a] rounded-[2.25rem] overflow-hidden border border-white/5 aspect-[9/19.5]">

            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-10 flex items-center justify-center gap-2 border border-white/5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <div className="w-2.5 h-2.5 bg-white/10 rounded-full" />
            </div>

            {/* Lock Screen Time */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-10 w-full px-4">
              <div className="text-[11px] text-white/50 font-medium tracking-wide mb-1">
                {formatDay(currentTime)}
              </div>
              <div className="text-5xl font-semibold text-white/90 tracking-tight tabular-nums">
                {formatTime(currentTime)}
              </div>
            </div>

            {/* Notification Card */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className={`w-[90%] transition-all duration-700 ease-out ${
                  notificationVisible 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 -translate-y-4 scale-95"
                }`}
              >
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/90">Feednances</span>
                    </div>
                    <span className="text-[10px] text-white/40">now</span>
                  </div>
                  <div className="text-sm font-medium text-white/90 mb-1">
                    Expense saved successfully
                  </div>
                  <div className="text-xs font-semibold text-primary/80">
                    -17.99€ added to Entertainment
                  </div>
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Side Buttons */}
          <div className="absolute top-24 -left-1 w-1 h-8 bg-white/20 rounded-l-full" />
          <div className="absolute top-36 -left-1 w-1 h-14 bg-white/20 rounded-l-full" />
          <div className="absolute top-52 -left-1 w-1 h-14 bg-white/20 rounded-l-full" />
          <div className="absolute top-32 -right-1 w-1 h-16 bg-white/20 rounded-r-full" />
        </div>
      </div>
    </div>
  );
}
