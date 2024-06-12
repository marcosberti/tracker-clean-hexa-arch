import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAccountById } from "~/application/accounts";
import { getCategories } from "~/application/categories";
import { getCurrencies } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import { createTransaction } from "~/application/transactions";
import TransactionForm from "~/presentation/account/components/transaction-form";

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(typeof params.id === "string", "missing account param");

  const accountId = params.id;
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const { errors } = await createTransaction(userId, accountId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect(`/account/${accountId}`, {
    status: 201,
    headers: {
      "X-Remix-Redirect": `/account/${accountId}`,
    },
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(typeof params.id === "string", "missing account param");

  const accountId = params.id;
  const userId = await requireUserId(request);
  const accountPromise = getAccountById(userId, accountId);
  const categoriesPromise = getCategories(userId);
  const currenciesPromise = getCurrencies(userId);

  const [account, categories, currencies] = await Promise.all([
    accountPromise,
    categoriesPromise,
    currenciesPromise,
  ]);

  return {
    accountCurrencyCode: account.currency.id,
    categories: categories ?? [],
    currencies: currencies ?? [],
  };
}

export default function CreateTransaction() {
  const { accountCurrencyCode, categories, currencies } =
    useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() ?? {};

  return (
    <TransactionForm
      accountCurrencyCode={accountCurrencyCode}
      categories={categories}
      currencies={currencies}
      errors={errors}
    />
  );
}
