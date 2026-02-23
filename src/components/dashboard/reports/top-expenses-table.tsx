"use client";

import { format } from "date-fns";
import type { TopExpenseItem } from "@/lib/dtos/reports.dto";
import { formatCurrency } from "@/lib/utils/formatters";

interface TopExpensesTableProps {
  data: TopExpenseItem[];
}

export default function TopExpensesTable({ data }: TopExpensesTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground italic">
          No expenses yet this month.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] pb-3">
              Concept
            </th>
            <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] pb-3">
              Category
            </th>
            <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] pb-3">
              Date
            </th>
            <th className="text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] pb-3">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((expense, i) => (
            <tr
              key={`${expense.concept}-${i}`}
              className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td className="py-3 pr-4">
                <span className="text-foreground font-medium truncate block max-w-[180px]">
                  {expense.concept}
                </span>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: expense.categoryColor || "var(--muted-foreground)",
                    }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {expense.category}
                  </span>
                </div>
              </td>
              <td className="py-3 pr-4 text-muted-foreground text-xs whitespace-nowrap">
                {format(new Date(expense.date), "MMM d")}
              </td>
              <td className="py-3 text-right font-semibold tabular-nums">
                {formatCurrency(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
