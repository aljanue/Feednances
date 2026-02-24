"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./icons/google-icon";
import { GitHubIcon } from "./icons/github-icon";
import { Loader2 } from "lucide-react";

type OAuthProvider = "google" | "github";

interface OAuthButtonProps {
  provider: OAuthProvider;
  callbackUrl?: string;
}

const providerConfig = {
  google: {
    icon: GoogleIcon,
    label: "Sign in with Google",
  },
  github: {
    icon: GitHubIcon,
    label: "Sign in with GitHub",
  },
};

export function OAuthButton({ provider, callbackUrl = "/dashboard" }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = providerConfig[provider];
  const Icon = config.icon;

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl });
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      className="w-full group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
      onClick={handleSignIn}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
          <Icon />
      )}
      <span className="ml-2 transition-all duration-300 group-hover:font-medium">
        {isLoading ? "Connecting..." : config.label}
      </span>
    </Button>
  );
}
