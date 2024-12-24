import { useAsyncValue } from "@remix-run/react";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

import { AccountSelect } from "~/application/accounts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
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
    <Card className="h-fit min-w-[260px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Your balance</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatAmount(Number(account?.balance ?? 0), account?.currency.code)}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex gap-1">
            <ArrowUp className="size-4 text-green-600" />
            <p>{formatAmount(income, account?.currency.code)}</p>
          </div>

          <div className="flex gap-1">
            <ArrowDown className="size-4 text-red-600" />
            <p>{formatAmount(spent, account?.currency.code)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
