import { Link, useAsyncValue } from "@remix-run/react";
import { Plus } from "lucide-react";

import { InstallmentSelect } from "~/application/installment";
import { ScheduledSelect } from "~/application/scheduled";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/presentation/components/ui/carousel";

import { ExpenseCard } from "./expense-card";

interface ExpensesCarouselArgs {
  currencyCode: string;
}

export function ExpensesCarousel({ currencyCode }: ExpensesCarouselArgs) {
  const [scheduled, installments] = useAsyncValue() as [
    ScheduledSelect[],
    InstallmentSelect[],
  ];

  return (
    <Carousel className="w-full max-w-[calc(100vw-275px-128px-6rem)]">
      <CarouselContent className="h-[136px] -ml-4">
        {scheduled.map((expense) => (
          <CarouselItem key={expense.id} className="pl-4 basis-[275px]">
            <ExpenseCard
              type="scheduled"
              expense={expense}
              currencyCode={currencyCode}
            />
          </CarouselItem>
        ))}
        {installments.map((expense) => (
          <CarouselItem key={expense.id} className="pl-4 basis-[275px]">
            <ExpenseCard
              type="installment"
              expense={expense}
              currencyCode={currencyCode}
            />
          </CarouselItem>
        ))}
        <CarouselItem className="min-w-[130px] basis-[130px] h-[130px] pl-4">
          <Link
            to="create/expense"
            className="w-full h-full p-4 flex justify-center items-center shadow-md rounded-lg opacity-50 hover:opacity-100 transition-opacity ease-out active:translate-y-[1px]"
          >
            <Plus className="size-8" />
          </Link>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="-left-4 disabled:opacity-0" />
      <CarouselNext className="-right-4 disabled:opacity-0" />
    </Carousel>
  );
}
