import { Repository } from "~/adapter/repository";
import { CategoriesE } from "~/domain/entity";
import { CategorySchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function updateCategory(
  userId: CategoriesE["userId"],
  id: CategoriesE["id"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof CategorySchema._type>(
    formData,
    CategorySchema,
  );

  if (errors) {
    return { errors };
  }

  const account = await Repository.category.updateCategory(userId, id, data);

  return { account };
}
