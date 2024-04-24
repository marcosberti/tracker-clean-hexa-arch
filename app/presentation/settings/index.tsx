import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import { Await, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getCategories, deleteCategory } from "~/application/categories";
import { deleteCurrency, getCurrencies } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import { useActionToast } from "~/presentation/hooks";

import { CategoryItems } from "./category-items";
import { CurrencyItems } from "./currency-items";
import { EntityCarousel } from "./entity-carousel";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const intent = formData.get("intent") as string;
  const [action, entity] = intent.split("-");

  let errors;
  let message;

  if (action === "delete" && entity === "currency") {
    const currency = formData.get("currency");

    invariant(typeof currency === "string", "missing currency");
    const result = await deleteCurrency(userId, currency);
    errors = result.errors;
    message = !errors ? "Currency deleted" : null;
  }

  if (action === "delete" && entity === "category") {
    const category = formData.get("category");

    invariant(typeof category === "string", "missing category");
    const result = await deleteCategory(userId, category);
    errors = result.errors;
    message = !errors ? "Category deleted" : null;
  }

  return json({ intent, message, errors }, { status: errors ? 400 : 200 });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const currencies = getCurrencies(userId);
  const categories = getCategories(userId);

  return defer({ currencies, categories });
}

export default function Settings() {
  const { currencies, categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useActionToast(actionData);

  return (
    <>
      <div className="flex align-top mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>
      <div className="flex flex-col gap-4">
        <Await resolve={currencies}>
          <EntityCarousel
            title="Currencies"
            createRoute="/create/currency"
            items={CurrencyItems}
          />
        </Await>
        <Await resolve={categories}>
          <EntityCarousel
            title="Categories"
            createRoute="/create/category"
            items={CategoryItems}
          />
        </Await>
        <h2 className="text-lg font-semibold">Installments</h2>
        <h2 className="text-lg font-semibold">Scheduled</h2>
      </div>
    </>
  );
}
