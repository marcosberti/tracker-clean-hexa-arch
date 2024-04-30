import { z } from "zod";

type Data = Record<string, FormDataEntryValue | number>;

export async function validateSchema<T>(
  formData: FormData,
  schema: ReturnType<typeof z.object | typeof z.effect>,
  numericFields?: string[],
) {
  const data = Object.fromEntries(formData) as Data;

  if (numericFields) {
    numericFields.forEach((field) => {
      data[field] = Number(data[field]);
    });
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return { data: result.data as T };
  } else {
    return {
      errors: result.error.flatten().fieldErrors as unknown as {
        [Property in keyof T]?: [string];
      },
    };
  }
}
