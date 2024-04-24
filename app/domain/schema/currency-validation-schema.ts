import { z } from "zod";

export const CurrencySchema = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .min(4, { message: "name to short" }),
  code: z
    .string({
      required_error: "icon is required",
    })
    .min(3, { message: "icon is required" }),
});
