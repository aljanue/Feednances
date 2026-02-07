import { Skeleton } from "@/components/ui/skeleton";

export default function GraphCardSkeleton() {
  return (
    <div className="h-full w-full min-h-0 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-44" />
        </div>
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <Skeleton className="h-[clamp(200px,26vw,260px)] w-full rounded-2xl" />
      </div>
    </div>
  );
}
