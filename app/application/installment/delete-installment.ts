import { Repository } from "~/adapter/repository";
import { InstallmentsE } from "~/domain/entity";

export async function deleteInstallment(
  userId: InstallmentsE["userId"],
  accountId: InstallmentsE["accountId"],
  isntallmentId: InstallmentsE["id"],
) {
  try {
    await Repository.installments.deleteInstallment(
      userId,
      accountId,
      isntallmentId,
    );

    return { errors: null };
  } catch (e) {
    return { errors: "The installment could not be deleted" };
  }
}
