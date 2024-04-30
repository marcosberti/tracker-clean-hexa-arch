import { Link, useAsyncValue } from "@remix-run/react";
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";

import { AccountSelect } from "~/application/accounts";
import { TransactionsSelect } from "~/application/transactions";
import { formatAmount, formatDate } from "~/presentation/utils";

interface RecentActivityArgs {
  account: AccountSelect | undefined;
}

export default function RecentActivity({ account }: RecentActivityArgs) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, transactions] = useAsyncValue() as [number, TransactionsSelect[]];

  return (
    <div className="rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center h-9">
        <h2 className="font-semibold text-lg">Recent activity</h2>
        <div className="relative group">
          <Link
            to={`/account/${account?.id}`}
            aria-disabled={!account}
            className={clsx(
              account && " text-blue-600",
              !account && "pointer-events-none",
              "text-sm",
            )}
          >
            see all
          </Link>
          <div className="absolute bottom-[2px] h-[1px] w-full bg-blue-600 bg-opacity-0 group-hover:bg-opacity-100 transition ease-out" />
        </div>
      </div>
      <ol className="w-full">
        {!transactions.length ? (
          <li className="mt-8">
            <p className="text-center text-sm">no transactions yet</p>
          </li>
        ) : null}
        {transactions.map((transaction) => (
          <li key={transaction.id} className="px-2 mb-4 first:mt-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col justify-start">
                <p className="text-sm">{transaction.title}</p>
                <small className="text-xs font-light">
                  {formatDate(transaction.createdAt)}
                </small>
              </div>
              <div className="flex items-center gap-2">
                {transaction.type === "income" ? (
                  <ArrowUp className="size-4 text-green-600" />
                ) : (
                  <ArrowDown className="size-4 text-red-600" />
                )}
                <p className="font-semibold">
                  {formatAmount(
                    Number(transaction.amount),
                    account!.currency.code,
                  )}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
