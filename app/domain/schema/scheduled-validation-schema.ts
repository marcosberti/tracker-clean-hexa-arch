import { z } from "zod";

export const ScheduledSchema = z.object({
  currencyId: z.string().min(1, { message: "currencyId is required" }),
  categoryId: z.string().min(1, { message: "categoryId is required" }),
  // type: z.enum(["income", "spent"]),
  title: z
    .string({
      required_error: "title is required",
    })
    .min(6, { message: "title is too short" }),
  amount: z
    .number({
      required_error: "amount is required",
    })
    .min(1, { message: "amount must be greater than 0" }),
  description: z.nullable(
    z
      .string()
      .min(6, { message: "description too short" })
      .optional()
      .or(z.literal("")),
  ),
  from: z
    .string()
    .min(10, "from date is required")
    .transform((date) => new Date(date).toISOString()),
  to: z
    .string()
    .min(10, "from date is required")
    .transform((date) => new Date(date).toISOString()),
});
