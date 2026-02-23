"use client";

import { UserSettingsDTO } from "@/lib/dtos/user";
import InfoContainer from "./info-container";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useTransition, useRef, useState, useMemo } from "react";
import { updatePasswordAction } from "@/lib/actions/users";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface Props {
  user: UserSettingsDTO;
}

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

export default function Security({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordValidation = useMemo(() => ({
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>\[\]\\;'`~_+\-=/]/.test(newPassword),
  }), [newPassword]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  
  const canSubmit = isPasswordValid && passwordsMatch && (!user.hasPassword || currentPassword.length > 0);

  const resetForm = () => {
    formRef.current?.reset();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updatePasswordAction({ success: false }, formData);
      if (result.success) {
        toast.success(result.message);
        resetForm();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <InfoContainer title="Security">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${user.hasPassword ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {user.hasPassword ? <ShieldCheck className="h-8 w-8" /> : <ShieldAlert className="h-8 w-8" />}
            </div>
            <div>
              <h3 className="text-lg font-medium">Password Settings</h3>
              <p className="text-sm text-muted-foreground">
                {user.hasPassword 
                  ? "Update your password to keep your account secure." 
                  : "You don't have a password yet. Create one to login with email."}
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              {user.hasPassword ? "Change Password" : "Create Password"}
            </Button>
          )}
        </div>

        {isEditing && (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {user.hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput 
                  id="currentPassword" 
                  name="currentPassword" 
                  required 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput 
                  id="newPassword" 
                  name="newPassword" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={newPassword.length > 0 ? (isPasswordValid ? "border-green-500/50" : "border-destructive/50") : ""}
                />
                {newPassword.length > 0 && (
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
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput 
                  id="confirmPassword" 
                  name="confirmPassword" 
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
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || !canSubmit}>
                  {isPending ? "Saving..." : (user.hasPassword ? "Save Password" : "Save Created Password")}
                </Button>
            </div>
          </form>
        )}
      </div>
    </InfoContainer>
  );
}
