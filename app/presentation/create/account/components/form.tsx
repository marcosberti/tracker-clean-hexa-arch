import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { IconsCombobox } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import { Checkbox } from "~/presentation/components/ui/checkbox";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/presentation/components/ui/select";
import { COLORS, TAILWIND_BG } from "~/presentation/utils";

import { action, loader } from "../index";

export default function AccountForm() {
  const { errors } = useActionData<typeof action>() ?? {};
  const { currencies } = useLoaderData<typeof loader>();

  return (
    <Form method="post" className="w-[50%]">
      <div className="flex gap-2 items-center">
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
            htmlFor="currencyId"
            className="block text-sm font-medium text-gray-700"
          >
            Currency
          </Label>
          <div className="mt-1 w-full">
            <Select
              name="currencyId"
              aria-invalid={errors?.currencyId ? true : undefined}
              aria-describedby="currency-error"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {currencies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors?.currencyId ? (
              <div className="pt-1 text-red-700" id="currency-error">
                {errors.currencyId}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="basis-[50%]">
          <Label htmlFor="icon">Icon</Label>
          <IconsCombobox
            name="icon"
            aria-invalid={errors?.icon ? true : undefined}
            aria-describedby="icon-error"
          />
          {errors?.icon ? (
            <div className="pt-1 text-red-700" id="icon-error">
              {errors.icon}
            </div>
          ) : null}
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="color">Color</Label>
          <Select name="color">
            <SelectTrigger>
              <SelectValue
                placeholder="Select a color"
                aria-invalid={errors?.color ? true : undefined}
                aria-describedby="color-error"
              />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${TAILWIND_BG[color]} `}
                  />
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.color ? (
            <div className="pt-1 text-red-700" id="color-error">
              {errors.color}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="main" name="main" />
          <Label
            htmlFor="main"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            is this your main account?
          </Label>
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
