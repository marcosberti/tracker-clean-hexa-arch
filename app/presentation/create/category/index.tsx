import { ActionFunctionArgs, json, redirect } from "@remix-run/node";

import { createCategory } from "~/application/categories";
import { requireUserId } from "~/application/session";

import Form from "./components/form";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { errors } = await createCategory(userId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect("/", {
    status: 201,
    headers: { "X-Remix-Redirect": "/" },
  });
}

export default function CreateAccount() {
  return <Form />;
}
