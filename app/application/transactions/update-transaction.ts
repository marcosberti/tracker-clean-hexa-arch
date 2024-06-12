import { Repository } from "~/adapter/repository";
import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";
import { TransactionSchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function updateTransaction(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
  transactionId: TransactionsE["id"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof TransactionSchema._type>(
    formData,
    TransactionSchema,
    ["amount"],
  );

  if (errors) {
    return { errors };
  }

  const [oldTransaction, account] = await Promise.all([
    Repository.transaction.getTransactionById(
      userId,
      accountId,
      transactionId,
      { amount: true, type: true },
    ),
    Repository.account.getAccountById(userId, accountId, {
      id: true,
      balance: true,
    }),
  ]);

  if (!account || !oldTransaction) {
    throw new Error("invalid account or transaction");
  }

  const oldAmount =
    oldTransaction.type === "spent"
      ? Number(oldTransaction.amount)
      : Number(oldTransaction.amount) * -1;

  const amount = data.type === "spent" ? data.amount * -1 : data.amount;
  const balance = Number(account.balance) + oldAmount + amount;

  const [transaction] = await prisma.$transaction([
    Repository.transaction.updateTransaction(
      userId,
      accountId,
      transactionId,
      data,
    ),
    Repository.account.updateAccount(userId, accountId, { balance }),
  ]);

  return { transaction };
}
