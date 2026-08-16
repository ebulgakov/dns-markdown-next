"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { formatDateShort } from "@/shared/lib/format";
import { Card, CardContent } from "@/shared/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";

type AnalyticsGoodsChartProps = {
  chartData: {
    date: string;
    count: number;
  }[];
};

function AnalyticsGoodsCountChart({ chartData }: AnalyticsGoodsChartProps) {
  const formattedData = chartData.map(item => ({
    ...item,
    date: formatDateShort(item.date)
  }));

  return (
    <Card>
      <CardContent className="p-0 md:px-2 md:pt-4">
        <ChartContainer
          config={{
            count: {
              label: "Количество товаров",
              color: "var(--accent)"
            }
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={formattedData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--accent)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { AnalyticsGoodsCountChart };
