"use client";

import { useMemo, useState } from "react";

import type {
    GraphCardData,
    TimeRangeValue,
} from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";
import EllipsisMenu, { EllipsisMenuItem } from "./ellipsis-menu";
import TimeRangeSelect from "./time-range-select";
import CategoryDonutChart from "./charts/category-donut-chart";
import ExpenseTrendAreaChart from "./charts/expense-trend-area-chart";
import FixedVariableStackedBarChart from "./charts/fixed-variable-stacked-bar-chart";
import TopSubscriptionsHorizontalBarChart from "./charts/top-subscriptions-horizontal-bar-chart";

type ChartKey = "area" | "donut" | "stacked" | "top";

interface GraphCardProps {
    dataByRange: GraphCardData;
    defaultRange?: TimeRangeValue;
}

export default function GraphCard({
    dataByRange,
    defaultRange = "last-3-months",
}: GraphCardProps) {
    const [chartKey, setChartKey] = useState<ChartKey>("area");
    const [timeRange, setTimeRange] = useState<TimeRangeValue>(defaultRange);

    const rangeData = dataByRange[timeRange] ?? dataByRange[defaultRange];

    const chartMeta = useMemo(
        () => ({
            area: {
                label: "Expense Trends",
                value: formatCurrency(rangeData.totals.expenseTrends),
                title: "Expense Trends",
            },
            donut: {
                label: "Category Breakdown",
                value: formatCurrency(rangeData.totals.categoryBreakdown),
                title: "Category Breakdown",
            },
            stacked: {
                label: "Fixed vs. Variable",
                value: formatCurrency(rangeData.totals.fixedVariable),
                title: "Fixed vs. Variable",
            },
            top: {
                label: "Top 5 Subscriptions",
                value: formatCurrency(rangeData.totals.topSubscriptions),
                title: "Top 5 Most Expensive Subscriptions",
            },
        }),
        [rangeData]
    );

    const menuItems: EllipsisMenuItem[] = [
        {
            label: "Expense Trends",
            onSelect: () => setChartKey("area"),
        },
        {
            label: "Category Breakdown",
            onSelect: () => setChartKey("donut"),
        },
        {
            label: "Fixed vs. Variable",
            onSelect: () => setChartKey("stacked"),
        },
        {
            label: "Top 5 Most Expensive Subscriptions",
            onSelect: () => setChartKey("top"),
        },
    ];

    const meta = chartMeta[chartKey];

    return (
        <div className="h-full w-full min-h-0 flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {meta.label}
                    </p>
                    <p className="text-3xl font-semibold leading-tight">
                        {meta.value}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <TimeRangeSelect value={timeRange} onValueChange={setTimeRange} />
                    <EllipsisMenu items={menuItems} />
                </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
                <div className="min-h-50 w-full">
                    {chartKey === "area" && (
                        <ExpenseTrendAreaChart data={rangeData.expenseTrends} />
                    )}
                    {chartKey === "donut" && (
                        <CategoryDonutChart data={rangeData.categoryBreakdown} />
                    )}
                    {chartKey === "stacked" && (
                        <FixedVariableStackedBarChart data={rangeData.fixedVariable} />
                    )}
                    {chartKey === "top" && (
                        <TopSubscriptionsHorizontalBarChart
                            data={rangeData.topSubscriptions}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}