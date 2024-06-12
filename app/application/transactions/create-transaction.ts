import { Repository } from "~/adapter/repository";
import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";
import { TransactionSchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function createTransaction(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
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

  const account = await Repository.account.getAccountById(userId, accountId, {
    id: true,
    balance: true,
  });

  if (!account) {
    throw new Error("invalid account");
  }

  const amount = data.type === "spent" ? data.amount * -1 : data.amount;
  const balance = Number(account.balance) + amount;

  const [transaction] = await prisma.$transaction([
    Repository.transaction.createTransaction({
      ...data,
      userId,
      accountId,
    }),
    Repository.account.updateAccount(userId, accountId, { balance }),
  ]);

  return { transaction };
}
