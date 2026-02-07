import { Skeleton } from "@/components/ui/skeleton";

export default function RecentExpensesSkeleton() {
  return (
    <div className="h-full w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="rounded-md border border-muted/40 bg-card/30 p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`recent-expense-skeleton-${index}`}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
