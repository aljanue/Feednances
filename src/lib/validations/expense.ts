import { z } from "zod";

import { formatAmount } from "@/utils/format-data.utils";

const amountSchema = z
  .string()
  .trim()
  .min(1, "Amount is required.")
  .superRefine((value, ctx) => {
    try {
      const formatted = formatAmount(value);
      if (Number.isNaN(Number(formatted))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount must be a number.",
        });
      }
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error instanceof Error ? error.message : "Invalid amount.",
      });
    }
  });

export const expenseFormSchema = z.object({
  concept: z.string().trim().min(1, "Concept is required."),
  amount: amountSchema,
  category: z.string().trim().min(1, "Category is required."),
  expenseDate: z
    .string()
    .min(1, "Date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date."),
});

export type ExpenseFormInput = z.infer<typeof expenseFormSchema>;

export function validateExpenseForm(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const result = expenseFormSchema.safeParse(rawData);

  if (result.success) {
    return { success: true as const, data: result.data };
  }

  const fieldErrors = result.error.flatten().fieldErrors;
  const mappedErrors: Record<string, string> = {};

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) {
      mappedErrors[field] = messages[0];
    }
  }

  return {
    success: false as const,
    fieldErrors: mappedErrors,
  };
}
