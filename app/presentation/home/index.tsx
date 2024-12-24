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
import { deleteCategory } from "~/application/categories/delete-category";
import { requireUserId } from "~/application/session";
import {
  getMonthlySummarizedByCategory,
  getMonthlySummarizedByType,
  getTransactionSummarizedByType,
  getTransactionsByAccount,
} from "~/application/transactions";
import { BalanceCard } from "~/presentation/components";
import AccountCard from "~/presentation/components/account-card";
import {
  ScrollArea,
  ScrollBar,
} from "~/presentation/components/ui/scroll-area";
import { useActionToast } from "~/presentation/hooks";
import { getMonthDefaultValue } from "~/presentation/utils";

import CategoriesChart from "./components/categories-chart";
import MonthlyChart from "./components/monthly-chart";
import RecentActivity from "./components/recent-activity";

export const meta: MetaFunction = () => [{ title: "Tracker" }];

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

  const account = accounts?.find((a) => a.main);

  const month = getMonthDefaultValue();

  const transactions = account
    ? getTransactionsByAccount(userId, account.id, PAGE, TAKE, month)
    : Promise.resolve([]);

  const monthData = account
    ? getTransactionSummarizedByType(userId, account.id, month)
    : Promise.resolve({ income: 0, spent: 0 });

  const monthlyData = account
    ? getMonthlySummarizedByType(userId, account.id)
    : Promise.resolve([]);

  const monthlyCategoryData = account
    ? getMonthlySummarizedByCategory(userId, account.id)
    : Promise.resolve([]);

  return defer({
    accounts: accounts ?? [],
    transactions,
    account,
    monthData,
    monthlyData,
    monthlyCategoryData,
  });
}

export default function Index() {
  const {
    accounts,
    account,
    transactions,
    monthData,
    monthlyData,
    monthlyCategoryData,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useActionToast(actionData);

  return (
    <ScrollArea className="h-[calc(100vh-4.5rem-2rem)] sm:h-[calc(100vh-4.5rem-3rem)]">
      <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-6 h-full">
        <div className="flex flex-col sm:flex-row gap-8">
          <div>
            <Await resolve={monthData}>
              <BalanceCard account={account} />
            </Await>
          </div>
          <ScrollArea className="w-[calc(100dvw-2rem)] whitespace-nowrap">
            <div className="flex w-max space-x-4">
              {accounts.map((a) => (
                <AccountCard key={a.id} account={a} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 lg:grid-rows-1 xl:grid-cols-4 h-full">
          <Await resolve={monthlyData}>
            <MonthlyChart currencyCode={account?.currency.code} />
          </Await>
          <div className="hidden md:block">
            <Await resolve={monthlyCategoryData}>
              <CategoriesChart />
            </Await>
          </div>
          <Await resolve={transactions}>
            <RecentActivity account={account} />
          </Await>
        </div>
      </main>
      <ScrollBar />
    </ScrollArea>
  );
}
