"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export interface PasswordInputProps extends React.ComponentProps<"input"> { }

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, disabled, ...props }, ref) => {
        const [isRevealed, setIsRevealed] = React.useState(false);
        const [inputType, setInputType] = React.useState<"password" | "text">("password");

        const togglePassword = () => {
            if (disabled) return;

            if (isRevealed) {
                setIsRevealed(false);
                setInputType("password");
            } else {
                setIsRevealed(true);
                // Delay revealing text strictly after the swoosh expands
                setTimeout(() => setInputType("text"), 200);
            }
        };

        return (
            <div
                className={cn(
                    "relative flex w-full items-center h-9 rounded-md border border-input bg-transparent overflow-hidden",
                    "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-[box-shadow,color]",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                {/* The Lock Icon */}
                <div className={cn(
                    "absolute left-3 z-20 flex h-full items-center justify-center transition-colors duration-200",
                    isRevealed ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                    <Lock className="w-4 h-4" />
                </div>

                {/* Expanding Background Circle */}
                <div
                    className={cn(
                        "absolute z-0 bg-primary/95 transition-transform duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-full w-10 h-10 top-1/2 right-0 -translate-y-1/2 origin-center",
                        isRevealed ? "scale-[75]" : "scale-0"
                    )}
                />

                {/* Actual Input */}
                <input
                    type={inputType}
                    disabled={disabled}
                    className={cn(
                        "relative z-10 w-full h-full bg-transparent py-1 text-base shadow-xs outline-none focus:outline-none focus:ring-0",
                        "pl-9 pr-9", // padding for lock(left) and eye(right)
                        "file:text-foreground placeholder:text-muted-foreground",
                        "disabled:pointer-events-none md:text-sm transition-colors duration-200",
                        isRevealed ? "text-primary-foreground placeholder:text-primary-foreground/70" : "text-foreground font-mono tracking-[0.2em]"
                    )}
                    ref={ref}
                    {...props}
                />

                {/* Eye Button Toggle */}
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={togglePassword}
                    disabled={disabled}
                    className={cn(
                        "absolute right-1 z-20 flex h-7 w-7 items-center justify-center rounded-sm",
                        "transition-colors focus:outline-none",
                        isRevealed ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                        disabled && "pointer-events-none"
                    )}
                    aria-label={isRevealed ? "Hide password" : "Show password"}
                >
                    <div className={cn("flex items-center justify-center w-[1.1rem] h-[1.1rem]", isRevealed ? "eye-open" : "eye-close")}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                .pwd-eye {
                  --duration-blink: .2s;
                  --duration-lashes: .2s;
                  --delay-lashes: .2s;
                  --duration-pupil: .1s;
                  --delay-pupil: .133s;
                }
                .pwd-eye-bottom, .pwd-eye-top { stroke-linecap: round; }
                .pwd-eye-top, .pwd-eye-lashes { 
                  transition: var(--duration-blink) ease-in; 
                  transform-origin: 140px 0px; 
                }
                .pwd-eye-pupil { 
                  opacity: 0; 
                  transition: opacity var(--duration-pupil) var(--delay-pupil) ease; 
                }
                .eye-open .pwd-eye-top, .eye-open .pwd-eye-lashes { 
                  transform: rotateX(180deg);
                  animation: pwdScaleUp var(--duration-lashes) var(--delay-lashes) ease-in-out; 
                }
                .eye-open .pwd-eye-pupil { opacity: 1; }
                .eye-close .pwd-eye-lashes {
                  animation: pwdScaleDown var(--duration-lashes) var(--duration-blink) ease-in-out; 
                }
                .eye-close .pwd-eye-pupil { opacity: 0; }
                
                @keyframes pwdScaleUp {
                  50% { transform: rotateX(180deg) scaleY(1.15); }
                  100% { transform: rotateX(180deg) scaleY(1); }
                }
                @keyframes pwdScaleDown {
                  50% { transform: scaleY(1.15); }
                  100% { transform: scaleY(1); }
                }
             `}} />
                        <svg className="pwd-eye overflow-visible w-full h-full" width="100%" height="100%" viewBox="-40 -200 360 400" xmlns="http://www.w3.org/2000/svg" strokeWidth="24" fill="none" stroke="currentColor">
                            <g className="pwd-eye-lashes">
                                <line x1="140" x2="140" y1="90" y2="160" />
                                <line x1="60" x2="10" y1="60" y2="120" />
                                <line x1="220" x2="270" y1="60" y2="120" />
                            </g>
                            <path className="pwd-eye-bottom" d="m0,0q140,160 280,0" />
                            <path className="pwd-eye-top" d="m0,0q140,160 280,0" />
                            <circle className="pwd-eye-pupil" cx="140" cy="0" r="40" fill="currentColor" stroke="none" />
                        </svg>
                    </div>
                </button>
            </div>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
