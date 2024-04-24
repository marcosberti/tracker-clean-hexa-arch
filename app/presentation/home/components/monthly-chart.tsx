import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from "victory";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const INCOME = [
  { month: 6, value: 200 },
  { month: 1, value: 300 },
  { month: 2, value: 200 },
  { month: 3, value: 250 },
  { month: 4, value: 400 },
  { month: 5, value: 500 },
];
const SPENT = [
  { month: 6, value: 20 },
  { month: 1, value: 50 },
  { month: 2, value: 150 },
  { month: 3, value: 200 },
  { month: 4, value: 200 },
  { month: 5, value: 450 },
];

export default function MonthlyChart() {
  return (
    <div className="rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center h-9">
        <h2 className="font-semibold text-lg">Monthly activity</h2>
      </div>
      <div className="">
        <VictoryChart>
          <VictoryAxis
            standalone={false}
            tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            tickFormat={MONTHS}
            style={{
              tickLabels: { fontSize: 8, padding: 2 },
              ticks: { stroke: "grey", size: 4 },
            }}
          />
          <VictoryAxis
            standalone={false}
            dependentAxis
            tickFormat={(x: number) => `$${x / 1000}k`}
            style={{
              tickLabels: { fontSize: 8, padding: 2 },
              ticks: { stroke: "grey", size: 4 },
            }}
          />
          <VictoryGroup
            standalone={false}
            colorScale={["forestgreen", "firebrick"]}
            offset={10}
          >
            <VictoryBar
              standalone={false}
              data={INCOME}
              cornerRadius={{ top: 3 }}
              barWidth={10}
              x="month"
              y="value"
              animate={{
                duration: 250,
                onLoad: { duration: 100 },
              }}
            />
            <VictoryBar
              standalone={false}
              data={SPENT}
              cornerRadius={{ top: 3 }}
              barWidth={10}
              x="month"
              y="value"
              animate={{
                duration: 250,
                onLoad: { duration: 100 },
              }}
            />
          </VictoryGroup>
        </VictoryChart>
      </div>
    </div>
  );
}
