import { UserRepository } from "./user/userRepository";
import { AccountRepository } from "./account/accountRepository";
import { TransactionRepository } from "./transaction/transactionRepository";

function buildRepository() {
  return {
    user: { ...UserRepository() },
    account: { ...AccountRepository() },
    transaction: { ...TransactionRepository() },
  };
}

export const Repository = buildRepository();
