import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { createCategory } from "~/application/categories";
import { requireUserId } from "~/application/session";
import CategoryForm from "~/presentation/settings/components/category-form";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { errors } = await createCategory(userId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect("/settings", {
    status: 201,
    headers: { "X-Remix-Redirect": "/settings" },
  });
}

export default function CreateCategory() {
  const { errors } = useActionData<typeof action>() ?? {};

  return <CategoryForm errors={errors} />;
}
