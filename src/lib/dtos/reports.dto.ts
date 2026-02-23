export interface ReportKPI {
  title: string;
  value: number;
  change: number | null;
  diff: number | null;
  period: "month" | "year";
  subtitle?: string;
}

export interface MonthlyComparisonPoint {
  month: string;
  current: number;
  previous: number;
}

export interface CategorySpendingItem {
  name: string;
  total: number;
  color: string;
  percentage: number;
}

export interface DailySpendingPoint {
  date: string;
  label: string;
  total: number;
}

export interface SubscriptionCostItem {
  name: string;
  amount: number;
  category: string;
  color: string;
  percentage: number;
}

export interface TopExpenseItem {
  concept: string;
  amount: number;
  category: string;
  categoryColor: string | null;
  date: string;
}

export interface RecurringVsOneTimePoint {
  month: string;
  recurring: number;
  oneTime: number;
}

export interface SpendingPaceDTO {
  /** How many days have elapsed this month */
  daysElapsed: number;
  /** Total days in the current month */
  totalDays: number;
  /** Amount spent so far this month */
  currentSpend: number;
  /** Projected monthly total at current pace */
  projectedSpend: number;
  /** Last month's total spend (baseline) */
  lastMonthTotal: number;
  /** Daily average this month */
  dailyAverage: number;
}

// --- Chart date filter types ---

/** Preset range identifiers for chart filters */
export type ReportsPreset =
  | "this-month"
  | "last-month"
  | "last-7"
  | "last-30"
  | "last-90"
  | "this-year";

export const REPORTS_PRESET_LABELS: Record<ReportsPreset, string> = {
  "this-month": "This Month",
  "last-month": "Last Month",
  "last-7": "Last 7 Days",
  "last-30": "Last 30 Days",
  "last-90": "Last 90 Days",
  "this-year": "This Year",
};

/** Input filter from URL search params */
export interface ReportsChartFilter {
  preset?: string;
  dateFrom?: string;
  dateTo?: string;
}

/** Resolved filter state returned to the client */
export interface ReportsActiveChartFilter {
  preset: ReportsPreset | "custom";
  dateFrom: string;
  dateTo: string;
}

/** Panel IDs that support independent chart date filtering */
export type FilterablePanelId = "daily-spending" | "category-spending" | "top-expenses";

/** URL param prefixes for each filterable panel */
export const CHART_FILTER_PREFIXES: Record<FilterablePanelId, string> = {
  "daily-spending": "ds",
  "category-spending": "cs",
  "top-expenses": "te",
};

/** Per-panel chart filter input */
export type ReportsChartFilters = Partial<Record<FilterablePanelId, ReportsChartFilter>>;

/** Per-panel resolved filter output */
export type ReportsActiveChartFilters = Record<FilterablePanelId, ReportsActiveChartFilter>;

// --- Main DTO ---

export interface ReportsDTO {
  kpis: {
    monthlySpend: ReportKPI;
    yearlySpend: ReportKPI;
    avgTransaction: ReportKPI;
    subscriptionsCost: ReportKPI;
    transactionCount: ReportKPI;
    dailyAverage: ReportKPI;
    largestExpense: ReportKPI;
    recurringRatio: ReportKPI;
  };
  monthlyComparison: MonthlyComparisonPoint[];
  categorySpending: CategorySpendingItem[];
  dailySpending: DailySpendingPoint[];
  subscriptionCosts: SubscriptionCostItem[];
  topExpenses: TopExpenseItem[];
  recurringVsOneTime: RecurringVsOneTimePoint[];
  spendingPace: SpendingPaceDTO;
  chartFilters: ReportsActiveChartFilters;
}

/** Panel identifiers for the layout customization system */
export type ReportPanelId =
  | "monthly-comparison"
  | "category-spending"
  | "daily-spending"
  | "subscription-costs"
  | "top-expenses"
  | "recurring-vs-onetime"
  | "spending-pace";

export interface ReportPanelConfig {
  visiblePanels: ReportPanelId[];
  panelOrder: ReportPanelId[];
}

export const ALL_PANEL_IDS: ReportPanelId[] = [
  "monthly-comparison",
  "category-spending",
  "daily-spending",
  "recurring-vs-onetime",
  "spending-pace",
  "subscription-costs",
  "top-expenses",
];

export const PANEL_LABELS: Record<ReportPanelId, { title: string; subtitle: string; tooltip: string }> = {
  "monthly-comparison": {
    title: "Monthly Comparison",
    subtitle: "This year vs last year",
    tooltip: "Compare how much you spent each month this year versus the same month last year, so you can see if your spending is trending higher or lower.",
  },
  "category-spending": {
    title: "Spending by Category",
    subtitle: "Selected period",
    tooltip: "Shows how your spending breaks down across categories for the selected period. Larger sections represent where you spent the most.",
  },
  "daily-spending": {
    title: "Daily Spending",
    subtitle: "Selected period",
    tooltip: "See how much you spend each day within the selected range. Peaks indicate high-spend days, and valleys show low or no spending.",
  },
  "subscription-costs": {
    title: "Subscription Costs",
    subtitle: "Active subscriptions ranked by cost",
    tooltip: "Ranks your active subscriptions from highest to lowest monthly cost, helping you identify which ones cost you the most.",
  },
  "top-expenses": {
    title: "Top Expenses",
    subtitle: "Selected period",
    tooltip: "Lists the 5 most expensive individual transactions for the selected period, including their category and date.",
  },
  "recurring-vs-onetime": {
    title: "Recurring vs One-Time",
    subtitle: "Monthly breakdown of expense types",
    tooltip: "Breaks down your monthly expenses into recurring (fixed) costs and one-time purchases, so you can see how much of your budget is fixed.",
  },
  "spending-pace": {
    title: "Spending Pace",
    subtitle: "Projected spend vs last month",
    tooltip: "Shows your current spending pace this month. Projects how much you'll spend by month-end at the current rate, and compares it to last month.",
  },
};

/** IDs of panels that support chart date filtering */
export const FILTERABLE_PANELS: FilterablePanelId[] = [
  "daily-spending",
  "category-spending",
  "top-expenses",
];
