import { json, redirect } from "@remix-run/node";
import { getUserId } from "./getUserId";

export async function checkLoggedOut(request: Request) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}
