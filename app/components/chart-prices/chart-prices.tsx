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

import type { DiffHistory } from "@/types/analysis-diff";

const chartConfig = {
  price: {
    label: "Цена",
    color: "var(--accent)"
  },
  priceOld: {
    label: "Обычная цена",
    color: "var(--secondary)"
  },
  profit: {
    label: "Ваша выгода",
    color: "var(--primary)"
  }
} satisfies ChartConfig;

type ChartPricesProps = {
  chartData: DiffHistory;
};

function ChartPrices({ chartData }: ChartPricesProps) {
  return (
    <Card>
      <CardContent className="p-0 md:px-2 md:pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dateAdded"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={date => formatDateMonthDay(date)}
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
              dataKey="priceOld"
              type="natural"
              fill="var(--color-priceOld)"
              fillOpacity={0.4}
              stroke="var(--color-priceOld)"
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
