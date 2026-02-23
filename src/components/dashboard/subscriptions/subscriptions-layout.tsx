"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { SubscriptionsPageDataDTO } from "@/lib/dtos/subscriptions.dto";
import SubscriptionsKpiGrid from "./subscriptions-kpi-grid";
import SubscriptionsGrid from "./subscriptions-grid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SectionCard from "@/components/shared/section-card";
import { differenceInDays, isAfter } from "date-fns";

interface SubscriptionsLayoutProps {
  data: SubscriptionsPageDataDTO;
}

type TabType = "all" | "active" | "archived" | "soon";
type SortType = "highest_spend" | "lowest_spend" | "next_run" | "category" | "name";

const TABS: { value: TabType; label: string }[] = [
  { value: "all", label: "All Subscriptions" },
  { value: "active", label: "Active" },
  { value: "soon", label: "Renewals Soon" },
  { value: "archived", label: "Archived" },
];

export default function SubscriptionsLayout({ data }: SubscriptionsLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [sortBy, setSortBy] = useState<SortType>("highest_spend");

  // Filter subscriptions based on the active tab
  const filteredSubscriptions = useMemo(() => {
    return data.subscriptions.filter((sub) => {
      switch (activeTab) {
        case "active":
          return sub.active;
        case "archived":
          return !sub.active;
        case "soon": {
          if (!sub.active) return false;
          const daysUntil = differenceInDays(new Date(sub.nextRun), new Date());
          return daysUntil >= 0 && daysUntil <= 7; // Renewing soon within 7 days
        }
        case "all":
        default:
          return true;
      }
    });
  }, [data.subscriptions, activeTab]);

  // Sort the filtered subscriptions
  const sortedSubscriptions = useMemo(() => {
    return [...filteredSubscriptions].sort((a, b) => {
      switch (sortBy) {
        case "highest_spend":
          return b.amount - a.amount;
        case "lowest_spend":
          return a.amount - b.amount;
        case "next_run": {
          const dateA = new Date(a.nextRun).getTime();
          const dateB = new Date(b.nextRun).getTime();
          return dateA - dateB;
        }
        case "category":
          return a.category.name.localeCompare(b.category.name);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredSubscriptions, sortBy]);

  return (
    <SectionCard className="flex flex-col border-none bg-transparent shadow-none" padding="compact">
      <SubscriptionsKpiGrid kpis={data.kpis} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/40 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(val: string) => setActiveTab(val as TabType)}
            className="w-full sm:w-auto overflow-x-auto pb-2 -mb-2 sm:pb-0 sm:mb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <TabsList className="bg-transparent space-x-1 sm:space-x-2 h-auto p-0 flex-nowrap w-max">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground border border-transparent rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:text-foreground transition-all"
                >
                  {activeTab === tab.value && (
                    <motion.div
                      layoutId="activeSubscriptionTab"
                      className="absolute inset-0 bg-card border border-border/50 shadow-sm rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hidden sm:inline">Sort By:</span>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortType)}>
              <SelectTrigger className="w-[140px] sm:w-[160px] h-9 text-xs border-border/50 bg-card/50">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest_spend">Highest Spend</SelectItem>
                <SelectItem value="lowest_spend">Lowest Spend</SelectItem>
                <SelectItem value="next_run">Next Run</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <SubscriptionsGrid subscriptions={sortedSubscriptions} />
    </SectionCard>
  );
}
