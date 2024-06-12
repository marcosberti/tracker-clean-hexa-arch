import { Repository } from "~/adapter/repository";
import { validateSchema } from "~/application/utils";
import { ScheduledE } from "~/domain/entity";
import { InstallmentSchema } from "~/domain/schema";

export async function updateInstallment(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
  id: ScheduledE["id"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof InstallmentSchema._type>(
    formData,
    InstallmentSchema,
    ["amount", "installments"],
  );

  if (errors) {
    return { errors };
  }

  const installment = await Repository.installments.updateInstallment(
    userId,
    accountId,
    id,
    data,
  );

  return { installment };
}
