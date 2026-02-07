import { Skeleton } from "@/components/ui/skeleton";

export default function NumberCardSkeleton() {
  return (
    <div className="h-full w-full flex flex-col gap-6 justify-between">
      <div className="flex items-center justify-between gap-6">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-12 w-48" />
      <div className="pt-6 mt-2 border-t border-solid border-muted">
        <Skeleton className="h-4 w-56" />
      </div>
    </div>
  );
}
