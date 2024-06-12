import { useAsyncValue } from "@remix-run/react";

import { InstallmentSelect } from "~/application/installment";
import { ScheduledSelect } from "~/application/scheduled";
import {
  ScrollArea,
  ScrollBar,
} from "~/presentation/components/ui/scroll-area";

import { ExpenseCard } from "./expense-card";

interface ExpensesArgs {
  currencyCode: string;
}

export function Expenses({ currencyCode }: ExpensesArgs) {
  const [scheduled, installments] = useAsyncValue() as [
    ScheduledSelect[],
    InstallmentSelect[],
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4">
        {scheduled.map((s) => (
          <ExpenseCard
            key={s.id}
            type="scheduled"
            expense={s}
            currencyCode={currencyCode}
          />
        ))}
        {installments.map((i) => (
          <ExpenseCard
            key={i.id}
            type="installment"
            expense={i}
            currencyCode={currencyCode}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
