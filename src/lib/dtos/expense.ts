export interface CreateExpenseDTO {
  amount: number | string;
  concept: string;
  categoryName?: string;
  category?: string;
  expenseDate: string;
  isRecurring?: boolean;
}
