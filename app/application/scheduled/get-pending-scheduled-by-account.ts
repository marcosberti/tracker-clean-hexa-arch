import { endOfMonth, startOfMonth } from "date-fns";

import { Repository } from "~/adapter/repository";
import { ScheduledE } from "~/domain/entity";

const SELECT = {
  id: true,
  title: true,
  description: true,
  amount: true,
  from: true,
  category: { select: { color: true, icon: true } },
};

export async function getPendingScheduledByAccount(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
  date: string,
) {
  const dateObj = new Date(`${date}T00:00:00`);
  const from = startOfMonth(dateObj).toISOString();
  const to = endOfMonth(dateObj).toISOString();

  return Repository.scheduled.getPendingScheduledByAccount(
    userId,
    accountId,
    SELECT,
    from,
    to,
  );
}
