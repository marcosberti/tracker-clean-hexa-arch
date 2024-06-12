import { Link } from "@remix-run/react";
import { Pencil, Trash2 } from "lucide-react";

import { InstallmentSelect } from "~/application/installment";
import { ScheduledSelect } from "~/application/scheduled";
import { DeleteButton } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import { formatAmount, formatDate } from "~/presentation/utils";

type ExpenseCardArgs = {
  currencyCode: string;
} & (
  | { type: "scheduled"; expense: ScheduledSelect }
  | { type: "installment"; expense: InstallmentSelect }
);

export function ExpenseCard({ type, expense, currencyCode }: ExpenseCardArgs) {
  const amount =
    type === "scheduled"
      ? Number(expense.amount)
      : Number(expense.amount) / Number(expense.installments);

  return (
    <Card className="group bg-background h-full min-w-[250px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{expense.title}</CardTitle>
          <span className="bg-foreground text-sm text-background rounded-full flex justify-center items-center size-4">
            {type === "scheduled" ? "s" : "i"}
          </span>
        </div>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity ease-out absolute top-5 right-5">
          <Button variant="ghost" className="p-0 size-6" asChild>
            <Link to={`edit/expense/${expense.id}`}>
              <Pencil className="size-3" />
            </Link>
          </Button>
          <DeleteButton id={expense.id} entity={type}>
            <Button variant="ghost" className="p-0 size-6">
              <Trash2 className="size-4 text-red-700" />
            </Button>
          </DeleteButton>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-2xl">
          {formatAmount(amount, currencyCode)}
        </p>
        {type == "scheduled" ? (
          <p className="text-xs">Active since: {formatDate(expense.from)}</p>
        ) : (
          <p className="text-xs">
            Installments: {expense.paidInstallments}/{expense.installments}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
