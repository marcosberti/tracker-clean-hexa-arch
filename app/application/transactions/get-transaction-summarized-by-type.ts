import { endOfMonth, startOfMonth } from "date-fns";

import { Repository } from "~/adapter/repository";
import { TransactionsE } from "~/domain/entity";

export async function getTransactionSummarizedByType(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
  month: string,
) {
  const date = new Date(`${month}T00:00:00`);
  const from = startOfMonth(date).toISOString();
  const to = endOfMonth(date).toISOString();

  return Repository.transaction.getTransactionSummarizedByType(
    userId,
    accountId,
    from,
    to,
  );
}
