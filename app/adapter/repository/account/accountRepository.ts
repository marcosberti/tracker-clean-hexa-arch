import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { AccountsE } from "~/domain/entity";
import { AccountRepositoryI } from "~/domain/port";

export function AccountRepository(): AccountRepositoryI {
  function getAccountById<T extends Prisma.AccountsSelect>(
    id: AccountsE["id"],
    userId: AccountsE["userId"],
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
    name: string,
    color: string,
    icon: string,
    main: boolean,
    userId: string,
    currencyId: string,
  ) {
    return prisma.accounts.create({
      data: {
        name,
        color,
        icon,
        main,
        currencyId,
        userId,
        balance: 0,
      },
    });
  }

  async function deleteAccount(
    id: AccountsE["id"],
    userId: AccountsE["userId"],
  ) {
    const account = await prisma.accounts.findFirst({ where: { id, userId } });
    if (!account) {
      return Promise.reject("Account not found");
    }

    return prisma.accounts.delete({ where: { id } });
  }

  // function updateAccount() {}

  return { getAccountById, getAccounts, createAccount, deleteAccount };
}
