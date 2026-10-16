import { openApiSpec } from "./index";

await Bun.write("openapi.json", `${JSON.stringify(openApiSpec, null, 2)}\n`);
