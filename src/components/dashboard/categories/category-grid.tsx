"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "./category-card";
import { CategoryDialog } from "./category-dialog";

interface CategoryGridProps {
  categories: {
    id: string;
    name: string;
    hexColor: string | null;
    userId: string | null;
    active: boolean | null;
    expenseCount: number;
  }[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           {/* Header is handled in page, but we can add controls here if needed */}
        </div>
        <Button className="font-bold" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
        
        <Button
          variant="outline"
          className="flex h-auto min-h-[100px] flex-col items-center justify-center gap-2 border-dashed hover:bg-muted/50"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Plus className="h-5 w-5" />
          </div>
          <span className="font-medium">Add New Category</span>
        </Button>
      </div>

      <CategoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        category={null}
      />
    </div>
  );
}
