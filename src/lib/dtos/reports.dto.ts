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
    tooltip: "Compara cuánto has gastado cada mes de este año frente al mismo mes del año pasado. Así puedes ver si estás gastando más o menos que antes.",
  },
  "category-spending": {
    title: "Spending by Category",
    subtitle: "Year to date",
    tooltip: "Muestra cómo se reparten tus gastos del año entre las distintas categorías. Las secciones más grandes representan donde más dinero has gastado.",
  },
  "daily-spending": {
    title: "Daily Spending",
    subtitle: "This month",
    tooltip: "Visualiza cuánto gastas cada día del mes actual. Los picos indican días con gastos elevados, y los valles días con poco o ningún gasto.",
  },
  "subscription-costs": {
    title: "Subscription Costs",
    subtitle: "Active subscriptions ranked by cost",
    tooltip: "Ordena tus suscripciones activas de mayor a menor coste mensual. Te ayuda a identificar cuáles te están costando más dinero al mes.",
  },
  "top-expenses": {
    title: "Top Expenses",
    subtitle: "Most expensive transactions this month",
    tooltip: "Lista los 5 gastos individuales más caros de este mes, con su categoría y fecha. Útil para identificar gastos puntuales importantes.",
  },
  "recurring-vs-onetime": {
    title: "Recurring vs One-Time",
    subtitle: "Monthly breakdown of expense types",
    tooltip: "Separa tus gastos mensuales en recurrentes (que se repiten cada mes) y puntuales (gastos únicos). Te permite ver qué parte de tu presupuesto es fija.",
  },
  "spending-pace": {
    title: "Spending Pace",
    subtitle: "Projected spend vs last month",
    tooltip: "Muestra a qué ritmo estás gastando este mes. El indicador proyecta cuánto gastarás a final de mes si sigues al mismo ritmo, y lo compara con el mes anterior.",
  },
};
