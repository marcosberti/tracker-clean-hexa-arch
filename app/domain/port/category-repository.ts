import { Prisma } from "@prisma/client";

import { CategoriesE } from "../entity";
import { CategorySchema } from "../schema";

export interface CategoryRepositoryI {
  getCategoryById: <T extends Prisma.CategoriesSelect>(
    userId: CategoriesE["userId"],
    id: CategoriesE["id"],
    select: T,
  ) => Promise<Prisma.CategoriesGetPayload<{ select: T }> | null>;
  getCategories: <T extends Prisma.CategoriesSelect>(
    userId: CategoriesE["userId"],
    select: T,
  ) => Promise<Prisma.CategoriesGetPayload<{ select: T }>[] | null>;
  createCategory: (
    data: typeof CategorySchema._type & {
      userId: CategoriesE["userId"];
    },
  ) => Promise<CategoriesE>;
  updateCategory: (
    userId: CategoriesE["userId"],
    id: CategoriesE["id"],
    data: typeof CategorySchema._type,
  ) => Prisma.PrismaPromise<CategoriesE>;
  deleteCategory: (
    userId: CategoriesE["userId"],
    id: CategoriesE["id"],
  ) => Promise<CategoriesE>;
}
