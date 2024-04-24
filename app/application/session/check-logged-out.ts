import { json, redirect } from "@remix-run/node";

import { getUserId } from "./get-user-id";

export async function checkLoggedOut(request: Request) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}
