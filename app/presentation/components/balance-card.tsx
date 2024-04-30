import { useAsyncValue } from "@remix-run/react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { AccountSelect } from "~/application/accounts";
import { Card } from "~/presentation/components";
import { formatAmount } from "~/presentation/utils";

interface BalanceCardArgs {
  account: AccountSelect | undefined;
}

export function BalanceCard({ account }: BalanceCardArgs) {
  const { income, spent } = useAsyncValue() as {
    income: number;
    spent: number;
  };

  return (
    <Card color="stone" className="w-[275px]">
      <Card.Header asChild>
        <h2 className="font-semibold text-gray-500">Your balance</h2>
      </Card.Header>
      <Card.Body>
        <p className="text-2xl font-bold">
          {formatAmount(Number(account?.balance ?? 0), account?.currency.code)}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex gap-1">
            <ArrowUp className="size-4 text-green-600" />
            <p>{formatAmount(income, account?.currency.code)}</p>
          </div>
          <div className="flex gap-1">
            <ArrowDown className="size-4 text-red-600" />
            <p>{formatAmount(spent, account?.currency.code)}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
