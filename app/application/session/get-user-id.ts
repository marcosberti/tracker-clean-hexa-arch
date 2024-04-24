import { UsersE } from "~/domain/entity";

import { getSession } from "./get-session";
import { USER_SESSION_KEY } from "./session-storage";

export async function getUserId(
  request: Request,
): Promise<UsersE["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
