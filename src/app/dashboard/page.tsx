import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";

import AverageCard from "@/components/dashboard/cards/average-card";
import GraphCard from "@/components/dashboard/cards/graph-card";
import NumberCard from "@/components/dashboard/cards/number-card";
import RecentExpensesCard from "@/components/dashboard/cards/recent-expenses-card";
import SubscriptionsCard from "@/components/dashboard/cards/subscriptions-card";
import SectionCard from "@/components/shared/section-card";
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
        <SectionCard padding="spacious">
          <p className="text-sm text-muted-foreground">
            Unable to load dashboard data.
          </p>
        </SectionCard>
      </section>
    );
  }

  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="flex md:flex-row flex-col gap-4">
        <div className="flex-1 md:max-w-107 max-w-full flex flex-col gap-4">
          <SectionCard padding="spacious" className="overflow-x-auto flex flex-col">
            <NumberCard data={dashboardData.numberCard} />
          </SectionCard>
          <SectionCard padding="spacious" className="overflow-x-auto grow flex flex-col">
            <AverageCard data={dashboardData.averageCard} />
          </SectionCard>
        </div>
        <SectionCard padding="spacious" className="overflow-x-auto flex-1 flex flex-col">
          <GraphCard dataByRange={dashboardData.graphCard} />
        </SectionCard>
      </div>
      <div className="flex md:flex-row flex-col-reverse gap-4">
        <SectionCard className="overflow-x-auto xl:min-w-84 lg:min-w-72 min-w-auto md:max-w-sm max-w-full flex flex-col">
          <SubscriptionsCard items={dashboardData.subscriptions} />
        </SectionCard>
        <SectionCard className="overflow-x-auto flex-1 min-h-62 flex flex-col">
          <RecentExpensesCard items={dashboardData.recentExpenses} />
        </SectionCard>
      </div>
    </section>
  );
}
