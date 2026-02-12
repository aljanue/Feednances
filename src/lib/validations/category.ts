import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(50),
  hexColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Invalid color format",
    })
    .optional()
    .nullable(),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
