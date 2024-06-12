import { Repository } from "~/adapter/repository";
import { ScheduledE } from "~/domain/entity";

export async function deleteScheduled(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
  scheduledId: ScheduledE["id"],
) {
  try {
    await Repository.scheduled.deleteScheduled(userId, accountId, scheduledId);
    return { errors: null };
  } catch (e) {
    return { errors: "The scheduled could not be deleted" };
  }
}
