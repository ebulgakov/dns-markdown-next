import { openai } from "./ai.js";

export const generateAnalysisReport = async (data: string) => {
  const prompt = `Проанализируйте приведенные ниже данные уценённых товаров и составьте краткий отчет, 
  в котором будут выделены ключевые выводы, тенденции и любые существенные изменения, а так же товары 
  которые которые сейчас имеют лучшую цену для покупки. Если нет profit или priceOld, то значит есть 
  только актуальная цена. Не упоминай их в отчёте. После отчёта больше ничего не предлагай - этого достаточно. 
  link - это ссылка на товар, всегда оборачивай товар в ссылку:\n\n${data}\n\nОтчёт:`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: "Вы — опытный аналитик данных." },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message?.content?.trim() || "";
};
