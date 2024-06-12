import { Form } from "@remix-run/react";
import { HandCoins } from "lucide-react";

import { ScheduledSelect } from "~/application/scheduled";
import { Icon } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import { formatAmount } from "~/presentation/utils";

interface PendingScheduledItemArgs {
  scheduled: ScheduledSelect;
  currencyCode: string;
}

export default function PendingScheduledItem({
  scheduled,
  currencyCode,
}: PendingScheduledItemArgs) {
  return (
    <li className="w-full flex items-center justify-between px-4 py-2 [&:not(:last-child)]:border-b-2 opacity-70">
      <div className="flex items-center gap-2">
        <Icon
          className="size-6"
          icon={scheduled.category.icon}
          color={scheduled.category.color}
        />
        <div className="flex flex-col">
          <span className="font-semibold">{scheduled.title}</span>
          <span className="text-xs">pending payment</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-bold">
          {formatAmount(Number(scheduled.amount), currencyCode)}
        </p>
        <div>
          <Form method="post">
            <input hidden name="scheduled" defaultValue={scheduled.id} />
            <Button
              variant="ghost"
              title="pay"
              type="submit"
              name="intent"
              value={`pay-scheduled`}
            >
              <HandCoins className="size-4" />
            </Button>
          </Form>
        </div>
      </div>
    </li>
  );
}
