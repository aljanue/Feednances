"use client";

import { OAuthButton } from "./oauth-button";

interface SocialLoginButtonsProps {
  callbackUrl?: string;
}

export function SocialLoginButtons({ callbackUrl = "/dashboard" }: SocialLoginButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <OAuthButton provider="google" callbackUrl={callbackUrl} />
      <OAuthButton provider="github" callbackUrl={callbackUrl} />
    </div>
  );
}
