import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { createAccount } from "~/application/accounts";
import { getCurrencies } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import { AccountForm } from "~/presentation/components";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { account, errors } = await createAccount(userId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect(`/account/${account.id}`, {
    status: 201,
    headers: { "X-Remix-Redirect": `/account/${account.id}` },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const currencies = (await getCurrencies(userId)) ?? [];

  return json({ currencies });
}

export default function CreateAccount() {
  const { errors } = useActionData<typeof action>() ?? {};
  const { currencies } = useLoaderData<typeof loader>();

  return <AccountForm currencies={currencies} errors={errors} />;
}
