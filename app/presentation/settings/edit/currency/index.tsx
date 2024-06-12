import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getCurrencyById, updateCurrency } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import CurrencyForm from "~/presentation/settings/components/currency-form";

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(typeof params.id === "string", "missing currency id");

  const userId = await requireUserId(request);
  const currencyId = params.id;
  const formData = await request.formData();
  const { errors } = await updateCurrency(userId, currencyId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect("/settings", {
    status: 200,
    headers: { "X-Remix-Redirect": "/settings" },
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(typeof params.id === "string", "missing currency id");

  const userId = await requireUserId(request);
  const currencyId = params.id;
  const currency = await getCurrencyById(userId, currencyId);

  return json({ currency });
}

export default function CreateCurrency() {
  const { currency } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() ?? {};

  return <CurrencyForm currency={currency} errors={errors} />;
}
