import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export default function getDirname(meta: string): string {
  const __filename = fileURLToPath(meta);
  return dirname(__filename);
}

export const joinPath = (path: string, meta: string) => {
  return join(getDirname(meta), path);
}
