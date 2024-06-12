import { Repository } from "~/adapter/repository";
import { validateSchema } from "~/application/utils";
import { ScheduledE } from "~/domain/entity";
import { ScheduledSchema } from "~/domain/schema";

export async function createScheduled(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof ScheduledSchema._type>(
    formData,
    ScheduledSchema,
    ["amount"],
  );

  if (errors) {
    return { errors };
  }

  const scheduled = await Repository.scheduled.createScheduled({
    ...data,
    userId,
    accountId,
  });

  return { scheduled };
}
