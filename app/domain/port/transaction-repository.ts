import { Prisma } from "@prisma/client";

import { TransactionsE } from "../entity";

export interface TransactionRepositoryI {
  getTransactionById: <T extends Prisma.TransactionsSelect>(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    id: TransactionsE["id"],
    select: T,
  ) => void;
  getTransactionsByAccount: <T extends Prisma.TransactionsSelect>(
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    skip: number,
    take: number,
    select: T,
    from: string,
    to: string,
  ) => void;
  getTransactionSummarizedByType: (
    userId: TransactionsE["userId"],
    accountId: TransactionsE["accountId"],
    from: string,
    to: string,
  ) => Promise<{ income: number; spent: number }>;
  createTransaction: () => void;
  deleteTransaction: () => void;
}
