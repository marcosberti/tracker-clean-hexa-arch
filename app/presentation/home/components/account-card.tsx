import { Link } from "@remix-run/react";

import { AccountSelect } from "~/application/accounts";
import { Card, Icon } from "~/presentation/components";
import { formatAmount, formatDate } from "~/presentation/utils";

export default function AccountCard({ account }: { account: AccountSelect }) {
  return (
    <Link to={`/account/${account.id}`}>
      <Card color={account.color}>
        <Card.Header>
          {formatAmount(Number(account.balance), account.currency.code)}
        </Card.Header>
        <Card.Body>
          <div className="flex gap-2 items-center">
            <Icon icon={account.icon} className="size-6" />
            <p className="font-semibold ">{account.name}</p>
          </div>
          <p className="text-xs">
            Latest transaction:{" "}
            {account.updatedAt && account.createdAt !== account.updatedAt
              ? formatDate(account.updatedAt)
              : "-"}
          </p>
        </Card.Body>
      </Card>
    </Link>
  );
}
