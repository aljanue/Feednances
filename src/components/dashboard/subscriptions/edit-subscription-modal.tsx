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

  const safeInitialDate = subscription.startsAt ? new Date(subscription.startsAt) : undefined;
  const initialDate = safeInitialDate && !isNaN(safeInitialDate.getTime()) ? safeInitialDate : new Date();

  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [categories, setCategories] = useState<{ id: string; name: string; hexColor: string | null }[]>([]);
  const [timeUnits, setTimeUnits] = useState<{ id: string; name: string; value: string }[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (open) {
      getCategoriesAction().then(setCategories);
      getTimeUnitsAction().then(setTimeUnits);
    }
  }, [open]);

  const submitSubscription = (formData: FormData) => {
    formData.append("id", subscription.id);

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

    submitSubscription(formData);
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
    </Dialog>
  );
}
