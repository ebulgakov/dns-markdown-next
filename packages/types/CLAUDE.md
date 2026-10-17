# packages/types — `@dns-markdown/types`

Shared TypeScript types for the data that crosses the API: what `apps/api` stores and returns, what `apps/parser` posts, what `apps/web` (and the future Expo app) renders. Monorepo-wide rules are in the root `CLAUDE.md`.

## Package shape

Types only, no build step and no dependencies. `exports` maps `./*` to `src/*.ts`; consumers import by subpath with `import type`:

- `@dns-markdown/types/pricelist` — `PriceList`, `Position`, `Goods`, `PriceListDate`, `PriceListsArchiveCount`
- `@dns-markdown/types/user` — `User`, `Favorite`, `FavoriteStatus`, `UserSections`, `UserNotifications`
- `@dns-markdown/types/analysis-data`, `analysis-diff`, `product`, `reports`
- `@dns-markdown/types/responses` — response envelopes of the user and LLM routes (`FavoritesResponse`, `SectionsResponse`, `LLMResponse`, …)

A new file under `src/` is exported automatically by the wildcard.

## Rules

- **No runtime code and no dependencies** (in particular no mongoose): the Expo app depends on this package, and `packages/db` builds its schemas against these types, not the other way round.
- Types describe the **JSON wire shape**: ids and dates are `string`, never `Date` / `ObjectId`.
- Inside the package use relative imports (`./pricelist`).
- App-only view types (e.g. web's `DiffsCollection`, `RemovedGoods`) stay in the app.
