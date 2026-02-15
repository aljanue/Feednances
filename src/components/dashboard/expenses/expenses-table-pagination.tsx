"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpensesTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ExpensesTablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: ExpensesTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {Math.max(1, totalPages)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
