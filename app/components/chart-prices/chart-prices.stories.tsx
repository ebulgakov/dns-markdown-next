import { ChartPrices } from "./chart-prices";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ChartPrices> = {
  title: "Components/ChartPrices",
  component: ChartPrices,
  tags: ["autodocs"],
  argTypes: {
    chartData: {
      control: "object",
      description: "Data for the chart"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ChartPrices>;

const sampleChartData = [
  { dateAdded: "2023-01-01T00:00:00.000Z", price: "100", priceOld: "120", profit: "20" },
  { dateAdded: "2023-01-02T00:00:00.000Z", price: "110", priceOld: "125", profit: "15" },
  { dateAdded: "2023-01-03T00:00:00.000Z", price: "115", priceOld: "130", profit: "15" },
  { dateAdded: "2023-01-04T00:00:00.000Z", price: "120", priceOld: "135", profit: "15" },
  { dateAdded: "2023-01-05T00:00:00.000Z", price: "125", priceOld: "140", profit: "15" }
];

export const Default: Story = {
  args: {
    chartData: sampleChartData
  }
};

export const WithSingleDataPoint: Story = {
  args: {
    chartData: [sampleChartData[0]]
  }
};

export const WithSomeMissingData: Story = {
  args: {
    chartData: [
      sampleChartData[0],
      { dateAdded: "2023-01-02T00:00:00.000Z", price: "110", priceOld: "", profit: "15" },
      { dateAdded: "2023-01-03T00:00:00.000Z", price: "", priceOld: "130", profit: "15" },
      sampleChartData[3],
      { dateAdded: "2023-01-05T00:00:00.000Z", price: "125", priceOld: "140", profit: "" }
    ]
  }
};
