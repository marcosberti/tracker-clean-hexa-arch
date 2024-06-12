import { useAsyncValue } from "@remix-run/react";

import { InstallmentSelect } from "~/application/installment";
import { ScheduledSelect } from "~/application/scheduled";

import PendingInstallmentItem from "./pending-installment-item";
import PendingScheduledItem from "./pending-scheduled-item";

interface PendingPaymentsArgs {
  currencyCode: string;
}

export function PendingPayments({ currencyCode }: PendingPaymentsArgs) {
  const [scheduled, installments] = useAsyncValue() as [
    ScheduledSelect[],
    InstallmentSelect[],
  ];

  return (
    <>
      <ol className="basis-[60%] rounded shadow-md">
        {!scheduled.length && !installments.length ? (
          <li className="w-full flex items-center justify-between px-4 py-2">
            <p className="w-full font-semibold text-xs text-center">
              no pending payments
            </p>
          </li>
        ) : null}
        {scheduled.map((s) => (
          <PendingScheduledItem
            key={s.id}
            scheduled={s}
            currencyCode={currencyCode}
          />
        ))}
        {installments.map((i) => (
          <PendingInstallmentItem
            key={i.id}
            installment={i}
            currencyCode={currencyCode}
          />
        ))}
      </ol>
    </>
  );
}
