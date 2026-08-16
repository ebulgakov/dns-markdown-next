import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";

// FSD layer/slice boundaries, enforced by eslint-plugin-boundaries instead of
// hand-rolled import/no-restricted-paths zones. `shared` has no slices (per
// FSD's own guidance — it's organized by segment, not slice) but does have a
// forced entry point per segment: every consumer outside src/shared must
// import through a path matched by SHARED_ENTRY_POINTS below, never an
// arbitrary deep path like `@/shared/lib/utils` (see recursive-hugging-finch.md
// for the migration that got every call site there). Imports WITHIN
// src/shared (e.g. a ui component importing `cn` from shared/lib) stay
// unchecked — `checkInternals` defaults to false, same as every other layer
// here.
const elements = [
  { type: "app", pattern: "app/**" },
  { type: "pages", pattern: "src/_pages/*", capture: ["slice"] },
  { type: "widget", pattern: "src/widgets/*", capture: ["slice"] },
  { type: "feature", pattern: "src/features/*", capture: ["slice"] },
  { type: "entity", pattern: "src/entities/*", capture: ["slice"] },
  { type: "shared", pattern: "src/shared/**" }
];

// `ui` intentionally has no single top-level barrel: shared/ui/index.ts was
// tried and reverted (see recursive-hugging-finch.md) — re-exporting every
// component from one file made a `Button`-only import eagerly evaluate the
// whole kit (recharts' chart, every Radix primitive, ...) in the same module
// graph, which broke `next build`'s page-data collection on multiple routes
// ("Super expression must either be null or a function, not undefined") even
// though dependency-cruiser found no cycle — an eager-bundling failure, not
// a circular-import one. Each ui component's own index.ts stays the entry
// point instead. `lib`/`api`/`providers` have no such fan-out (no heavy
// third-party client components), so they keep one barrel each.
const SHARED_ENTRY_POINTS = "{ui/*/index.ts,lib/index.ts,api/index.ts,providers/index.ts}";

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
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-explicit-any": "error"
    }
  },
  {
    // Guardrail against sprawling functions/components. Test files and
    // stories exempt: assertion-heavy arrange-act-assert blocks and story
    // render functions legitimately run long.
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    ignores: ["**/__tests__/**", "**/*.stories.tsx"],
    rules: {
      "max-lines-per-function": [
        "error",
        { max: 80, skipBlankLines: true, skipComments: true, IIFEs: true }
      ]
    }
  },
  {
    // Guardrail against sprawling files. Tests and stories exempt for the
    // same reason as max-lines-per-function above.
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    ignores: ["**/__tests__/**", "**/*.stories.tsx"],
    rules: {
      "max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }]
    }
  },
  {
    // Grandfathered: predate max-lines-per-function. Shrink this list
    // (refactor below 80 lines, drop the entry) rather than growing it.
    files: [
      "src/features/sort-goods/lib/use-filtered-goods.ts",
      "src/_pages/home/ui/home-updates.tsx",
      "src/_pages/home/ui/hot-offer.tsx",
      "src/_pages/about/ui/about-page.tsx",
      "src/_pages/profile/ui/profile-update-sections.tsx",
      "src/entities/product/ui/product-card.tsx",
      "src/entities/user/model/user-context.tsx",
      "src/features/product-catalog/ui/catalog-header.tsx",
      "src/features/product-catalog/ui/catalog.tsx",
      "src/shared/ui/chart/chart.tsx",
      "src/widgets/navbar/navbar-mobile.tsx"
    ],
    rules: {
      "max-lines-per-function": "off"
    }
  },
  {
    // Grandfathered: shadcn/ui-generated primitive, predates max-lines.
    // Shrink this list rather than growing it.
    files: ["src/shared/ui/chart/chart.tsx"],
    rules: {
      "max-lines": "off"
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
            // app/ (routing) composes every layer through its public API,
            // shared included (see SHARED_ENTRY_POINTS above).
            {
              from: { element: { type: "app" } },
              allow: [
                { to: { element: { type: "shared", fileInternalPath: SHARED_ENTRY_POINTS } } }
              ]
            },
            {
              from: { element: { type: "app" } },
              allow: [
                {
                  to: {
                    element: {
                      type: ["pages", "widget", "feature", "entity"],
                      fileInternalPath: "index.ts"
                    }
                  }
                }
              ]
            },

            // pages: route-level composition, composes widgets/features/entities/shared.
            {
              from: { element: { type: "pages" } },
              allow: [
                { to: { element: { type: "shared", fileInternalPath: SHARED_ENTRY_POINTS } } }
              ]
            },
            {
              from: { element: { type: "pages" } },
              allow: [
                { to: { element: { type: ["widget", "feature", "entity"], fileInternalPath: "index.ts" } } }
              ]
            },

            // widgets: app-shell chrome, composes features/entities/shared.
            {
              from: { element: { type: "widget" } },
              allow: [
                { to: { element: { type: "shared", fileInternalPath: SHARED_ENTRY_POINTS } } }
              ]
            },
            {
              from: { element: { type: "widget" } },
              allow: [
                { to: { element: { type: ["feature", "entity"], fileInternalPath: "index.ts" } } }
              ]
            },

            // features: compose entities/shared only — no cross-feature imports.
            {
              from: { element: { type: "feature" } },
              allow: [
                { to: { element: { type: "shared", fileInternalPath: SHARED_ENTRY_POINTS } } }
              ]
            },
            {
              from: { element: { type: "feature" } },
              allow: [{ to: { element: { type: "entity", fileInternalPath: "index.ts" } } }]
            },

            // entities: compose shared; entities/user -> entities/product
            // is a documented, single-direction exception (user needs
            // product's Goods/Favorite/FavoriteStatus types), never a deep
            // import. entities/product -> entities/user was removed by
            // pushing city resolution (getPriceListCity) up to the
            // app/_pages callers instead.
            {
              from: { element: { type: "entity" } },
              allow: [
                { to: { element: { type: "shared", fileInternalPath: SHARED_ENTRY_POINTS } } }
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

            // shared: no "from: shared" policies — it must not import app/
            // widget/feature/entity at all, which the "disallow" default
            // already enforces without needing to spell it out.
          ]
        }
      ]
    }
  }
]);

export default eslintConfig;
