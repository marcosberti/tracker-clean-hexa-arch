import { Link } from "@remix-run/react";
import clsx from "clsx";

import { AccountSelect } from "~/application/accounts";

interface RecentActivityArgs {
  account: AccountSelect | undefined;
}

export default function RecentActivity({ account }: RecentActivityArgs) {
  return (
    <div className="rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center h-9">
        <h2 className="font-semibold text-lg">Recent activity</h2>
        <div className="relative group">
          <Link
            to={`/account/${account?.id}`}
            aria-disabled={!account}
            className={clsx(
              account && " text-blue-600",
              !account && "pointer-events-none",
              "text-sm",
            )}
          >
            see all
          </Link>
          <div className="absolute bottom-[2px] h-[1px] w-full bg-blue-600 bg-opacity-0 group-hover:bg-opacity-100 transition ease-out" />
        </div>
      </div>
      <div className="w-full">
        <div className="mt-8">
          <p className="text-center text-sm">no transactions yet</p>
        </div>
      </div>
    </div>
  );
}
