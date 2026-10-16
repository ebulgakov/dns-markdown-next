# apps/parser — `@dns-markdown/parser`

Paths below are relative to `apps/parser`. All code lives in `src/` (same layout rules as `apps/api`: kebab-case names, `@src/*` alias); scraper runtime files stay in the package root. Monorepo-wide rules (commands, env files, code style) are in the root `CLAUDE.md`.

## What this is

A scraper/ETL service for DNS-shop markdown ("уценка") listings. It downloads catalog pages, parses them with cheerio, and pushes the results over HTTP to the API (`apps/api`), which backs the Next.js app [dns-markdown-next](https://github.com/ebulgakov/dns-markdown-next).

Runtime is **Bun**. TypeScript, ESM, no build step. Not deployed anywhere — it runs locally (Docker/Fly setup was dropped when moving into the monorepo).

## Commands

Run inside `apps/parser`, or from the root via `bunx nx run @dns-markdown/parser:<script>`:

```sh
bun run type-check     # tsc --noEmit
bun run lint           # eslint (root config)

bun run parse:samara   # full pipeline for Samara (+ favorites email + vector index)
bun run parse:moscow   # full pipeline for Moscow
```

Individual pipeline stages (each needs `CITY` set, see below):

```sh
bun run downloader                  # fetch pages -> crawler -> fetch prices
bun run add:list                    # parse pages/ -> POST price list
bun run add:analysis-data           # flatten price list -> analysis collection (WRITE_STRATEGY=insert)
bun run add:analysis-data:full      # same, WRITE_STRATEGY=replace
bun run add:analysis-diff           # day-over-day diff (WRITE_STRATEGY=insert)
bun run add:analysis-diff:full      # same, WRITE_STRATEGY=replace
bun run add:analysis-report         # ask the API to generate a report
bun run add:vector-db               # reset + reindex Upstash Vector from last price list
bun run check:favorites             # diff users' favorites, email changes, persist
bun run cache:clear                 # clear API cache (daily:*) + Next.js revalidate
bun run cache:clear:local           # same for local:* keys
```

**There are no tests** and no `test` script (so `nx run-many -t test` skips the parser). Lint and formatting use the root `eslint.config.ts` / `.prettierrc`.

## Architecture

### No database here

The parser never opens a database connection. **All persistence is HTTP** through two axios clients in `src/api/client.ts`:

- `apiClient` → `API_URL` (`apps/api`), with `X-Internal-API-Secret` + `Authorization: Bearer`. Reads live in `src/api/get.ts`, writes in `src/api/post.ts`. Service-only endpoints are under `/service/*`, public ones under `/api/*`.
- `webClient` → `WEB_URL`, used only for `POST /api/revalidate` to bust Next.js cache tags.

`mongodb` is a dependency **solely for `ObjectId`** — it generates hex ids and timestamps client-side before POSTing. Do not read it as a sign of a Mongo connection.

So: to add a new data operation, add a wrapper to `src/api/get.ts` / `src/api/post.ts` and implement the matching endpoint in `apps/api` (usually under `/service/*`).

Payload types (`PriceList`, `Goods`, `AnalysisData`, `AnalysisDiff`, `User`, …) come from `@dns-markdown/db/types/*` — the same types the API stores, imported with `import type` only (the parser has no mongoose runtime).

### The `pages/` directory is the contract between stages

`bun run downloader` is three steps whose only coupling is files in `pages/`, and the order is load-bearing:

1. `parser/dns_shop_downloader.sh` — wipes and recreates `pages/`, reads the page count, CSRF token and cookies **out of `request.sh`** (a saved curl command), then downloads `pages/page_N.html` (each is a JSON envelope: `{ html, assets }`) with rotating user-agents and random delays.
2. `parser/crawler.ts` — concatenates every `html` field into `pages/body.html`, and `eval`s each page's `assets.inlineJs` against a fake `window.AjaxState` shim to harvest product-buy container ids into `pages/ids.json`. The `eval` and the stub `window` are deliberate, not leftovers.
3. `parser/dns_shop_downloader_prices.sh` — POSTs `ids.json` back to DNS to get `pages/prices.html` (JSON, `{ data: { states: [...] } }`).

Then `src/add-price-list/helpers/create-data.ts` cheerio-parses `body.html`, joins each product to its price by the `.catalog-product__buy` element id against `prices.html`'s `states`, groups by `.markdown-page__group-title`, and drops any item missing title/link/price/availability.

### Pipeline order

`parse` = `downloader` → `add:list` → `add:analysis-data` → `add:analysis-diff` → `cache:clear`. `parse:samara` appends `check:favorites` and `add:vector-db`.

Data shape at each hop: scraped HTML → `PriceList` (nested `Position[]` → `Goods[]`, one per day per city) → `AnalysisData[]` (flat, `Goods` + city/category/dateAdded) → `AnalysisDiff` (newItems / removedItems / changesPrice / changesProfit, matched by `item.link`).

Only one price list per city per day is allowed: `src/add-price-list` checks the last one with `isSameDay` and deletes it before saving.

### Env contract

All vars are validated by the zod schema in `src/env.ts` (`import { env } from "@src/env"`) after `loadEnv()` loads the shared `.env` files from the monorepo root. Never read `process.env` elsewhere.

- **`CITY` is required**, not defaulted — almost every entrypoint does `if (!city) throw new Error("No city found")`. It's supplied by the `parse:samara` / `parse:moscow` / `add:*` wrapper scripts, so running a stage bare will fail. `CITY` must therefore **not** be put into the shared root `.env` (the API doesn't need it — its schema has a default).
- **`WRITE_STRATEGY`** (`insert` default | `replace`) switches each analysis stage between incremental and full rebuild. `insert` fetches only the last 2 price lists and deletes-then-reinserts today's rows so reruns are idempotent; `replace` deletes everything for the city first and, for diffs, also emits a diff of the oldest price list against an empty previous state.
- `KEYS` selects which API cache keys `src/cache-clear` wipes.
- Remaining vars are in the root `.env.example`.

## Gotchas

- **Gitignored but required at runtime** (see `apps/parser/.gitignore`): `parser/` (both `.sh` files and `crawler.ts`), `pages/`, `request.sh`; plus the root `.env`. A fresh clone has no scraper scripts — the README says to pull them from a Gist and hand-write `request.sh` (the saved DNS curl request whose cookies/CSRF token the downloaders scrape out of it; refresh it by hand when it expires). Don't "fix" missing-file errors by recreating them from scratch.
- **Imports** follow the api convention: `@src/*` (tsconfig `paths`, resolved by Bun at runtime) for cross-directory imports, relative `./…` within a stage's own folder (e.g. `./helpers/create-data`), no file extensions. Cross-workspace imports use package names (`@dns-markdown/db/types/pricelist`, `@dns-markdown/env`).
- **Paths to runtime files are cwd-relative** (`resolve("pages")` in `src/add-price-list`, `parser/*.sh` / `request.sh` in the `downloader` script): scripts must run with cwd = `apps/parser` (Nx and `bun run` do). `lint` / `type-check` cover only `src/`, so the gitignored `parser/crawler.ts` is not checked.
- **tsconfig extends the root `tsconfig.base.json` — strict and erasable-only:** `erasableSyntaxOnly` + `verbatimModuleSyntax` mean no enums, no `namespace`, no constructor parameter properties, and type-only imports must be written `import type`. `noUnusedLocals`/`noUnusedParameters` are on (prefix unused params with `_`), and `noUncheckedIndexedAccess` means array/record indexing yields `T | undefined` — the existing `if (priceLists[0])` guards are there for that reason.
- **Standalone scripts own their exit code.** Each `src/*/index.ts` stage wraps its work in `getPerformance(fn).then(...).catch(err => { console.error(...); process.exit(1) })` so a failing stage aborts the chained `parse` run. Keep that pattern when adding a stage. (`add-vector-db` and `cache-clear` deliberately don't exit 1.)
- User-facing strings (emails, vector-index text) are Russian. Keep them Russian.
