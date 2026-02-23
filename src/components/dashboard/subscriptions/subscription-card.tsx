"use client";

import { useTransition } from "react";
import { format, differenceInDays } from "date-fns";
import { MoreHorizontal, Loader2, Play, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationToast } from "@/components/shared/notification-toast";
import { formatCurrency } from "@/lib/utils/formatters";
import type { SubscriptionDetailDTO } from "@/lib/dtos/subscriptions.dto";
import { deleteSubscriptionAction, toggleSubscriptionAction } from "@/lib/actions/subscriptions";

interface SubscriptionCardProps {
  subscription: SubscriptionDetailDTO;
}

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleSubscriptionAction(subscription.id, !subscription.active);
      if (result.success) {
        toast.custom(() => (
          <NotificationToast
            title={`Subscription ${!subscription.active ? "enabled" : "disabled"}`}
            description={`"${subscription.name}" has been ${!subscription.active ? "enabled" : "disabled"}.`}
            type="success"
          />
        ));
      } else {
        toast.custom(() => (
          <NotificationToast
            title="Error"
            description={result.error || "Could not update subscription."}
            type="error"
          />
        ));
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSubscriptionAction(subscription.id);
      if (result.success) {
        toast.custom(() => (
          <NotificationToast
            title="Subscription deleted"
            description={`"${subscription.name}" has been removed.`}
            type="success"
          />
        ));
      } else {
        toast.custom(() => (
          <NotificationToast
            title="Error"
            description={result.error || "Could not delete subscription."}
            type="error"
          />
        ));
      }
    });
  };

  const nextRunDate = new Date(subscription.nextRun);
  const daysUntilNextRun = differenceInDays(nextRunDate, new Date());
  
  const isApproaching = daysUntilNextRun >= 0 && daysUntilNextRun <= 3;
  const isOverdue = daysUntilNextRun < 0;

  return (
    <div className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
      subscription.active 
        ? "bg-card border-border/50 hover:border-border hover:shadow-md" 
        : "bg-card/40 border-border/30 opacity-70 grayscale-[0.3]"
    }`}>
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="size-10 rounded-xl shadow-sm flex items-center justify-center font-bold text-white text-sm"
            style={{ backgroundColor: subscription.category.hexColor || "var(--primary)" }}
          >
            {subscription.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground tracking-tight line-clamp-1">{subscription.name}</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {subscription.category.name}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleToggle} disabled={isPending} className="cursor-pointer">
              {subscription.active ? (
                <>
                  <Pause className="mr-2 size-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 size-4" /> Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 size-4" /> Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete subscription</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{subscription.name}&quot;?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => handleDelete()}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Middle Cost Section */}
      <div className="flex flex-col mb-6">
        <span className="text-xs text-muted-foreground font-medium mb-1">Cost</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight tabular-nums">
            {formatCurrency(subscription.amount)}
          </span>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-0.5">
            Next Billing
          </span>
          <span className="text-sm font-medium tabular-nums">
            {format(nextRunDate, "MMM dd, yyyy")}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
           <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-0.5">
            Plan
          </span>
           <span className="text-sm font-medium">
            {subscription.timeValue} {subscription.timeType}
          </span>
        </div>
      </div>

      {/* Badges / Status Indicators */}
      {subscription.active ? (
        <div className="absolute top-4 right-14">
           {isApproaching && (
             <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
               {daysUntilNextRun === 0 ? "Tomorrow" : `In ${daysUntilNextRun} day${daysUntilNextRun !== 1 ? "s" : ""}`}
             </Badge>
           )}
           {isOverdue && (
             <Badge variant="destructive" className="shadow-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
               Overdue
             </Badge>
           )}
        </div>
      ) : (
        <div className="absolute top-4 right-14">
           <Badge variant="secondary" className="shadow-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider opacity-80">
             Paused
           </Badge>
        </div>
      )}
    </div>
  );
}
