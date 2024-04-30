import { Form, useActionData } from "@remix-run/react";

import { CategorySelect } from "~/application/categories";
import { CurrencySelect } from "~/application/currencies";
import { ErrorMessage } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/presentation/components/ui/select";
import { Textarea } from "~/presentation/components/ui/textarea";
import { TYPES } from "~/presentation/utils";

import { action } from "../index";

interface TransactionFormArgs {
  accountCurrencyCode: string;
  currencies: CurrencySelect[];
  categories: CategorySelect[];
}

export default function TransactionForm({
  accountCurrencyCode,
  categories,
  currencies,
}: TransactionFormArgs) {
  const { errors } = useActionData<typeof action>() ?? {};

  return (
    <Form method="post" className="w-full">
      <div className="flex gap-2">
        <div className="basis-[50%]">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            aria-invalid={errors?.title ? true : undefined}
            aria-describedby="title-error"
          />
          <ErrorMessage message={errors?.title} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="type">Type</Label>
          <Select
            name="type"
            aria-invalid={errors?.type ? true : undefined}
            aria-describedby="type-error"
          >
            <SelectTrigger
              aria-invalid={errors?.type ? true : undefined}
              aria-describedby="type-error"
            >
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage message={errors?.type} />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="basis-[50%]">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            aria-invalid={errors?.amount ? true : undefined}
            aria-describedby="amount-error"
          />
          <ErrorMessage message={errors?.amount} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="currencyId">Currency</Label>
          <Select
            name="currencyId"
            defaultValue={accountCurrencyCode}
            aria-invalid={errors?.currencyId ? true : undefined}
            aria-describedby="currencyId-error"
          >
            <SelectTrigger
              aria-invalid={errors?.currencyId ? true : undefined}
              aria-describedby="currencyId-error"
            >
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.id} value={currency.id}>
                  {currency.name} ({currency.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage message={errors?.currencyId} />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="basis-[50%]">
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId">
            <SelectTrigger
              aria-invalid={errors?.categoryId ? true : undefined}
              aria-describedby="categoryId-error"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage message={errors?.categoryId} />
        </div>
        <div className="basis-[50%]"></div>
      </div>
      <div className="w-full mt-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          className="resize-none"
          aria-invalid={errors?.description ? true : undefined}
          aria-describedby="description-error"
        />
        <ErrorMessage message={errors?.description} />
      </div>
      <div className="mt-6">
        <Button type="submit" className="w-full">
          Create
        </Button>
      </div>
    </Form>
  );
}
