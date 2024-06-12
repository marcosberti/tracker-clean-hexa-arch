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
import {
  getTransactionById,
  updateTransaction,
} from "~/application/transactions";
import TransactionForm from "~/presentation/account/components/transaction-form";

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(typeof params.id === "string", "missing account param");
  invariant(typeof params.txId === "string", "missing transaction param");

  const accountId = params.id;
  const transactionId = params.txId;
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const { errors } = await updateTransaction(
    userId,
    accountId,
    transactionId,
    formData,
  );

  if (errors) {
    return json({ errors }, { status: 400 });
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
  invariant(typeof params.txId === "string", "missing transaction param");

  const userId = await requireUserId(request);
  const accountId = params.id;
  const transactionId = params.txId;
  const transactionPromise = getTransactionById(
    userId,
    accountId,
    transactionId,
  );
  const accountPromise = getAccountById(userId, accountId);
  const categoriesPromise = getCategories(userId);
  const currenciesPromise = getCurrencies(userId);

  const [transaction, account, categories, currencies] = await Promise.all([
    transactionPromise,
    accountPromise,
    categoriesPromise,
    currenciesPromise,
  ]);

  return json({
    transaction,
    accountCurrencyCode: account.currency.id,
    categories: categories ?? [],
    currencies: currencies ?? [],
  });
}

export default function EditTransaction() {
  const { transaction, accountCurrencyCode, categories, currencies } =
    useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() ?? {};

  return (
    <TransactionForm
      transaction={transaction}
      accountCurrencyCode={accountCurrencyCode}
      categories={categories}
      currencies={currencies}
      errors={errors}
    />
  );
}
