import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getManagementCategories } from "@/lib/data/categories.queries";
import { CategoryGrid } from "@/components/dashboard/categories/category-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Fiscal Flow",
  description: "Manage your expense categories",
};

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const categories = await getManagementCategories(session.user.id);

  return (
    <section className="h-full w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage your expense categories. Default categories cannot be modified.
        </p>
      </div>

      <CategoryGrid categories={categories} />
    </section>
  );
}
