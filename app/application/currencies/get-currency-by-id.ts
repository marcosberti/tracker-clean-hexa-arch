import { Repository } from "~/adapter/repository";
import { CurrenciesE } from "~/domain/entity";

const SELECT = {
  id: true,
  name: true,
  code: true,
};

export type CurrencySelectById = {
  [Property in keyof typeof SELECT]: string;
};

export async function getCurrencyById(
  userId: CurrenciesE["userId"],
  currencyId: CurrenciesE["id"],
) {
  const currency = await Repository.currency.getCurrencyById(
    userId,
    currencyId,
    SELECT,
  );

  if (!currency) {
    throw new Error("Currency not found.");
  }
  return currency;
}
