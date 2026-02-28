"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, KeyRound, MessageCircle, Globe, X, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dismissProfileSetupBannerAction } from "@/lib/actions/users";
import Link from "next/link";
import { toast } from "sonner";
import { NotificationToast } from "@/components/shared/notification-toast";

interface ProfileSetupBannerProps {
  hasPassword: boolean;
  hasSecretKey: boolean;
  hasTelegram: boolean;
  className?: string;
}

export function ProfileSetupBanner({
  hasPassword,
  hasSecretKey,
  hasTelegram,
  className = "",
}: ProfileSetupBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  // If they have all core features configured, do not render anything
  if (hasPassword && hasSecretKey && hasTelegram) {
    return null;
  }

  const handleDismiss = () => {
    // Session only dismiss
    setIsVisible(false);
  };

  const handleDontShowAgain = () => {
    // Optimistic UI update
    setIsVisible(false);

    startTransition(async () => {
      const result = await dismissProfileSetupBannerAction();
      if (!result.success) {
        // Revert on failure
        setIsVisible(true);
        toast.custom(() => (
          <NotificationToast
            title="Unable to dismiss banner"
            description="Please try again later."
            type="error"
          />
        ));
      }
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative w-full mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-background via-primary/5 to-background shadow-lg dark:shadow-primary/5 ${className}`}
        >
          {/* Decorative background elements */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative p-5 sm:p-6 flex flex-col gap-5">
            
            {/* Content Area */}
            <div className="space-y-3">
              <div className="space-y-1 pr-6">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  Complete your profile setup
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Unlock the full potential of your Fiscal Flow experience. We highly recommend configuring the following features to secure your account and access advanced integrations.
                </p>
              </div>

              {/* Mobile Toggle Button */}
              <div className="sm:hidden pt-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex justify-between items-center"
                >
                  <span className="font-medium text-foreground">{isExpanded ? 'Hide' : 'View'} missing features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </div>

              {/* Badges / Checkmarks Grid - Hidden on mobile unless expanded */}
              <AnimatePresence>
                {(isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 640)) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 overflow-hidden sm:!h-auto sm:!opacity-100"
                  >
                    
                    <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${hasPassword ? 'bg-primary/5 border-primary/10 text-primary' : 'bg-muted/50 border-border/50 text-muted-foreground'}`}>
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">Account Password</span>
                      {!hasPassword && (
                        <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Missing</span>
                      )}
                    </div>

                    <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${hasSecretKey ? 'bg-primary/5 border-primary/10 text-primary' : 'bg-muted/50 border-border/50 text-muted-foreground'}`}>
                      <KeyRound className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">iOS Shortcut Key</span>
                      {!hasSecretKey && (
                        <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Missing</span>
                      )}
                    </div>

                    <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${hasTelegram ? 'bg-primary/5 border-primary/10 text-primary' : 'bg-muted/50 border-border/50 text-muted-foreground'}`}>
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">Telegram Bot Link</span>
                      {!hasTelegram && (
                        <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Missing</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-muted/50 border-border/50 text-foreground">
                      <Globe className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm font-medium">Regional Settings</span>
                      <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 text-muted-foreground">Review</span>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="font-semibold">
                <Link href="/dashboard/settings">
                  Go to Settings
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleDontShowAgain}
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground font-medium"
              >
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Don't show again
              </Button>
            </div>

            {/* Close Button absolute on desktop, relative on mobile if needed */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-muted-foreground hover:bg-muted/80 rounded-full w-8 h-8"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
