import { Repository } from "~/adapter/repository";
import { AccountsE } from "~/domain/entity";
import { AccountSchema } from "~/domain/schema";

import { validateSchema } from "../utils";

export async function updateAccount(
  userId: AccountsE["userId"],
  id: AccountsE["id"],
  formData: FormData,
) {
  const { data, errors } = await validateSchema<typeof AccountSchema._type>(
    formData,
    AccountSchema,
  );

  if (errors) {
    return { errors };
  }

  const account = await Repository.account.updateAccount(userId, id, {
    ...data,
    main: data.main === "on",
  });

  return { account };
}
