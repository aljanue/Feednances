import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().uuid("Invalid category ID"),
  timeUnitId: z.string().uuid("Invalid time unit ID"),
  frequencyValue: z
    .string()
    .min(1, "Frequency is required")
    .refine((val) => !Number.isNaN(Number(val)) && Number.isInteger(Number(val)) && Number(val) > 0, {
      message: "Frequency must be a positive integer",
    }),
  startsAt: z.string().min(1, "Start date is required"),
  recordPastPayment: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
});

type SubscriptionValidationResult =
  | { success: false; fieldErrors: Record<string, string> }
  | { success: true; data: z.infer<typeof subscriptionSchema> };

export function validateSubscriptionForm(formData: FormData): SubscriptionValidationResult {
  const data = {
    name: formData.get("name")?.toString() || "",
    amount: formData.get("amount")?.toString() || "",
    category: formData.get("category")?.toString() || "",
    timeUnitId: formData.get("timeUnitId")?.toString() || "",
    frequencyValue: formData.get("frequencyValue")?.toString() || "1",
    startsAt: formData.get("startsAt")?.toString() || "",
    recordPastPayment: formData.get("recordPastPayment"),
  };

  const result = subscriptionSchema.safeParse(data);

  if (!result.success) {
    const errorMap: Record<string, string> = {};
    for (const error of result.error.errors) {
      if (error.path[0]) {
        errorMap[error.path[0].toString()] = error.message;
      }
    }
    return { success: false, fieldErrors: errorMap };
  }

  return { success: true, data: result.data };
}
