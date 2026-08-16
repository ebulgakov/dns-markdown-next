import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

// FSD `features` layer. Each slice may freely import shared/entities
// (downward, unrestricted) but not app/ (routes sit above features) and not
// another feature's internals — only its public index.ts (Strategy D: "public
// API access" for genuinely-shared feature state, FSD skill §7).
const featureSliceDirs = [
  "product-catalog",
  "search",
  "sort-goods",
  "jump-to-section",
  "llm-report",
  "change-city",
  "favorite-toggle"
];

// Known cross-feature reuse today: product-catalog and jump-to-section both
// read search's and sort-goods' store state through their public API.
const allowedFeatureSliceImports = {
  "product-catalog": ["search", "sort-goods"],
  "jump-to-section": ["search", "sort-goods"]
};

const featureSliceZones = featureSliceDirs.flatMap(dir => {
  const allowed = allowedFeatureSliceImports[dir] ?? [];
  const blocked = featureSliceDirs.filter(d => d !== dir && !allowed.includes(d));
  const zones = [];
  if (blocked.length > 0) {
    zones.push({
      target: `./src/features/${dir}`,
      from: blocked.map(d => `./src/features/${d}`)
    });
  }
  for (const from of allowed) {
    zones.push({
      target: `./src/features/${dir}`,
      from: `./src/features/${from}`,
      except: ["./index.ts"]
    });
  }
  return zones;
});

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
    // FSD `shared` layer: infra only, must never depend on business code.
    files: ["src/shared/**/*.{ts,tsx}"],
    ignores: ["src/shared/**/*.stories.tsx"],
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/shared",
              from: ["./app"]
            }
          ]
        }
      ]
    }
  },
  {
    // FSD `widgets` layer: app-shell chrome (navbar/footer, rendered once
    // from root app/layout.tsx) — not a page, not a reusable feature action.
    // Must never depend on app/ (routes sit above widgets).
    files: ["src/widgets/**/*.{ts,tsx}"],
    ignores: ["src/widgets/**/*.stories.tsx"],
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/widgets",
              from: ["./app"]
            }
          ]
        }
      ]
    }
  },
  {
    // FSD `entities` layer: must never depend on app/ (routes/features are
    // above entities in the layer order). Cross-imports between
    // entities/product and entities/user are narrowed to each other's public
    // index.ts only (never deep internals) — see recursive-hugging-finch.md
    // for the decoupling this replaced. The two directions are asymmetric by
    // design, not just by usage count:
    //  - entities/product -> entities/user: exactly one symbol,
    //    `getPriceListCity` in api/get.ts (product needs to know which
    //    city's pricelist to fetch; this is a genuine one-off dependency,
    //    not worth inventing a third entity for).
    //  - entities/user -> entities/product: `Goods` (Favorite.item, and
    //    postAddToFavorites/etc.'s parameter type) and the re-exported
    //    `Favorite`/`FavoriteStatus` types themselves, which are now defined
    //    in entities/product/model/favorite.ts (a favorite embeds a full
    //    Goods; the metadata has no user-specific fields) and merely
    //    re-exported from entities/user/model/user.ts so existing consumers
    //    of @/entities/user keep working unchanged.
    files: ["src/entities/**/*.{ts,tsx}"],
    ignores: ["src/entities/**/*.stories.tsx", "src/entities/**/__mocks__/**"],
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: ["./src/entities/product", "./src/entities/user"],
              from: ["./app"]
            },
            {
              target: "./src/entities/product",
              from: "./src/entities/user",
              except: ["./index.ts"]
            },
            {
              target: "./src/entities/user",
              from: "./src/entities/product",
              except: ["./index.ts"]
            },
            {
              // Pragmatic entities -> features exception (only product-card.tsx
              // actually does this today): the compare-to-LLM-report button and
              // the favorite-toggle button are each owned by a feature, but
              // ProductCard renders them directly rather than via slot/IoC
              // composition from a higher layer — not worth a full Strategy-C
              // refactor at this project's scale. `except` only opens each
              // feature's public index.ts, not its internals.
              target: ["./src/entities/product", "./src/entities/user"],
              from: ["./src/features/llm-report", "./src/features/favorite-toggle"],
              except: ["./index.ts"]
            }
          ]
        }
      ]
    }
  },
  {
    // FSD `features` layer: must never depend on app/ (routes sit above
    // features); cross-slice imports go through the other slice's public
    // index.ts only (see featureSliceZones above).
    files: ["src/features/**/*.{ts,tsx}"],
    ignores: ["src/features/**/*.stories.tsx", "src/features/**/__mocks__/**"],
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: featureSliceDirs.map(dir => `./src/features/${dir}`),
              from: ["./app"]
            },
            ...featureSliceZones
          ]
        }
      ]
    }
  }
]);

export default eslintConfig;
