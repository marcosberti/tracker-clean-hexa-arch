import { Repository } from "~/adapter/repository";
import { CurrenciesE } from "~/domain/entity";
import { CurrencySchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function createCurrency(
  userId: CurrenciesE["userId"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof CurrencySchema._type>(
    formData,
    CurrencySchema,
  );

  if (errors) {
    return { errors };
  }

  const { name, code } = data;
  const account = await Repository.currency.createCurrency(userId, name, code);

  return { account };
}
