import { prisma } from "~/db.server";
import { AccountsE, UsersE } from "~/domain/entity";
import { TransactionRepositoryI } from "~/domain/port";

export function TransactionRepository(): TransactionRepositoryI {
  function getTransactionByAccount() {}

  function getTransactionById() {}

  async function getTransactionSummarizedByType(
    userId: UsersE["id"],
    accountId: AccountsE["id"],
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

    return {
      income: Number(income),
      spent: Number(spent),
    };
  }

  function createTransaction() {}

  function deleteTransaction() {}

  return {
    getTransactionByAccount,
    getTransactionById,
    getTransactionSummarizedByType,
    createTransaction,
    deleteTransaction,
  };
}
