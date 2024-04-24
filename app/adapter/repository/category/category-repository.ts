import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { CategoriesE } from "~/domain/entity";
import { CategoryRepositoryI } from "~/domain/port";

export function CategoryRepository(): CategoryRepositoryI {
  function getCategoryById<T extends Prisma.CategoriesSelect>(
    userId: CategoriesE["userId"],
    id: CategoriesE["id"],
    select: T,
  ) {
    return prisma.categories.findFirst({ select, where: { id, userId } });
  }

  function getCategories<T extends Prisma.CategoriesSelect>(
    userId: CategoriesE["userId"],
    select: T,
  ) {
    return prisma.categories.findMany({
      select,
      where: {
        userId,
      },
      orderBy: [{ name: "asc" }],
    });
  }

  function createCategory(
    userId: string,
    name: string,
    color: string,
    icon: string,
  ) {
    return prisma.categories.create({
      data: {
        name,
        color,
        icon,
        userId,
      },
    });
  }

  async function deleteCategory(
    userId: CategoriesE["userId"],
    id: CategoriesE["id"],
  ) {
    const category = await prisma.categories.findFirst({
      where: { id, userId },
    });
    if (!category) {
      return Promise.reject("Category not found");
    }

    const transaction = await prisma.transactions.findFirst({
      where: { userId, category },
    });

    if (transaction) {
      return Promise.reject("Category cannot be deleted");
    }

    return prisma.categories.delete({ where: { id } });
  }

  return { getCategoryById, getCategories, createCategory, deleteCategory };
}
