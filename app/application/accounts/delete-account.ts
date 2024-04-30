import { Repository } from "~/adapter/repository";
import { AccountsE } from "~/domain/entity";

export async function deleteAccount(
  userId: AccountsE["userId"],
  id: AccountsE["id"],
) {
  try {
    await Repository.account.deleteAccount(userId, id);
    return { errors: null };
  } catch (e) {
    return {
      errors:
        "The account could not be deleted, check the console for more info.",
    };
  }
}
