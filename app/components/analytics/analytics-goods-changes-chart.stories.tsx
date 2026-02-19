import { AnalyticsGoodsChangesChart } from "./analytics-goods-changes-chart";

import type { AnalysisDiffReport } from "@/types/analysis-diff";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AnalyticsGoodsChangesChart> = {
  title: "Components/Analytics/AnalyticsGoodsChangesChart",
  component: AnalyticsGoodsChangesChart,
  tags: ["autodocs"],
  argTypes: {
    chartData: {
      control: "object",
      description: "Массив данных отчёта по изменениям товаров"
    }
  }
};

export default meta;
type Story = StoryObj<typeof AnalyticsGoodsChangesChart>;

const sampleChartData: AnalysisDiffReport[] = [
  {
    city: "Москва",
    dateAdded: "2025-02-10",
    newItems: 12,
    removedItems: 5,
    changesPrice: 8,
    changesProfit: 3
  },
  {
    city: "Москва",
    dateAdded: "2025-02-11",
    newItems: 7,
    removedItems: 10,
    changesPrice: 15,
    changesProfit: 6
  },
  {
    city: "Москва",
    dateAdded: "2025-02-12",
    newItems: 20,
    removedItems: 3,
    changesPrice: 4,
    changesProfit: 9
  },
  {
    city: "Москва",
    dateAdded: "2025-02-13",
    newItems: 5,
    removedItems: 8,
    changesPrice: 12,
    changesProfit: 2
  },
  {
    city: "Москва",
    dateAdded: "2025-02-14",
    newItems: 15,
    removedItems: 6,
    changesPrice: 10,
    changesProfit: 7
  },
  {
    city: "Москва",
    dateAdded: "2025-02-15",
    newItems: 9,
    removedItems: 14,
    changesPrice: 6,
    changesProfit: 11
  },
  {
    city: "Москва",
    dateAdded: "2025-02-16",
    newItems: 25,
    removedItems: 2,
    changesPrice: 18,
    changesProfit: 5
  }
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
      {
        city: "Москва",
        dateAdded: "2025-02-10",
        newItems: 500,
        removedItems: 300,
        changesPrice: 250,
        changesProfit: 120
      },
      {
        city: "Москва",
        dateAdded: "2025-02-11",
        newItems: 620,
        removedItems: 410,
        changesPrice: 180,
        changesProfit: 90
      },
      {
        city: "Москва",
        dateAdded: "2025-02-12",
        newItems: 350,
        removedItems: 550,
        changesPrice: 400,
        changesProfit: 200
      }
    ]
  }
};

export const OnlyNewItems: Story = {
  args: {
    chartData: [
      {
        city: "Москва",
        dateAdded: "2025-02-10",
        newItems: 10,
        removedItems: 0,
        changesPrice: 0,
        changesProfit: 0
      },
      {
        city: "Москва",
        dateAdded: "2025-02-11",
        newItems: 15,
        removedItems: 0,
        changesPrice: 0,
        changesProfit: 0
      },
      {
        city: "Москва",
        dateAdded: "2025-02-12",
        newItems: 8,
        removedItems: 0,
        changesPrice: 0,
        changesProfit: 0
      }
    ]
  }
};
