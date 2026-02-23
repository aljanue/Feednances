import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";

import { getReportsData } from "@/lib/services/reports";
import ReportsLayout from "@/components/dashboard/reports/reports-layout";
import SectionCard from "@/components/shared/section-card";
import type { ReportsChartFilters } from "@/lib/dtos/reports.dto";
import { CHART_FILTER_PREFIXES } from "@/lib/dtos/reports.dto";
import type { FilterablePanelId } from "@/lib/dtos/reports.dto";

interface ReportsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

/** Parse per-panel chart filter params from the URL using prefixes like ds_, cs_, te_ */
function parseChartFilters(params: Record<string, string | undefined>): ReportsChartFilters {
  const filters: ReportsChartFilters = {};

  for (const [panelId, prefix] of Object.entries(CHART_FILTER_PREFIXES)) {
    const preset = params[`${prefix}_preset`];
    const dateFrom = params[`${prefix}_from`];
    const dateTo = params[`${prefix}_to`];

    if (preset || dateFrom || dateTo) {
      filters[panelId as FilterablePanelId] = { preset, dateFrom, dateTo };
    }
  }

  return filters;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  noStore();

  const session = await auth();
  const headerList = await headers();
  const timeZone = headerList.get("x-vercel-ip-timezone") ?? "UTC";

  const params = await searchParams;
  const chartFilters = parseChartFilters(params);

  const data = session?.user?.id
    ? await getReportsData(session.user.id, timeZone, chartFilters)
    : null;

  if (!data) {
    return (
      <section className="h-full w-full flex flex-col gap-4">
        <SectionCard padding="spacious">
          <p className="text-sm text-muted-foreground">
            Unable to load reports data.
          </p>
        </SectionCard>
      </section>
    );
  }

  return <ReportsLayout data={data} />;
}
