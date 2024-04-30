import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";
import { TransactionRepositoryI } from "~/domain/port";
import { TransactionSchema } from "~/domain/schema";

export function TransactionRepository(): TransactionRepositoryI {
  async function getTransactionById<T extends Prisma.TransactionsSelect>(
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
    const where = {
      userId,
      accountId,
      createdAt: {
        gte: from,
        lte: to,
      },
    };

    return prisma.$transaction([
      prisma.transactions.count({ where }),
      prisma.transactions.findMany({
        select,
        where,
        skip,
        take,
      }),
    ]);
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

  function createTransaction(
    data: typeof TransactionSchema._type & {
      userId: TransactionsE["userId"];
      accountId: TransactionsE["accountId"];
    },
  ) {
    return prisma.transactions.create({
      data,
    });
  }

  async function deleteTransaction(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
  ) {
    const transaction = await getTransactionById(userId, accountId, id, {
      id: true,
    });
    if (!transaction) {
      throw new Error("could not find the transaction");
    }

    return prisma.transactions.delete({ where: { userId, accountId, id } });
  }

  return {
    getTransactionsByAccount,
    getTransactionById,
    getTransactionSummarizedByType,
    createTransaction,
    deleteTransaction,
  };
}
