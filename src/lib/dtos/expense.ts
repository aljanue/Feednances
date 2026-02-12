export interface Category {
  id: string;
  name: string;
  hexColor: string | null;

}

export interface CreateExpenseDTO {
  amount: number | string;
  concept: string;
  categoryId: string;
  expenseDate: string;
  isRecurring?: boolean;
}
