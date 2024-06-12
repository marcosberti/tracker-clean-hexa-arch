import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import {
  Await,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { PlusCircle } from "lucide-react";
import { Suspense, useState } from "react";
import invariant from "tiny-invariant";

import { getAccountById } from "~/application/accounts";
import {
  deleteInstallment,
  getInstallmentsByAccount,
  getPendingInstallmentsByAccount,
} from "~/application/installment";
import {
  deleteScheduled,
  getPendingScheduledByAccount,
  getScheduledByAccount,
} from "~/application/scheduled";
import { requireUserId } from "~/application/session";
import {
  deleteTransaction,
  getTransactionSummarizedByType,
  getTransactionsByAccount,
  payInstallment,
  paySchedule,
} from "~/application/transactions";
import { BalanceCard } from "~/presentation/components";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "~/presentation/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/presentation/components/ui/tabs";
import { useActionToast } from "~/presentation/hooks";
import { getMonthDefaultValue } from "~/presentation/utils";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { Expenses } from "./components/expenses";
import { PendingPayments } from "./components/pending-payments";
import { Transactions } from "./components/transactions";

export const ITEMS_PER_PAGE = 12;

type Intent =
  | "delete-transaction"
  | "delete-scheduled"
  | "delete-installment"
  | "pay-scheduled"
  | "pay-installment";

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = params.id;
  invariant(typeof accountId === "string", "account id missing in params");

  const userId = await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent") as Intent;

  let errors;
  let message;

  if (intent === "delete-transaction") {
    const transaction = formData.get("transaction");
    invariant(typeof transaction === "string", "missing transaction");

    const result = await deleteTransaction(userId, accountId, transaction);
    errors = result.errors;
    message = !errors ? "Transaction deleted" : null;
  } else if (intent === "delete-scheduled") {
    const scheduled = formData.get("scheduled");
    invariant(typeof scheduled === "string", "missing scheduled");

    const result = await deleteScheduled(userId, accountId, scheduled);
    errors = result.errors;
    message = !errors ? "Scheduled deleted" : null;
  } else if (intent === "delete-installment") {
    const installment = formData.get("installment");
    invariant(typeof installment === "string", "missing installment");

    const result = await deleteInstallment(userId, accountId, installment);
    errors = result.errors;
    message = !errors ? "Installment deleted" : null;
  } else if (intent === "pay-scheduled") {
    const scheduled = formData.get("scheduled");
    invariant(typeof scheduled === "string", "missing scheduled");

    const result = await paySchedule(userId, accountId, scheduled);
    errors = result.errors;
    message = !errors ? "Transaction created" : null;
  } else if (intent === "pay-installment") {
    const installment = formData.get("installment");
    invariant(typeof installment === "string", "missing installment");

    const result = await payInstallment(userId, accountId, installment);
    errors = result.errors;
    message = !errors ? "Transaction created" : null;
  }

  return json({ intent, message, errors }, { status: errors ? 400 : 200 });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "account id missing in params");

  const url = new URL(request.url);
  let month = url.searchParams.get("month") as string;
  let page = Number(url.searchParams.get("page"));

  if (!month) {
    month = getMonthDefaultValue();
  }

  if (!page) {
    page = 1;
  }

  const { id } = params;

  const userId = await requireUserId(request);
  const account = await getAccountById(userId, id);
  const scheduled = getScheduledByAccount(userId, account.id);
  const installments = getInstallmentsByAccount(userId, account.id);
  const transactions = getTransactionsByAccount(
    userId,
    account.id,
    page,
    ITEMS_PER_PAGE,
    month,
  );
  const pendingScheduled = getPendingScheduledByAccount(
    userId,
    account.id,
    month,
  );
  const pendingInstallments = getPendingInstallmentsByAccount(
    userId,
    account.id,
    month,
  );

  const monthData = getTransactionSummarizedByType(userId, account.id, month);

  return defer({
    page,
    month,
    account,
    monthData,
    transactions,
    pending: Promise.all([pendingScheduled, pendingInstallments]),
    expenses: Promise.all([scheduled, installments]),
  });
}

function getIsInCurrentMonth(month: string) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  return month === currentMonth;
}

export default function Account() {
  const { account, month, page, transactions, expenses, monthData, pending } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useActionToast(actionData);
  const submit = useSubmit();
  const [currentTab, setCurrentTab] = useState<
    "transactions" | "pendingPayments"
  >("transactions");

  function handleValueChange(val: string) {
    setCurrentTab(val as "transactions" | "pendingPayments");
  }

  const isInCurrentMonth = getIsInCurrentMonth(month);

  return (
    <main className="p-4 sm:p-6">
      <div className="flex gap-8">
        <Await resolve={monthData}>
          <BalanceCard account={account} />
        </Await>
        <Await resolve={expenses}>
          <Expenses currencyCode={account.currency.code} />
        </Await>
      </div>
      <div className="grid gap-4 mt-8 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Tabs value={currentTab} onValueChange={handleValueChange}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger
                  value="pendingPayments"
                  disabled={!isInCurrentMonth}
                >
                  Pending payments
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="transactions">
              <Card className="bg-background">
                <CardHeader className="px-7">
                  <div className="flex items-center justify-between">
                    <CardTitle>Transactions</CardTitle>
                    <div className="flex items-center gap-2">
                      <Input
                        type="month"
                        value={month}
                        className="dark:[color-scheme:dark]"
                        onChange={(e) => {
                          submit(
                            { page: 1, month: e.currentTarget.value },
                            { method: "get" },
                          );
                        }}
                      />
                      <Button asChild disabled={!isInCurrentMonth}>
                        <Link
                          to={{
                            pathname: `create/transaction`,
                            search: `?page=${page}&month=${month}`,
                          }}
                          className={
                            isInCurrentMonth
                              ? "pointer-events-auto"
                              : "pointer-events-none opacity-50"
                          }
                        >
                          <PlusCircle className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={null}>
                    <Await resolve={transactions}>
                      <Transactions
                        month={month}
                        page={page}
                        currencyCode={account.currency.code}
                      />
                    </Await>
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pendingPayments">
              <Card className="bg-background">
                <CardHeader className="px-7">
                  <CardTitle>Pending payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={null}>
                    <Await resolve={pending}>
                      <PendingPayments currencyCode={account.currency.code} />
                    </Await>
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
