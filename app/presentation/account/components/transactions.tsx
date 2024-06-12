import { Link, useAsyncValue, useSubmit } from "@remix-run/react";
import { Pencil, Trash2 } from "lucide-react";

import { TransactionsSelect } from "~/application/transactions";
import { DeleteButton } from "~/presentation/components";
import { Badge } from "~/presentation/components/ui/badge";
import { Button } from "~/presentation/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/presentation/components/ui/pagination";
import {
  ScrollArea,
  ScrollBar,
} from "~/presentation/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/presentation/components/ui/table";
import { formatAmount, formatDate } from "~/presentation/utils";

import { ITEMS_PER_PAGE } from "../index";

interface TransactionListArgs {
  month: string;
  page: number;
  currencyCode: string;
}

function getMonthName(month: string) {
  const date = new Date(`${month}-01T00:00:00`);
  const monthName = date.toLocaleString("default", { month: "long" });

  return monthName;
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
  const monthName = getMonthName(month);

  return transactions.length ? (
    <>
      <ScrollArea className="md:h-[calc(100vh-31rem)]">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="p-0">
                  <Link
                    to={`transaction/${t.id}`}
                    className="p-2 w-full h-full inline-block"
                  >
                    <div className="font-medium">{t.title}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {t.description}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="p-0 capitalize hidden sm:table-cell">
                  <Link
                    to={{
                      pathname: `transaction/${t.id}`,
                      search: `?page=${page}&month=${month}`,
                    }}
                    className="p-2 w-full h-full inline-block"
                  >
                    <Badge
                      className="text-xs"
                      variant={t.type === "income" ? "outline" : "secondary"}
                    >
                      {t.type}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="p-0 hidden sm:table-cell">
                  <Link
                    to={{
                      pathname: `transaction/${t.id}`,
                      search: `?page=${page}&month=${month}`,
                    }}
                    className="p-2 w-full h-full inline-block"
                  >
                    {t.category.name}
                  </Link>
                </TableCell>
                <TableCell className="p-0 hidden md:table-cell">
                  <Link
                    to={{
                      pathname: `transaction/${t.id}`,
                      search: `?page=${page}&month=${month}`,
                    }}
                    className="p-2 w-full h-full inline-block"
                  >
                    {formatDate(t.createdAt)}
                  </Link>
                </TableCell>
                <TableCell className="p-0 text-right">
                  <Link
                    to={{
                      pathname: `transaction/${t.id}`,
                      search: `?page=${page}&month=${month}`,
                    }}
                    className="p-2 w-full h-full inline-block"
                  >
                    {formatAmount(Number(t.amount), currencyCode)}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Link
                      to={{
                        pathname: `edit/transaction/${t.id}`,
                        search: `?page=${page}&month=${month}`,
                      }}
                      type="submit"
                      className="flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8 p-0"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteButton id={t.id} entity="transaction">
                      <Button variant="ghost" className="p-0 size-6">
                        <Trash2 className="size-4 text-red-700" />
                      </Button>
                    </DeleteButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

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
  ) : (
    <div className="w-full md:h-[calc(100vh-27.5rem)] flex justify-center">
      <p>No transactions in {monthName}</p>
    </div>
  );
}
