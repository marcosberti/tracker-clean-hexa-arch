import { Prisma } from "@prisma/client";

import { CurrenciesE } from "../entity";

export interface CurrencyRepositoryI {
  getCurrencyById: <T extends Prisma.CurrenciesSelect>(
    id: CurrenciesE["id"],
    userId: CurrenciesE["userId"],
    select: T,
  ) => Promise<Prisma.CurrenciesGetPayload<{ select: T }> | null>;
  getCurrencies: <T extends Prisma.CurrenciesSelect>(
    userId: CurrenciesE["userId"],
    select: T,
  ) => Promise<Prisma.CurrenciesGetPayload<{ select: T }>[] | null>;
  createCurrency: (
    userId: CurrenciesE["userId"],
    name: CurrenciesE["name"],
    core: CurrenciesE["code"],
  ) => Promise<CurrenciesE>;
  // updateAccount: (
  //   id: AccountsE["id"],
  //   name: AccountsE["name"],
  //   color: AccountsE["color"],
  //   icon: AccountsE["icon"],
  //   main: AccountsE["main"],
  //   userId: AccountsE["userId"],
  //   currencyId: AccountsE["currencyId"],
  // ) => Promise<AccountsE>;
  deleteCurrency: (
    userId: CurrenciesE["userId"],
    id: CurrenciesE["id"],
  ) => Promise<CurrenciesE>;
}
