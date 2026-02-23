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

import { createSubscriptionAction } from "@/lib/actions/subscriptions";
import { getCategoriesAction } from "@/lib/actions/categories";
import { getTimeUnitsAction } from "@/lib/actions/time-units";
import { NotificationToast } from "@/components/shared/notification-toast";

interface NewSubscriptionModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  asCard?: boolean;
}

export default function NewSubscriptionModal({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  asCard = false
}: NewSubscriptionModalProps = {}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const setOpen = (newOpen: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [categories, setCategories] = useState<{ id: string; name: string; hexColor: string | null }[]>([]);
  const [timeUnits, setTimeUnits] = useState<{ id: string; name: string; value: string }[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const [showPastDateAlert, setShowPastDateAlert] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (open) {
      getCategoriesAction().then(setCategories);
      getTimeUnitsAction().then(setTimeUnits);
    }
  }, [open]);

  const submitSubscription = (formData: FormData, recordPastPayment: boolean) => {
    if (recordPastPayment) {
      formData.set("recordPastPayment", "true");
    }

    startTransition(async () => {
      const result = await createSubscriptionAction({}, formData);
      if (result.success) {
        toast.custom(() => (
          <NotificationToast
            title="Subscription created"
            description="Your new subscription has been saved."
            type="success"
          />
        ));

        setOpen(false);
        setDate(new Date());
        formRef.current?.reset();
        mutate("/api/user/me");
        router.refresh();
      } else if (result.fieldErrors) {
        setValidationErrors(result.fieldErrors);
      } else {
        toast.custom(() => (
          <NotificationToast
            title="Error creating subscription"
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
      {asCard && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 border-dashed hover:bg-muted/50 w-full"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-medium">Add New Subscription</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>New Subscription</DialogTitle>
          <DialogDescription>
            Add a new recurring expense for your records.
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
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="frequencyValue">Repeats Every</Label>
                <Input
                  id="frequencyValue"
                  name="frequencyValue"
                  type="number"
                  min="1"
                  defaultValue="1"
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
                <Select name="timeUnitId" disabled={isPending} required>
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
              {isPending ? "Creating..." : "Save Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Past Date Selected Alert Dialog */}
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
              No, just set up
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
