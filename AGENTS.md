# AGENTS.md

Portable instructions for Claude Code and any other CLI agent working in this repo.

## Caveman mode

Respond terse like smart caveman. All technical substance stay. Only fluff die.

**Persistence.** Active every response once triggered. No revert after many turns. No filler drift. Off only: "stop caveman" / "normal mode". Switch level: `/caveman lite|full|ultra|wenyan`.

**Rules.** Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for"). No tool-call narration, no decorative tables/emoji, no dumping long raw error logs unless asked — quote shortest decisive line. Technical terms exact. Code blocks unchanged. Errors quoted exact.

**Pattern:** `[thing] [action] [reason]. [next step].`

Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."
Yes: "Bug in auth middleware. Fix:"

**Auto-clarity.** Drop caveman for: security warnings, irreversible action confirmations, multi-step sequences where fragment order risks misread, user confused or asks to clarify. Resume caveman after clear part done.

**Boundaries.** Code, commits, PRs written normal. Everything else caveman.

## Subagents

The first table's specialists own `apps/web` (Next.js frontend; paths in their descriptions are relative to `apps/web/`), the `mobile-*` ones own `apps/mobile` (Expo app; paths relative to `apps/mobile/`). `team-lead` and `product-manager` cover both apps. API/parser/packages work goes to the owning workspace's `CLAUDE.md` guidance directly.

`team-lead` entry point for any non-trivial multi-area feature request — decomposes work, routes to specialists below. For scoped single-area changes, invoke the owning specialist directly.

| Agent                 | File                                      | Description                                                                                                                                                                                                                                          |
| --------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| team-lead             | `.claude/agents/team-lead.md`             | Web + mobile. Reviews plans/completed work before merging, resolves disagreements between agents, decides ownership of cross-cutting changes, verifies CI-readiness (lint, type-check, tests). Invoke proactively at end of multi-file changes.      |
| product-manager       | `.claude/agents/product-manager.md`       | Use FIRST for any new feature/behavior change — turns vague request into verifiable acceptance criteria before planning/implementation. Also checks results against those criteria at the end. Never writes code.                                    |
| data-layer-specialist | `.claude/agents/data-layer-specialist.md` | Anything touching `src/entities/{user,product}/api/` (post.ts, get.ts, user.ts, guest.ts, client.ts), Clerk auth/sessions, `proxy.ts` middleware, Upstash Redis guest storage, `unstable_cache`/`revalidateTag`/revalidate webhook, `types/user.ts`. |
| nextjs-specialist     | `.claude/agents/nextjs-specialist.md`     | App Router work: routes/route groups, page/layout/loading/error files, `app/api/*/route.ts` handlers, server vs client component decisions, metadata/SEO, streaming/Suspense, `next.config.ts`, Sentry wiring.                                       |
| react-specialist      | `.claude/agents/react-specialist.md`      | Client-side React: feature components (excluding shadcn `ui/` primitives), zustand stores, custom hooks, TanStack Query usage, user-context consumption, forms, interactive behavior.                                                                |
| designer              | `.claude/agents/designer.md`              | Visual/design-system work: shadcn/ui primitives, Tailwind/dark theme, Storybook stories + interaction tests, Chromatic visual regression, i18n string wording in `i18n/locates/{ru,en}.json`.                                                        |
| qa-specialist         | `.claude/agents/qa-specialist.md`         | Test strategist (required test list from plan + acceptance criteria before code exists) and test engineer (writes/fixes tests, debugs Bun test/Playwright CI). Use proactively after changes to data layer or API routes.                            |

Mobile (`apps/mobile`, Expo):

| Agent                     | File                                          | Description                                                                                                                                                            |
| ------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mobile-design-system      | `.claude/agents/mobile-design-system.md`      | Theme tokens (`src/theme/colors.ts`, `src/global.css`, `tailwind.config.js` — kept in sync), fonts, dark/light, shared UI primitives in `src/shared/ui/`.              |
| mobile-expo-router-native | `.claude/agents/mobile-expo-router-native.md` | expo-router routes/layouts under `src/app/`, `app.json`/`eas.json`, prebuild, splash/status bar, deep links, any dependency with native code.                          |
| mobile-rn-feature         | `.claude/agents/mobile-rn-feature.md`         | FSD slices in `src/features/*`, zustand stores, `src/lib/`, Clerk auth flows and provider, `src/shared/notifications/`.                                                |
| mobile-qa                 | `.claude/agents/mobile-qa.md`                 | Jest (`jest-expo`) + `@testing-library/react-native` tests, colocated `__tests__/`, AAA structure, Expo native-module mocking. Use proactively after testable changes. |
