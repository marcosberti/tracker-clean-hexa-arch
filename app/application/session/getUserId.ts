import { UsersE } from "~/domain/entity";
import { getSession } from "./getSession";
import { USER_SESSION_KEY } from "./sessionStorage";

export async function getUserId(
  request: Request,
): Promise<UsersE["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
