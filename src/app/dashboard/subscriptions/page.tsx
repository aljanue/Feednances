import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getSubscriptionsPageData } from "@/lib/services/subscriptions";
import MainSection from "@/components/dashboard/main-section";
import TitleHeader from "@/components/dashboard/title-header";
import SubscriptionsLayout from "@/components/dashboard/subscriptions/subscriptions-layout";
import { NewSubscriptionButton } from "@/components/dashboard/subscriptions/new-subscription-button";
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
      <div className="flex items-center justify-between gap-4 mb-4">
        <TitleHeader
          title="Subscriptions"
          description="Monitor and optimize your recurring expenditures."
          icon={<CalendarClock />}
        />
        <div className="flex items-center gap-3">
          <NewSubscriptionButton />
        </div>
      </div>

      <SubscriptionsLayout data={data} />
    </MainSection>
  );
}
