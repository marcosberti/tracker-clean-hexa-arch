import { useAsyncValue } from "@remix-run/react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/presentation/components/ui/card";
import { formatAmount } from "~/presentation/utils";

interface MonthlyData {
  month: string;
  income: number;
  spent: number;
}

type Payload = Partial<{ value: number }>;

interface CustomTooltipArgs {
  active?: boolean;
  payload?: Payload[];
  label?: string;
  currencyCode: string | undefined;
}

function CustomTooltip({
  active,
  payload,
  label,
  currencyCode,
}: CustomTooltipArgs) {
  if (active && payload && payload.length) {
    const income = payload[0].value as number;
    const spent = payload[1].value as number;

    return (
      <div className="bg-foreground bg-opacity-50 rounded-lg text-background p-4">
        <p className="label font-semibold">{label}</p>
        <p className="intro text-sm">
          Income: {formatAmount(income, currencyCode)}
        </p>
        <p className="intro text-sm">
          Spent: {formatAmount(spent, currencyCode)}
        </p>
      </div>
    );
  }

  return null;
}

interface MonthlyChartArgs {
  currencyCode: string | undefined;
}

export default function MonthlyChart({ currencyCode }: MonthlyChartArgs) {
  const monthlyData = useAsyncValue() as MonthlyData[];

  return (
    <Card className="bg-background xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip currencyCode={currencyCode} />} />
            <Bar
              dataKey="income"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-foreground"
            />
            <Bar
              dataKey="spent"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-muted-foreground"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
