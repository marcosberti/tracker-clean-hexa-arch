import { Prisma } from "@prisma/client";

import { CurrenciesE } from "../entity";
import { CurrencySchema } from "../schema";

export interface CurrencyRepositoryI {
  getCurrencyById: <T extends Prisma.CurrenciesSelect>(
    userId: CurrenciesE["userId"],
    id: CurrenciesE["id"],
    select: T,
  ) => Promise<Prisma.CurrenciesGetPayload<{ select: T }> | null>;
  getCurrencies: <T extends Prisma.CurrenciesSelect>(
    userId: CurrenciesE["userId"],
    select: T,
  ) => Promise<Prisma.CurrenciesGetPayload<{ select: T }>[] | null>;
  createCurrency: (
    data: typeof CurrencySchema._type & {
      userId: CurrenciesE["userId"];
    },
  ) => Promise<CurrenciesE>;
  updateCurrency: (
    userId: CurrenciesE["userId"],
    id: CurrenciesE["id"],
    data: typeof CurrencySchema._type,
  ) => Prisma.PrismaPromise<CurrenciesE>;
  deleteCurrency: (
    userId: CurrenciesE["userId"],
    id: CurrenciesE["id"],
  ) => Promise<CurrenciesE>;
}
