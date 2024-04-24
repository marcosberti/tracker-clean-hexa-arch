import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAccounts } from "~/application/accounts";
import { getCategories } from "~/application/categories";
import { deleteCategory } from "~/application/categories/delete-category";
import { requireUserId } from "~/application/session";
import { getTransactionSummarizedByType } from "~/application/transactions";
import { BalanceCard } from "~/presentation/components";
import { useActionToast } from "~/presentation/hooks";

import AccountsCarousel from "./components/accounts-carousel";
import Categories from "./components/categories";
import MonthlyChart from "./components/monthly-chart";
import RecentActivity from "./components/recent-activity";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const intent = formData.get("intent") as string;
  const category = formData.get("category");

  invariant(typeof category === "string", "missing category");

  const { errors } = await deleteCategory(userId, category);

  return json(
    {
      intent,
      message: errors ? null : "Category deleted successfully",
      errors,
    },
    { status: errors ? 400 : 200 },
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const accounts = await getAccounts(userId);
  const categories = await getCategories(userId);

  const account = accounts?.find((a) => a.main);
  const { income, spent } = account
    ? await getTransactionSummarizedByType(userId, account.id)
    : { income: 0, spent: 0 };

  return json({
    accounts: accounts ?? [],
    categories: categories ?? [],
    account,
    income,
    spent,
  });
}

export default function Index() {
  const { accounts, account, categories, income, spent } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useActionToast(actionData);

  return (
    <>
      <div className="flex align-top mb-8">
        <h1 className="text-4xl font-bold">Overview</h1>
      </div>
      <div className="flex gap-8">
        <BalanceCard account={account} income={income} spent={spent} />
        <AccountsCarousel accounts={accounts} />
      </div>
      <div className="flex gap-8 pt-8 flex-col md:flex-row">
        <div className="hidden lg:block lg:w-[65%] 2xl:w-[50%]">
          <MonthlyChart />
        </div>
        <div className="w-full md:w-[50%] lg:w-[35%] 2xl:w-[25%]">
          <RecentActivity account={account} />
        </div>
        <div className="w-full md:w-[50%] lg:hidden 2xl:block 2xl:w-[25%]">
          <Categories categories={categories} />
        </div>
      </div>
    </>
  );
}
