"use client";

import { UserSettingsDTO } from "@/lib/dtos/user";
import InfoContainer from "./info-container";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition, useState, useEffect } from "react";
import { updatePreferencesAction } from "@/lib/actions/users";
import { toast } from "sonner";
import { Globe, Coins } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  user: UserSettingsDTO;
}

export default function Preferences({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    currency: user.currency || "EUR",
    timeZone: user.timeZone || "UTC",
  });

  useEffect(() => {
    setFormData({
      currency: user.currency || "EUR",
      timeZone: user.timeZone || "UTC",
    });
  }, [user.currency, user.timeZone]);

  const hasChanged =
    formData.currency !== (user.currency || "EUR") ||
    formData.timeZone !== (user.timeZone || "UTC");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append("currency", formData.currency);
    data.append("timeZone", formData.timeZone);

    startTransition(async () => {
      const result = await updatePreferencesAction({ success: false }, data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      currency: user.currency || "EUR",
      timeZone: user.timeZone || "UTC",
    });
  };

  return (
    <InfoContainer title="Regional & Formatting">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Currency Section */}
        <div className="grid gap-6 md:grid-cols-3 py-6 border-b border-border/50">
          <div className="md:col-span-1 space-y-1">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" /> Default Currency
            </h3>
            <p className="text-sm text-muted-foreground mr-4 leading-relaxed">
              Select the currency used to display all expenses, subscriptions, and reports across your dashboard.
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col justify-center">
            <div className="w-full max-w-md">
              <Label htmlFor="currency" className="sr-only">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(val) => setFormData((p) => ({ ...p, currency: val }))}
                disabled={isPending}
              >
                <SelectTrigger id="currency" className={cn("bg-background", isPending && "opacity-50")}>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                  <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                  <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                  <SelectItem value="CHF">Swiss Franc (Fr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Timezone Section */}
        <div className="grid gap-6 md:grid-cols-3 py-6">
          <div className="md:col-span-1 space-y-1">
             <h3 className="font-medium text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Time Zone
            </h3>
            <p className="text-sm text-muted-foreground mr-4 leading-relaxed">
              Set your local time zone. This ensures that subscription renewals and monthly expenses align correctly with your calendar.
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col justify-center">
             <div className="w-full max-w-md">
              <Label htmlFor="timeZone" className="sr-only">Time Zone</Label>
              <Select
                value={formData.timeZone}
                onValueChange={(val) => setFormData((p) => ({ ...p, timeZone: val }))}
                disabled={isPending}
              >
                <SelectTrigger id="timeZone" className={cn("bg-background", isPending && "opacity-50")}>
                  <SelectValue placeholder="Select a time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Universal Time)</SelectItem>
                  <SelectItem value="Europe/Madrid">Europe/Madrid (CET/CEST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</SelectItem>
                </SelectContent>
              </Select>
             </div>
          </div>
        </div>

        {hasChanged && (
          <div className="flex justify-end gap-3 pt-6 border-t border-border/50 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </InfoContainer>
  );
}
