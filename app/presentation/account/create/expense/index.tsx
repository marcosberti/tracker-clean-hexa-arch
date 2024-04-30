import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAccountById } from "~/application/accounts";
import { getCategories } from "~/application/categories";
import { getCurrencies } from "~/application/currencies";
import { createExpense } from "~/application/expenses";
import { requireUserId } from "~/application/session";

import Form from "./components/form";

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(typeof params.id === "string", "missing account param");

  const accountId = params.id;
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const { insErr, schedErr } = await createExpense(userId, accountId, formData);

  if (insErr || schedErr) {
    return json({ insErr, schedErr }, { status: 400 });
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

export default function ScheduleForm() {
  const { accountCurrencyCode, categories, currencies } =
    useLoaderData<typeof loader>();
  return (
    <Form
      accountCurrencyCode={accountCurrencyCode}
      categories={categories}
      currencies={currencies}
    />
  );
}
