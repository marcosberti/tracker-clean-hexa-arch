import { Repository } from "~/adapter/repository";
import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";

const INS_SELECT = {
  title: true,
  amount: true,
  currencyId: true,
  description: true,
  categoryId: true,
  installments: true,
  paidInstallments: true,
};

export async function payInstallment(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
  installmentId: NonNullable<TransactionsE["installmentId"]>,
) {
  const [installment, account] = await Promise.all([
    Repository.installments.getInstallmentById(
      userId,
      accountId,
      installmentId,
      INS_SELECT,
    ),
    Repository.account.getAccountById(userId, accountId, {
      id: true,
      balance: true,
    }),
  ]);

  if (!installment || !account) {
    return { errors: "invalid account or installment" };
  }

  const amount = Number(
    (Number(installment.amount) / Number(installment.installments)).toFixed(2),
  );
  const balance = Number(account.balance) + amount * -1;
  const paidInstallments = installment.paidInstallments + 1;
  const active = paidInstallments < installment.installments;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { paidInstallments: _, installments: __, ...tx } = installment;

  const data = {
    ...tx,
    userId,
    accountId,
    installmentId,
    amount,
    description: installment.description as string | undefined,
    type: "spent" as const,
  };

  const [transaction] = await prisma.$transaction([
    Repository.transaction.createTransaction(data),
    Repository.installments.updateInstallment(
      userId,
      accountId,
      installmentId,
      { paidInstallments, active },
    ),
    Repository.account.updateAccount(userId, accountId, { balance }),
  ]);

  return { transaction };
}
