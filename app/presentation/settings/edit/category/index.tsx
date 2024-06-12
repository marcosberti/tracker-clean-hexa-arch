import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getCategoryById, updateCategory } from "~/application/categories";
import { requireUserId } from "~/application/session";
import CategoryForm from "~/presentation/settings/components/category-form";

export const shouldRevalidate = () => {
  return true;
};

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(typeof params.id === "string", "missing category id");

  const userId = await requireUserId(request);
  const categoryId = params.id;
  const formData = await request.formData();
  const { errors } = await updateCategory(userId, categoryId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect("/settings", {
    status: 200,
    headers: { "X-Remix-Redirect": "/settings" },
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(typeof params.id === "string", "missing category id");

  const userId = await requireUserId(request);
  const categoryId = params.id;
  const category = await getCategoryById(userId, categoryId);

  return json({ category });
}

export default function CreateCategory() {
  const { category } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() ?? {};

  return <CategoryForm category={category} errors={errors} />;
}
