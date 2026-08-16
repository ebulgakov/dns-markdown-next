import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";

// FSD layer/slice boundaries, enforced by eslint-plugin-boundaries instead of
// hand-rolled import/no-restricted-paths zones. `shared` is intentionally
// left WITHOUT per-file entry-point enforcement below (see the note on the
// `shared` element and recursive-hugging-finch.md): it has per-component
// barrels (e.g. shared/ui/change-theme-selector/index.ts) but no top-level
// shared/{ui,lib,api}/index.ts yet, so `@/shared/lib/utils`-style deep
// imports are still normal today. Tightening that is a deliberately separate,
// larger follow-up (would touch every shared import site in the repo), not
// bundled into this pass.
const elements = [
  { type: "app", pattern: "app/**" },
  { type: "widget", pattern: "src/widgets/*", capture: ["slice"] },
  { type: "feature", pattern: "src/features/*", capture: ["slice"] },
  { type: "entity", pattern: "src/entities/*", capture: ["slice"] },
  { type: "shared", pattern: "src/shared/**" }
];

// Known cross-feature reuse today: product-catalog and jump-to-section both
// read search's and sort-goods' store state through their public API
// (Strategy D, FSD skill §7).
const allowedFeatureSliceImports = {
  "product-catalog": ["search", "sort-goods"],
  "jump-to-section": ["search", "sort-goods"]
};
const featureSlicePolicies = Object.entries(allowedFeatureSliceImports).map(([from, to]) => ({
  from: { element: { type: "feature", captured: { slice: from } } },
  allow: [{ to: { element: { type: "feature", captured: { slice: to }, fileInternalPath: "index.ts" } } }]
}));

// Pragmatic entities -> features exceptions (only product-card.tsx does this
// today): the compare-to-LLM-report button and the favorite-toggle button
// are each owned by a feature, but ProductCard renders them directly rather
// than via slot/IoC composition from a higher layer — not worth a full
// Strategy-C refactor at this project's scale. `fileInternalPath: "index.ts"`
// only opens each feature's public API, never its internals.
const entityToFeatureExceptions = ["llm-report", "favorite-toggle"];

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
    // FSD layer/slice boundaries. Covers both Next's app/ (routing-only,
    // never restructured — see recursive-hugging-finch.md) and every FSD
    // layer under src/. Stories/mocks/tests are exempt: they legitimately
    // reach into internals (mock a store, render a component directly) that
    // production code must not.
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    ignores: ["**/*.stories.tsx", "**/__mocks__/**", "**/__tests__/**"],
    plugins: {
      boundaries
    },
    settings: {
      "boundaries/elements": elements
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            // app/ (routing) composes every layer through its public API;
            // shared has no forced entry point (see note above).
            {
              from: { element: { type: "app" } },
              allow: [{ to: { element: { type: "shared" } } }]
            },
            {
              from: { element: { type: "app" } },
              allow: [
                {
                  to: {
                    element: { type: ["widget", "feature", "entity"], fileInternalPath: "index.ts" }
                  }
                }
              ]
            },

            // widgets: app-shell chrome, composes features/entities/shared.
            {
              from: { element: { type: "widget" } },
              allow: [{ to: { element: { type: "shared" } } }]
            },
            {
              from: { element: { type: "widget" } },
              allow: [
                { to: { element: { type: ["feature", "entity"], fileInternalPath: "index.ts" } } }
              ]
            },

            // features: compose entities/shared; cross-feature only via the
            // documented pairs above, through the target's public API.
            {
              from: { element: { type: "feature" } },
              allow: [{ to: { element: { type: "shared" } } }]
            },
            {
              from: { element: { type: "feature" } },
              allow: [{ to: { element: { type: "entity", fileInternalPath: "index.ts" } } }]
            },
            ...featureSlicePolicies,

            // entities: compose shared; entities/product <-> entities/user
            // is a documented, single-direction-per-symbol exception (see
            // recursive-hugging-finch.md for the decoupling this replaced —
            // product needs user's getPriceListCity, user needs product's
            // Goods/Favorite/FavoriteStatus), never a deep import.
            {
              from: { element: { type: "entity" } },
              allow: [{ to: { element: { type: "shared" } } }]
            },
            {
              from: { element: { type: "entity", captured: { slice: "product" } } },
              allow: [
                {
                  to: {
                    element: { type: "entity", captured: { slice: "user" }, fileInternalPath: "index.ts" }
                  }
                }
              ]
            },
            {
              from: { element: { type: "entity", captured: { slice: "user" } } },
              allow: [
                {
                  to: {
                    element: {
                      type: "entity",
                      captured: { slice: "product" },
                      fileInternalPath: "index.ts"
                    }
                  }
                }
              ]
            },
            {
              from: { element: { type: "entity" } },
              allow: [
                {
                  to: {
                    element: {
                      type: "feature",
                      captured: { slice: entityToFeatureExceptions },
                      fileInternalPath: "index.ts"
                    }
                  }
                }
              ]
            }

            // shared: no policies — it must not import app/widget/feature/
            // entity at all, which the "disallow" default already enforces
            // without needing to spell it out.
          ]
        }
      ]
    }
  }
]);

export default eslintConfig;
