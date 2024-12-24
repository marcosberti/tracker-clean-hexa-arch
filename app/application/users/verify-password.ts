import { Repository } from "~/adapter/repository";
import { validateSchema } from "~/application/utils";
import { UserSchema } from "~/domain/schema";

export async function verifyPassword(formData: FormData) {
  const { data, errors } = await validateSchema<typeof UserSchema._type>(
    formData,
    UserSchema,
  );

  if (errors) {
    return { errors };
  }

  const { email, password } = data;
  const user = await Repository.user.verifyPassword(email, password);

  if (!user) {
    return {
      errors: {
        email: "Invalid email or password",
        password: null,
        code: "INVALID_CREDENTIALS",
      } as unknown as {
        [Property in keyof typeof UserSchema._type]: string;
      } & { code: string },
    };
  }

  return { data: { ...data, userId: user.id } };
}
