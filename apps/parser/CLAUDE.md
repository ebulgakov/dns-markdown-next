# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A scraper/ETL service for DNS-shop markdown ("уценка") listings. It downloads catalog pages, parses them with cheerio, and pushes the results over HTTP to the companion Next.js app [dns-markdown-next](https://github.com/ebulgakov/dns-markdown-next). It also ships a small Express control panel for triggering runs and editing the scraper's curl scripts.

Runtime is **Bun** (not Node, despite the Dockerfile base image). TypeScript, ESM, no build step for running.

## Commands

```sh
bun run start          # Express control panel on $PORT (default 3100), --watch
bun run type-check     # tsc --noEmit over the whole repo
bun run build          # tsc -p tsconfig.build.json (also type-check only: noEmit is inherited)

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

**There is no test runner.** `bun run test` is the npm placeholder that exits 1 — don't try to run or extend it. There is no lint/format script either, only a `.prettierrc`: 2-space indent, semicolons, double quotes, no trailing commas, `printWidth` 100, `arrowParens: "avoid"`.

## Architecture

### No database here

This repo never opens a database connection. **All persistence is HTTP** through two axios clients in `api/client.ts`:

- `apiClient` → `API_URL` (the Next.js app), with `X-Internal-API-Secret` + `Authorization: Bearer`. Reads live in `api/get.ts`, writes in `api/post.ts`. Service-only endpoints are under `/service/*`, public ones under `/api/*`.
- `webClient` → `WEB_URL`, used only for `POST /api/revalidate` to bust Next.js cache tags.

`mongodb` is a dependency **solely for `ObjectId`** — it generates hex ids and timestamps client-side before POSTing. Do not read it as a sign of a Mongo connection.

So: to add a new data operation, add a wrapper to `api/get.ts` / `api/post.ts` and implement the matching endpoint in `dns-markdown-next`.

### The `pages/` directory is the contract between stages

`bun run downloader` is three steps whose only coupling is files in `pages/`, and the order is load-bearing:

1. `parser/dns_shop_downloader.sh` — wipes and recreates `pages/`, reads the page count, CSRF token and cookies **out of `request.sh`** (a saved curl command), then downloads `pages/page_N.html` (each is a JSON envelope: `{ html, assets }`) with rotating user-agents and random delays.
2. `parser/crawler.ts` — concatenates every `html` field into `pages/body.html`, and `eval`s each page's `assets.inlineJs` against a fake `window.AjaxState` shim to harvest product-buy container ids into `pages/ids.json`. The `eval` and the stub `window` are deliberate, not leftovers.
3. `parser/dns_shop_downloader_prices.sh` — POSTs `ids.json` back to DNS to get `pages/prices.html` (JSON, `{ data: { states: [...] } }`).

Then `add_price_list/helpers/create_data.ts` cheerio-parses `body.html`, joins each product to its price by the `.catalog-product__buy` element id against `prices.html`'s `states`, groups by `.markdown-page__group-title`, and drops any item missing title/link/price/availability.

### Pipeline order

`parse` = `downloader` → `add:list` → `add:analysis-data` → `add:analysis-diff` → `cache:clear`. `parse:samara` appends `check:favorites` and `add:vector-db`.

Data shape at each hop: scraped HTML → `PriceList` (nested `Position[]` → `Goods[]`, one per day per city) → `AnalysisData[]` (flat, `Goods` + city/category/dateAdded) → `AnalysisDiff` (newItems / removedItems / changesPrice / changesProfit, matched by `item.link`).

Only one price list per city per day is allowed: `add_price_list` checks the last one with `isSameDay` and deletes it before saving.

### Env contract

- **`CITY` is required**, not defaulted — almost every entrypoint does `if (!city) throw new Error("No city found")`. It's supplied by the `parse:samara` / `parse:moscow` / `add:*` wrapper scripts, so running a stage bare will fail.
- **`WRITE_STRATEGY`** (`insert` default | `replace`) switches each analysis stage between incremental and full rebuild. `insert` fetches only the last 2 price lists and deletes-then-reinserts today's rows so reruns are idempotent; `replace` deletes everything for the city first and, for diffs, also emits a diff of the oldest price list against an empty previous state.
- `KEYS` selects which API cache keys `cache_clear` wipes.
- Remaining vars are in `.env.example`.

### Express control panel (`express/`)

Not a public API — an ops UI rendered from `express/templates/*.html` via ejs:

- `GET /` + `POST /update-request` — edit and overwrite `request.sh` (the saved DNS curl request that carries the cookies/CSRF token the downloaders scrape out of it). POST redirects 307 to `/log`, which starts a run.
- `GET|POST /config` — read and overwrite `parser/dns_shop_downloader*.sh` in place.
- `POST /log` — spawns `npm run parse` detached, guarded by `global.npmProcess` so a second request is a no-op; stdout/stderr are appended to `parselog.txt` (truncated at start). `GET /log` renders it; `GET /log/stop` kills the process group.

All three forms write files that are gitignored, so the panel is how the deployed container gets its scraper config.

## Gotchas

- **Gitignored but required at runtime:** `parser/` (both `.sh` files), `pages/`, `request.sh`, `parselog.txt`, `fly.toml`, `.env`. A fresh clone has no scraper scripts — the README says to pull them from a Gist and hand-write `request.sh`. Don't "fix" missing-file errors by recreating them from scratch.
- **Imports use the `#*` subpath map** (`package.json` `"imports": { "#*": "./*" }`), rooted at the repo, with explicit `.ts` extensions: `import { getLastPriceList } from "#api/get.ts"`. Relative imports with `.ts` also appear and are fine. Some type imports still say `.js` (`#types/user.js`) — harmless, but prefer `.ts` in new code.
- **tsconfig is strict and erasable-only:** `erasableSyntaxOnly` + `verbatimModuleSyntax` mean no enums, no `namespace`, no constructor parameter properties, and type-only imports must be written `import type`. `noUnusedLocals`/`noUnusedParameters` are on (hence the `_req` naming), and `noUncheckedIndexedAccess` means array/record indexing yields `T | undefined` — the existing `if (priceLists[0])` guards are there for that reason.
- **Standalone scripts own their exit code.** Each `*/index.ts` wraps its work in `getPerformance(fn).then(...).catch(err => { console.error(...); process.exit(1) })` so a failing stage aborts the chained `parse` run. Keep that pattern when adding a stage. (`add_vector_db` and `cache_clear` deliberately don't exit 1.)
- `express/middlewares/middlewares.ts` is dead code.
- User-facing strings (emails, vector-index text) are Russian. Keep them Russian.
