import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import { Await, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAccountById } from "~/application/accounts";
import { getInstallmentsByAccount } from "~/application/installment";
import { getScheduledByAccount } from "~/application/scheduled";
import { requireUserId } from "~/application/session";
import {
  deleteTransaction,
  getTransactionSummarizedByType,
  getTransactionsByAccount,
} from "~/application/transactions";
import { Breadcrumb, BalanceCard } from "~/presentation/components";
import { useActionToast } from "~/presentation/hooks";
import { getMonthDefaultValue } from "~/presentation/utils";

import { ExpensesCarousel } from "./components/expense-carousel";
import { Transactions } from "./components/transactions";

export const ITEMS_PER_PAGE = 12;

type Actions = "delete";
type Entity = "transaction";

export async function action({ request, params }: ActionFunctionArgs) {
  invariant(params.id, "account id missing in params");

  const { id } = params;
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const [action, entity] = intent.split("-") as [Actions, Entity];

  let errors;
  let message;

  if (action === "delete" && entity === "transaction") {
    const transaction = formData.get("transaction");
    invariant(typeof transaction === "string", "missing transaction");

    const result = await deleteTransaction(userId, id, transaction);
    errors = result.errors;
    message = !errors ? "Transaction deleted" : null;
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
  const monthData = getTransactionSummarizedByType(userId, account.id, month);

  const items = [{ label: "Home", link: "/" }, { label: account.name }];

  return defer({
    account,
    month,
    page,
    items,
    transactions,
    monthData,
    expenses: Promise.all([scheduled, installments]),
  });
}

export default function Account() {
  const { account, month, page, items, transactions, expenses, monthData } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useActionToast(actionData);

  return (
    <div className="h-full">
      <div className="mb-8 h-10 flex items-center">
        <Breadcrumb items={items} />
      </div>
      <div className="flex gap-8 mb-4">
        <Await resolve={monthData}>
          <BalanceCard account={account} />
        </Await>
        <Await resolve={expenses}>
          <ExpensesCarousel currencyCode={account.currency.code} />
        </Await>
      </div>
      <div className="h-[calc(100%-150px-3rem)] flex gap-4">
        <div className="basis-[60%] lg:basis-[50%]">
          <Await resolve={transactions}>
            <Transactions
              month={month}
              page={page}
              currencyCode={account.currency.code}
            />
          </Await>
        </div>
        <div className="basis-[40%] lg:basis-[50%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// interface SchedItemArgs {
//   currencyCode: string;
// }

// function SchedItem({ currencyCode }: SchedItemArgs) {
//   return (
//     <li className="w-full flex items-center justify-between px-4 py-2 border-b-2 opacity-70">
//       <div className="flex items-center gap-2">
//         <Building className="size-6" />
//         <div className="flex flex-col">
//           <span className="font-semibold">alquiler</span>
//           <span className="text-xs">pending payment</span>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <ArrowUp className="size-4 text-green-600" />
//         <p className="font-bold">{formatAmount(123123, currencyCode)}</p>
//         <DropdownMenu>
//           <DropdownMenuTrigger>
//             <MoreVerticalIcon className="size-4" />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem className="text-gray-600 flex gap-2 items-center">
//               <Pencil className="size-4" /> <span>pay</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </li>
//   );
// }
