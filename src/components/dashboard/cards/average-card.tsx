export default function AverageCard() {
    return (
        <div className="h-full w-full min-h-0 flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                        Average Monthly Expenses
                    </p>
                    <p className="text-3xl font-semibold">$1,234.56</p>
                </div>
            </div>
        </div>
    );
}