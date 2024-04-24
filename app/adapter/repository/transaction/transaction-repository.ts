import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";
import { TransactionRepositoryI } from "~/domain/port";

export function TransactionRepository(): TransactionRepositoryI {
  function getTransactionById<T extends Prisma.TransactionsSelect>(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
    select: T,
  ) {
    return prisma.transactions.findFirst({
      select,
      where: {
        userId,
        accountId,
        id,
      },
    });
  }

  async function getTransactionsByAccount<T extends Prisma.TransactionsSelect>(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    skip: number,
    take: number,
    select: T,
    from: string,
    to: string,
  ) {
    return prisma.transactions.findMany({
      select,
      where: {
        userId,
        accountId,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      skip,
      take,
    });
  }

  async function getTransactionSummarizedByType(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    from: string,
    to: string,
  ) {
    const data = await prisma.transactions.groupBy({
      by: ["type"],
      _sum: {
        amount: true,
      },
      where: {
        userId,
        accountId,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    const income = data.find((d) => d.type === "income")?._sum.amount ?? 0;
    const spent = data.find((d) => d.type === "spent")?._sum.amount ?? 0;

    return {
      income: Number(income),
      spent: Number(spent),
    };
  }

  function createTransaction() {}

  function deleteTransaction() {}

  return {
    getTransactionsByAccount,
    getTransactionById,
    getTransactionSummarizedByType,
    createTransaction,
    deleteTransaction,
  };
}
