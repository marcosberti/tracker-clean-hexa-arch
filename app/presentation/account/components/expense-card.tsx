import { InstallmentSelect } from "~/application/installment";
import { ScheduledSelect } from "~/application/scheduled";
import { Card } from "~/presentation/components";
import { Badge } from "~/presentation/components/ui/badge";
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
    <Card color={expense.category.color}>
      <Card.Header asChild>
        <div className="flex gap-2 items-center">
          {expense.title}
          <Badge variant="secondary" className="text-xs font-light">
            {type}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body>
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
      </Card.Body>
    </Card>
  );
}
