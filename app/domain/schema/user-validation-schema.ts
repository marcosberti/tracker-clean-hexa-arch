import { z } from "zod";

export const UserSchema = z.object({
  email: z
    .string({
      required_error: "Required",
    })
    .email("invalid email"),
  password: z.string().min(8, { message: "must have at least 8 characters" }),
  remember: z.enum(["on"]).optional(),
});
