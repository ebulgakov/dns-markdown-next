import { ChartPrices } from "../chart-prices";

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

const sampleChartData = {
  labels: [
    "2023-01-01T00:00:00.000Z",
    "2023-01-02T00:00:00.000Z",
    "2023-01-03T00:00:00.000Z",
    "2023-01-04T00:00:00.000Z",
    "2023-01-05T00:00:00.000Z"
  ],
  price: ["100", "110", "105", "115", "120"],
  priceOld: ["120", "125", "120", "130", "135"],
  profit: ["20", "15", "15", "15", "15"]
};

export const Default: Story = {
  args: {
    chartData: sampleChartData
  }
};

export const WithNoData: Story = {
  args: {
    chartData: null
  }
};

export const WithSingleDataPoint: Story = {
  args: {
    chartData: {
      labels: ["2023-01-01T00:00:00.000Z"],
      price: ["100"],
      priceOld: ["120"],
      profit: ["20"]
    }
  }
};

export const WithSomeMissingData: Story = {
  args: {
    chartData: {
      labels: [
        "2023-01-01T00:00:00.000Z",
        "2023-01-02T00:00:00.000Z",
        "2023-01-03T00:00:00.000Z",
        "2023-01-04T00:00:00.000Z",
        "2023-01-05T00:00:00.000Z"
      ],
      price: ["100", "110", "0", "115", "120"],
      priceOld: ["120", "125", "0", "130", "135"],
      profit: ["20", "15", "0", "15", "15"]
    }
  }
};
