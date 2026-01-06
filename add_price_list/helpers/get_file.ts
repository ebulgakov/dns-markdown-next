import { existsSync, readFileSync } from "node:fs";
import { join } from "path";

export default function getFile(fileName: string, path: string): string {
  const filePath = join(path, fileName);

  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  return readFileSync(filePath, "utf8");
}
