# @dns-markdown/mobile

iOS/Android app of [dns-markdown](../../README.md), built with Expo SDK 57 (React Native, expo-router, NativeWind). Tabs: home, catalog (with markdown detail screen), today, analysis, favorites, profile (Clerk sign-in/sign-up). Built and distributed with EAS, not deployed to Vercel.

The app runs in its own **dev client**, not in Expo Go: native modules (Clerk, notifications, glass effect, …) need a native build.

## Setup

Dependencies are installed from the monorepo root (single `bun.lock`):

```bash
bun install
```

Native toolchain: Xcode (iOS simulator / device) and/or Android Studio (Android emulator / device).

## Commands

Run inside `apps/mobile`, or from the root via `bunx nx run @dns-markdown/mobile:<script>`:

```bash
bun run ios                 # build + install the dev client on iOS (expo run:ios), starts Metro
bun run android             # same for Android
bun run start               # start Metro for an already installed dev client
bun run prebuild:ios        # regenerate ios/ (expo prebuild --clean) after app.json/native changes
bun run prebuild:android    # regenerate android/
```

`ios/` and `android/` are generated (Continuous Native Generation) and gitignored — change native config through `app.json` / config plugins, never by hand. Adding a dependency with native code needs a dev client rebuild, not just a Metro restart. Install dependencies with `npx expo install <pkg>` so versions match the SDK.

Checks (root `bun run lint|type-check|test` include this app):

```bash
bun run test          # Jest (jest-expo + @testing-library/react-native), not bun test
bun run lint          # expo lint (own eslint.config.js; the root ESLint config ignores apps/mobile)
bun run lint:fix
bun run type-check    # tsc --noEmit
```

## Builds (EAS)

Profiles in `eas.json`: `development` (dev client, internal), `preview` (internal), `production` (store, auto-incremented build number; app version is managed remotely).

```bash
bunx eas-cli build --profile development --platform ios
bunx eas-cli build --profile production --platform all
bunx eas-cli submit --profile production
```

## .env

Unlike the other workspaces, the app does not use the shared root `.env*` files: Expo reads `EXPO_PUBLIC_*` vars only from `apps/mobile/.env*` and inlines them into the JS bundle — never put a secret behind that prefix.

```bash
# apps/mobile/.env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

## Technologies

- Expo SDK 57, React Native 0.86 (New Architecture), React 19, React Compiler
- expo-router (typed routes), NativeWind / Tailwind CSS, `@expo/ui`
- Clerk (`@clerk/expo`), expo-notifications, Zustand
- Jest (`jest-expo`), `@testing-library/react-native`
- EAS Build / Submit

Architecture, conventions and agent ownership: [CLAUDE.md](CLAUDE.md).
