"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "./category-dialog";

export function NewCategoryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="font-bold" onClick={() => setOpen(true)}>
        Add Category
      </Button>
      <CategoryDialog open={open} onOpenChange={setOpen} category={null} />
    </>
  );
}
