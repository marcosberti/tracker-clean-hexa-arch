import { UsersE } from "~/domain/entity";
import { getUserId } from "./getUserId";
import { redirect } from "@remix-run/node";

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
): Promise<UsersE["id"]> {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
