# @dns-markdown/parser

Scraper/ETL for DNS markdown ("уценка") listings of [dns-markdown](../../README.md). It downloads catalog pages, parses them with cheerio and pushes the results over HTTP to the API (`apps/api`) through [`@dns-markdown/api-client`](../../packages/api-client/CLAUDE.md). The parser never opens a database connection. Runs locally only (not deployed).

## Preparation

- The scraper scripts live in the private `dns-markdown-parser` git submodule at `src/dns-markdown-parser` (needs access to `git@github.com:ebulgakov/dns-markdown-parser.git`). Fetch it after cloning: `git submodule update --init`.
- `src/dns-markdown-parser/request.sh` is a saved DNS curl request (cookies, CSRF token) that the downloader reads. It is gitignored and refreshed by hand when it expires.

## Commands

Run inside `apps/parser` (cwd matters: runtime paths are relative to it), or from the root via `NX_LOAD_DOT_ENV_FILES=false bunx nx run @dns-markdown/parser:<script>`:

```bash
bun run parse:samara    # full pipeline for Samara (+ favorites email + vector index)
bun run parse:moscow    # full pipeline for Moscow
```

Pipeline: `downloader` → `add:list` → `add:analysis-data` → `add:analysis-diff` → `cache:clear`; `parse:samara` then runs `check:favorites` and `add:vector-db`.

Individual stages (each needs `CITY` set, e.g. `CITY=samara bun run add:list`):

```bash
bun run downloader                # fetch pages -> crawler -> fetch prices (into src/pages/)
bun run add:list                  # parse src/pages/ -> POST price list
bun run add:analysis-data         # flatten price list -> analysis collection (incremental)
bun run add:analysis-data:full    # same, full rebuild (WRITE_STRATEGY=replace)
bun run add:analysis-diff         # day-over-day diff (incremental)
bun run add:analysis-diff:full    # same, full rebuild
bun run add:analysis-report       # ask the API to generate a report
bun run add:vector-db             # reset + reindex Upstash Vector from the last price list
bun run check:favorites           # diff users' favorites, email changes (Resend)
bun run cache:clear               # clear API cache (daily:*) + Next.js revalidate
bun run cache:clear:local         # same for local:* keys
bun run delete:old-price-lists    # delete old Samara price lists
```

Checks:

```bash
bun run test          # bun test (no env vars needed)
bun run lint          # eslint (root config, submodule ignored)
bun run type-check    # tsc --noEmit
```

## .env

Env vars live in the shared `.env*` files in the monorepo root (see the root `.env.example`) and are validated by the zod schema in `src/env.ts`. `CITY`, `WRITE_STRATEGY` and `KEYS` are set by the `package.json` scripts — do not put `CITY` into the shared `.env`.

## Technologies

- Bun, TypeScript, Zod
- cheerio, axios
- Upstash Vector DB
- Resend
