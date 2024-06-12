import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import invariant from "tiny-invariant";

import { Button } from "~/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";

export const shouldRevalidate = () => {
  return true;
};

export function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "account id missing in params");

  const accountId = params.id;

  const url = new URL(request.url);
  const month = url.searchParams.get("month") as string;
  const page = Number(url.searchParams.get("page"));
  const entity = url.pathname.split("/create/")[1];

  return json({ accountId, month, page, entity });
}

export default function CreateAccount() {
  const { accountId, month, page, entity } = useLoaderData<typeof loader>();

  return (
    <Card className="h-full">
      <CardHeader>
        <Button variant="link" className="mr-auto p-0 h-auto" asChild>
          <Link
            to={{
              pathname: `/account/${accountId}`,
              search: `?page=${page}&month=${month}`,
            }}
          >
            <p className="flex items-center gap-2">
              <ArrowLeft className="size-3" />{" "}
              <span className="text-xs font-light">back</span>
            </p>
          </Link>
        </Button>
        <CardTitle>Create {entity}</CardTitle>
      </CardHeader>
      <CardContent>
        <Outlet />
      </CardContent>
    </Card>
  );
}
