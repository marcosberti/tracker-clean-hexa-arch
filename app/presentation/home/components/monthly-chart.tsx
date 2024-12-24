"use client";
import { useAsyncValue } from "@remix-run/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/presentation/components/ui/chart";
import { formatAmount } from "~/presentation/utils";

interface MonthlyData {
  month: string;
  income: number;
  spent: number;
}

interface MonthlyChartArgs {
  currencyCode: string | undefined;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MonthlyChart({ currencyCode }: MonthlyChartArgs) {
  const monthlyData = useAsyncValue() as MonthlyData[];

  return (
    <Card className="xl:col-span-2 lg:row-span-2 h-fit">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig}>
          <BarChart data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#888888"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(v, n) => {
                    return `${n}: ${formatAmount(Number(v), currencyCode)}`;
                  }}
                />
              }
            />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="spent"
              fill="var(--color-spent)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
