"use client";

import { useTransition, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { deleteCategoryAction, toggleCategoryAction } from "@/lib/actions/categories";
import { CategoryDialog } from "./category-dialog";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    hexColor: string | null;
    userId: string | null;
    active: boolean | null;
    expenseCount: number;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isDefault = category.userId === null;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (result.success) {
        toast.success("Category deleted");
      } else {
        toast.error(result.error || "Failed to delete category");
      }
      setIsDeleteDialogOpen(false);
    });
  };

  const handleToggleActive = (checked: boolean) => {
    startTransition(async () => {
      const result = await toggleCategoryAction(category.id, checked);
      if (result.success) {
        toast.success(checked ? "Category enabled" : "Category disabled");
      } else {
        toast.error(result.error || "Failed to toggle category");
      }
    });
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col justify-between rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden",
          category.active === false && "opacity-75 grayscale-[0.5]"
        )}
      >
        {/* Color Accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: category.hexColor || "var(--muted)" }}
        />

        <div className="flex flex-col justify-between h-full p-5 pl-7">
          <div className="flex items-start justify-between grow">
            <div className="flex flex-col gap-2 justify-between items-start h-full">
              <h3 className="font-semibold text-lg leading-none tracking-tight text-foreground/90">
                {category.name}
              </h3>
              {isDefault && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-gray-500/10">
                  Default
                </span>
              )}
              <div className="text-sm text-muted-foreground">
                {category.expenseCount} transactions
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t mt-2">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full opacity-70"
                style={{ backgroundColor: category.hexColor || "var(--muted)" }}
              />
              <span className="text-sm text-muted-foreground">
                {isDefault ? "Default" : (category.active !== false ? "Active" : "Inactive")}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {!isDefault && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Switch
                          checked={category.active !== false}
                          onCheckedChange={handleToggleActive}
                          disabled={isPending}
                          className="scale-90 data-[state=checked]:bg-primary/80"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle to enable/disable this category in selectors.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!isDefault && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDefault ? "Delete" : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <CategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={category}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {isDefault
                ? `This will delete the default category "${category.name}". It will no longer appear in your selectors, but existing expenses with this category will remain unchanged.`
                : `This action cannot be undone. This will permanently delete the category "${category.name}". Any expenses associated with this category will be uncategorized (but not deleted).`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
