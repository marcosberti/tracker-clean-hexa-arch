import { z } from "zod";

export const TransactionSchema = z.object({
  currencyId: z.string().min(1, { message: "currency is required" }),
  categoryId: z.string().min(1, { message: "category is required" }),
  type: z.enum(["income", "spent"]),
  createdAt: z
    .string()
    .min(1, { message: "date is required" })
    .transform((v) => `${v}T00:00:00z`),
  title: z
    .string({
      required_error: "title is required",
    })
    .min(4, { message: "title is too short" }),
  amount: z
    .number({
      required_error: "amount is required",
    })
    .min(1, { message: "amount must be greater than 0" }),
  description: z
    .string()
    .min(6, { message: "description too short" })
    .optional()
    .or(z.literal("")),
  parentTransactionId: z.string().optional(),
  installmentId: z.string().optional(),
  scheduledId: z.string().optional(),
});
