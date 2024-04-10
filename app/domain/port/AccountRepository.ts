import { Prisma } from "@prisma/client";
import { AccountsE } from "../entity";

type Return = Promise<Prisma.AccountsGetPayload<{}>[] | null>;

export interface AccountRepositoryI {
  getAccountById: <T extends Prisma.AccountsSelect>(
    id: AccountsE["id"],
    userId: AccountsE["userId"],
    select: T,
  ) => Promise<Prisma.AccountsGetPayload<{ select: T }> | null>;
  getAccounts: <T extends Prisma.AccountsSelect>(
    userId: AccountsE["userId"],
    select: T,
  ) => Promise<Prisma.AccountsGetPayload<{ select: T }>[] | null>;
  createAccount: (
    name: AccountsE["name"],
    color: AccountsE["color"],
    icon: AccountsE["icon"],
    main: AccountsE["main"],
    userId: AccountsE["userId"],
    currencyId: AccountsE["currencyId"],
  ) => Promise<AccountsE>;
  // updateAccount: (
  //   id: AccountsE["id"],
  //   name: AccountsE["name"],
  //   color: AccountsE["color"],
  //   icon: AccountsE["icon"],
  //   main: AccountsE["main"],
  //   userId: AccountsE["userId"],
  //   currencyId: AccountsE["currencyId"],
  // ) => Promise<AccountsE>;
  deleteAccount: (
    id: AccountsE["id"],
    userId: AccountsE["userId"],
  ) => Promise<AccountsE>;
}
