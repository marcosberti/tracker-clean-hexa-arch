import { Link, useAsyncValue, useSubmit } from "@remix-run/react";
import { Plus } from "lucide-react";

import { TransactionsSelect } from "~/application/transactions";
import { Input } from "~/presentation/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/presentation/components/ui/pagination";

import { ITEMS_PER_PAGE } from "../index";

import { Item } from "./transaction-item";

interface TransactionListArgs {
  month: string;
  page: number;
  currencyCode: string;
}

export function Transactions({
  month,
  page,
  currencyCode,
}: TransactionListArgs) {
  const [total, transactions] = useAsyncValue() as [
    number,
    TransactionsSelect[],
  ];
  const submit = useSubmit();
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const pages = new Array(totalPages).fill("").map((_, index) => index + 1);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Transactions</h2>
        <div className="flex justify-end items-center gap-2">
          <Input
            name="month"
            type="month"
            defaultValue={month}
            onChange={(e) => {
              submit(
                { page: 1, month: e.currentTarget.value },
                { method: "get" },
              );
            }}
          />
          <Link
            to="create/transaction"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Plus className="size-4" />
          </Link>
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
      </ol>
      <Pagination className="mx-0 justify-end mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page === 1}
              onClick={() =>
                submit({ page: page - 1, month }, { method: "get" })
              }
            />
          </PaginationItem>

          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                disabled={p === page}
                onClick={() => submit({ page: p, month }, { method: "get" })}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              disabled={page === totalPages}
              onClick={() =>
                submit({ page: page + 1, month }, { method: "get" })
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
