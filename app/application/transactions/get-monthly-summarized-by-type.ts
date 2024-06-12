import { endOfMonth, startOfMonth } from "date-fns";

import { Repository } from "~/adapter/repository";
import { TransactionsE } from "~/domain/entity";

export async function getMonthlySummarizedByType(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
) {
  const year = new Date().getFullYear();
  const promises = new Array(12).fill("").map((_, i) => {
    const month = i < 9 ? `0${i + 1}` : i + 1;
    const date = new Date(`${year}-${month}-01T00:00:00`);
    const from = startOfMonth(date).toISOString();
    const to = endOfMonth(date).toISOString();

    return Repository.transaction.getTransactionSummarizedByType(
      userId,
      accountId,
      from,
      to,
    );
  });

  return Promise.all(promises);
}
