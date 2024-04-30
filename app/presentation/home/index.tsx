import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  defer,
  json,
} from "@remix-run/node";
import { Await, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteAccount, getAccounts } from "~/application/accounts";
import { getCategories } from "~/application/categories";
import { deleteCategory } from "~/application/categories/delete-category";
import { requireUserId } from "~/application/session";
import {
  getTransactionSummarizedByType,
  getTransactionsByAccount,
} from "~/application/transactions";
import { BalanceCard } from "~/presentation/components";
import { useActionToast } from "~/presentation/hooks";
import { getMonthDefaultValue } from "~/presentation/utils";

import AccountsCarousel from "./components/accounts-carousel";
import Categories from "./components/categories";
import MonthlyChart from "./components/monthly-chart";
import RecentActivity from "./components/recent-activity";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

type Actions = "delete";
type Entity = "category" | "account";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const intent = formData.get("intent") as string;
  const [action, entity] = intent.split("-") as [Actions, Entity];

  let errors;
  let message;

  if (action === "delete" && entity === "category") {
    const category = formData.get("category");

    invariant(typeof category === "string", "missing category");

    const result = await deleteCategory(userId, category);
    errors = result.errors;
    message = !errors ? "Category deleted" : null;
  } else if (action === "delete" && entity === "account") {
    const account = formData.get("account");

    invariant(typeof account === "string", "missing account");

    const result = await deleteAccount(userId, account);
    errors = result.errors;
    message = !errors ? "Account deleted" : null;
  }

  return json({ intent, message, errors }, { status: errors ? 400 : 200 });
}

const PAGE = 1;
const TAKE = 9;

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const accounts = await getAccounts(userId);
  const categories = getCategories(userId);

  const account = accounts?.find((a) => a.main);

  // TODO: send month in params
  const url = new URL(request.url);
  let month = url.searchParams.get("month") as string;

  if (!month) {
    month = getMonthDefaultValue();
  }

  const transactions = account
    ? getTransactionsByAccount(userId, account.id, PAGE, TAKE, month)
    : Promise.resolve([]);

  const monthData = account
    ? await getTransactionSummarizedByType(userId, account.id, month)
    : Promise.resolve({ income: 0, spent: 0 });

  return defer({
    accounts: accounts ?? [],
    categories,
    transactions,
    account,
    monthData,
  });
}

export default function Index() {
  const { accounts, account, categories, transactions, monthData } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useActionToast(actionData);

  return (
    <>
      <div className="flex align-top mb-8">
        <h1 className="text-4xl font-bold">Overview</h1>
      </div>
      <div className="flex gap-8">
        <Await resolve={monthData}>
          <BalanceCard account={account} />
        </Await>
        <AccountsCarousel accounts={accounts} />
      </div>
      <div className="flex gap-8 pt-8 flex-col md:flex-row">
        <div className="hidden lg:block lg:w-[65%] 2xl:w-[50%]">
          <MonthlyChart />
        </div>
        <div className="w-full md:w-[50%] lg:w-[35%] 2xl:w-[25%]">
          <Await resolve={transactions}>
            <RecentActivity account={account} />
          </Await>
        </div>
        <div className="w-full md:w-[50%] lg:hidden 2xl:block 2xl:w-[25%]">
          <Await resolve={categories}>
            <Categories />
          </Await>
        </div>
      </div>
    </>
  );
}
