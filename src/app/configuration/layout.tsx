import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/data/users.queries";

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

  const user = await getUserById(session.user.id);

  if (user && !user.firstLogin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
