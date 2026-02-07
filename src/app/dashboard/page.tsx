import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";

import AverageCard from "@/components/dashboard/cards/average-card";
import GraphCard from "@/components/dashboard/cards/graph-card";
import NumberCard from "@/components/dashboard/cards/number-card";
import RecentExpensesCard from "@/components/dashboard/cards/recent-expenses-card";
import SubscriptionsCard from "@/components/dashboard/cards/subscriptions-card";
import { getDashboardData } from "@/lib/services/dashboard";

export default async function HomePage() {
  noStore();

  const session = await auth();
  const headerList = await headers();
  const timeZone = headerList.get("x-vercel-ip-timezone") ?? "UTC";

  const dashboardData = session?.user?.id
    ? await getDashboardData(session.user.id, timeZone)
    : null;

  if (!dashboardData) {
    return (
      <section className="h-full w-full flex flex-col gap-4">
        <div className="p-8 border border-solid border-muted bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">
            Unable to load dashboard data.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="flex md:flex-row flex-col gap-4">
        <div className="flex-1 md:max-w-107 max-w-full flex flex-col gap-4">
          <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg flex flex-col">
            <NumberCard data={dashboardData.numberCard} />
          </div>
          <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg grow flex flex-col">
            <AverageCard data={dashboardData.averageCard} />
          </div>
        </div>
        <div className="p-8 border border-solid border-muted bg-card overflow-x-auto rounded-lg flex-1 flex flex-col">
          <GraphCard dataByRange={dashboardData.graphCard} />
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse gap-4">
        <div className="p-6 xl:min-w-84 lg:min-w-72 min-w-auto border border-solid border-muted bg-card overflow-x-auto rounded-lg md:max-w-sm max-w-full flex flex-col">
          <SubscriptionsCard items={dashboardData.subscriptions} />
        </div>
        <div className="p-6 border border-solid border-muted bg-card overflow-x-auto rounded-lg flex-1 min-h-62 flex flex-col">
          <RecentExpensesCard items={dashboardData.recentExpenses} />
        </div>
      </div>
    </section>
  );
}
