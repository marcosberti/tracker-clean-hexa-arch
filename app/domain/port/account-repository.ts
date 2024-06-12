import { Prisma } from "@prisma/client";

import { AccountsE } from "../entity";
import { AccountSchema } from "../schema";

export interface AccountRepositoryI {
  getAccountById: <T extends Prisma.AccountsSelect>(
    userId: AccountsE["userId"],
    id: AccountsE["id"],
    select: T,
  ) => Promise<Prisma.AccountsGetPayload<{ select: T }> | null>;
  getAccounts: <T extends Prisma.AccountsSelect>(
    userId: AccountsE["userId"],
    select: T,
  ) => Promise<Prisma.AccountsGetPayload<{ select: T }>[] | null>;
  createAccount: (
    data: Omit<typeof AccountSchema._type, "main"> & {
      userId: AccountsE["userId"];
      main: boolean;
    },
  ) => Prisma.PrismaPromise<AccountsE>;
  updateAccount: (
    userId: AccountsE["userId"],
    id: AccountsE["id"],
    data: Partial<
      Omit<typeof AccountSchema._type, "main"> & {
        balance?: number;
        main?: boolean;
      }
    >,
  ) => Prisma.PrismaPromise<AccountsE>;
  deleteAccount: (
    userId: AccountsE["userId"],
    id: AccountsE["id"],
  ) => Prisma.PrismaPromise<AccountsE>;
}
