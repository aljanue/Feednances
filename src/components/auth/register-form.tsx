// components/auth/register-form.tsx
"use client";

import { useActionState, useState, useMemo } from "react";
import { registerUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

function CheckIcon({ valid, invalid }: { valid: boolean; invalid?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] transition-all duration-200 ${
      valid 
        ? "bg-green-500/20 text-green-500" 
        : invalid 
          ? "bg-destructive/20 text-destructive"
          : "bg-muted text-muted-foreground"
    }`}>
      {valid ? "✓" : invalid ? "✗" : "○"}
    </span>
  );
}

export function RegisterForm() {
  const [state, dispatch, isPending] = useActionState(registerUser, null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const usernameValidation = useMemo(() => ({
    noSpaces: !/\s/.test(username),
    hasSpaces: /\s/.test(username),
  }), [username]);

  const passwordValidation = useMemo(() => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>\[\]\\;'`~_+\-=/]/.test(password),
  }), [password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isUsernameValid = username.length > 0 && usernameValidation.noSpaces;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const allFieldsFilled = username.length > 0 && fullName.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0;
  const canSubmit = allFieldsFilled && isUsernameValid && isPasswordValid && passwordsMatch;

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Register to start managing your expenses smartly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              name="username" 
              placeholder="e.g. john_doe" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={username.length > 0 ? (isUsernameValid ? "border-green-500/50" : "border-destructive/50") : ""}
            />
            <div className={`flex items-center gap-2 text-[10px] ${usernameValidation.hasSpaces ? "text-destructive" : "text-muted-foreground"}`}>
              <CheckIcon valid={username.length > 0 && usernameValidation.noSpaces} invalid={usernameValidation.hasSpaces} />
              <span>No spaces allowed</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Name & Surname</Label>
            <Input 
              id="fullName" 
              name="fullName" 
              placeholder="e.g. John Doe" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="e.g. john@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password.length > 0 ? (isPasswordValid ? "border-green-500/50" : "border-destructive/50") : ""}
            />
            <div className="grid grid-cols-2 gap-1 mt-2">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <CheckIcon valid={passwordValidation.minLength} />
                <span>Min 8 characters</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <CheckIcon valid={passwordValidation.hasUppercase} />
                <span>Uppercase letter</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <CheckIcon valid={passwordValidation.hasLowercase} />
                <span>Lowercase letter</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <CheckIcon valid={passwordValidation.hasNumber} />
                <span>Number</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground col-span-2">
                <CheckIcon valid={passwordValidation.hasSpecial} />
                <span>Special character (!@#$%...)</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Repeat Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={confirmPassword.length > 0 ? (passwordsMatch ? "border-green-500/50" : "border-destructive/50") : ""}
            />
            {confirmPassword.length > 0 && (
              <div className={`flex items-center gap-2 text-[10px] ${passwordsMatch ? "text-green-500" : "text-destructive"}`}>
                <CheckIcon valid={passwordsMatch} invalid={!passwordsMatch} />
                <span>{passwordsMatch ? "Passwords match" : "Passwords don't match"}</span>
              </div>
            )}
          </div>
          
          {state?.error && (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending || !canSubmit}>
            {isPending ? "Creating account..." : "Register"}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}