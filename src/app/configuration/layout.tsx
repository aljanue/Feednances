import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Setup | Feednances",
  description: "Configure your integrations and shortcuts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ConfigurationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (user && !user.firstLogin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
