import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { CurrenciesE } from "~/domain/entity";
import { CurrencyRepositoryI } from "~/domain/port";
import { CurrencySchema } from "~/domain/schema";

export function CurrencyRepository(): CurrencyRepositoryI {
  function getCurrencyById<T extends Prisma.CurrenciesSelect>(
    id: CurrenciesE["id"],
    userId: CurrenciesE["userId"],
    select: T,
  ) {
    return prisma.currencies.findFirst({ select, where: { id, userId } });
  }

  function getCurrencies<T extends Prisma.CurrenciesSelect>(
    userId: CurrenciesE["userId"],
    select: T,
  ) {
    return prisma.currencies.findMany({
      select,
      where: {
        userId,
      },
      orderBy: [{ name: "asc" }],
    });
  }

  function createCurrency(
    data: typeof CurrencySchema._type & {
      userId: CurrenciesE["userId"];
    },
  ) {
    return prisma.currencies.create({
      data,
    });
  }

  async function deleteCurrency(
    userId: CurrenciesE["userId"],
    id: CurrenciesE["id"],
  ) {
    const currency = await prisma.currencies.findFirst({
      where: { id, userId },
    });
    if (!currency) {
      return Promise.reject("Currency not found");
    }

    return prisma.currencies.delete({ where: { id } });
  }

  return { getCurrencyById, getCurrencies, createCurrency, deleteCurrency };
}
