import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  // apps/parser/src/dns-markdown-parser is a git submodule (scraper scripts), linted in its own repo
  globalIgnores([
    "**/coverage/**",
    "**/node_modules/**",
    "**/dist/**",
    ".nx/**",
    "apps/parser/src/dns-markdown-parser/**"
  ]),
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin
    },
    rules: {
      "no-multiple-empty-lines": ["error", { max: 1 }],
      // Ensures all imports are at the top of the file
      "import/first": "error",
      // Enforce a convention in the order of imports
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js built-in modules (fs, path, etc.)
            "external", // External packages (react, lodash, etc.)
            "internal", // Internal project modules
            "parent", // Imports from parent directories (../)
            "sibling", // Imports from sibling directories (./)
            "index", // Imports from current directory index (./)
            "object", // Object imports (TypeScript only)
            "type" // Type imports (Flow/TypeScript only)
          ],
          "newlines-between": "always", // Add a newline between groups
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ]
    }
  }
]);

export default eslintConfig;
