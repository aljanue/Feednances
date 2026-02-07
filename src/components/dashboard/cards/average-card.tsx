import type { AverageCardDTO } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";

interface AverageCardProps {
    data: AverageCardDTO;
}

export default function AverageCard({ data }: AverageCardProps) {
    return (
        <div className="h-full w-full min-h-0 flex flex-col gap-6">
            <AverageCardHeader label={data.label} value={data.value} />
            {data.value === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No monthly average yet. Log expenses to unlock insights.
                </p>
            ) : null}
        </div>
    );
}

function AverageCardHeader({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                    {label}
                </p>
                <p className="text-3xl font-semibold">{formatCurrency(value)}</p>
            </div>
        </div>
    );
}