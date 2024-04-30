import { Repository } from "~/adapter/repository";
import { AccountsE } from "~/domain/entity";
import { AccountSchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function createAccount(
  userId: AccountsE["userId"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof AccountSchema._type>(
    formData,
    AccountSchema,
  );

  if (errors) {
    return { errors };
  }

  const account = await Repository.account.createAccount({
    ...data,
    userId,
    main: data.main === "on",
  });

  return { account };
}
