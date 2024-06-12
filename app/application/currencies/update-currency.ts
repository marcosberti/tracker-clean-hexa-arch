import { Repository } from "~/adapter/repository";
import { CurrenciesE } from "~/domain/entity";
import { CurrencySchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function updateCurrency(
  userId: CurrenciesE["userId"],
  id: CurrenciesE["id"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof CurrencySchema._type>(
    formData,
    CurrencySchema,
  );

  if (errors) {
    return { errors };
  }

  const account = await Repository.currency.updateCurrency(userId, id, data);

  return { account };
}
