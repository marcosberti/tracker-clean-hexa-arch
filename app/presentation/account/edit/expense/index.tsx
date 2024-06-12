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
import {
  getInstallmentById,
  updateInstallment,
} from "~/application/installment";
import { getScheduledById, updateScheduled } from "~/application/scheduled";
import { requireUserId } from "~/application/session";
import ExpenseForm, {
  Errors,
} from "~/presentation/account/components/expense-form";

type ExpenseType = "scheduled" | "installment";

export const shouldRevalidate = () => {
  return true;
};

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(typeof params.id === "string", "missing account param");
  invariant(typeof params.exId === "string", "missing expense param");

  const accountId = params.id;
  const expenseId = params.exId;
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const expenseType = formData.get("expenseType") as ExpenseType;

  if (expenseType === "installment") {
    const { errors } = await updateInstallment(
      userId,
      accountId,
      expenseId,
      formData,
    );

    if (errors) {
      return json({ expenseType, errors }, { status: 400 });
    }
  } else {
    const { errors } = await updateScheduled(
      userId,
      accountId,
      expenseId,
      formData,
    );

    if (errors) {
      return json({ expenseType, errors }, { status: 400 });
    }
  }

  return redirect(`/account/${accountId}`, {
    status: 200,
    headers: {
      "X-Remix-Redirect": `/account/${accountId}`,
    },
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(typeof params.id === "string", "missing account param");
  invariant(typeof params.exId === "string", "missing expense param");

  const accountId = params.id;
  const expenseId = params.exId;
  const userId = await requireUserId(request);
  const accountPromise = await getAccountById(userId, accountId);

  const [scheduled, installment] = await Promise.all([
    getScheduledById(userId, accountId, expenseId),
    getInstallmentById(userId, accountId, expenseId),
  ]);

  if (!scheduled && !installment) {
    throw json("invalid expense", { status: 400 });
  }

  const categoriesPromise = getCategories(userId);
  const currenciesPromise = getCurrencies(userId);

  const [account, categories, currencies] = await Promise.all([
    accountPromise,
    categoriesPromise,
    currenciesPromise,
  ]);

  return json({
    scheduled,
    installment,
    accountCurrencyCode: account.currency.id,
    categories: categories ?? [],
    currencies: currencies ?? [],
  });
}

export default function EditExpense() {
  const {
    scheduled,
    installment,
    accountCurrencyCode,
    categories,
    currencies,
  } = useLoaderData<typeof loader>();

  const data = (useActionData<typeof action>() ?? {
    expenseType: undefined,
    errors: undefined,
  }) as Errors;

  return (
    <ExpenseForm
      scheduled={scheduled}
      installment={installment}
      accountCurrencyCode={accountCurrencyCode}
      categories={categories}
      currencies={currencies}
      actionErrors={data}
    />
  );
}
