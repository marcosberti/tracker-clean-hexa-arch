import { Repository } from "~/adapter/repository";
import { TransactionsE } from "~/domain/entity";

const SELECT = {
  id: true,
  title: true,
  description: true,
  amount: true,
  currencyId: true,
  categoryId: true,
  type: true,
  createdAt: true,
};

export type TransactionByIdSelect = {
  [Property in keyof Omit<typeof SELECT, "currency" | "description">]: string;
} & {
  description: string | null;
};

export async function getTransactionById(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
  transactionId: TransactionsE["id"],
) {
  const transaction = await Repository.transaction.getTransactionById(
    userId,
    accountId,
    transactionId,
    SELECT,
  );
  if (!transaction) {
    throw new Error("Transaction not found.");
  }

  return transaction;
}
