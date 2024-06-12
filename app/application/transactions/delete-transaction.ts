import { Repository } from "~/adapter/repository";
import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";

type Transaction =
  | ReturnType<typeof Repository.transaction.deleteTransaction>
  | ReturnType<typeof Repository.account.updateAccount>
  | ReturnType<typeof Repository.installments.updateInstallment>;

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
        { id: true, amount: true, type: true, installmentId: true },
      ),
    ]);

    if (!account || !transaction) {
      return { errors: "account or transaction not found" };
    }

    const amount =
      transaction.type === "spent"
        ? Number(transaction.amount)
        : Number(transaction.amount) * -1;

    const balance = Number(account.balance) + amount;

    const prismaTransactions: Transaction[] = [
      Repository.transaction.deleteTransaction(
        userId,
        accountId,
        transactionId,
      ),
      Repository.account.updateAccount(userId, accountId, { balance }),
    ];

    if (transaction.installmentId) {
      const installment = await Repository.installments.getInstallmentById(
        userId,
        accountId,
        transaction.installmentId,
        { id: true, installments: true, paidInstallments: true, active: true },
      );

      if (!installment) {
        return { errors: "installment not found" };
      }

      const paidInstallments = installment.paidInstallments - 1;
      const active = paidInstallments < installment.installments;
      prismaTransactions.push(
        Repository.installments.updateInstallment(
          userId,
          accountId,
          installment.id,
          { paidInstallments, active },
        ),
      );
    }

    await prisma.$transaction(prismaTransactions);

    return { transaction };
  } catch (e) {
    return {
      errors:
        "The transaction could not be deleted, check the console for more info.",
    };
  }
}
