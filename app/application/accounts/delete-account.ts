import { Repository } from "~/adapter/repository";
import { AccountsE } from "~/domain/entity";

type Errors =
  | {
      errors: string;
      code: "ACCOUNT_NOT_FOUND";
    }
  | { errors: null };

export async function deleteAccount(
  userId: AccountsE["userId"],
  id: AccountsE["id"],
): Promise<Errors> {
  try {
    await Repository.account.deleteAccount(userId, id);
    return { errors: null };
  } catch (e) {
    return {
      errors:
        "The account could not be deleted, check the console for more info.",
      code: "ACCOUNT_NOT_FOUND",
    };
  }
}
