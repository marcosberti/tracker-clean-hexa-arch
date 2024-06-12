import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";

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

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const entity = url.pathname.split("/create/")[1];

  return json({ entity });
}

export default function CreateSetting() {
  const { entity } = useLoaderData<typeof loader>();

  return (
    <Card className="h-full">
      <CardHeader>
        <Button variant="link" className="mr-auto p-0 h-auto" asChild>
          <Link to="/settings">
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
