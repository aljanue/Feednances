"use client";

import { type ComponentType, useMemo, useState } from "react";

import EllipsisMenu, { EllipsisMenuItem } from "./ellipsis-menu";
import TimeRangeSelect, { TimeRangeValue } from "./time-range-select";
import CategoryDonutChart from "./charts/category-donut-chart";
import ExpenseTrendAreaChart from "./charts/expense-trend-area-chart";
import FixedVariableStackedBarChart from "./charts/fixed-variable-stacked-bar-chart";
import TopSubscriptionsHorizontalBarChart from "./charts/top-subscriptions-horizontal-bar-chart";

type ChartKey = "area" | "donut" | "stacked" | "top";

const chartComponents: Record<ChartKey, ComponentType> = {
    area: ExpenseTrendAreaChart,
    donut: CategoryDonutChart,
    stacked: FixedVariableStackedBarChart,
    top: TopSubscriptionsHorizontalBarChart,
};

export default function GraphCard() {
    const [chartKey, setChartKey] = useState<ChartKey>("area");
    const [timeRange, setTimeRange] = useState<TimeRangeValue>("last-3-months");

    const chartMeta = useMemo(
        () => ({
            area: {
                label: "Expense Trends",
                value: "$24,980",
                title: "Expense Trends",
            },
            donut: {
                label: "Category Breakdown",
                value: "$14,720",
                title: "Category Breakdown",
            },
            stacked: {
                label: "Fixed vs. Variable",
                value: "$8,940",
                title: "Fixed vs. Variable",
            },
            top: {
                label: "Top 5 Subscriptions",
                value: "$1,470",
                title: "Top 5 Most Expensive Subscriptions",
            },
        }),
        []
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

    const ChartComponent = chartComponents[chartKey];
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
                    <ChartComponent />
                </div>
            </div>
        </div>
    );
}