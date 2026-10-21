import parser from "@dns-markdown/dns-markdown-parser";
import inquirer from "inquirer";

async function runWizard() {
  const response = await inquirer.prompt([
    {
      type: "select",
      name: "city",
      message: "Выберите город:",
      default: "samara",
      choices: [
        { title: "Самара", value: "samara" },
        { title: "Москва", value: "moscow" }
      ]
    },
    {
      type: "input", // В inquirer text называется input
      name: "hash",
      default: "81078972d560e0c2a698f523e04b6a8b68498d017b697c6bf83990ed60f4cec8024946b6db",
      message: "Введите hash:"
    },
    {
      type: "editor", // Откроет Nano/Vim в Linux или Блокнот в Windows
      name: "request",
      message: "Введите многострочный запрос (сохраните и закройте редактор, когда закончите):"
    }
  ]);

  console.log(response);

  const data = await parser({
    request: response.request,
    hash: response.hash
  });

  console.log(data);
}

await runWizard();
