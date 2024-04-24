import { Repository } from "~/adapter/repository";
import { CurrenciesE } from "~/domain/entity";

const SELECT = {
  id: true,
  name: true,
  code: true,
};

export type CurrencySelect = {
  [Property in keyof typeof SELECT]: string;
};

export async function getCurrencies(userId: CurrenciesE["id"]) {
  return Repository.currency.getCurrencies(userId, SELECT);
}
