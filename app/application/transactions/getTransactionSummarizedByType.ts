import { endOfMonth, startOfMonth } from "date-fns";
import { Repository } from "~/adapter/repository";
import { AccountsE, UsersE } from "~/domain/entity";

export async function getTransactionSummarizedByType(
  userId: UsersE["id"],
  accountId: AccountsE["id"],
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
