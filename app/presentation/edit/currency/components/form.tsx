import { Form, useActionData } from "@remix-run/react";

import { Button } from "~/presentation/components/ui/button";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";

import { action } from "../index";

export default function CurrencyForm() {
  const { errors } = useActionData<typeof action>() ?? {};

  return (
    <Form method="post" className="w-[50%]">
      <div className="flex gap-2">
        <div className="basis-[50%]">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </Label>
          <div className="mt-1 w-full">
            <Input
              id="name"
              name="name"
              aria-invalid={errors?.name ? true : undefined}
              aria-describedby="name-error"
            />
            {errors?.name ? (
              <div className="pt-1 text-red-700" id="name-error">
                {errors.name}
              </div>
            ) : null}
          </div>
        </div>
        <div className="basis-[50%]">
          <Label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            code
          </Label>
          <div className="mt-1 w-full">
            <Input
              id="code"
              name="code"
              aria-invalid={errors?.code ? true : undefined}
              aria-describedby="code-error"
            />
            {errors?.code ? (
              <div className="pt-1 text-red-700" id="code-error">
                {errors.code}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Button type="submit" className="w-full">
          Create
        </Button>
      </div>
    </Form>
  );
}
