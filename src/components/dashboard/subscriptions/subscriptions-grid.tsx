"use client";

import SubscriptionCard from "./subscription-card";
import type { SubscriptionDetailDTO } from "@/lib/dtos/subscriptions.dto";
import NewSubscriptionModal from "./new-subscription-modal";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionsGridProps {
  subscriptions: SubscriptionDetailDTO[];
}

export default function SubscriptionsGrid({ subscriptions }: SubscriptionsGridProps) {

  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <AnimatePresence mode="popLayout">
        {subscriptions.map((sub) => (
          <motion.div
            key={sub.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <SubscriptionCard subscription={sub} />
          </motion.div>
        ))}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <NewSubscriptionModal asCard />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
