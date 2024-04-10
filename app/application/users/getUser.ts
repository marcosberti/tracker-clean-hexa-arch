import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Repository } from "~/adapter/repository";

export async function getUserLoader({ request }: LoaderFunctionArgs) {
  // const userId = await Repository.session.requireUserId(request);

  // session no tiene que ser un repository pq las cosas propias del framework tiene que ir en /application
  throw new Error("asdadsa");

  const user = await Repository.user.getUserById(userId);

  return json({ user });
}
