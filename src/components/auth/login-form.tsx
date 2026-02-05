"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SocialLoginButtons } from "./social-login-buttons";
import { RegistrationSuccessAlert } from "./registration-success-alert";

export function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome to <span className="text-primary"> Feednances</span></CardTitle>
        <CardDescription>
          Enter your email and password to access your dashboard and manage your finances with ease.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegistrationSuccessAlert />
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              autoComplete="username"
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="bg-background/50"
            />
          </div>
          
          {errorMessage && (
            <p className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              {errorMessage}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full shadow-lg shadow-primary/20" 
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>

          <SocialLoginButtons />
        </form>
      </CardContent>
    </Card>
  );
}