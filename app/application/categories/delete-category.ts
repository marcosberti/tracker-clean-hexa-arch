import { Repository } from "~/adapter/repository";
import { CategoriesE } from "~/domain/entity";

export async function deleteCategory(
  userId: CategoriesE["userId"],
  categoryId: CategoriesE["id"],
) {
  try {
    await Repository.category.deleteCategory(userId, categoryId);
    return { errors: null };
  } catch (e) {
    return {
      errors:
        "The category could not be deleted, check the console for more info.",
    };
  }
}
