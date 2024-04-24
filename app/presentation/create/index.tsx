import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { Breadcrumb } from "~/presentation/components";

const BACK_TO = {
  account: {
    label: "Home",
    link: "/",
  },
  currency: {
    label: "Settings",
    link: "/settings",
  },
  category: {
    label: "Settings",
    link: "/settings",
  },
} as const;

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const entity = url.pathname.replace("/create/", "") as keyof typeof BACK_TO;

  const { label, link } = BACK_TO[entity];
  const items = [{ label, link }, { label: `Create ${entity}` }];

  return json({ items, entity });
}

export default function CreateAccount() {
  const { entity, items } = useLoaderData<typeof loader>();

  return (
    <>
      <div>
        <Breadcrumb items={items} />
      </div>
      <div className="flex align-top mb-8">
        <h1 className="text-4xl font-bold">Create a new {entity}</h1>
      </div>
      <div className="flex gap-8 justify-center">
        <Outlet />
      </div>
    </>
  );
}
