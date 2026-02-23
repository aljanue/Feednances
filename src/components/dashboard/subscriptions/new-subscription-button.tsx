"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NewSubscriptionModal from "./new-subscription-modal";

export function NewSubscriptionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="font-bold shrink-0" onClick={() => setOpen(true)}>
        New Subscription
      </Button>
      <NewSubscriptionModal open={open} onOpenChange={setOpen} />
    </>
  );
}
