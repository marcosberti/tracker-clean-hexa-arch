import { Form } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { CategorySelect } from "~/application/categories";
import { CurrencySelect } from "~/application/currencies";
import { InstallmentByIdSelect } from "~/application/installment";
import { ScheduledByIdSelect } from "~/application/scheduled";
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

interface SchedError {
  currencyId?: [string] | undefined;
  amount?: [string] | undefined;
  title?: [string] | undefined;
  from?: [string] | undefined;
  to?: [string] | undefined;
  categoryId?: [string] | undefined;
  description?: [string] | undefined;
}

interface IntallError {
  currencyId?: [string] | undefined;
  installments?: [string] | undefined;
  amount?: [string] | undefined;
  title?: [string] | undefined;
  categoryId?: [string] | undefined;
  firstPaymentDate?: [string] | undefined;
  description?: [string] | undefined;
}

export type Errors =
  | {
      expenseType: undefined;
      errors: undefined;
    }
  | {
      expenseType: "scheduled";
      errors: SchedError;
    }
  | {
      expenseType: "installment";
      errors: IntallError;
    };

interface ExpenseFormArgs {
  scheduled?: ScheduledByIdSelect | null;
  installment?: InstallmentByIdSelect | null;
  accountCurrencyCode: string;
  currencies: CurrencySelect[];
  categories: CategorySelect[];
  actionErrors: Errors;
}

export default function ExpenseForm({
  scheduled,
  installment,
  accountCurrencyCode,
  categories,
  currencies,
  actionErrors,
}: ExpenseFormArgs) {
  const { expenseType: etError, errors } = actionErrors;

  const [expenseType, setExpenseType] = useState(
    Boolean(scheduled) || (!scheduled && !installment)
      ? "scheduled"
      : "installment",
  );
  const formRef = useRef<HTMLFormElement>(null);
  // const errors = insErr || schedErr;

  const scheduledFrom = scheduled?.from
    ? scheduled.from.slice(0, 10)
    : undefined;
  const scheduledTo = scheduled?.to ? scheduled.to.slice(0, 10) : undefined;
  const firstPaymentDate = installment?.firstPaymentDate
    ? installment.firstPaymentDate.slice(0, 10)
    : undefined;

  useEffect(() => {
    if (!scheduled && !installment) {
      return;
    }

    formRef.current?.reset();
    setExpenseType(
      Boolean(scheduled) || (!scheduled && !installment)
        ? "scheduled"
        : "installment",
    );
  }, [scheduled, installment]);

  return (
    <Form method="post" className="w-full" ref={formRef}>
      <div className="flex gap-2">
        <div className="basis-[50%]">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={scheduled?.title ?? installment?.title}
            aria-invalid={errors?.title ? true : undefined}
            aria-describedby="title-error"
          />
          <ErrorMessage message={errors?.title} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            name="categoryId"
            defaultValue={scheduled?.categoryId ?? installment?.categoryId}
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
            defaultValue={scheduled?.amount ?? installment?.amount}
            aria-invalid={errors?.amount ? true : undefined}
            aria-describedby="amount-error"
          />
          <ErrorMessage message={errors?.amount} />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="currencyId">Currency</Label>
          <Select
            name="currencyId"
            defaultValue={
              scheduled?.currencyId ??
              installment?.currencyId ??
              accountCurrencyCode
            }
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
        <Label htmlFor="expenseType">Type of expense</Label>
        <RadioGroup
          id="expenseType"
          name="expenseType"
          className="mt-2"
          value={expenseType}
          onValueChange={(v) => {
            setExpenseType(v);
          }}
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
                  defaultValue={scheduledFrom}
                  aria-invalid={
                    etError === "scheduled" && errors?.from ? true : undefined
                  }
                  aria-describedby="from-error"
                />
                <ErrorMessage
                  message={etError === "scheduled" ? errors?.from : undefined}
                />
              </div>
              <div className="basis-[50%]">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  name="to"
                  type="date"
                  defaultValue={scheduledTo}
                  aria-invalid={
                    etError === "scheduled" && errors?.to ? true : undefined
                  }
                  aria-describedby="to-error"
                />
                <ErrorMessage
                  message={etError === "scheduled" ? errors?.to : undefined}
                />
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
                  defaultValue={firstPaymentDate}
                  aria-invalid={
                    etError === "installment" && errors?.firstPaymentDate
                      ? true
                      : undefined
                  }
                  aria-describedby="firstPaymentDate-error"
                />
                <ErrorMessage
                  message={
                    etError === "installment"
                      ? errors?.firstPaymentDate
                      : undefined
                  }
                />
              </div>
              <div className="basis-[50%]">
                <Label htmlFor="installments">Installments</Label>
                <Input
                  id="installments"
                  name="installments"
                  type="number"
                  min="0"
                  defaultValue={installment?.installments}
                  aria-invalid={
                    etError === "installment" && errors?.installments
                      ? true
                      : undefined
                  }
                  aria-describedby="installments-error"
                />
                <ErrorMessage
                  message={
                    etError === "installment" ? errors?.installments : undefined
                  }
                />
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
          defaultValue={
            (scheduled?.description ?? installment?.description) as
              | string
              | number
              | readonly string[]
              | undefined
          }
          aria-invalid={errors?.description ? true : undefined}
          aria-describedby="description-error"
        />
        <ErrorMessage message={errors?.description} />
      </div>
      <div className="mt-6">
        <Button type="submit" className="w-full">
          Save
        </Button>
      </div>
    </Form>
  );
}
