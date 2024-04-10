import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAccounts } from "~/application/accounts";
import { requireUserId } from "~/application/session";
import BalanceCard from "./components/balance-card";
import { getTransactionSummarizedByType } from "~/application/transactions";
import AccountsCarousel from "./components/accounts-carousel";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const accounts = await getAccounts(userId);

  const account = accounts?.find((a) => a.main);
  const { income, spent } = account
    ? await getTransactionSummarizedByType(userId, account.id)
    : { income: 0, spent: 0 };

  return json({ accounts: accounts ?? [], account, income, spent });
}

export default function Index() {
  const { accounts, account, income, spent } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex align-top mb-8">
        <h1 className="text-4xl font-bold">overview</h1>
      </div>
      <div className="flex gap-8">
        <BalanceCard account={account} income={income} spent={spent} />
        <AccountsCarousel accounts={accounts} />
      </div>
    </>
  );
}
