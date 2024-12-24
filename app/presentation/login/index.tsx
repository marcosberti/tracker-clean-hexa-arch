import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import { checkLoggedOut, login } from "~/application/session";
import { verifyPassword } from "~/application/users";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { Label } from "~/presentation/components/ui/label";
import { Input } from "~/presentation/components/ui/input";
import { Button } from "~/presentation/components/ui/button";
import { useEffect, useRef } from "react";
import { ErrorMessage } from "~/presentation/components";

export const meta: MetaFunction = () => [{ title: "Login" }];

export async function loader({ request }: LoaderFunctionArgs) {
  return checkLoggedOut(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const redirectTo = (formData.get("redirectTo") ?? "/") as string;
  const { data, errors } = await verifyPassword(formData);

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  const session = {
    request,
    redirectTo,
    userId: data.userId,
    remember: data.remember === "on",
  };

  return login(session);
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/app";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form id="login-form" method="post" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
                autoFocus
                // required
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
              />
              {actionData?.errors?.email ? (
                <ErrorMessage message={actionData.errors.email} />
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                ref={passwordRef}
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
              {actionData?.errors?.password ? (
                <ErrorMessage message={actionData.errors.password} />
              ) : null}
            </div>
          </Form>
        </CardContent>
        <CardFooter className="grid gap-4">
          <Button type="submit" form="login-form" className="w-full">
            Sign in
          </Button>
          <div className="flex items-center gap-2 justify-center">
            <Input
              id="remember"
              form="login-form"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded "
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
