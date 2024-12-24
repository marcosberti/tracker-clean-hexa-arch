import { Link } from "@remix-run/react";

import { AccountSelect } from "~/application/accounts";
import { Icon } from "~/presentation/components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import { formatAmount, formatDate } from "~/presentation/utils";

export default function AccountCard({ account }: { account: AccountSelect }) {
  return (
    <Card className="h-full min-w-[220px]">
      <Link to={`/account/${account.id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
          <Icon icon={account.icon} className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatAmount(Number(account.balance), account.currency.code)}
          </p>
          <p className="text-xs">
            Latest transaction:{" "}
            {account.updatedAt && account.createdAt !== account.updatedAt
              ? formatDate(account.updatedAt)
              : "-"}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
