import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { X } from "lucide-react";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const entity = url.pathname.split("/create/")[1];

  return json({ entity });
}

export default function CreateAccount() {
  const { entity } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="h-10 flex items-center justify-between mb-4">
        <h3 className="font-semibold">Create a new {entity}</h3>
        <div>
          <Link to=".." className="block p-4">
            <X className="size-4" />
          </Link>
        </div>
      </div>
      <div className="flex gap-8 justify-center p-4 rounded shadow-md">
        <Outlet />
      </div>
    </>
  );
}
