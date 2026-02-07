import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionsSkeleton() {
  return (
    <div className="h-full w-full flex flex-col gap-6">
      <div className="flex items-center justify-between gap-8">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`subscription-skeleton-${index}`}
            className="flex items-center justify-between rounded-lg border border-muted/50 p-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
