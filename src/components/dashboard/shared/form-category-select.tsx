"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  hexColor: string | null;
}

interface FormCategorySelectProps {
  categories: Category[];
  isPending: boolean;
  error?: string;
  defaultValue?: string;
}

export function FormCategorySelect({
  categories,
  isPending,
  error,
  defaultValue,
}: FormCategorySelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Category</Label>
      <Select name="category" disabled={isPending} required defaultValue={defaultValue}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              <div className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full shadow-sm"
                  style={{
                    backgroundColor: cat.hexColor ?? "var(--foreground)",
                  }}
                />
                {cat.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
