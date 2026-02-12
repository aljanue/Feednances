import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import DashboardNavbar from "@/components/dashboard/navbar";
import DashboardTopbar from "@/components/dashboard/topbar";

export const metadata = {
  title: "Dashboard | Feednances",
  description: "Manage your subscriptions and expenses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Categories", href: "/dashboard/categories" },
    { name: "Expenses", href: "/dashboard/expenses" },
    { name: "Subscriptions", href: "/dashboard/subscriptions" },
    { name: "Reports", href: "/dashboard/reports" },
    { name: "Settings", href: "/dashboard/settings" },
  ];
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (user?.firstLogin) {
    redirect("/configuration");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {" "}
      <DashboardNavbar
        username={user?.username ?? ""}
        fullName={user?.fullName ?? ""}
        menuItems={menuItems}
      />
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {" "}
        <DashboardTopbar
          menuItems={menuItems}
          username={user?.username ?? ""}
          fullName={user?.fullName ?? ""}
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
