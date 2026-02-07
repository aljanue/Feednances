import AverageCardSkeleton from "@/components/dashboard/cards/skeletons/average-card-skeleton";
import GraphCardSkeleton from "@/components/dashboard/cards/skeletons/graph-card-skeleton";
import NumberCardSkeleton from "@/components/dashboard/cards/skeletons/number-card-skeleton";
import RecentExpensesSkeleton from "@/components/dashboard/cards/skeletons/recent-expenses-skeleton";
import SubscriptionsSkeleton from "@/components/dashboard/cards/skeletons/subscriptions-skeleton";

export default function DashboardLoading() {
  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="flex md:flex-row flex-col gap-4">
        <div className="flex-1 md:max-w-107 max-w-full flex flex-col gap-4">
          <div className="p-8 border border-solid border-muted bg-card rounded-lg">
            <NumberCardSkeleton />
          </div>
          <div className="p-8 border border-solid border-muted bg-card rounded-lg">
            <AverageCardSkeleton />
          </div>
        </div>
        <div className="p-8 border border-solid border-muted bg-card rounded-lg flex-1">
          <GraphCardSkeleton />
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse gap-4">
        <div className="p-6 xl:min-w-84 lg:min-w-72 min-w-auto border border-solid border-muted bg-card rounded-lg md:max-w-sm max-w-full">
          <SubscriptionsSkeleton />
        </div>
        <div className="p-6 border border-solid border-muted bg-card rounded-lg flex-1 min-h-62">
          <RecentExpensesSkeleton />
        </div>
      </div>
    </section>
  );
}
