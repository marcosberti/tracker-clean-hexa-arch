import { Prisma } from "@prisma/client";
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

type Error = {
  errors: string;
  code: "ACCOUNT_NOT_FOUND";
};

export async function getAccountById(
  userId: AccountsE["id"],
  accountId: AccountsE["id"],
): Promise<Prisma.AccountsGetPayload<{ select: typeof SELECT }> | Error> {
  const account = await Repository.account.getAccountById(
    userId,
    accountId,
    SELECT,
  );
  if (!account) {
    return {
      errors: "Account not found",
      code: "ACCOUNT_NOT_FOUND",
    };
  }

  return account;
}
