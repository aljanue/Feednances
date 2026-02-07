"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
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

import { createExpenseAction } from "@/lib/actions/expenses";
import type {
  NotificationItemDTO,
  NotificationsResponseDTO,
} from "@/lib/dtos/notifications";
import { NotificationToast } from "@/components/shared/notification-toast";

export default function NewExpenseModal() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  // Estados locales
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement | null>(null);

  // Helper para la actualización optimista (DRY)
  const updateNotificationsCache = (newNotification: NotificationItemDTO) => {
    mutate(
      "/api/user/me", // ⚠️ IMPORTANTE: Asegúrate que esta clave coincide con la de NotificationsMenu
      (
        current: NotificationsResponseDTO | undefined,
      ): NotificationsResponseDTO | undefined => {
        if (!current) return undefined;
        return {
          ...current,
          unreadCount: (current.unreadCount || 0) + 1, // Incrementamos contador optimista
          latestNotifications: [
            newNotification,
            ...current.latestNotifications,
          ].slice(0, 10),
        };
      },
      { revalidate: false },
    );
  };

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

        // Actualización Optimista de SWR
        if (result.notification) {
          updateNotificationsCache(result.notification);
        }

        // Limpieza y Cierre
        setOpen(false);
        setDate(undefined);
        formRef.current?.reset();

        // Revalidación real en segundo plano
        mutate("/api/user/me");
        router.refresh(); // Actualiza las gráficas del dashboard
      } else if (result.fieldErrors) {
        // ⚠️ ERRORES DE VALIDACIÓN (Zod)
        setValidationErrors(result.fieldErrors);
      } else {
        // ❌ ERROR GENÉRICO (Base de datos, etc.)
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
          {/* Input oculto para la fecha */}
          <input
            type="hidden"
            name="expenseDate"
            value={date ? format(date, "yyyy-MM-dd") : ""}
          />

          <div className="grid gap-4 py-4">
            {/* Concepto */}
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

            {/* Cantidad */}
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

            {/* Categoría */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                placeholder="Food, Transport, etc."
                disabled={isPending}
                required
              />
              {validationErrors.category && (
                <p className="text-sm font-medium text-destructive">
                  {validationErrors.category}
                </p>
              )}
            </div>

            {/* Selector de Fecha */}
            <div className="grid gap-2">
              <Label htmlFor="expenseDate">Date</Label>
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
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
              {isPending ? "Creating..." : "Create Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
