import { z } from "zod";

export const AccountSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .min(4, { message: "name to short" }),
  currencyId: z
    .string({
      required_error: "currency is required",
    })
    .min(1, { message: "currency is required" }),
  icon: z
    .string({
      required_error: "icon is required",
    })
    .min(1, { message: "icon is required" }),
  color: z
    .string({
      required_error: "color is required",
    })
    .min(1, { message: "color is required" }),
  main: z.enum(["on"]).optional(),
  balance: z.string().optional(),
});
