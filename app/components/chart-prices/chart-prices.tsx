"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/app/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent
} from "@/app/components/ui/chart";
import { formatDateMonthDay } from "@/app/helpers/format";

const chartConfig = {
  price: {
    label: "Цена",
    color: "var(--accent)"
  },
  old: {
    label: "Обычная цена",
    color: "var(--secondary)"
  },
  profit: {
    label: "Ваша выгода",
    color: "var(--primary)"
  }
} satisfies ChartConfig;

type ChartPricesProps = {
  chartData: {
    labels: string[];
    price: string[];
    priceOld: string[];
    profit: string[];
  } | null;
};

function ChartPrices({ chartData }: ChartPricesProps) {
  if (!chartData) {
    return null;
  }

  const data = Array.from({ length: chartData.labels.length || 0 }, (_, index) => ({
    date: formatDateMonthDay(chartData.labels[index]),
    price: chartData.price[index] || "0",
    old: chartData.priceOld[index] || "0",
    profit: chartData.profit[index] || "0"
  }));

  return (
    <Card>
      <CardContent className="p-0 md:px-2 md:pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="price"
              type="natural"
              fill="var(--color-price)"
              fillOpacity={0.4}
              stroke="var(--color-price)"
              stackId="a"
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="var(--color-profit)"
              fillOpacity={0.4}
              stroke="var(--color-profit)"
              stackId="a"
            />
            <Area
              dataKey="old"
              type="natural"
              fill="var(--color-old)"
              fillOpacity={0.4}
              stroke="var(--color-old)"
              stackId="c"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { ChartPrices };
