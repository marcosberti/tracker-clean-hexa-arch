import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { createCurrency } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import CurrencyForm from "~/presentation/settings/components/currency-form";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { errors } = await createCurrency(userId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect("/settings", {
    status: 201,
    headers: { "X-Remix-Redirect": "/settings" },
  });
}

export default function CreateCurrency() {
  const { errors } = useActionData<typeof action>() ?? {};

  return <CurrencyForm errors={errors} />;
}
