import { Link } from "@remix-run/react";
import { Pencil } from "lucide-react";

import { AccountSelect } from "~/application/accounts";
import { Card, DeleteButton, Icon } from "~/presentation/components";
import { formatAmount, formatDate } from "~/presentation/utils";

export default function AccountCard({ account }: { account: AccountSelect }) {
  return (
    <Card color={account.color} className="group">
      <Card.Header asChild>
        <div className="flex justify-between items-center">
          <Link to={`/account/${account.id}`} className="grow">
            <div className="flex gap-2 items-center">
              <Icon icon={account.icon} className="size-6" />
              <p className="font-semibold">{account.name}</p>
            </div>
          </Link>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ease-out">
            <Link
              to={`/edit/account/${account.id}`}
              className="flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8 p-0"
            >
              <Pencil className="size-4" />
            </Link>
            <DeleteButton id={account.id} entity="account" />
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Link to={`/account/${account.id}`}>
          <p className="text-2xl font-bold">
            {formatAmount(Number(account.balance), account.currency.code)}
          </p>
          <p className="text-xs">
            Latest transaction:{" "}
            {account.updatedAt && account.createdAt !== account.updatedAt
              ? formatDate(account.updatedAt)
              : "-"}
          </p>
        </Link>
      </Card.Body>
    </Card>
  );
}
