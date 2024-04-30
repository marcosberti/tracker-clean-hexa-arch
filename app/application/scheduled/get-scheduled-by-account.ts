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

export type ScheduledSelect = {
  [Property in keyof Omit<typeof SELECT, "category">]: string;
} & {
  category: {
    color: string;
    icon: string;
  };
};

export async function getScheduledByAccount(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
) {
  return Repository.scheduled.getScheduledByAccount(userId, accountId, SELECT);
}
