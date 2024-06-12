import { Form } from "@remix-run/react";
import { HandCoins } from "lucide-react";

import { InstallmentSelect } from "~/application/installment";
import { Icon } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import { formatAmount } from "~/presentation/utils";

interface PendingInstallmentItemArgs {
  installment: InstallmentSelect;
  currencyCode: string;
}

export default function PendingInstallmentItem({
  installment,
  currencyCode,
}: PendingInstallmentItemArgs) {
  const amount = Number(installment.amount) / Number(installment.installments);

  return (
    <li className="w-full flex items-center justify-between px-4 py-2 [&:not(:last-child)]:border-b-2 opacity-70">
      <div className="flex items-center gap-2">
        <Icon
          className="size-6"
          icon={installment.category.icon}
          color={installment.category.color}
        />
        <div className="flex flex-col">
          <span className="font-semibold">{installment.title}</span>
          <span className="text-xs">
            {installment.paidInstallments}/{installment.installments}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-bold">{formatAmount(amount, currencyCode)}</p>
        <div>
          <Form method="post">
            <input hidden name="installment" defaultValue={installment.id} />
            <Button
              variant="ghost"
              title="pay"
              type="submit"
              name="intent"
              value={`pay-installment`}
            >
              <HandCoins className="size-4" />
            </Button>
          </Form>
        </div>
      </div>
    </li>
  );
}
