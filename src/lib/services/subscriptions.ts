import { getUserSubscriptions } from "@/lib/data/subscriptions.queries";
import type { SubscriptionsPageDataDTO, SubscriptionDetailDTO } from "@/lib/dtos/subscriptions.dto";
import { formatTimeAbbreviationByType } from "@/utils/format-data.utils";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number.parseFloat(value);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return (current - previous) / previous;
}

// Convert a subscription to a normalized monthly cost based on its frequency
function getMonthlyCost(amount: number, frequencyValue: number, timeUnitValue: string): number {
  const value = frequencyValue || 1;
  switch (timeUnitValue.toLowerCase()) {
    case "d":
    case "days":
    case "day":
      return (amount / value) * 30.44; // average days in month
    case "w":
    case "weeks":
    case "week":
      return (amount / value) * 4.345; // average weeks in month
    case "m":
    case "months":
    case "month":
      return amount / value;
    case "y":
    case "years":
    case "year":
      return amount / (value * 12);
    default:
      return amount; // Fallback
  }
}

export async function getSubscriptionsPageData(userId: string): Promise<SubscriptionsPageDataDTO> {
  const subscriptionsRaw = await getUserSubscriptions(userId);

  let totalMonthlySpend = 0;
  let activeCount = 0;
  
  let totalMonthlySpendLastMonth = 0;
  let activeCountLastMonth = 0;
  
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const subscriptions: SubscriptionDetailDTO[] = subscriptionsRaw.map((sub) => {
    const amountNum = toNumber(sub.amount);
    
    // Default to 'm' if timeUnit is missing, though it shouldn't be
    const timeUnitVal = sub.timeUnit?.value ?? "m"; 

    if (sub.active) {
      activeCount++;
      const monthlyCost = getMonthlyCost(amountNum, sub.frequencyValue, timeUnitVal);
      totalMonthlySpend += monthlyCost;
      
      // Compare startsAt to see if it was active a month ago
      if (new Date(sub.startsAt) <= oneMonthAgo) {
        activeCountLastMonth++;
        totalMonthlySpendLastMonth += monthlyCost;
      }
    }

    return {
      id: sub.id,
      name: sub.name,
      amount: amountNum,
      category: {
        id: sub.category?.id || "uncategorized",
        name: sub.category?.name || "Uncategorized",
        hexColor: sub.category?.hexColor || null,
      },
      active: sub.active ?? true,
      nextRun: sub.nextRun.toISOString(),
      nextDate: sub.nextRun.toISOString(),
      startsAt: (sub.startsAt || sub.nextRun).toISOString(),
      timeUnitId: sub.timeUnitId,
      timeValue: sub.frequencyValue,
      timeType: sub.timeUnit ? formatTimeAbbreviationByType(sub.timeUnit.value) : "m",
    };
  });

  const annualProjected = totalMonthlySpend * 12;
  const annualProjectedLastMonth = totalMonthlySpendLastMonth * 12;

  const spendChangeMonth = percentChange(totalMonthlySpend, totalMonthlySpendLastMonth) ?? undefined;
  const spendDiffMonth = totalMonthlySpendLastMonth ? totalMonthlySpend - totalMonthlySpendLastMonth : undefined;

  const activeChangeMonth = percentChange(activeCount, activeCountLastMonth) ?? undefined;
  const activeDiffMonth = activeCountLastMonth ? activeCount - activeCountLastMonth : undefined;

  const projectedChangeMonth = percentChange(annualProjected, annualProjectedLastMonth) ?? undefined;
  const projectedDiffMonth = annualProjectedLastMonth ? annualProjected - annualProjectedLastMonth : undefined;

  return {
    kpis: {
      totalMonthlySpend,
      spendChangeMonth,
      spendDiffMonth,
      activeSubscriptions: activeCount,
      activeChangeMonth,
      activeDiffMonth,
      annualProjected,
      projectedChangeMonth,
      projectedDiffMonth,
    },
    subscriptions,
  };
}
