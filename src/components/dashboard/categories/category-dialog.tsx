"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./color-picker";
import {
  createCategoryAction,
  updateCategoryAction,
  CategoryActionState,
} from "@/lib/actions/categories";
import { createCategorySchema } from "@/lib/validations/category";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: {
    id: string;
    name: string;
    hexColor: string | null;
  } | null;
}

const initialState: CategoryActionState = {};

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [hexColor, setHexColor] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // We use key to force reset state when category changes
  const [state, formAction] = useActionState(
    category
      ? updateCategoryAction.bind(null, category.id)
      : createCategoryAction,
    initialState
  );

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setHexColor(category?.hexColor ?? null);
    }
  }, [open, category]);

  useEffect(() => {
    if (state.success) {
      toast.success(
        category ? "Category updated successfully" : "Category created successfully"
      );
      onOpenChange(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, onOpenChange, category]);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      // Append color manually since it's not a standard input
      if (hexColor) {
        formData.append("hexColor", hexColor);
      }
      formAction(formData);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "New Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Make changes to your category here."
              : "Add a new category to organize your expenses."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {state.fieldErrors?.name && (
              <p className="text-sm font-medium text-destructive">
                {state.fieldErrors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <ColorPicker
              value={hexColor}
              onChange={setHexColor}
              error={state.fieldErrors?.hexColor}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <SubmitButton isPending={isPending} isEditing={!!category} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton({
  isPending,
  isEditing,
}: {
  isPending: boolean;
  isEditing: boolean;
}) {
  const { pending } = useFormStatus();
  const isLoading = isPending || pending;

  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? "Save Changes" : "Create Category"}
    </Button>
  );
}
