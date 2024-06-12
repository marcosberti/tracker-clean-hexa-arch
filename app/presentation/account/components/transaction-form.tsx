import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { CategorySelect } from "~/application/categories";
import { CurrencySelect } from "~/application/currencies";
import { TransactionByIdSelect } from "~/application/transactions";
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

interface TransactionFormArgs {
  transaction?: TransactionByIdSelect;
  accountCurrencyCode: string;
  currencies: CurrencySelect[];
  categories: CategorySelect[];
  errors:
    | {
        title?: [string];
        type?: [string];
        amount?: [string];
        currencyId?: [string];
        categoryId?: [string];
        description?: [string];
        createdAt?: [string];
      }
    | undefined;
}

export default function TransactionForm({
  transaction,
  accountCurrencyCode,
  categories,
  currencies,
  errors,
}: TransactionFormArgs) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!transaction) {
      return;
    }

    formRef.current?.reset();
  }, [transaction]);

  return (
    <Form method="post" className="w-full" noValidate ref={formRef}>
      <div className="flex gap-2">
        <div className="basis-[50%]">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={transaction?.title}
            aria-invalid={errors?.title ? true : undefined}
            aria-describedby="title-error"
          />
          <ErrorMessage message={errors?.title} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="type">Type</Label>
          <Select
            name="type"
            defaultValue={transaction?.type}
            aria-invalid={errors?.type ? true : undefined}
            aria-describedby="type-error"
          >
            <SelectTrigger>
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
          <Label htmlFor="createdAt">Date</Label>
          <Input
            id="createdAt"
            name="createdAt"
            type="date"
            defaultValue={transaction?.createdAt?.slice(0, 10)}
          />
          <ErrorMessage message={errors?.createdAt} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            name="categoryId"
            defaultValue={transaction?.categoryId}
            aria-invalid={errors?.categoryId ? true : undefined}
            aria-describedby="categoryId-error"
          >
            <SelectTrigger>
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
      </div>
      <div className="flex gap-2 mt-2">
        <div className="basis-[50%]">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            defaultValue={transaction?.amount}
            aria-invalid={errors?.amount ? true : undefined}
            aria-describedby="amount-error"
          />
          <ErrorMessage message={errors?.amount} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="currencyId">Currency</Label>
          <Select
            name="currencyId"
            defaultValue={transaction?.currencyId ?? accountCurrencyCode}
            aria-invalid={errors?.currencyId ? true : undefined}
            aria-describedby="currencyId-error"
          >
            <SelectTrigger>
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
      <div className="w-full mt-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          className="resize-none"
          defaultValue={
            transaction?.description as string | string[] | undefined
          }
          aria-invalid={errors?.description ? true : undefined}
          aria-describedby="description-error"
        />
        <ErrorMessage message={errors?.description} />
      </div>
      <div className="mt-6">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
