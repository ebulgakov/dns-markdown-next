import { AnalyticsReports } from "./analytics-reports";

import type { ReportsResponse } from "@/types/reports";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AnalyticsReports> = {
  title: "Components/Analytics/AnalyticsReports",
  component: AnalyticsReports,
  tags: ["autodocs"],
  argTypes: {
    reports: {
      control: "object",
      description: "Массив отчётов с датой и markdown-содержимым"
    }
  }
};

export default meta;
type Story = StoryObj<typeof AnalyticsReports>;

const sampleReports: ReportsResponse = [
  {
    _id: "1",
    city: "Москва",
    dateAdded: "2025-02-16",
    report:
      "## Итоги дня\n\nДобавлено **25** новых товаров. Удалено **3** товара.\n\n- Средняя скидка: 15%\n- Максимальная скидка: 42%\n\n[Подробнее](https://example.com)"
  },
  {
    _id: "2",
    city: "Москва",
    dateAdded: "2025-02-15",
    report:
      "## Итоги дня\n\nДобавлено **12** новых товаров. Удалено **8** товаров.\n\n- Средняя скидка: 10%\n- Максимальная скидка: 35%"
  },
  {
    _id: "3",
    city: "Москва",
    dateAdded: "2025-02-14",
    report:
      "## Итоги дня\n\nДобавлено **40** новых товаров. Удалено **1** товар.\n\n- Средняя скидка: 18%\n- Максимальная скидка: 55%"
  }
];

export const Default: Story = {
  args: {
    reports: sampleReports
  }
};

export const SingleReport: Story = {
  args: {
    reports: [sampleReports[0]]
  }
};

export const EmptyReports: Story = {
  args: {
    reports: []
  }
};

export const RichMarkdown: Story = {
  args: {
    reports: [
      {
        _id: "rich",
        city: "Москва",
        dateAdded: "2025-02-16",
        report: [
          "# Подробный отчёт",
          "",
          "Сегодня произошли значительные изменения в каталоге:",
          "",
          "## Новые товары",
          "",
          "1. Смартфон Samsung Galaxy S25 — **89 990 ₽** ~~99 990 ₽~~",
          "2. Ноутбук ASUS ROG — **149 990 ₽** ~~179 990 ₽~~",
          "3. Наушники Sony WH-1000XM6 — **29 990 ₽** ~~34 990 ₽~~",
          "",
          "## Удалённые товары",
          "",
          "- Смартфон iPhone 14 Pro",
          "- Планшет iPad Air 5",
          "",
          "> Всего изменений цен: **48**",
          "",
          "[Открыть полный каталог](https://example.com)"
        ].join("\n")
      }
    ]
  }
};

export const ManyTabs: Story = {
  args: {
    reports: Array.from({ length: 7 }, (_, i) => ({
      _id: String(i),
      city: "Москва",
      dateAdded: `2025-02-${String(10 + i).padStart(2, "0")}`,
      report: `## Отчёт за ${10 + i}.02.2025\n\nДобавлено **${10 + i * 3}** товаров. Удалено **${i + 1}** товаров.`
    }))
  }
};
