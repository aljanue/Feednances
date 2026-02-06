import type { RecentExpenseDTO } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";

interface RecentExpensesCardProps {
  items: RecentExpenseDTO[];
}

export default function RecentExpensesCard({ items }: RecentExpensesCardProps) {
  return (
    <div className="h-full w-full flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Recent Expenses</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No recent expenses to show.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((expense) => (
            <div
              key={expense.id}
              className="flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{expense.concept}</p>
                <p className="text-xs text-muted-foreground">
                  {expense.category}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}