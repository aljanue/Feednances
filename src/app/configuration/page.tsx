"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { completeConfiguration } from "@/lib/auth";
import { ShortcutsCard } from "@/components/configuration/shortcuts-card";
import { TelegramCard } from "@/components/configuration/telegram-card";

export default function ConfigurationPage() {
  const router = useRouter();
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      await completeConfiguration();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing configuration:", error);
      setIsSkipping(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto md:px-16 md:py-12 px-8 py-6 min-h-screen flex flex-col justify-between gap-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            Quick setup
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Feednances</span> 🎉
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Let&apos;s set up your account. Configure integrations now or skip
            and do it later from your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ShortcutsCard />
          <TelegramCard />
        </div>

        <div className="text-center pt-2">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleSkip}
            disabled={isSkipping}
          >
            {isSkipping ? "Completing setup..." : "Skip for now →"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            You can always configure these later in Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
