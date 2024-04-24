import { endOfMonth, startOfMonth } from "date-fns";

import { Repository } from "~/adapter/repository";
import { TransactionsE } from "~/domain/entity";

export async function getTransactionSummarizedByType(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
) {
  const date = new Date();
  const from = startOfMonth(date).toISOString();
  const to = endOfMonth(date).toISOString();

  return Repository.transaction.getTransactionSummarizedByType(
    userId,
    accountId,
    from,
    to,
  );
}
