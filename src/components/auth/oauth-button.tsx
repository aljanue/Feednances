"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./icons/google-icon";
import { GitHubIcon } from "./icons/github-icon";

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
  const config = providerConfig[provider];
  const Icon = config.icon;

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
      onClick={() => signIn(provider, { callbackUrl })}
    >
      <Icon />
      <span className="ml-2 transition-all duration-300 group-hover:font-medium">
        {config.label}
      </span>
    </Button>
  );
}
