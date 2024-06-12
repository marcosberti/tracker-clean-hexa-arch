import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";

import { createAccount } from "~/application/accounts";
import { getCurrencies } from "~/application/currencies";
import { requireUserId } from "~/application/session";
import { AccountForm } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { account, errors } = await createAccount(userId, formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return redirect(`/account/${account.id}`, {
    status: 201,
    headers: { "X-Remix-Redirect": `/account/${account.id}` },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const currencies = (await getCurrencies(userId)) ?? [];

  return json({ currencies });
}

export default function CreateAccount() {
  const { errors } = useActionData<typeof action>() ?? {};
  const { currencies } = useLoaderData<typeof loader>();

  return (
    <Card className="bg-background">
      <CardHeader>
        <Button variant="link" className="mr-auto p-0 h-auto" asChild>
          <Link to="..">
            <p className="flex items-center gap-2">
              <ArrowLeft className="size-3" />{" "}
              <span className="text-xs font-light">back</span>
            </p>
          </Link>
        </Button>
        <CardTitle>create account </CardTitle>
      </CardHeader>
      <CardContent>
        <AccountForm currencies={currencies} errors={errors} />
      </CardContent>
    </Card>
  );
}
