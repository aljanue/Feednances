import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Dashboard | Feednances",
  description: "Manage your subscriptions and expenses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  // Check if user needs to complete first login setup
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (user?.firstLogin) {
    redirect("/configuration");
  }

  return (
    <>
      {children}
    </>
  );
}