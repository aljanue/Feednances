import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";

import { getReportsData } from "@/lib/services/reports";
import ReportsLayout from "@/components/dashboard/reports/reports-layout";

export default async function ReportsPage() {
  noStore();

  const session = await auth();
  const headerList = await headers();
  const timeZone = headerList.get("x-vercel-ip-timezone") ?? "UTC";

  const data = session?.user?.id
    ? await getReportsData(session.user.id, timeZone)
    : null;

  if (!data) {
    return (
      <section className="h-full w-full flex flex-col gap-4">
        <div className="p-8 border border-solid border-muted bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">
            Unable to load reports data.
          </p>
        </div>
      </section>
    );
  }

  return <ReportsLayout data={data} />;
}
