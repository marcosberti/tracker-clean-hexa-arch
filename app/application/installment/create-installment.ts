import { Repository } from "~/adapter/repository";
import { validateSchema } from "~/application/utils";
import { ScheduledE } from "~/domain/entity";
import { InstallmentSchema } from "~/domain/schema";

export async function createInstallment(
  userId: ScheduledE["userId"],
  accountId: ScheduledE["accountId"],
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

  const installment = await Repository.installments.createInstallment({
    ...data,
    userId,
    accountId,
  });

  return { installment };
}
