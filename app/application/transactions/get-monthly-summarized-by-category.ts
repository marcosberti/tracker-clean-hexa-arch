import { endOfMonth, startOfMonth } from "date-fns";

import { Repository } from "~/adapter/repository";
import { TransactionsE } from "~/domain/entity";

const SELECT = {
  id: true,
  name: true,
  color: true,
};

export async function getMonthlySummarizedByCategory(
  userId: TransactionsE["userId"],
  accountId: TransactionsE["accountId"],
) {
  const year = new Date().getFullYear();
  const categories = await Repository.category.getCategories(userId, SELECT);

  if (!categories) {
    throw new Error("missing categories");
  }

  const promises = new Array(12).fill("").map((_, i) => {
    const month = i < 9 ? `0${i + 1}` : i + 1;
    const date = new Date(`${year}-${month}-01T00:00:00`);
    const from = startOfMonth(date).toISOString();
    const to = endOfMonth(date).toISOString();

    return Repository.transaction.getTransactionSummarizedByCategory(
      userId,
      accountId,
      from,
      to,
    );
  });

  const data = await Promise.all(promises);

  const monthlyData = data.map((d) => {
    const keys = Object.keys(d).filter((k) => k !== "month");
    const data = keys.reduce(
      (acc, k) => {
        const category = categories.find((c) => c.id === k);
        acc[category!.name] = d[k];

        return acc;
      },
      { month: d.month } as Record<string, string | number>,
    );

    return data;
  });

  return { monthlyData, categories };
}
