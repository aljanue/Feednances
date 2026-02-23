"use client";

import { UserSettingsDTO } from "@/lib/dtos/user";
import { Button } from "@/components/ui/button";
import { useTransition, useState, useEffect } from "react";
import { unlinkTelegramAction } from "@/lib/actions/users";
import { toast } from "sonner";
import { Bot, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function TelegramIntegration({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isPolling, setIsPolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPolling && !user.telegramChatId) {
      intervalId = setInterval(() => {
        router.refresh();
      }, 3000); 
    }

    if (user.telegramChatId) {
      setIsPolling(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling, user.telegramChatId, router]);

  const handleUnlinkTelegram = () => {
    startTransition(async () => {
      const result = await unlinkTelegramAction();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to unlink Telegram");
      }
    });
  };

  const handleConnectClick = () => {
    setIsPolling(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between ml-14">
        <div className="flex items-center gap-4 -ml-14">
          <div className="h-10 w-10 rounded-full flex items-center justify-center md:bg-[#0088cc]/10 text-[#0088cc] bg-transparent">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-md font-medium flex items-center gap-2">
              Telegram Bot
              {user.telegramChatId && (
                <span className="flex items-center gap-1 text-[10px] font-medium bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Connected
                </span>
              )}
            </h4>
            <p className="text-sm text-muted-foreground">
              Receive real-time notifications about your subscriptions.
            </p>
          </div>
        </div>

        {user.telegramChatId ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Unlink
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unlink Telegram Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to decouple your Telegram account? You will stop receiving automated payment notifications immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleUnlinkTelegram}
                >
                  Unlink
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button variant="outline" asChild disabled={isPending || isPolling} onClick={handleConnectClick}>
            <a href={`https://t.me/feednances_bot?start=${user.id}`} target="_blank" rel="noopener noreferrer">
              {isPolling ? "Connecting..." : "Connect Telegram"}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
