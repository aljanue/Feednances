"use client";

import { UserSettingsDTO } from "@/lib/dtos/user";
import InfoContainer from "./info-container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Github, Chrome, Info } from "lucide-react";
import { useTransition, useState, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions/users";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  user: UserSettingsDTO;
}

export default function ProfileInfo({ user }: Props) {
  const hasGithub = user.connectedProviders.includes("github");
  const hasGoogle = user.connectedProviders.includes("google");

  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    username: user.username,
    fullName: user.fullName || "",
    email: user.email,
  });

  useEffect(() => {
    setFormData({
      username: user.username,
      fullName: user.fullName || "",
      email: user.email,
    });
  }, [user.username, user.fullName, user.email]);

  const hasChanged =
    formData.username !== user.username ||
    formData.fullName !== (user.fullName || "") ||
    formData.email !== user.email;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfileAction({ success: false }, data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      fullName: user.fullName || "",
      email: user.email,
    });
  };

  const initials = user.fullName
    ? user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase();

  return (
    <InfoContainer title="Profile Information">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b">
          <Avatar className="h-16 w-16 border border-primary/20">
            <AvatarImage src={user.image ?? undefined} alt={user.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{user.username}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
              placeholder="No full name set"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
        </div>
        {hasChanged && (
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Connected Accounts</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>To connect an account, simply log in using Google or GitHub with this same email address.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${hasGoogle ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 text-muted-foreground'}`}>
              <Chrome className="h-4 w-4" />
              <span>Google {hasGoogle ? 'Connected' : 'Not linked'}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${hasGithub ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 text-muted-foreground'}`}>
              <Github className="h-4 w-4" />
              <span>GitHub {hasGithub ? 'Connected' : 'Not linked'}</span>
            </div>
          </div>
        </div>


      </form>
    </InfoContainer>
  );
}
