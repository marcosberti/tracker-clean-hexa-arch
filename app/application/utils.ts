import { z } from "zod";

export async function validateSchema<T>(
  formData: FormData,
  schema: ReturnType<typeof z.object>,
) {
  const data = Object.fromEntries(formData);

  schema._type;
  const result = schema.safeParse(data);

  if (result.success) {
    return { data: result.data as T };
  } else {
    return {
      errors: result.error.flatten().fieldErrors as unknown as {
        [Property in keyof T]: string;
      },
    };
  }
}
