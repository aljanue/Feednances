export interface CreateSubscriptionDTO {
  concept: string;
  amount: string;
  periodType: string;
  periodValue: number;
  categoryId: string;
  startsAt?: string;
}
