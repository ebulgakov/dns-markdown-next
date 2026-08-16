import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

// `app/components/*` feature folders (everything except the shared `ui` primitives).
// Each folder may only be imported from `ui`/hooks/lib/stores/contexts by default —
// cross-feature imports must be explicitly whitelisted below, matching what's
// actually reused in production code today.
const featureDirs = [
  "alerts",
  "analytics",
  "catalog",
  "change-location-selector",
  "change-theme-selector",
  "chart-prices",
  "clerk-error",
  "footer",
  "hot-offer",
  "jump-to-section",
  "llm-report",
  "more-link",
  "navbar",
  "page-loader",
  "product-card",
  "profile-sections",
  "scroll-to-top",
  "search",
  "sort-goods"
];

// Existing sanctioned cross-feature reuse — each pair gets its own narrow zone
// below (target/from/except on a single directory pair) so `except` only
// whitelists the specific file actually reused, not the whole directory.
const allowedCrossFeatureImports = {
  catalog: { alerts: "./catalog-favorites-empty-alert.tsx", "product-card": "./product-card.tsx" },
  navbar: {
    "change-location-selector": "./change-location-selector.tsx",
    "change-theme-selector": "./change-theme-selector.tsx"
  },
  footer: {
    "change-location-selector": "./change-location-selector.tsx",
    "change-theme-selector": "./change-theme-selector.tsx"
  }
};

const featureZones = featureDirs.map(dir => ({
  target: `./app/components/${dir}`,
  from: featureDirs
    .filter(d => d !== dir && !(allowedCrossFeatureImports[dir]?.[d]))
    .map(d => `./app/components/${d}`)
}));

const exceptionZones = Object.entries(allowedCrossFeatureImports).flatMap(([target, fromDirs]) =>
  Object.entries(fromDirs).map(([from, exceptFile]) => ({
    target: `./app/components/${target}`,
    from: `./app/components/${from}`,
    except: [exceptFile]
  }))
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".design-sync/**",
    ".ds-sync/**",
    ".next/**",
    "out/**",
    "ds-bundle/**",
    "build/**",
    "storybook-static/**",
    "coverage/**",
    "next-env.d.ts"
  ]),
  {
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
      ],
      // Allow setState in useEffect for hydration handling
      "react-hooks/set-state-in-effect": "off"
    }
  },
  {
    files: ["app/components/**/*.{ts,tsx}"],
    // Stories/mocks are dev-only test fixtures, not production module boundaries.
    ignores: ["app/components/**/*.stories.tsx", "app/components/**/__mocks__/**"],
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // Shared `ui` primitives must never depend on feature code.
            {
              target: "./app/components/ui",
              from: featureDirs.map(dir => `./app/components/${dir}`)
            },
            ...featureZones,
            ...exceptionZones
          ]
        }
      ]
    }
  }
]);

export default eslintConfig;
