"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent } from "@/app/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/app/components/ui/chart";

import type { AnalysisChangesByDates } from "@/types/analysis-data";

type AnalyticsGoodsChartProps = {
  chartData: AnalysisChangesByDates;
};

function AnalyticsGoodsChangesChart({ chartData }: AnalyticsGoodsChartProps) {
  return (
    <Card>
      <CardContent className="p-0 md:px-2 md:pt-4">
        <ChartContainer
          config={{
            new: {
              label: "Добавлено товаров",
              color: "var(--primary)"
            },
            sold: {
              label: "Продано товаров",
              color: "var(--destructive)"
            },
            pricesChanged: {
              label: "Поменяно цен у товаров",
              color: "var(--accent)"
            },
            profitChanged: {
              label: "Изменена выгода у товаров",
              color: "var(--secondary)"
            }
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="sold" fill="var(--destructive)" radius={8} stackId="a" />
            <Bar dataKey="new" fill="var(--primary)" radius={8} stackId="a" />
            <Bar dataKey="pricesChanged" fill="var(--accent)" radius={8} stackId="a" />
            <Bar dataKey="profitChanged" fill="var(--secondary)" radius={8} stackId="a" />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { AnalyticsGoodsChangesChart };
