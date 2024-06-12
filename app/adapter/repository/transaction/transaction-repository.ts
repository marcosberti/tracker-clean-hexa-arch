import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";
import { TransactionRepositoryI } from "~/domain/port";
import { TransactionSchema } from "~/domain/schema";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
    const month = Number(from.slice(5, 7)) - 1;

    return {
      month: MONTHS[month],
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

  function updateTransaction(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
    data: Partial<
      typeof TransactionSchema._type & {
        userId: TransactionsE["userId"];
        accountId: TransactionsE["accountId"];
      }
    >,
  ) {
    const where = {
      userId,
      accountId,
      id,
    };
    return prisma.transactions.update({ data, where });
  }

  function deleteTransaction(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
  ) {
    return prisma.transactions.delete({ where: { userId, accountId, id } });
  }

  return {
    getTransactionsByAccount,
    getTransactionById,
    getTransactionSummarizedByType,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
