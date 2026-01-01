"use client";

import { useClientRendering } from "@/app/hooks/useClientRendering";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  LineController,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

const options = {
  responsive: true
};

type ProductPricesChartProps = {
  chartData: {
    labels: string[];
    price: string[];
    priceOld: string[];
    profit: string[];
  } | null;
};

export default function ProductPricesChart({ chartData }: ProductPricesChartProps) {
  const isClient = useClientRendering();
  if (!isClient || !chartData) return null;

  return (
    <Chart
      type="line"
      options={options}
      data={{
        labels: chartData.labels.map(label =>
          label !== "-" ? new Date(label).toLocaleDateString() : "-"
        ),
        datasets: [
          {
            label: "Цена",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            data: chartData.price.map(price => parseInt(price, 10))
          },
          {
            label: "Обычная цена",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            data: chartData.priceOld.map(price => parseInt(price, 10))
          },
          {
            label: "Ваша выгода",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            data: chartData.profit.map(price => parseInt(price, 10)),
            hidden: true
          }
        ]
      }}
      width={600}
      height={250}
    />
  );
}
