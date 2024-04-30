import { Repository } from "~/adapter/repository";
import { TransactionsE } from "~/domain/entity";

export async function deleteTransaction(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
  transactionId: TransactionsE["id"],
) {
  try {
    const [account, transaction] = await Promise.all([
      Repository.account.getAccountById(userId, accountId, {
        id: true,
        balance: true,
      }),
      Repository.transaction.getTransactionById(
        userId,
        accountId,
        transactionId,
        { id: true, amount: true, type: true },
      ),
    ]);

    if (!account || !transaction) {
      throw new Error("account or transaction not found");
    }

    await Repository.transaction.deleteTransaction(
      userId,
      accountId,
      transactionId,
    );

    const amount =
      transaction.type === "spent"
        ? Number(transaction.amount)
        : Number(transaction.amount) * -1;

    const balance = Number(account.balance) + amount;

    await Repository.account.updateAccount(userId, accountId, { balance });

    return { transaction };
  } catch (e) {
    return {
      errors:
        "The transaction could not be deleted, check the console for more info.",
    };
  }
}
