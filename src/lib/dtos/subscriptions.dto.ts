import { z } from "zod";

export interface SubscriptionDetailDTO {
  id: string;
  name: string;
  amount: number;
  category: {
    id: string;
    name: string;
    hexColor: string | null;
  };
  active: boolean;
  nextRun: string; // ISO string
  nextDate: string; // ISO string matching SubscriptionDTO
  startsAt: string; // ISO string
  timeUnitId: string;
  timeValue: number;
  timeType: string;
}

export interface SubscriptionsPageDataDTO {
  kpis: {
    totalMonthlySpend: number;
    spendChangeMonth?: number;
    spendDiffMonth?: number;
    
    activeSubscriptions: number;
    activeChangeMonth?: number;
    activeDiffMonth?: number;
    
    annualProjected: number;
    projectedChangeMonth?: number;
    projectedDiffMonth?: number;
  };
  subscriptions: SubscriptionDetailDTO[];
}
