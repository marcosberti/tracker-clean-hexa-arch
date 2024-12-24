import { Prisma } from "@prisma/client";

import { TransactionsE } from "../entity";
import { TransactionSchema } from "../schema";

export interface TransactionRepositoryI {
  getTransactionById: <T extends Prisma.TransactionsSelect>(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
    select: T,
  ) => Promise<Prisma.TransactionsGetPayload<{ select: T }> | null>;
  getTransactionsByAccount: <T extends Prisma.TransactionsSelect>(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    skip: number,
    take: number,
    select: T,
    from: string,
    to: string,
  ) => Promise<[number, Prisma.TransactionsGetPayload<{ select: T }>[] | null]>;
  getTransactionSummarizedByType: (
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    from: string,
    to: string,
  ) => Promise<{ income: number; spent: number }>;
  getTransactionSummarizedByCategory: (
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    from: string,
    to: string,
  ) => Promise<Record<string, number | string>>;
  createTransaction: (
    data: typeof TransactionSchema._type & {
      userId: TransactionsE["userId"];
      accountId: TransactionsE["accountId"];
    },
  ) => Prisma.PrismaPromise<TransactionsE>;
  updateTransaction: (
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
    data: Partial<
      typeof TransactionSchema._type & {
        userId: TransactionsE["userId"];
        accountId: TransactionsE["accountId"];
      }
    >,
  ) => Prisma.PrismaPromise<TransactionsE>;
  deleteTransaction: (
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
  ) => Prisma.PrismaPromise<TransactionsE>;
}
