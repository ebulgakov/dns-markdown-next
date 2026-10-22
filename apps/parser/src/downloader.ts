import parser from "@dns-markdown/dns-markdown-parser";
import inquirer from "inquirer";

async function runWizard() {
  const response = await inquirer.prompt([
    {
      type: "editor",
      name: "request",
      message: "Введите многострочный запрос (сохраните и закройте редактор, когда закончите):"
    },
    {
      type: "input",
      name: "hash",
      message: "Введите hash:"
    }
  ]);

  await parser(
    {
      request: response.request,
      hash: response.hash
    },
    {
      appPath: "src"
    }
  );
}

await runWizard();
