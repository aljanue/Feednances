"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  CreditCard,
  Receipt,
  Repeat,
  Gauge,
  Eye,
  EyeOff,
  Settings2,
  GripVertical,
  X,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react";
import type { ReportsDTO, ReportPanelId, ReportPanelConfig } from "@/lib/dtos/reports.dto";
import { ALL_PANEL_IDS, PANEL_LABELS } from "@/lib/dtos/reports.dto";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReportKpiGrid from "./report-kpi-grid";
import MonthlyComparisonChart from "./monthly-comparison-chart";
import CategorySpendingChart from "./category-spending-chart";
import DailySpendingChart from "./daily-spending-chart";
import SubscriptionCostChart from "./subscription-cost-chart";
import TopExpensesTable from "./top-expenses-table";
import RecurringVsOneTimeChart from "./recurring-vs-onetime-chart";
import SpendingPaceCard from "./spending-pace-card";

const STORAGE_KEY = "reports-panel-config";

const PANEL_ICONS: Record<ReportPanelId, React.ReactNode> = {
  "monthly-comparison": <BarChart3 className="h-4 w-4" />,
  "category-spending": <PieChart className="h-4 w-4" />,
  "daily-spending": <TrendingUp className="h-4 w-4" />,
  "subscription-costs": <CreditCard className="h-4 w-4" />,
  "top-expenses": <Receipt className="h-4 w-4" />,
  "recurring-vs-onetime": <Repeat className="h-4 w-4" />,
  "spending-pace": <Gauge className="h-4 w-4" />,
};

function loadConfig(): ReportPanelConfig {
  if (typeof window === "undefined") {
    return { visiblePanels: [...ALL_PANEL_IDS], panelOrder: [...ALL_PANEL_IDS] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ReportPanelConfig;
      const merged = [...parsed.panelOrder];
      for (const id of ALL_PANEL_IDS) {
        if (!merged.includes(id)) merged.push(id);
      }
      return {
        visiblePanels: parsed.visiblePanels.filter((id) => ALL_PANEL_IDS.includes(id)),
        panelOrder: merged.filter((id) => ALL_PANEL_IDS.includes(id)),
      };
    }
  } catch {
    // Corrupted localStorage — ignore
  }
  return { visiblePanels: [...ALL_PANEL_IDS], panelOrder: [...ALL_PANEL_IDS] };
}

function saveConfig(config: ReportPanelConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Storage full or unavailable — ignore
  }
}

// --- Empty-state helpers ---

function hasData(data: ReportsDTO, panelId: ReportPanelId): boolean {
  switch (panelId) {
    case "monthly-comparison":
      return data.monthlyComparison.some((p) => p.current > 0 || p.previous > 0);
    case "category-spending":
      return data.categorySpending.length > 0;
    case "daily-spending":
      return data.dailySpending.some((p) => p.total > 0);
    case "subscription-costs":
      return data.subscriptionCosts.length > 0;
    case "top-expenses":
      return data.topExpenses.length > 0;
    case "recurring-vs-onetime":
      return data.recurringVsOneTime.some((p) => p.recurring > 0 || p.oneTime > 0);
    case "spending-pace":
      return data.spendingPace.currentSpend > 0 || data.spendingPace.lastMonthTotal > 0;
  }
}

const EMPTY_MESSAGES: Record<ReportPanelId, string> = {
  "monthly-comparison": "No monthly expense data to compare yet.",
  "category-spending": "Add categorized expenses to see your spending breakdown.",
  "daily-spending": "Log your first expense this month to see daily trends.",
  "subscription-costs": "No active subscriptions. Add one to track recurring costs.",
  "top-expenses": "No expenses recorded this month yet.",
  "recurring-vs-onetime": "Add recurring and one-time expenses to see the breakdown.",
  "spending-pace": "Start spending this month to see pace projections.",
};

// Which panels go side-by-side in a 2-col grid
const PAIRED_PANELS: [ReportPanelId, ReportPanelId][] = [
  ["category-spending", "daily-spending"],
  ["recurring-vs-onetime", "spending-pace"],
  ["subscription-costs", "top-expenses"],
];

// Full-width panels
const FULL_WIDTH_PANELS: ReportPanelId[] = ["monthly-comparison"];

interface ReportsLayoutProps {
  data: ReportsDTO;
}

export default function ReportsLayout({ data }: ReportsLayoutProps) {
  const [config, setConfig] = useState<ReportPanelConfig>(loadConfig);
  const [editOpen, setEditOpen] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [animationDir, setAnimationDir] = useState<"up" | "down" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Persist config changes
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const isVisible = useCallback(
    (id: ReportPanelId) => config.visiblePanels.includes(id),
    [config.visiblePanels],
  );

  const togglePanel = useCallback((id: ReportPanelId) => {
    setConfig((prev) => {
      const visible = prev.visiblePanels.includes(id)
        ? prev.visiblePanels.filter((v) => v !== id)
        : [...prev.visiblePanels, id];
      return { ...prev, visiblePanels: visible };
    });
  }, []);

  const movePanel = useCallback((id: ReportPanelId, direction: "up" | "down") => {
    // Trigger animation
    setAnimatingId(id);
    setAnimationDir(direction);

    // Delay the actual reorder so the animation plays first
    setTimeout(() => {
      setConfig((prev) => {
        const order = [...prev.panelOrder];
        const idx = order.indexOf(id);
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= order.length) return prev;
        [order[idx], order[targetIdx]] = [order[targetIdx], order[idx]];
        return { ...prev, panelOrder: order };
      });
      setAnimatingId(null);
      setAnimationDir(null);
    }, 200);
  }, []);

  const resetConfig = useCallback(() => {
    const defaults: ReportPanelConfig = {
      visiblePanels: [...ALL_PANEL_IDS],
      panelOrder: [...ALL_PANEL_IDS],
    };
    setConfig(defaults);
  }, []);

  // Build ordered visible panels
  const orderedPanels = config.panelOrder.filter((id) => isVisible(id));

  // Render panel content
  function renderPanelContent(id: ReportPanelId) {
    switch (id) {
      case "monthly-comparison":
        return <MonthlyComparisonChart data={data.monthlyComparison} />;
      case "category-spending":
        return <CategorySpendingChart data={data.categorySpending} />;
      case "daily-spending":
        return <DailySpendingChart data={data.dailySpending} />;
      case "subscription-costs":
        return <SubscriptionCostChart data={data.subscriptionCosts} />;
      case "top-expenses":
        return <TopExpensesTable data={data.topExpenses} />;
      case "recurring-vs-onetime":
        return <RecurringVsOneTimeChart data={data.recurringVsOneTime} />;
      case "spending-pace":
        return <SpendingPaceCard data={data.spendingPace} />;
    }
  }

  // Group panels into rows for the grid
  function buildRows(): React.ReactNode[] {
    const rendered = new Set<ReportPanelId>();
    const rows: React.ReactNode[] = [];

    for (const panelId of orderedPanels) {
      if (rendered.has(panelId)) continue;

      // Full-width panel
      if (FULL_WIDTH_PANELS.includes(panelId)) {
        rendered.add(panelId);
        rows.push(
          <PanelCard key={panelId} panelId={panelId} data={data}>
            {renderPanelContent(panelId)}
          </PanelCard>,
        );
        continue;
      }

      // Try to find a pair
      const pair = PAIRED_PANELS.find(
        ([a, b]) =>
          (a === panelId || b === panelId) &&
          orderedPanels.includes(a) &&
          orderedPanels.includes(b) &&
          !rendered.has(a) &&
          !rendered.has(b),
      );

      if (pair) {
        const [a, b] = pair;
        rendered.add(a);
        rendered.add(b);
        rows.push(
          <div key={`${a}-${b}`} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PanelCard panelId={a} data={data}>
              {renderPanelContent(a)}
            </PanelCard>
            <PanelCard panelId={b} data={data}>
              {renderPanelContent(b)}
            </PanelCard>
          </div>,
        );
      } else {
        rendered.add(panelId);
        rows.push(
          <PanelCard key={panelId} panelId={panelId} data={data}>
            {renderPanelContent(panelId)}
          </PanelCard>,
        );
      }
    }

    return rows;
  }

  return (
    <TooltipProvider>
      <section className="h-full w-full flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
              <p className="text-sm text-muted-foreground">
                Analytics overview of your expenses and subscriptions
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted/60 transition-colors duration-200 text-muted-foreground hover:text-foreground"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit Panels</span>
          </button>
        </div>

        {/* Edit panel dialog */}
        {editOpen && (
          <div className="border border-border bg-card/95 backdrop-blur-sm rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Customize Dashboard</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetConfig}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setEditOpen(false)}
                  className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="p-4 space-y-1">
              {config.panelOrder.map((id, idx) => {
                const visible = isVisible(id);
                const label = PANEL_LABELS[id];
                const isAnimating = animatingId === id;
                const animClass = isAnimating
                  ? animationDir === "up"
                    ? "animate-slide-up"
                    : "animate-slide-down"
                  : "";

                return (
                  <div
                    key={id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-all duration-200 group ${animClass}`}
                    style={{
                      opacity: visible ? 1 : 0.5,
                    }}
                  >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />

                    <span className="text-muted-foreground flex-shrink-0">{PANEL_ICONS[id]}</span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{label.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{label.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => movePanel(id, "up")}
                        disabled={idx === 0 || isAnimating}
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        aria-label={`Move ${label.title} up`}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => movePanel(id, "down")}
                        disabled={idx === config.panelOrder.length - 1 || isAnimating}
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        aria-label={`Move ${label.title} down`}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => togglePanel(id)}
                        className="p-1 rounded hover:bg-muted/50 transition-colors"
                        aria-label={visible ? `Hide ${label.title}` : `Show ${label.title}`}
                      >
                        {visible ? (
                          <Eye className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* KPI grid */}
        <ReportKpiGrid kpis={data.kpis} />

        {/* Panels */}
        {buildRows()}
      </section>
    </TooltipProvider>
  );
}

// --- Panel card wrapper ---

function PanelCard({
  panelId,
  data,
  children,
}: {
  panelId: ReportPanelId;
  data: ReportsDTO;
  children: React.ReactNode;
}) {
  const label = PANEL_LABELS[panelId];
  const empty = !hasData(data, panelId);

  return (
    <div className="p-6 border border-solid border-muted bg-card rounded-lg flex flex-col gap-5 transition-all duration-300 hover:border-primary/20">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{PANEL_ICONS[panelId]}</span>
            <h2 className="text-sm font-semibold">{label.title}</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-0.5 rounded-full text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[280px] text-xs leading-relaxed">
                {label.tooltip}
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-[11px] text-muted-foreground">{label.subtitle}</p>
        </div>
      </div>

      {empty ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground italic">{EMPTY_MESSAGES[panelId]}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
