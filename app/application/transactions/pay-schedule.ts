import { Repository } from "~/adapter/repository";
import { prisma } from "~/db.server";
import { TransactionsE } from "~/domain/entity";

const SCHED_SELECT = {
  title: true,
  amount: true,
  currencyId: true,
  description: true,
  categoryId: true,
};

export async function paySchedule(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
  scheduledId: NonNullable<TransactionsE["scheduledId"]>,
) {
  const scheduled = await Repository.scheduled.getScheduledById(
    userId,
    accountId,
    scheduledId,
    SCHED_SELECT,
  );

  if (!scheduled) {
    return { errors: "invalid scheduled" };
  }

  const data = {
    ...scheduled,
    userId,
    accountId,
    scheduledId,
    amount: Number(scheduled.amount),
    description: scheduled.description as string | undefined,
    type: "spent" as const,
  };

  const account = await Repository.account.getAccountById(userId, accountId, {
    id: true,
    balance: true,
  });

  if (!account) {
    return { errors: "invalid account" };
  }

  const balance = Number(account.balance) + data.amount * -1;
  const [transaction] = await prisma.$transaction([
    Repository.transaction.createTransaction(data),
    Repository.account.updateAccount(userId, accountId, { balance }),
  ]);

  return { transaction };
}
