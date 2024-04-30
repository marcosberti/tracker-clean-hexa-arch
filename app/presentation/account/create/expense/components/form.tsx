import { Form, useActionData } from "@remix-run/react";

import { CategorySelect } from "~/application/categories";
import { CurrencySelect } from "~/application/currencies";
import { ErrorMessage } from "~/presentation/components";
import { Button } from "~/presentation/components/ui/button";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "~/presentation/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/presentation/components/ui/select";
import { Textarea } from "~/presentation/components/ui/textarea";

import { action } from "../index";

interface ExpenseFormArgs {
  accountCurrencyCode: string;
  currencies: CurrencySelect[];
  categories: CategorySelect[];
}

export default function ExpenseForm({
  accountCurrencyCode,
  categories,
  currencies,
}: ExpenseFormArgs) {
  const { insErr, schedErr } = useActionData<typeof action>() ?? {};
  const errors = insErr || schedErr;

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

      <div className="w-full mt-2">
        <Label htmlFor="expenseType">Type of expense</Label>
        <RadioGroup
          id="expenseType"
          name="expenseType"
          defaultValue="scheduled"
          className="mt-2"
        >
          <div className="flex items-center space-x-2 peer/scheduled">
            <RadioGroupItem id="scheduled" value="scheduled" />
            <Label htmlFor="scheduled">Scheduled</Label>
          </div>
          <div className="flex items-center space-x-2 peer/installment">
            <RadioGroupItem id="installment" value="installment" />
            <Label htmlFor="installment">Installment</Label>
          </div>

          <div className="hidden peer-has-[:checked]/scheduled:block">
            <div className="flex gap-2">
              <div className="basis-[50%]">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  name="from"
                  type="date"
                  aria-invalid={schedErr?.from ? true : undefined}
                  aria-describedby="from-error"
                />
                <ErrorMessage message={schedErr?.from} />
              </div>
              <div className="basis-[50%]">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  name="to"
                  type="date"
                  aria-invalid={schedErr?.to ? true : undefined}
                  aria-describedby="to-error"
                />
                <ErrorMessage message={schedErr?.to} />
              </div>
            </div>
          </div>

          <div className="hidden peer-has-[:checked]/installment:block ">
            <div className="flex gap-2">
              <div className="basis-[50%]">
                <Label htmlFor="firstPaymentDate">First payment</Label>
                <Input
                  id="firstPaymentDate"
                  name="firstPaymentDate"
                  type="date"
                  aria-invalid={insErr?.firstPaymentDate ? true : undefined}
                  aria-describedby="firstPaymentDate-error"
                />
                <ErrorMessage message={insErr?.firstPaymentDate} />
              </div>
              <div className="basis-[50%]">
                <Label htmlFor="installments">Installments</Label>
                <Input
                  id="installments"
                  name="installments"
                  type="number"
                  min="0"
                  aria-invalid={insErr?.installments ? true : undefined}
                  aria-describedby="installments-error"
                />
                <ErrorMessage message={insErr?.installments} />
              </div>
            </div>
          </div>
        </RadioGroup>
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
