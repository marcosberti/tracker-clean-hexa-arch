import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { CurrencySelectById } from "~/application/currencies";
import { ErrorMessage } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";

interface CurrencyFormArgs {
  currency?: CurrencySelectById;
  errors:
    | {
        name?: [string];
        code?: [string];
      }
    | undefined;
}

export default function CurrencyForm({ currency, errors }: CurrencyFormArgs) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!currency) {
      return;
    }

    formRef.current?.reset();
  }, [currency]);

  return (
    <Form method="post" className="w-full" noValidate ref={formRef}>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        defaultValue={currency?.name}
        aria-invalid={errors?.name ? true : undefined}
        aria-describedby="name-error"
      />
      <ErrorMessage message={errors?.name} />
      <Label htmlFor="code">Code</Label>
      <Input
        id="code"
        name="code"
        defaultValue={currency?.code}
        aria-invalid={errors?.code ? true : undefined}
        aria-describedby="code-error"
      />
      <ErrorMessage message={errors?.code} />
      <div className="mt-6">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
