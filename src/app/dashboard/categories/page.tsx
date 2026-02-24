import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getManagementCategories } from "@/lib/data/categories.queries";
import { CategoryGrid } from "@/components/dashboard/categories/category-grid";
import { NewCategoryButton } from "@/components/dashboard/categories/new-category-button";
import { Metadata } from "next";
import TitleHeader from "@/components/dashboard/title-header";
import MainSection from "@/components/dashboard/main-section";
import { Tags } from "lucide-react";

export const metadata: Metadata = {
  title: "Categories | Feednances",
  description: "Manage your expense categories",
};

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const categories = await getManagementCategories(session.user.id);

  return (
    <MainSection>
      <div className="flex items-center justify-between gap-4">
        <TitleHeader
          title="Categories"
          description="Manage your expense categories. Default categories cannot be modified."
          icon={<Tags />}
        />
        <NewCategoryButton />
      </div>

      <CategoryGrid categories={categories} />
    </MainSection>
  );
}
