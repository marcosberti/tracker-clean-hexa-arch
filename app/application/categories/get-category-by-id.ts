import { Repository } from "~/adapter/repository";
import { CategoriesE } from "~/domain/entity";

const SELECT = {
  id: true,
  name: true,
  icon: true,
  color: true,
};

export type CategorySelectById = {
  [Property in keyof typeof SELECT]: string;
};

export async function getCategoryById(
  userId: CategoriesE["userId"],
  categoryId: CategoriesE["id"],
) {
  const category = await Repository.category.getCategoryById(
    userId,
    categoryId,
    SELECT,
  );

  if (!category) {
    throw new Error("Category not found.");
  }
  return category;
}
