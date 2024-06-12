import { endOfMonth, startOfMonth } from "date-fns";

import { Repository } from "~/adapter/repository";
import { InstallmentsE } from "~/domain/entity";

const SELECT = {
  id: true,
  title: true,
  description: true,
  amount: true,
  installments: true,
  paidInstallments: true,
  category: { select: { color: true, icon: true } },
};

export async function getPendingInstallmentsByAccount(
  userId: InstallmentsE["userId"],
  accountId: InstallmentsE["accountId"],
  date: string,
) {
  const dateObj = new Date(`${date}T00:00:00`);
  const from = startOfMonth(dateObj).toISOString();
  const to = endOfMonth(dateObj).toISOString();

  return Repository.installments.getPendingInstallmentsByAccount(
    userId,
    accountId,
    SELECT,
    from,
    to,
  );
}
