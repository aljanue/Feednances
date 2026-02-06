import type { SubscriptionDTO } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";

interface SubscriptionsCardProps {
  items: SubscriptionDTO[];
}

export default function SubscriptionsCard({ items }: SubscriptionsCardProps) {
  return (
    <div className="h-full w-full flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Subscriptions</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No subscriptions to show.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{subscription.name}</p>
                <p className="text-xs text-muted-foreground">
                  {subscription.category}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatCurrency(subscription.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}