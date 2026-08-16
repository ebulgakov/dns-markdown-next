import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

// `app/components/*` feature folders still pending FSD migration (moved
// folders are dropped from this list as each migration stage lands — see
// the plan at recursive-hugging-finch.md step 6 for the eventual FSD-layer
// replacement of this whole ESLint block).
// Each folder may only be imported from `ui`/hooks/lib/stores/contexts by default —
// cross-feature imports must be explicitly whitelisted below, matching what's
// actually reused in production code today.
const featureDirs = [
  "alerts",
  "analytics",
  "chart-prices",
  "footer",
  "hot-offer",
  "more-link",
  "navbar",
  "profile-sections"
];

// No cross-feature exceptions currently needed — the ones that existed
// (catalog->alerts, navbar/footer->change-location-selector) were for
// folders that have since migrated out of app/components/ entirely.
const featureZones = featureDirs.map(dir => ({
  target: `./app/components/${dir}`,
  from: featureDirs.filter(d => d !== dir).map(d => `./app/components/${d}`)
}));

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
  "change-city"
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
          zones: featureZones
        }
      ]
    }
  },
  {
    // FSD `shared` layer: infra only, must never depend on business code.
    // Enforced separately from the app/components zones above since this
    // rule targets the new src/shared/ location, not the legacy app/ tree.
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
    // FSD `entities` layer: must never depend on app/ (routes/features are
    // above entities in the layer order). Cross-imports between
    // entities/product and entities/user are deliberately NOT restricted
    // here: "favorite" is inherently a product+user relationship (Favorite
    // embeds a Goods; a product page shows its FavoriteStatus; the
    // favorite-toggle button reads UserContext; entities/product's get.ts
    // needs entities/user's getPriceListCity), so the two entities cross
    //-reference each other in ~10 places, most of them type-only. Enumerating
    // each as a separate except zone (as done for app/components/* features
    // above) would be pure lint-maintenance overhead for a single
    // -contributor, ~10k-LOC app with exactly two entities — see FSD skill
    // §7 on cross-import strictness being a deliberate, project-scale-
    // dependent choice, and recursive-hugging-finch.md for the fuller
    // rationale.
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
              // Pragmatic entities -> features exception (only product-card.tsx
              // actually does this today): the compare-to-LLM-report button is
              // owned by features/llm-report, but ProductCard renders it
              // directly rather than via slot/IoC composition from a higher
              // layer — not worth a full Strategy-C refactor at this project's
              // scale. `except` only opens the feature's public index.ts, not
              // its internals.
              target: ["./src/entities/product", "./src/entities/user"],
              from: "./src/features/llm-report",
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
