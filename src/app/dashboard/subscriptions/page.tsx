import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getSubscriptionsPageData } from "@/lib/services/subscriptions";
import MainSection from "@/components/dashboard/main-section";
import TitleHeader from "@/components/dashboard/title-header";
import SubscriptionsLayout from "@/components/dashboard/subscriptions/subscriptions-layout";
import { NewSubscriptionButton } from "@/components/dashboard/subscriptions/new-subscription-button";
import { ExportButton } from "@/components/dashboard/export/ExportButton";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";

export default async function SubscriptionsPage() {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getSubscriptionsPageData(session.user.id);

  return (
    <MainSection>
      <div className="flex sm:items-center items-start justify-between gap-4 mb-4 sm:flex-row flex-col">
        <TitleHeader
          title="Subscriptions"
          description="Monitor and optimize your recurring expenditures."
          icon={<CalendarClock />}
        />
        <div className="flex items-center gap-3">
          <ExportButton
            data={{
              title: "Active Subscriptions",
              filename: `subscriptions_${format(new Date(), "yyyy-MM-dd")}`,
              columns: [
                { header: "Name", key: "name" },
                { header: "Category", key: "categoryName" },
                { header: "Frequency", key: "frequency" },
                { header: "Next Run", key: "formattedNextRun" },
                { header: "Amount", key: "formattedAmount" }
              ],
              data: data.subscriptions.map(s => ({
                ...s,
                categoryName: s.category?.name ?? "Uncategorized",
                frequency: `${s.timeValue} ${s.timeType}`,
                formattedNextRun: format(new Date(s.nextRun), "PP"),
                formattedAmount: `${Number(s.amount).toFixed(2)}`
              })),
              summary: {
                "Monthly Total": `${data.kpis.totalMonthlySpend.toFixed(2)}`,
                "Annual Projected": `${data.kpis.annualProjected.toFixed(2)}`,
                "Active Subscriptions": data.subscriptions.length
              }
            }}
          />
          <NewSubscriptionButton />
        </div>
      </div>

      <SubscriptionsLayout data={data} />
    </MainSection>
  );
}
