"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { updateExpenseAction } from "@/lib/actions/expenses";
import { getCategoriesAction } from "@/lib/actions/categories";
import { NotificationToast } from "@/components/shared/notification-toast";
import type { ExpenseRowDTO } from "@/lib/dtos/expenses.dto";

interface EditExpenseModalProps {
  expense: ExpenseRowDTO;
}

export default function EditExpenseModal({ expense }: EditExpenseModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    parseISO(expense.expenseDate),
  );
  const [categories, setCategories] = useState<{ id: string; name: string; hexColor: string | null }[]>(
    [],
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (open) {
      getCategoriesAction().then(setCategories);
      // Reset date to current expense date when opening
      setDate(parseISO(expense.expenseDate));
      setValidationErrors({});
    }
  }, [open, expense.expenseDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setValidationErrors({});

    startTransition(async () => {
      const result = await updateExpenseAction(expense.id, formData);
      if (result.success) {
        toast.custom(() => (
          <NotificationToast
            title="Expense updated"
            description={`"${formData.get("concept")}" has been updated.`}
            type="success"
          />
        ));
        setOpen(false);
        router.refresh();
      } else if (result.fieldErrors) {
        setValidationErrors(result.fieldErrors);
      } else {
        toast.custom(() => (
          <NotificationToast
            title="Error updating expense"
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
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="size-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Update the details of this expense.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="expenseDate"
            value={date ? format(date, "yyyy-MM-dd") : ""}
          />

          <div className="grid gap-4 py-4">
            {/* Concept */}
            <div className="grid gap-2">
              <Label htmlFor="edit-concept">Concept</Label>
              <Input
                id="edit-concept"
                name="concept"
                placeholder="Groceries, rent, etc."
                defaultValue={expense.concept}
                disabled={isPending}
                required
              />
              {validationErrors.concept && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.concept}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={expense.amount}
                disabled={isPending}
                required
              />
              {validationErrors.amount && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.amount}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                name="category"
                defaultValue={expense.category.id}
                disabled={isPending}
                required
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full shadow-sm"
                          style={{
                            backgroundColor: cat.hexColor ?? "var(--foreground)",
                          }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.category && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.category}
                </p>
              )}
            </div>

            {/* Date Picker */}
            <div className="grid gap-2">
              <Label htmlFor="edit-expenseDate">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isPending}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      validationErrors.expenseDate &&
                        "border-destructive text-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) =>
                      d > new Date() || d < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.expenseDate && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.expenseDate}
                </p>
              )}
            </div>
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
