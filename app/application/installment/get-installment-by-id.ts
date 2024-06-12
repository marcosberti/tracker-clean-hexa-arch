import { Repository } from "~/adapter/repository";
import { InstallmentsE } from "~/domain/entity";

const SELECT = {
  id: true,
  title: true,
  description: true,
  amount: true,
  installments: true,
  firstPaymentDate: true,
  categoryId: true,
  currencyId: true,
};

export type InstallmentByIdSelect = {
  [Property in keyof Omit<
    typeof SELECT,
    "description" | "installments"
  >]: string;
} & {
  installments: number;
  description: string | null;
};

export function getInstallmentById(
  userId: InstallmentsE["userId"],
  accountId: InstallmentsE["accountId"],
  installmentId: InstallmentsE["id"],
) {
  return Repository.installments.getInstallmentById(
    userId,
    accountId,
    installmentId,
    SELECT,
  );
}
