import { Skeleton } from "@/components/ui/skeleton";

export default function AverageCardSkeleton() {
  return (
    <div className="h-full w-full min-h-0 flex flex-col gap-6">
      <div className="space-y-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
