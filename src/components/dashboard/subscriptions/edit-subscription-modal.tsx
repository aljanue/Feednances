"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCategorySelect } from "@/components/dashboard/shared/form-category-select";
import { FormDatePicker } from "@/components/dashboard/shared/form-date-picker";

import { editSubscriptionAction } from "@/lib/actions/subscriptions";
import { getCategoriesAction } from "@/lib/actions/categories";
import { getTimeUnitsAction } from "@/lib/actions/time-units";
import { NotificationToast } from "@/components/shared/notification-toast";
import type { SubscriptionDTO } from "@/lib/dtos/dashboard";

interface EditSubscriptionModalProps {
  subscription: SubscriptionDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSubscriptionModal({ 
  subscription,
  open, 
  onOpenChange
}: EditSubscriptionModalProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const setOpen = onOpenChange;

  const safeInitialDate = subscription.nextDate ? new Date(subscription.nextDate) : subscription.startsAt ? new Date(subscription.startsAt) : undefined;
  const initialDate = safeInitialDate && !isNaN(safeInitialDate.getTime()) ? safeInitialDate : new Date();

  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [categories, setCategories] = useState<{ id: string; name: string; hexColor: string | null }[]>([]);
  const [timeUnits, setTimeUnits] = useState<{ id: string; name: string; value: string }[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const [showPastDateAlert, setShowPastDateAlert] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (open) {
      if (subscription.nextDate) {
        const nextD = new Date(subscription.nextDate);
        setDate(!isNaN(nextD.getTime()) ? nextD : new Date());
      } else if (subscription.startsAt) {
        const startsD = new Date(subscription.startsAt);
        setDate(!isNaN(startsD.getTime()) ? startsD : new Date());
      } else {
        setDate(new Date());
      }

      getCategoriesAction().then(setCategories);
      getTimeUnitsAction().then(setTimeUnits);
    }
  }, [open, subscription]);

  const submitSubscription = (formData: FormData, recordPastPayment: boolean = false) => {
    formData.append("id", subscription.id);
    if (recordPastPayment) {
      formData.set("recordPastPayment", "true");
    }

    startTransition(async () => {
      const result = await editSubscriptionAction({}, formData);
      if (result.success) {
        toast.custom(() => (
          <NotificationToast
            title="Subscription updated"
            description="Your changes have been saved."
            type="success"
          />
        ));

        setOpen(false);
        formRef.current?.reset();
        mutate("/api/user/me");
        router.refresh();
      } else if (result.fieldErrors) {
        setValidationErrors(result.fieldErrors);
      } else {
        toast.custom(() => (
          <NotificationToast
            title="Error updating subscription"
            description={result.error || "Something went wrong."}
            type="error"
          />
        ));
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setValidationErrors({});

    const selectedDateStr = formData.get("startsAt")?.toString();
    if (selectedDateStr) {
      const selectedDate = new Date(selectedDateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      // Treat today as a past date to allow instant creation + scheduling
      if (selectedDate <= today) {
        setPendingFormData(formData);
        setShowPastDateAlert(true);
        return;
      }
    }

    submitSubscription(formData, false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Modify the details of your recurring expense.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Netflix, Spotify, Gym, etc."
                defaultValue={subscription.name}
                disabled={isPending}
                required
              />
              {validationErrors.name && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={subscription.amount.toString()}
                disabled={isPending}
                required
              />
              {validationErrors.amount && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.amount}
                </p>
              )}
            </div>

            <FormCategorySelect
              categories={categories}
              isPending={isPending}
              error={validationErrors.category}
              defaultValue={subscription.category.id}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="frequencyValue">Repeats Every</Label>
                <Input
                  id="frequencyValue"
                  name="frequencyValue"
                  type="number"
                  min="1"
                  defaultValue={subscription.timeValue.toString()}
                  disabled={isPending}
                  required
                />
                {validationErrors.frequencyValue && (
                  <p className="text-sm font-medium text-destructive">
                    {validationErrors.frequencyValue}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeUnitId">Period</Label>
                <Select name="timeUnitId" disabled={isPending} defaultValue={subscription.timeUnitId} required>
                  <SelectTrigger id="timeUnitId">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeUnits.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.timeUnitId && (
                  <p className="text-sm font-medium text-destructive">
                    {validationErrors.timeUnitId}
                  </p>
                )}
              </div>
            </div>

            <FormDatePicker
              date={date}
              setDate={setDate}
              isPending={isPending}
              error={validationErrors.startsAt}
              label="Next Billing Date / Start Date"
              name="startsAt"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !date}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={showPastDateAlert} onOpenChange={setShowPastDateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You selected a past date</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span>
                We noticed the start date for this subscription is in the past.
                We will automatically calculate your next billing cycle based on this date.
              </span>
              <span>
                <strong>Would you like us to also record expenses for all past billing cycles since that date?</strong>
                <br />
                <span className="text-xs text-muted-foreground mt-1 block">
                  (Note: If you have already recorded these payments previously, select &quot;No, just update next billing&quot; to avoid duplicating expenses).
                </span>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4 sm:justify-end">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setShowPastDateAlert(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                if (pendingFormData) submitSubscription(pendingFormData, false);
                setShowPastDateAlert(false);
              }}
            >
              No, just update next billing
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                if (pendingFormData) submitSubscription(pendingFormData, true);
                setShowPastDateAlert(false);
              }}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, record past payments
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
