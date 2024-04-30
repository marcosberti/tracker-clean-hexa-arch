import { Repository } from "~/adapter/repository";
import { ScheduledE } from "~/domain/entity";
import { InstallmentSchema, ScheduledSchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function createExpense(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
  formData: FormData,
) {
  const expenseType = formData.get("expenseType") as
    | "scheduled"
    | "installment";

  if (expenseType === "scheduled") {
    const { data, errors } = await validateSchema<typeof ScheduledSchema._type>(
      formData,
      ScheduledSchema,
      ["amount"],
    );

    if (errors) {
      return { schedErr: errors };
    }

    const scheduled = await Repository.scheduled.createScheduled({
      ...data,
      userId,
      accountId,
    });

    return { scheduled };
  } else if (expenseType === "installment") {
    const { data, errors } = await validateSchema<
      typeof InstallmentSchema._type
    >(formData, InstallmentSchema, ["amount", "installments"]);

    if (errors) {
      return { insErr: errors };
    }

    const installment = await Repository.installments.createInstallment({
      ...data,
      userId,
      accountId,
    });

    return { installment };
  } else {
    throw new Error(`invalid expense type: ${expenseType}`);
  }
}
