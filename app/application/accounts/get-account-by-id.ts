import { Repository } from "~/adapter/repository";
import { AccountsE } from "~/domain/entity";

const SELECT = {
  id: true,
  name: true,
  icon: true,
  color: true,
  balance: true,
  createdAt: true,
  updatedAt: true,
  main: true,

  currency: {
    select: {
      id: true,
      code: true,
    },
  },
};

export type AccountByIdSelect = {
  [Property in keyof Omit<typeof SELECT, "currency" | "main">]: string;
} & {
  currency: {
    code: string;
  };
};

export async function getAccountById(
  userId: AccountsE["id"],
  accountId: AccountsE["id"],
) {
  const account = await Repository.account.getAccountById(
    userId,
    accountId,
    SELECT,
  );
  if (!account) {
    throw new Error("Account not found.");
  }

  return account;
}
