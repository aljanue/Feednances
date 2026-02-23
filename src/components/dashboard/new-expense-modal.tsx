"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { createExpenseAction } from "@/lib/actions/expenses";
import { getCategoriesAction } from "@/lib/actions/categories";
import { NotificationToast } from "@/components/shared/notification-toast";
import { FormCategorySelect } from "@/components/dashboard/shared/form-category-select";
import { FormDatePicker } from "@/components/dashboard/shared/form-date-picker";

export default function NewExpenseModal() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [categories, setCategories] = useState<{ id: string; name: string; hexColor: string | null }[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (open) {
      getCategoriesAction().then(setCategories);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setValidationErrors({});

    startTransition(async () => {
      const result = await createExpenseAction({}, formData);
      if (result.success) {
        toast.custom(() => (
          <NotificationToast
            title="Expense created"
            description="Your expense has been saved."
            type="success"
          />
        ));

        setOpen(false);
        setDate(undefined);
        formRef.current?.reset();
        mutate("/api/user/me");
        router.refresh();
      } else if (result.fieldErrors) {
        setValidationErrors(result.fieldErrors);
      } else {
        toast.custom(() => (
          <NotificationToast
            title="Error creating expense"
            description={result.error || "Something went wrong."}
            type="error"
          />
        ));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold">New Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to your records. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="expenseDate"
            value={date ? format(date, "yyyy-MM-dd") : ""}
          />

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="concept">Concept</Label>
              <Input
                id="concept"
                name="concept"
                placeholder="Groceries, rent, etc."
                disabled={isPending}
                required
              />
              {validationErrors.concept && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.concept}
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

            <FormDatePicker
              date={date}
              setDate={setDate}
              isPending={isPending}
              error={validationErrors.expenseDate}
              label="Date"
              name="expenseDate"
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
              {isPending ? "Creating..." : "Create Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
