import { endOfMonth, startOfMonth } from "date-fns";

import { Repository } from "~/adapter/repository";
import { TransactionsE } from "~/domain/entity";

const ITEMS_PER_PAGE = 5;

const SELECT = {
  id: true,
  title: true,
  description: true,
  amount: true,
  type: true,
  createdAt: true,
  category: { select: { color: true, icon: true } },
};

export type TransactionsSelect = {
  [Property in keyof Omit<typeof SELECT, "category">]: string;
} & {
  category: {
    color: string;
    icon: string;
  };
};

export async function getTransactionsByAccount(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
  page: number,
  date: string,
) {
  const dateObj = new Date(`${date}T00:00:00`);
  const from = startOfMonth(dateObj).toISOString();
  const to = endOfMonth(dateObj).toISOString();

  const skip = (page - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  return Repository.transaction.getTransactionsByAccount(
    userId,
    accountId,
    skip,
    take,
    SELECT,
    from,
    to,
  );
}
