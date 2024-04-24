import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";

import { createAccount } from "~/application/accounts";
import { getCurrencies } from "~/application/currencies";
import { requireUserId } from "~/application/session";

import Form from "./components/form";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { account, errors } = await createAccount(userId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect(`/accounts/${account.id}`, {
    status: 201,
    headers: { "X-Remix-Redirect": `/accounts/${account.id}` },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const currencies = (await getCurrencies(userId)) ?? [];

  return json({ currencies });
}

export default function CreateAccount() {
  return <Form />;
}
