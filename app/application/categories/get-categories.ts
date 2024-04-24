import { Repository } from "~/adapter/repository";
import { CategoriesE } from "~/domain/entity";

const SELECT = {
  id: true,
  name: true,
  icon: true,
  color: true,
};

export type CategorySelect = {
  [Property in keyof typeof SELECT]: string;
};

export async function getCategories(userId: CategoriesE["id"]) {
  return Repository.category.getCategories(userId, SELECT);
}
