import { Link } from "@remix-run/react";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";

import { TransactionsSelect } from "~/application/transactions";
import { DeleteButton, Icon } from "~/presentation/components";
import { formatAmount, formatDate } from "~/presentation/utils";

interface ItemArgs {
  currencyCode: string;
  transaction: TransactionsSelect;
}

export function Item({ currencyCode, transaction }: ItemArgs) {
  return (
    <li className="w-full flex items-center justify-between px-4 py-2 border-b-2">
      <div className="grow">
        <Link
          to={`transaction/${transaction.id}`}
          className="flex items-center gap-2 "
        >
          <Icon
            icon={transaction.category.icon}
            className="size-6"
            color={transaction.category.color}
          />
          <div className="flex flex-col">
            <span className="font-semibold">{transaction.title}</span>
            <span className="text-xs">{formatDate(transaction.createdAt)}</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {transaction.type === "income" ? (
          <ArrowUp className="size-4 text-green-600" />
        ) : (
          <ArrowDown className="size-4 text-red-600" />
        )}
        <p className="font-bold">
          {formatAmount(Number(transaction.amount), currencyCode)}
        </p>
        <div className="flex items-center">
          <Link
            to={`edit/transaction/${transaction.id}`}
            type="submit"
            className="flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8 p-0"
          >
            <Pencil className="size-4" />
          </Link>
          <DeleteButton id={transaction.id} entity="transaction" />
        </div>
      </div>
    </li>
  );
}
