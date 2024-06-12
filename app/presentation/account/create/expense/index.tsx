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
import { createInstallment } from "~/application/installment";
import { createScheduled } from "~/application/scheduled";
import { requireUserId } from "~/application/session";
import ExpenseForm, {
  Errors,
} from "~/presentation/account/components/expense-form";

type ExpenseType = "scheduled" | "installment";

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(typeof params.id === "string", "missing account param");

  const accountId = params.id;
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const expenseType = formData.get("expenseType") as ExpenseType;

  if (expenseType === "installment") {
    const { errors } = await createInstallment(userId, accountId, formData);

    if (errors) {
      return json({ expenseType, errors }, { status: 400 });
    }
  } else {
    const { errors } = await createScheduled(userId, accountId, formData);

    if (errors) {
      return json({ expenseType, errors }, { status: 400 });
    }
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

export default function CreateExpense() {
  const { accountCurrencyCode, categories, currencies } =
    useLoaderData<typeof loader>();

  const data = (useActionData<typeof action>() ?? {
    expenseType: undefined,
    errors: undefined,
  }) as Errors;

  return (
    <ExpenseForm
      accountCurrencyCode={accountCurrencyCode}
      categories={categories}
      currencies={currencies}
      actionErrors={data}
    />
  );
}
