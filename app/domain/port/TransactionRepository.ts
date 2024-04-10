import { AccountsE, UsersE } from "../entity";

export interface TransactionRepositoryI {
  getTransactionById: () => void;
  getTransactionByAccount: () => void;
  getTransactionSummarizedByType: (
    userId: UsersE["id"],
    accountId: AccountsE["id"],
    from: string,
    to: string,
  ) => Promise<{ income: number; spent: number }>;
  createTransaction: () => void;
  deleteTransaction: () => void;
}
