import { format, parseISO } from "date-fns";
import { ReceiptText, ArrowUpRight, RefreshCcw } from "lucide-react";
import type { RecentExpenseDTO } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface RecentExpensesCardProps {
  items: RecentExpenseDTO[];
}

export default function RecentExpensesCard({ items }: RecentExpensesCardProps) {
  return (
    <div className="h-full w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Last Expenses
        </h2>
        <Link href="/dashboard/expenses" className="font-semibold text-primary hover:underline underline-offset-6 text-md">
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl bg-muted/5">
          <p className="text-sm text-muted-foreground">
            No recent expenses to show.
          </p>
        </div>
      ) : (
        <div className="rounded-md overflow-hidden bg-card/30">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-75">Transaction</TableHead>
                <TableHead className="table-cell text-center">
                  Category
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((expense) => {
                const date = parseISO(expense.expenseDate);

                return (
                  <TableRow
                    key={expense.id}
                    className="group transition-colors"
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        {expense.isRecurring ? (
                          <div className="hidden sm:flex size-9 rounded-lg bg-(--info)/10 border border-(--info)/20 items-center justify-center text-(--info) group-hover:scale-105 transition-transform">
                            <RefreshCcw className="size-4" />
                          </div>
                        ) : (
                          <div className="hidden sm:flex size-9 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center text-primary group-hover:scale-105 transition-transform">
                            <ReceiptText className="size-4" />
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="font-medium text-sm leading-none mb-1">
                            {expense.concept}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {format(date, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="table-cell text-center">
                      <Badge
                        variant="outline"
                        className="text-xs capitalize bg-background/50"
                      >
                        {expense.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right py-3">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-sm tracking-tight text-foreground">
                          {formatCurrency(expense.amount)}
                        </span>
                        <div className="flex items-center text-[10px] text-emerald-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="size-3 mr-0.5" />
                          Processed
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
