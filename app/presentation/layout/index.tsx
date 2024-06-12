import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { getAccountById } from "~/application/accounts";
import { requireUserId } from "~/application/session";

import Header from "./components/header";
import Navbar from "./components/navbar";

export const meta: MetaFunction = () => [{ title: "Tracker" }];

export const shouldRevalidate = () => {
  return true;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);

  let account;
  if (url.pathname.startsWith("/account/") && params.id) {
    account = await getAccountById(userId, params.id);
  }

  return json({ account });
}

export default function Index() {
  const { account } = useLoaderData<typeof loader>();

  return (
    <div className="relative min-h-screen bg-muted/40 flex">
      <Navbar />
      <section className="flex flex-col w-full sm:pl-[3rem] sm:gap-4 lg:pl-[5rem]">
        <Header account={account} />
        <Outlet />
      </section>
    </div>
  );
}
