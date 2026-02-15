export type TimeRangeValue =
  | "last-month"
  | "last-3-months"
  | "last-6-months"
  | "last-year";

export interface ExpenseTrendPoint {
  label: string;
  total: number;
}

export interface CategoryBreakdownItem {
  id: string;
  category: string;
  total: number;
  color: string;
}

export interface FixedVariablePoint {
  label: string;
  fixed: number;
  variable: number;
}

export interface TopSubscriptionItem {
  name: string;
  total: number;
}

export interface GraphRangeData {
  expenseTrends: ExpenseTrendPoint[];
  categoryBreakdown: CategoryBreakdownItem[];
  fixedVariable: FixedVariablePoint[];
  topSubscriptions: TopSubscriptionItem[];
  totals: {
    expenseTrends: number;
    categoryBreakdown: number;
    fixedVariable: number;
    topSubscriptions: number;
  };
}

export type GraphCardData = Record<TimeRangeValue, GraphRangeData>;

export type NumberCardMetricKey =
  | "total"
  | "monthly"
  | "subsTotal"
  | "subsMonthly";

export interface NumberCardMetric {
  title: string;
  value: number;
  period: "month" | "year";
  changeMonth?: number;
  changeYear?: number;
  diffMonth?: number;
  diffYear?: number;
}

export interface NumberCardDTO {
  metrics: Record<NumberCardMetricKey, NumberCardMetric>;
}

export interface AverageCardDTO {
  label: string;
  value: number;
  currentMonthTotal: number;
  percentageDiff: number;
}

export interface CategoryDTO {
  id: string;
  name: string;
  hexColor: string | null;
}

export interface RecentExpenseDTO {
  id: string;
  concept: string;
  amount: number;
  category: CategoryDTO;
  expenseDate: string;
  isRecurring: boolean;
}

export interface SubscriptionDTO {
  id: string;
  name: string;
  amount: number;
  category: CategoryDTO;
  active: boolean;
  nextDate: string;
  timeValue: number;
  timeType: string;
}

export interface DashboardDTO {
  numberCard: NumberCardDTO;
  averageCard: AverageCardDTO;
  graphCard: GraphCardData;
  recentExpenses: RecentExpenseDTO[];
  subscriptions: SubscriptionDTO[];
}
