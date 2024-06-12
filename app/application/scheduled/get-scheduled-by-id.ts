import { Repository } from "~/adapter/repository";
import { ScheduledE } from "~/domain/entity";

const SELECT = {
  id: true,
  title: true,
  description: true,
  amount: true,
  from: true,
  to: true,
  categoryId: true,
  currencyId: true,
};

export type ScheduledByIdSelect = {
  [Property in keyof Omit<typeof SELECT, "to" | "description">]: string;
} & {
  to: string | null;
  description: string | null;
};

export function getScheduledById(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
  scheduledId: ScheduledE["id"],
) {
  return Repository.scheduled.getScheduledById(
    userId,
    accountId,
    scheduledId,
    SELECT,
  );
}
