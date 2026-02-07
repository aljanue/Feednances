"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "bg-card text-foreground border border-muted shadow-lg rounded-xl",
          title: "text-sm font-semibold",
          description: "text-xs text-muted-foreground",
        },
      }}
    />
  );
}
