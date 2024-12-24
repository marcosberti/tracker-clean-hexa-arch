"use client";
import { useAsyncValue } from "@remix-run/react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import * as tailwindColors from "tailwindcss/colors";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/presentation/components/ui/chart";

interface CategoriesData {
  categories: {
    id: string;
    name: string;
    color: string;
  }[];
  monthlyData: {
    month: string;
    data: { category: string; amount: number }[];
  }[];
}

export default function CategoriesChart() {
  const { monthlyData, categories } = useAsyncValue() as CategoriesData;

  const config = categories.reduce(
    (acc, c) => {
      acc[c.name.toLocaleLowerCase()] = {
        label: c.name,
        color: tailwindColors[c.color as keyof typeof tailwindColors][500],
      };

      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  ) satisfies ChartConfig;

  return (
    <Card className="lg:row-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Categories</CardTitle>
          <CardDescription>expenses from each category.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 ">
        <ChartContainer config={config} className="mx-auto aspect-square ">
          <LineChart
            accessibilityLayer
            data={monthlyData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {categories.map((c) => (
              <Line
                key={c.id}
                dataKey={c.name}
                type="monotone"
                stroke={`var(--color-${c.name.toLowerCase()})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
