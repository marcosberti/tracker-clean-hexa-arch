import { ActionFunctionArgs, json, redirect } from "@remix-run/node";

import { createCurrency } from "~/application/currencies";
import { requireUserId } from "~/application/session";

import Form from "./components/form";

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
  return <Form />;
}
