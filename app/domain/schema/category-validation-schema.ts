import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .min(4, { message: "name to short" }),
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
});
