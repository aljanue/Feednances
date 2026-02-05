"use client";

import { useRouter } from "next/navigation";
import { ConfigurationCard } from "./configuration-card";

export function ShortcutsCard() {
  const router = useRouter();

  const icon = (
    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const features = [
    "Log expenses and subscriptions via Siri",
    "Quick access from home screen",
    "Secure authentication",
  ];

  return (
    <ConfigurationCard
      icon={icon}
      title="iOS Shortcuts"
      description="Generate your secret key and install the shortcut to track expenses directly from your iPhone."
      features={features}
      buttonText="Configure Shortcuts"
      onButtonClick={() => router.push("/configuration/shortcuts")}
      iconBgColor="bg-linear-to-br from-primary/20 to-primary/5"
      iconColor="text-primary"
      borderHoverColor="hover:border-primary/30"
      shadowHoverColor="hover:shadow-primary/10"
      buttonBorderColor="border-primary/30"
      buttonHoverBgColor="hover:bg-primary/5"
    />
  );
}
