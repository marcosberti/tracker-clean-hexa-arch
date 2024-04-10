import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/application/session";
import Navbar from "./components/navbar";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return null;
}

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white flex text-gray-600">
      <Navbar />
      <div className="py-10 px-8 w-full max-w-[calc(100vw-128px)]">
        <Outlet />
      </div>
    </main>
  );
}
