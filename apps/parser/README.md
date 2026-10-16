# Parser for the [Dns-markdown](https://github.com/ebulgakov/dns-markdown-next)

## Parser preparation instructions.

- The scraper scripts live in the private `dns-markdown-parser` git submodule at `src/dns-markdown-parser` (needs access to `git@github.com:ebulgakov/dns-markdown-parser.git`). Fetch it after cloning: `git submodule update --init`.
- Put a curl request to the last page into `src/dns-markdown-parser/request.sh`.

## .env

Env vars live in the shared `.env` in the monorepo root (see the root `.env.example`).
