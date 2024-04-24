import { Repository } from "~/adapter/repository";
import { CurrenciesE } from "~/domain/entity";

export async function deleteCurrency(
  userId: CurrenciesE["userId"],
  currencyId: CurrenciesE["id"],
) {
  try {
    await Repository.currency.deleteCurrency(userId, currencyId);
    return { errors: null };
  } catch (e) {
    return {
      errors:
        "The currency could not be deleted, check the console for more info.",
    };
  }
}
