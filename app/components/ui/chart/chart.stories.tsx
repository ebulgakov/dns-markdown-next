import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart/chart";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BarChart> = {
  title: "UI/Chart",
  component: BarChart,
  tags: ["autodocs"],
  args: {
    width: 600,
    height: 300,
    data: [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 }
    ]
  },
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  render: args => (
    <ChartContainer
      config={{
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))"
        }
      }}
      className="min-h-[200px] w-full"
    >
      <BarChart data={args.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
};

export const WithMultipleBars: Story = {
  render: args => (
    <ChartContainer
      config={{
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))"
        },
        mobile: {
          label: "Mobile",
          color: "hsl(var(--chart-2))"
        }
      }}
      className="min-h-[200px] w-full"
    >
      <BarChart data={args.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
};
