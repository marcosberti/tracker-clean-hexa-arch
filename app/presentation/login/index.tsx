import type { MetaFunction } from "@remix-run/node";
import { LoginForm, loader, action } from "./components/login-form";

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <LoginForm />
      </div>
    </div>
  );
}

export { loader, action };
