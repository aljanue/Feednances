import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | Feednances",
  description: "Manage your subscriptions and expenses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_token");

  if (!session) redirect("/login");

  return (
    <>
      {children}
    </>
  );
}