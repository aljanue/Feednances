"use client";

import { Search, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { parseISO, format } from "date-fns";

import type { ExpensesFilterParams } from "@/lib/dtos/expenses.dto";
import type { CategoryDTO } from "@/lib/dtos/dashboard";

interface ExpensesFilterBarProps {
  filters: ExpensesFilterParams;
  categories: CategoryDTO[];
  hasActiveFilters: boolean;
  onNavigate: (overrides: Record<string, string | undefined>) => void;
  onClear: () => void;
}

export default function ExpensesFilterBar({
  filters,
  categories,
  hasActiveFilters,
  onNavigate,
  onClear,
}: ExpensesFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-muted/20 p-3 rounded-xl border border-muted/30">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onNavigate({ search: (fd.get("search") as string) || undefined });
          }}
        >
          <Input
            name="search"
            placeholder="Search transactions..."
            defaultValue={filters.search ?? ""}
            className="pl-9 h-10 border-muted/40 bg-background/50 focus-visible:ring-primary/20 transition-all"
          />
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category filter */}
        <Select
          value={filters.categoryId ?? "all"}
          onValueChange={(val) =>
            onNavigate({ category: val === "all" ? undefined : val })
          }
        >
          <SelectTrigger className="w-[180px] h-10 border-muted/40 bg-background/50">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-popover/95 backdrop-blur-md">
            <SelectItem value="all" className="font-medium text-muted-foreground">All Categories</SelectItem>
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

        {/* Date Filter */}
        <DatePickerWithRange
          date={{
            from: filters.dateFrom ? parseISO(filters.dateFrom) : undefined,
            to: filters.dateTo ? parseISO(filters.dateTo) : undefined,
          }}
          onSelect={(range) => {
            if (range?.from) {
              onNavigate({
                dateFrom: format(range.from, "yyyy-MM-dd"),
                dateTo: range.to ? format(range.to, "yyyy-MM-dd") : undefined,
              });
            } else {
              onNavigate({ dateFrom: undefined, dateTo: undefined });
            }
          }}
          className="w-full lg:w-auto"
        />
      </div>
    </div>
  );
}
