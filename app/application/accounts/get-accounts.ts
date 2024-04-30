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

export type AccountSelect = {
  [Property in keyof Omit<typeof SELECT, "currency" | "main">]: string;
} & {
  main: boolean;
} & {
  currency: {
    id: string;
    code: string;
  };
};

export async function getAccounts(userId: AccountsE["id"]) {
  return Repository.account.getAccounts(userId, SELECT);
}
