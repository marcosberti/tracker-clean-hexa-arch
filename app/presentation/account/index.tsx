import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import {
  ArrowUp,
  Building,
  MoreVerticalIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import invariant from "tiny-invariant";

import { getAccountById } from "~/application/accounts";
import { requireUserId } from "~/application/session";
import {
  TransactionsSelect,
  getTransactionsByAccount,
} from "~/application/transactions";
import { Breadcrumb, BalanceCard, Card } from "~/presentation/components";
import { Badge } from "~/presentation/components/ui/badge";
import { Button } from "~/presentation/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/presentation/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/presentation/components/ui/dropdown-menu";
import { formatAmount, formatDate } from "~/presentation/utils";

import { Input } from "../components/ui/input";

function getMonthDefaultValue() {
  const [month, year] = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .split("/");

  return `${year}-${month}`;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "account id missing in params");

  const url = new URL(request.url);
  let month = url.searchParams.get("month") as string;

  if (!month) {
    month = getMonthDefaultValue();
  }

  const { id } = params;

  console.log(">>>params", month);

  const userId = await requireUserId(request);
  const account = await getAccountById(userId, id);
  const transactions = await getTransactionsByAccount(
    userId,
    account.id,
    1,
    month,
  );

  const items = [{ label: "Home", link: "/" }, { label: account.name }];

  return json({ account, month, items, transactions });
}

export default function Account() {
  const { account, month, items, transactions } =
    useLoaderData<typeof loader>();

  const income = 0;
  const spent = 0;

  return (
    <div className="h-full">
      <div className="mb-8">
        <Breadcrumb items={items} />
      </div>
      <div className="flex gap-8 mb-4">
        <BalanceCard account={account} income={income} spent={spent} />
        <ExpensesCarousel />
      </div>
      <div className="h-[calc(100%-150px-3rem)] flex gap-4">
        <div className="basis-[60%] lg:basis-[50%]">
          <TransactionList
            month={month}
            currencyCode={account.currency.code}
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
}

function ExpenseCard({ account }: { account: number }) {
  return (
    <Card color="white">
      <Card.Header asChild>
        <div className="flex gap-2 items-center">
          <p>
            name{" "}
            <Badge variant="secondary" className="text-xs font-light">
              {account === 1 ? "scheduled" : "installment"}
            </Badge>
          </p>
        </div>
      </Card.Header>
      <Card.Body>
        <p className="font-bold text-2xl">{formatAmount(123123, "ARS")}</p>
        {account === 1 ? (
          <p className="text-xs">Active since: {formatDate(new Date())}</p>
        ) : (
          <p className="text-xs">Installments: 3/12</p>
        )}
      </Card.Body>
    </Card>
  );
}

function ExpensesCarousel() {
  return (
    <Carousel className="w-full max-w-[calc(100vw-275px-128px-6rem)]">
      <CarouselContent className="h-[136px] -ml-4">
        {[1, 2].map((account) => (
          <CarouselItem key={account} className="pl-4 basis-[275px]">
            <ExpenseCard account={account} />
          </CarouselItem>
        ))}
        <CarouselItem className="min-w-[130px] basis-[130px] h-[130px] pl-4">
          <Link
            to="/create/account"
            className="w-full h-full p-4 flex justify-center items-center shadow-md rounded-lg opacity-50 hover:opacity-100 transition-opacity ease-out active:translate-y-[1px]"
          >
            <Plus className="size-8" />
          </Link>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="-left-4 disabled:opacity-0" />
      <CarouselNext className="-right-4 disabled:opacity-0" />
    </Carousel>
  );
}

interface TransactionListArgs {
  month: string;
  currencyCode: string;
  transactions: TransactionsSelect[];
}

function TransactionList({
  month,
  currencyCode,
  transactions,
}: TransactionListArgs) {
  const submit = useSubmit();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold mb-2">Transactions</h2>
        <div className="flex justify-end items-center gap-2">
          <Form method="get">
            <Input
              name="month"
              type="month"
              defaultValue={month}
              onChange={(e) => submit(e.currentTarget.form)}
            />
          </Form>
          <Button variant="outline">
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <ol className="basis-[60%] rounded shadow-md">
        {!transactions.length ? (
          <li className="w-full flex items-center justify-between px-4 py-2 border-b-2">
            <p className="w-full font-semibold text-xs text-center">
              no transactions yet
            </p>
          </li>
        ) : null}
        {transactions.map((t) => (
          <Item key={t.id} currencyCode={currencyCode} transaction={t} />
        ))}
        {/* <Item account={account} />
        <Item account={account} />
        <Item account={account} />
        <SchedItem account={account} /> */}
      </ol>
    </>
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

interface ItemArgs {
  currencyCode: string;
  transaction: TransactionsSelect;
}

function Item({ currencyCode, transaction }: ItemArgs) {
  return (
    <li className="w-full flex items-center justify-between px-4 py-2 border-b-2">
      <div className="flex items-center gap-2">
        <Building className="size-6" />
        <div className="flex flex-col">
          <span className="font-semibold">{transaction.title}</span>
          <span className="text-xs">{formatDate(transaction.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ArrowUp className="size-4 text-green-600" />
        <p className="font-bold">
          {formatAmount(Number(transaction.amount), currencyCode)}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVerticalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-gray-600 flex gap-2 items-center">
              <Pencil className="size-4" /> <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-600 flex gap-2 items-center">
              <Trash2 className="size-4" /> <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
