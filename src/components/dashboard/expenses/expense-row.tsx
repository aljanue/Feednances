"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ReceiptText, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TableCell, TableRow } from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotificationToast } from "@/components/shared/notification-toast";

import { formatCurrency } from "@/lib/utils/formatters";
import { deleteExpenseAction } from "@/lib/actions/expenses";
import type { ExpenseRowDTO } from "@/lib/dtos/expenses.dto";
import EditExpenseModal from "./edit-expense-modal";

interface ExpenseRowProps {
  expense: ExpenseRowDTO;
}

export default function ExpenseRow({ expense }: ExpenseRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const date = parseISO(expense.expenseDate);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteExpenseAction(expense.id);
      if (result.success) {
        toast.custom(() => (
          <NotificationToast
            title="Expense deleted"
            description={`"${expense.concept}" has been removed.`}
            type="success"
          />
        ));
        router.refresh();
      } else {
        toast.custom(() => (
          <NotificationToast
            title="Error"
            description={result.error || "Could not delete expense."}
            type="error"
          />
        ));
      }
    });
  };

  return (
    <TableRow className="group transition-all hover:bg-muted/30 border-b-muted/20">
      {/* Date */}
      <TableCell className="text-center py-4">
        <span className="text-sm font-medium text-muted-foreground/80">
          {format(date, "MMM d, yyyy")}
        </span>
      </TableCell>

      {/* Transaction */}
      <TableCell className="py-4">
        <div className="flex items-center gap-4">
          <ExpenseIcon isRecurring={expense.isRecurring} />
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
              {expense.concept}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell className="text-center hidden sm:table-cell py-4">
        <Badge
          variant="outline"
          className="text-[10px] uppercase tracking-wider font-bold py-0.5 px-2 bg-background/40 border-muted/30 shadow-sm"
        >
          <span
            className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]"
            style={{
              backgroundColor:
                expense.category.hexColor ?? "var(--foreground)",
            }}
          />
          {expense.category.name}
        </Badge>
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right py-4 pr-6">
        <span className="font-mono font-bold text-sm tracking-tighter text-foreground tabular-nums">
          {formatCurrency(expense.amount)}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right py-4 pr-4">
        <div className="flex items-center justify-end gap-1">
          <EditExpenseModal expense={expense} />
          <DeleteExpenseDialog
            concept={expense.concept}
            isPending={isPending}
            onConfirm={handleDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

// --- Subcomponents ---

function ExpenseIcon({ isRecurring }: { isRecurring: boolean }) {
  if (isRecurring) {
    return (
      <div className="hidden sm:flex size-9 rounded-lg bg-(--info)/10 border border-(--info)/20 items-center justify-center text-(--info) group-hover:scale-105 transition-transform">
        <RefreshCcw className="size-4" />
      </div>
    );
  }

  return (
    <div className="hidden sm:flex size-9 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center text-primary group-hover:scale-105 transition-transform">
      <ReceiptText className="size-4" />
    </div>
  );
}

function DeleteExpenseDialog({
  concept,
  isPending,
  onConfirm,
}: {
  concept: string;
  isPending: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={isPending}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{concept}&quot;? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
