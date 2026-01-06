import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export default function getPath(path: string, metaUrl: string): string {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = dirname(__filename);
  return join(__dirname, path);
}
