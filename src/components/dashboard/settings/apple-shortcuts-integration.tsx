"use client";

import { UserSettingsDTO } from "@/lib/dtos/user";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";
import { generateApiKeyAction, deleteApiKeyAction } from "@/lib/actions/users";
import { toast } from "sonner";
import { KeyRound, Sparkles, Copy, ExternalLink, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  user: UserSettingsDTO;
}

export default function AppleShortcutsIntegration({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  const handleGenerateApiKey = () => {
    startTransition(async () => {
      const result = await generateApiKeyAction();
      if (result.success && result.key) {
        toast.success(result.message);
        setNewApiKey(result.key);
      } else {
        toast.error(result.message || "Failed to generate API Key");
      }
    });
  };

  const handleDeleteApiKey = () => {
    startTransition(async () => {
      const result = await deleteApiKeyAction();
      if (result.success) {
        toast.success(result.message);
        setNewApiKey(null);
      } else {
        toast.error(result.message || "Failed to delete API Key");
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between ml-14">
        <div className="flex items-center gap-4 -ml-14">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-md font-medium">Apple Shortcuts</h4>
            <p className="text-sm text-muted-foreground">
              Connect your iOS devices using our official shortcut.
            </p>
          </div>
        </div>

        {!newApiKey && !user.hasApiKey && (
          <Button variant="outline" onClick={handleGenerateApiKey} disabled={isPending}>
            Generate API Key
          </Button>
        )}
      </div>

      {(newApiKey || user.hasApiKey) && (
        <div className="ml-14 space-y-4">
          {newApiKey ? (
            <div className="p-4 border rounded-md bg-muted/50 space-y-3">
              <p className="text-sm font-medium text-amber-500 flex items-center gap-2">
                ⚠️ Copy this key now. You won&apos;t be able to see it again!
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-background border rounded font-mono text-sm break-all">
                  {newApiKey}
                </code>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(newApiKey)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : user.hasApiKey ? (
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center justify-between p-3 border rounded-md bg-muted/20">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <code className="text-sm text-muted-foreground text-ellipsis overflow-hidden hidden sm:inline-block">
                    ff_live-••••••••••••••••••••••••••••••••
                  </code>
                  <code className="text-sm text-muted-foreground sm:hidden">ff_live-••••••••</code>
                </div>
                <Button variant="ghost" size="sm" onClick={handleGenerateApiKey} disabled={isPending}>
                  Regenerate
                </Button>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your active Apple Shortcuts API Key, breaking any shortcuts using it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleDeleteApiKey}
                    >
                      Delete Key
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}

          <div className="flex items-center gap-2 pt-2">
            <Button variant="secondary" className="w-fit" asChild>
              <a
                href="https://www.icloud.com/shortcuts/e7560ae3d4804005bab592f33a4b1d31"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download iOS Shortcut <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
