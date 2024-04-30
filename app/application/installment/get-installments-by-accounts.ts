import { Repository } from "~/adapter/repository";
import { InstallmentsE } from "~/domain/entity";

const SELECT = {
  id: true,
  title: true,
  description: true,
  amount: true,
  installments: true,
  paidInstallments: true,
  category: { select: { color: true, icon: true } },
};

export type InstallmentSelect = {
  [Property in keyof Omit<typeof SELECT, "category">]: string;
} & {
  category: {
    color: string;
    icon: string;
  };
};

export async function getInstallmentsByAccount(
  userId: InstallmentsE["userId"],
  accountId: InstallmentsE["accountId"],
) {
  return Repository.installments.getInstallmentByAccount(
    userId,
    accountId,
    SELECT,
  );
}
