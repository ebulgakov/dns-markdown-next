import { Index } from "@upstash/vector";
import ora from "ora";

import { getLastPriceList } from "#api/get.ts";
import { env } from "#env.ts";
import getPerformance from "#helpers/get_performance.ts";

async function addVectorDb() {
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  const index = new Index({
    url: env.UPSTASH_VECTOR_REST_URL,
    token: env.UPSTASH_VECTOR_REST_TOKEN
  });

  const spinner = ora("Connection to DB...").start();

  try {
    await index.info();
    spinner.text = "Connected to Vector DB.";
  } catch (error) {
    spinner.fail("Failed to connect to Vector DB.");
    console.error(error);
    throw error;
  }

  const lastPriceList = await getLastPriceList(city);

  if (lastPriceList) {
    spinner.text = "Resetting index...";
    await index.reset({ all: true });

    for (const category of lastPriceList.positions) {
      for (const item of category.items) {
        spinner.text = `Indexing Item: ${item.title}`;

        // 1. Формируем читаемую строку причин уценки
        const reasonsString = item.reasons
          ? item.reasons.map(r => `${r.label}: ${r.text}`).join("; ")
          : "Без дефектов";

        // 2. Очищаем описание
        const description = (item.description || "").replace(/[\[\]\n\r]+/g, " ").trim();

        // 3. Собираем НАСЫЩЕННЫЙ текст для вектора.
        // Добавляем категорию и причины уценки, чтобы поиск понимал запросы про состояние.
        const semanticText = `
            Категория: ${category.title}.
            Товар: ${item.title}.
            Характеристики: ${description}.
            Состояние и причины уценки: ${reasonsString}.
            Цена: ${item.price} руб.
            Выгода: ${item.profit} руб.
          `
          .replace(/\s+/g, " ")
          .trim(); // Убираем лишние пробелы

        // 4. Формируем payload
        const payload = {
          id: item.link,
          data: semanticText, // Теперь здесь есть всё для смыслового поиска
          metadata: {
            // Дублируем для LLM, чтобы он мог красиво вывести данные
            title: item.title,
            category: category.title,
            description: description,

            // Важно для фильтрации через Upstash (Metadata Filtering)
            price: Number(item.price),
            priceOld: Number(item.priceOld || 0),
            profit: Number(item.profit || 0),

            // Техническая инфа
            link: `https://dns-shop.ru${item.link}`,
            image: item.image, // Полезно вернуть сразу с вектором, чтобы показать картинку
            reasons: item.reasons,
            city: "samara", // Если планируешь несколько городов
            code: item.code,
            createdAt: lastPriceList.createdAt
          }
        };

        await index.upsert(payload);
      }
    }

    spinner.succeed("Connected to Vector DB successfully.");
  } else {
    spinner.fail(`No price list found for city: ${city}`);
    throw new Error("No price list found for city");
  }
}

getPerformance(addVectorDb)
  .then(() => {
    console.log("/************** VECTOR DB ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding vector DB:", err);
  });
