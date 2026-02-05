"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RegistrationSuccessAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [showAlert] = useState(() => searchParams.get("registered") === "true");

  useEffect(() => {
    if (showAlert) {
      router.replace("/login", { scroll: false });
    }
  }, [showAlert, router]);

  if (!showAlert) return null;

  return (
    <div className="mb-6 p-4 rounded-lg bg-linear-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-3 duration-500">
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-green-600 dark:text-green-400">Account created successfully!</span>
          <span className="text-xs text-muted-foreground">You can now sign in with your credentials.</span>
        </div>
      </div>
    </div>
  );
}
