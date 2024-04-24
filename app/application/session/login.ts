import { redirect } from "@remix-run/node";

import { getSession } from "./get-session";
import { USER_SESSION_KEY, sessionStorage } from "./session-storage";

export interface LoginArgs {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}

export async function login({
  request,
  userId,
  remember,
  redirectTo,
}: LoginArgs) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
