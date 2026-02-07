import type { SubscriptionDTO } from "@/lib/dtos/dashboard"; 
import { formatCurrency } from "@/lib/utils/formatters"; 
import { format, differenceInCalendarDays, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import EmptyState from "./empty-state";

interface SubscriptionsCardProps {
  items: SubscriptionDTO[];
}

export default function SubscriptionsCard({ items }: SubscriptionsCardProps) {
  const today = new Date();

  return (
    <div className="h-full w-full flex flex-col gap-6">
      <CardHeader />
      {items.length === 0 ? (
        <EmptyState
          title="No subscriptions"
          description="Connect subscriptions to keep recurring charges visible."
          icon={CalendarDays}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              today={today}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardHeader() {
  return (
    <div className="flex items-center justify-between gap-8">
      <h2 className="text-lg font-semibold">Subscriptions</h2>
      <Link
        href="/dashboard/subscriptions"
        className="font-semibold text-primary hover:underline underline-offset-6 text-md"
      >
        View all
      </Link>
    </div>
  );
}

function SubscriptionRow({
  subscription,
  today,
}: {
  subscription: SubscriptionDTO;
  today: Date;
}) {
  const nextDate =
    typeof subscription.nextDate === "string"
      ? parseISO(subscription.nextDate)
      : new Date(subscription.nextDate);

  const daysLeft = differenceInCalendarDays(nextDate, today);

  return (
    <div
      key={subscription.id}
      className="flex items-center gap-x-8 gap-y-2 justify-between p-4 border border-solid border-muted rounded-lg bg-background/20 flex-wrap hover:bg-muted/30 hover:scale-101 transition-all"
    >
      <div className="flex flex-col">
        <p className="text-md font-semibold">{subscription.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(subscription.amount)} / {subscription.timeValue} Mo
        </p>
      </div>
      <div>
        {daysLeft === 2 ? (
          <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/30 uppercase">
            2 DAYS LEFT
          </span>
        ) : (
          <span className="text-sm text-muted-foreground font-bold px-2 py-1 uppercase">
            {format(nextDate, "MMM d")}
          </span>
        )}
      </div>
    </div>
  );
}
