"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  createExpenseAction,
  type CreateExpenseActionState,
} from "@/lib/actions/expenses";
import type { NotificationsResponseDTO } from "@/lib/dtos/notifications";
import { NotificationToast } from "@/components/shared/notification-toast";

export default function NewExpenseModal() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const [state, dispatch] = useActionState(
    createExpenseAction,
    {} as CreateExpenseActionState,
  );

  const handleFormAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createExpenseAction(state, formData);
      
      if (result.success) {
        toast.custom(
          () => (
            <NotificationToast
              title="Expense created"
              description="Your expense has been added successfully."
              type="success"
            />
          ),
          { duration: 3500 },
        );

        if (result.notification) {
          mutate(
            "/api/notifications",
            (current: NotificationsResponseDTO | undefined) => {
              if (!current) return current;
              return {
                ...current,
                items: [result.notification, ...current.items].slice(0, 10),
              };
            },
            { revalidate: false },
          );
        }

        mutate("/api/notifications");
        setOpen(false);
        setDate(undefined);
        formRef.current?.reset();
        router.refresh();
      } else if (result.error) {
        toast.custom(
          () => (
            <NotificationToast
              title="Expense failed"
              description={result.error}
              type="error"
            />
          ),
          { duration: 4000 },
        );

        if (result.notification) {
          mutate(
            "/api/notifications",
            (current: NotificationsResponseDTO | undefined) => {
              if (!current) return current;
              return {
                ...current,
                items: [result.notification, ...current.items].slice(0, 10),
              };
            },
            { revalidate: false },
          );
        }

        mutate("/api/notifications");
        dispatch(formData);
      } else {
        dispatch(formData); 
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
        
        <form 
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleFormAction(formData);
          }}
        >
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
                required
              />
              {state?.fieldErrors?.concept && (
                <p className="text-sm text-red-500">{state.fieldErrors.concept}</p>
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
                required
              />
              {state?.fieldErrors?.amount && (
                <p className="text-sm text-red-500">{state.fieldErrors.amount}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                placeholder="Food, Transport, etc."
                required
              />
              {state?.fieldErrors?.category && (
                <p className="text-sm text-red-500">{state.fieldErrors.category}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expenseDate">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-red-500 mb-4">{state.error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !date}>
              {isPending ? "Creating..." : "Create Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}