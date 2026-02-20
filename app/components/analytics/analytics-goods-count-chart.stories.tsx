import { AnalyticsGoodsCountChart } from "./analytics-goods-count-chart";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AnalyticsGoodsCountChart> = {
  title: "Components/Analytics/AnalyticsGoodsCountChart",
  component: AnalyticsGoodsCountChart,
  tags: ["autodocs"],
  argTypes: {
    chartData: {
      control: "object",
      description: "Массив данных с датой и количеством товаров"
    }
  }
};

export default meta;
type Story = StoryObj<typeof AnalyticsGoodsCountChart>;

const sampleChartData = [
  { date: "2025-02-10", count: 120 },
  { date: "2025-02-11", count: 135 },
  { date: "2025-02-12", count: 98 },
  { date: "2025-02-13", count: 142 },
  { date: "2025-02-14", count: 160 },
  { date: "2025-02-15", count: 155 },
  { date: "2025-02-16", count: 170 }
];

export const Default: Story = {
  args: {
    chartData: sampleChartData
  }
};

export const SingleDay: Story = {
  args: {
    chartData: [sampleChartData[0]]
  }
};

export const EmptyData: Story = {
  args: {
    chartData: []
  }
};

export const LargeValues: Story = {
  args: {
    chartData: [
      { date: "2025-02-10", count: 5200 },
      { date: "2025-02-11", count: 4800 },
      { date: "2025-02-12", count: 6100 },
      { date: "2025-02-13", count: 5500 },
      { date: "2025-02-14", count: 7000 }
    ]
  }
};

export const GrowingTrend: Story = {
  args: {
    chartData: [
      { date: "2025-02-10", count: 50 },
      { date: "2025-02-11", count: 75 },
      { date: "2025-02-12", count: 110 },
      { date: "2025-02-13", count: 160 },
      { date: "2025-02-14", count: 230 },
      { date: "2025-02-15", count: 310 },
      { date: "2025-02-16", count: 420 }
    ]
  }
};
