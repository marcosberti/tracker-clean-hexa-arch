import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { getAccounts } from "~/application/accounts";
import { requireUserId } from "~/application/session";
import AccountCard from "~/presentation/components/account-card";

export async function action() {
  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  console.log(">>>>accounts");

  const userId = await requireUserId(request);
  const accounts = await getAccounts(userId);

  return json({ accounts: accounts ?? [] });
}

export default function Accounts() {
  const { accounts } = useLoaderData<typeof loader>();

  return (
    <main className="p-4 sm:p-6">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="flex gap-4 flex-wrap">
            {accounts.map((a) => (
              <AccountCard key={a.id} account={a} />
            ))}
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
