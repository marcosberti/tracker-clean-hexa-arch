import { Link, useAsyncValue } from "@remix-run/react";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";

import { AccountSelect } from "~/application/accounts";
import { TransactionsSelect } from "~/application/transactions";
import { Icon } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import { formatAmount, formatDate } from "~/presentation/utils";

interface RecentActivityArgs {
  account: AccountSelect | undefined;
}

export default function RecentActivity({ account }: RecentActivityArgs) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, transactions] = useAsyncValue() as [number, TransactionsSelect[]];

  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions.</CardDescription>
        </div>
        <Button
          asChild
          size="sm"
          className="ml-auto gap-1 bg-muted-foreground hover:bg-foreground"
        >
          <Link
            to={`/account/${account?.id}`}
            aria-disabled={!account}
            className={clsx(!account && "pointer-events-none")}
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-8">
        {!transactions.length ? (
          <div className="flex items-center justify-center">
            <p className="text-center text-sm">no transactions yet</p>
          </div>
        ) : null}
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4">
            <Icon icon={transaction.category.icon} className="size-6" />
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {transaction.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transaction.createdAt)}
              </p>
            </div>
            <div className="ml-auto font-medium">
              <p className="">
                {transaction.type === "income" ? "+" : "-"}
                {formatAmount(
                  Number(transaction.amount),
                  account!.currency.code,
                )}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
