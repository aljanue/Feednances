import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getSafeUserSettings } from "@/lib/data/users.queries";
import MainSection from "@/components/dashboard/main-section";
import TitleHeader from "@/components/dashboard/title-header";
import { Settings } from "lucide-react";
import SettingsLayout from "@/components/dashboard/settings/settings-layout";

export default async function SettingsPage() {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const safeUserData = await getSafeUserSettings(session.user.id);

  if (!safeUserData) {
    redirect("/login");
  }

  console.log(safeUserData);
  return <MainSection>
    <TitleHeader
      title="Settings"
      description="Manage your account settings and preferences."
      icon={<Settings />}
    />
    <SettingsLayout user={safeUserData} />
  </MainSection>;
}
