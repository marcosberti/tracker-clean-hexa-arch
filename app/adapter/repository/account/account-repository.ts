import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { AccountsE } from "~/domain/entity";
import { AccountRepositoryI } from "~/domain/port";
import { AccountSchema } from "~/domain/schema";

export function AccountRepository(): AccountRepositoryI {
  function getAccountById<T extends Prisma.AccountsSelect>(
    userId: AccountsE["userId"],
    id: AccountsE["id"],
    select: T,
  ) {
    return prisma.accounts.findFirst({ select, where: { id, userId } });
  }

  function getAccounts<T extends Prisma.AccountsSelect>(
    userId: AccountsE["userId"],
    select: T,
  ) {
    return prisma.accounts.findMany({
      select,
      where: {
        userId,
      },
      orderBy: [{ name: "asc" }],
    });
  }

  function createAccount(
    data: Omit<typeof AccountSchema._type, "main"> & {
      userId: AccountsE["userId"];
      main: boolean;
    },
  ) {
    return prisma.accounts.create({
      data,
    });
  }

  function updateAccount(
    userId: AccountsE["userId"],
    id: AccountsE["id"],
    data: Partial<
      Omit<typeof AccountSchema._type, "main"> & {
        balance?: number;
        main?: boolean;
      }
    >,
  ) {
    return prisma.accounts.update({
      data,
      where: {
        userId,
        id,
      },
    });
  }

  function deleteAccount(userId: AccountsE["userId"], id: AccountsE["id"]) {
    return prisma.accounts.delete({ where: { userId, id } });
  }

  return {
    getAccountById,
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
