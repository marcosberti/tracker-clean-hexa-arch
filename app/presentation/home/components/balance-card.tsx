import { ArrowDown, ArrowUp } from "lucide-react";
import { AccountSelect } from "~/application/accounts";
import { formatAmount } from "~/presentation/utils";

type BalanceCardArgs = {
  account: AccountSelect | undefined;
  income: number;
  spent: number;
};

export default function BalanceCard({
  account,
  income,
  spent,
}: BalanceCardArgs) {
  return (
    <div className="w-[275px] h-[130px] p-4 shadow-md rounded-lg flex flex-col gap-4">
      <h2 className="font-semibold text-gray-500">Your balance</h2>
      <p className="text-2xl font-bold">
        {formatAmount(Number(account?.balance ?? 0), account?.currency.code)}
      </p>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex gap-1">
          <ArrowUp className="size-4 text-green-600" />{" "}
          <p>{formatAmount(income, account?.currency.code)}</p>
        </div>
        <div className="flex gap-1">
          <ArrowDown className="size-4 text-red-600" />{" "}
          <p>{formatAmount(spent, account?.currency.code)}</p>
        </div>
      </div>
    </div>
  );
}
