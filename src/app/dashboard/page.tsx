import AverageCard from "@/components/dashboard/cards/average-card";
import GraphCard from "@/components/dashboard/cards/graph-card";
import NumberCard from "@/components/dashboard/cards/number-card";
import RecentExpensesCard from "@/components/dashboard/cards/recent-expenses-card";
import SubscriptionsCard from "@/components/dashboard/cards/subscriptions-card";

export default function HomePage() {
  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="flex md:flex-row flex-col gap-4">
        <div className="flex-1 md:max-w-107 max-w-full flex flex-col gap-4">
          <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg flex flex-col">
            <NumberCard />
          </div>
          <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg grow flex flex-col">
            <AverageCard />
          </div>
        </div>
        <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg flex-1 flex flex-col">
          <GraphCard />
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse gap-4">
        <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg md:max-w-sm max-w-full flex flex-col">
          <SubscriptionsCard />
        </div>
        <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg flex-1 min-h-62 flex flex-col">
          <RecentExpensesCard />
        </div>
      </div>
    </section>
  );
}
