import { Form } from "@remix-run/react";

import { AccountSelect } from "~/application/accounts";
import { CurrencySelect } from "~/application/currencies";
import { ErrorMessage, IconsCombobox } from "~/presentation/components";
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

interface AccountFormArgs {
  account?: AccountSelect;
  currencies: CurrencySelect[];
  errors:
    | {
        name?: [string] | undefined;
        icon?: [string] | undefined;
        color?: [string] | undefined;
        currencyId?: [string] | undefined;
        main?: [string] | undefined;
      }
    | undefined;
}

export function AccountForm({ account, currencies, errors }: AccountFormArgs) {
  return (
    <Form method="post">
      <div className="flex gap-2 items-center">
        <div className="basis-[50%]">
          <Label htmlFor="name">Name</Label>
          <div className="mt-1 w-full">
            <Input
              id="name"
              name="name"
              defaultValue={account?.name}
              aria-invalid={errors?.name ? true : undefined}
              aria-describedby="name-error"
            />
            {errors?.name ? <ErrorMessage message={errors.name} /> : null}
          </div>
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="currencyId">Currency</Label>
          <div className="mt-1 w-full">
            <Select name="currencyId" defaultValue={account?.currency.id}>
              <SelectTrigger
                aria-invalid={errors?.currencyId ? true : undefined}
                aria-describedby="currency-error"
              >
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
              <ErrorMessage message={errors.currencyId} />
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <div className="basis-[50%]">
          <Label htmlFor="icon">Icon</Label>
          <IconsCombobox
            name="icon"
            defaultIcon={account?.icon}
            aria-invalid={errors?.icon ? true : undefined}
            aria-describedby="icon-error"
          />
          {errors?.icon ? <ErrorMessage message={errors.icon} /> : null}
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="color">Color</Label>
          <Select name="color" defaultValue={account?.color}>
            <SelectTrigger
              aria-invalid={errors?.color ? true : undefined}
              aria-describedby="color-error"
            >
              <SelectValue placeholder="Select a color" />
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
          {errors?.color ? <ErrorMessage message={errors.color} /> : null}
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="main" name="main" defaultChecked={account?.main} />
          <Label
            htmlFor="main"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            is this your main account?
          </Label>
        </div>
      </div>
      <div className="mt-8">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
