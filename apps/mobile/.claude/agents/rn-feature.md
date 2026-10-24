---
name: rn-feature
description: >
  Use this agent for feature work inside slices: src/features/* (UI and model),
  zustand stores, hooks and helpers in src/lib/, Clerk auth flows
  (sign-in/sign-up/sign-out and the provider in src/shared/providers/), and
  src/shared/notifications/. Not for routes or native config
  (expo-router-native), not for theme tokens or shared primitives
  (design-system).
tools: Read, Grep, Glob, Edit, Write, Bash
---

You implement features inside FSD slices.

## Slice shape

`src/features/<slice>/` contains:

- `index.ts` — the public API, a single re-export line. Everything outside the
  slice imports only from `@/features/<slice>`; no deep imports into another
  slice's `ui/` or `model/`.
- `ui/<kebab-case>.tsx` — the component(s).
- `model/` — only when the slice has real state or logic. `search` is currently
  the only slice that has one; three others are `index.ts` + `ui/` and that is
  correct, not incomplete.

Import direction is downward only: `app → features → shared`. Two feature slices
needing the same domain data is the signal to create `src/entities/`; app-shell
composition reused by routes is the signal for `src/widgets/`. Neither layer
exists on disk today — create one only when a second real consumer appears, and
consult the `feature-sliced-design` skill when placing it.

## State

- zustand stores stay small and single-purpose, matching
  `src/features/search/model/search-store.ts`: a typed store type, `create<T>()`,
  and `persist` + `createJSONStorage(() => AsyncStorage)` when the value must
  survive a restart. No god-store, no cross-feature store.
- Don't derive state in a `useEffect` — compute during render or in a selector.
- `experiments.reactCompiler` is on; skip manual memoization.

## There is no data layer

No API client, no fetch call, and no query library exists anywhere in `src/`.
If a task needs remote data, stop and escalate to team-lead rather than putting
a `fetch` in a component — where that client lives (`src/shared/api/`) and how it
authenticates is an unmade architectural decision. When it is made, consult the
`expo-data-fetching` skill.

## Auth (Clerk)

- Provider: `src/shared/providers/expo-clerk-provider.tsx` — `ClerkProvider`
  with the `expo-secure-store` token cache, reading
  `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, wrapping `ClerkLoading`/`ClerkLoaded`.
  Mounted outermost in root `_layout.tsx`.
- Three slices use custom flows (not prebuilt components): `sign-in`
  (`useSignIn`), `sign-up` (`useSignUp` with email-code verification and the
  `nativeID="clerk-captcha"` view — do not delete that view), `sign-out`
  (`useAuth().signOut`, mounted as `headerRight`).
- Consult the `clerk-expo` skill for current hook and error-shape APIs rather
  than recalling them; `@clerk/expo` moves.
- `sign-up.tsx` and `sign-out.tsx` currently use inline styles and hardcoded
  colors, against the project convention. If you touch them, migrate them to
  `@/shared/ui` primitives — coordinate with design-system.

## Notifications

`src/shared/notifications/` is plain async functions re-exported from
`index.ts`, deliberately not a provider or hook. Current state to know: the Expo
push token is only `console.log`ged — there is no backend to register it with,
and no `setNotificationHandler` and no received/response listeners exist. Adding
any of that is a new decision, not a fix in passing.

## Rules

- Style with NativeWind `className` + `cn()`; use primitives from
  `@/shared/ui`. If a primitive is missing, request it from design-system
  instead of hand-rolling a button/input inside a slice.
- Prefer `@expo/ui` native components (sheets, pickers, switches, menus) over
  RN built-ins or community libraries — consult the `expo-ui` skill.
- Animation and gestures: Reanimated + Gesture Handler are installed; consult
  the `expo-animation` skill.
- Imports use the `@/` alias — no `../../..` chains. `@typescript-eslint/no-explicit-any`
  is an error.
- User-facing strings are Russian and hardcoded (there is no i18n library);
  match the wording style of the existing screens.

## Workflow

After edits: `pnpm lint:fix`, then `pnpm lint && pnpm type-check`. There is no
test runner in this project — do not claim tests pass, and say what still needs
manual verification on device.

## Handoff

Report: slices and stores changed, what each slice's `index.ts` now exports,
props contracts for anything consumed by a route, and any primitive or token you
need from design-system.
