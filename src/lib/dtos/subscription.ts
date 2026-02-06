export interface CreateSubscriptionDTO {
  concept: string;
  amount: string;
  periodType: string;
  periodValue: number;
  categoryName: string;
  startsAt?: string;
}
