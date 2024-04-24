import { AccountRepository } from "./account/account-repository";
import { CategoryRepository } from "./category/category-repository";
import { CurrencyRepository } from "./currency/currency-repository";
import { TransactionRepository } from "./transaction/transaction-repository";
import { UserRepository } from "./user/user-repository";

function buildRepository() {
  return {
    user: { ...UserRepository() },
    account: { ...AccountRepository() },
    transaction: { ...TransactionRepository() },
    currency: { ...CurrencyRepository() },
    category: { ...CategoryRepository() },
  };
}

export const Repository = buildRepository();
