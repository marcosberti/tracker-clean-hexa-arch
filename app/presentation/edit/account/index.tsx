import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { updateAccount, getAccountById } from "~/application/accounts";
import { getCurrencies } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import { AccountForm } from "~/presentation/components";

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = params.id;

  invariant(typeof accountId === "string", "account id missing");

  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { account, errors } = await updateAccount(userId, accountId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect(`/account/${account.id}`, {
    status: 200,
    headers: { "X-Remix-Redirect": `/account/${account.id}` },
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = params.id;

  invariant(typeof accountId === "string", "account id missing");

  const userId = await requireUserId(request);
  const accountPromise = getAccountById(userId, accountId);
  const currenciesPromise = getCurrencies(userId);

  const [account, currencies] = await Promise.all([
    accountPromise,
    currenciesPromise,
  ]);

  return json({ account, currencies: currencies ?? [] });
}

export default function EditAccount() {
  const { errors } = useActionData<typeof action>() ?? {};
  const { account, currencies } = useLoaderData<typeof loader>();

  return (
    <AccountForm account={account} currencies={currencies} errors={errors} />
  );
}
