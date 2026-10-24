Русский | [English](./README.en.md)

# Dns-Markdown

Сервис по подбору уценённых товаров магазина DNS: сайт, мобильное приложение, API и парсер данных в одном монорепозитории.

## Адрес сайта

https://dns.ebulgakov.com/

## О сервисе

Это неофициальный сайт, связанный с компанией DNS. Он помогает просматривать уценённые товары, представленные на сайте DNS.

Сейчас сервис показывает товары из Самары и Москвы (город переключается в шапке сайта). Вы можете добавлять товары в избранное, чтобы отслеживать обновления, такие как изменения цен или наличие товара в магазинах.

<img width="1920" height="1758" alt="image" src="https://github.com/user-attachments/assets/de7ff969-c516-4031-8604-f21029b86fdb" />

## Воркспейсы

| Путь                  | Пакет                      | Описание                                                                                         | Документация                                                        |
| --------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `apps/web`            | `@dns-markdown/web`        | Сайт на Next.js (App Router), деплоится на Vercel                                                | [README](apps/web/README.md), [CLAUDE.md](apps/web/CLAUDE.md)       |
| `apps/api`            | `@dns-markdown/api`        | Express API (MongoDB/Mongoose), деплоится на Vercel                                              | [README](apps/api/README.md), [CLAUDE.md](apps/api/CLAUDE.md)       |
| `apps/parser`         | `@dns-markdown/parser`     | Скрапер/ETL уценки DNS, отправляет данные в API, запускается локально                            | [README](apps/parser/README.md), [CLAUDE.md](apps/parser/CLAUDE.md) |
| `apps/mobile`         | `@dns-markdown/mobile`     | Мобильное приложение на Expo (React Native, expo-router) для iOS и Android, собирается через EAS | [README](apps/mobile/README.md), [CLAUDE.md](apps/mobile/CLAUDE.md) |
| `packages/env`        | `@dns-markdown/env`        | Общая загрузка env-файлов и проверки `NODE_ENV`/платформы                                        | [CLAUDE.md](packages/env/CLAUDE.md)                                 |
| `packages/types`      | `@dns-markdown/types`      | Общие типы payload и ответов API                                                                 | [CLAUDE.md](packages/types/CLAUDE.md)                               |
| `packages/api-client` | `@dns-markdown/api-client` | Типизированный axios-клиент ко всем эндпоинтам API                                               | [CLAUDE.md](packages/api-client/CLAUDE.md)                          |
| `packages/tests`      | `@dns-markdown/tests`      | Общие тестовые утилиты: фикстуры, HTTP/Express/Mongoose-дублёры, DOM, таймеры                    | [CLAUDE.md](packages/tests/CLAUDE.md)                               |

## Инструменты

Воркспейсы [Bun](https://bun.sh) (`apps/*`, `packages/*`) с единым `bun.lock`, оркестрация через [Nx](https://nx.dev) в package-based режиме: таргеты Nx — это скрипты `package.json` каждого воркспейса, правила кеширования лежат в `nx.json`.

- Bun — менеджер пакетов, рантайм и тест-раннер; версия закреплена в `packageManager` корневого `package.json`. Исключение — `apps/mobile`: тесты на Jest (`jest-expo`), линт через `expo lint`.
- Node (нужен для `next`, `storybook`, `eslint`, `expo`) — версия в [`.nvmrc`](.nvmrc).
- Для `apps/mobile` — Xcode (iOS) и/или Android Studio (Android): приложение работает через собственный dev client, а не через Expo Go.
- Pre-commit хуки — husky + lint-staged.

## Начало работы

```bash
git clone --recurse-submodules git@github.com:ebulgakov/dns-markdown-next.git
# или в уже склонированном репозитории:
git submodule update --init   # приватный сабмодуль со скриптами скрапера (нужен только парсеру)

bun install
cp .env.example .env          # заполнить нужные переменные
bun run dev
```

Мобильное приложение (из `apps/mobile/`):

```bash
bun run ios            # собрать и запустить dev client в симуляторе iOS (или bun run android)
bun run start          # запустить Metro для уже установленного dev client
```

## Команды

Запускаются из корня репозитория:

```bash
bun install            # установить зависимости всех воркспейсов
bun run dev            # dev-таргеты всех проектов (api в watch-режиме, web на :3000)
bun run test           # тесты всех проектов (mobile — Jest, остальные — bun test)
bun run lint           # линт всех проектов
bun run lint:fix       # линт с --fix
bun run type-check     # tsc --noEmit для всех проектов
bun run build          # сборка всех проектов
bun run affected       # lint/type-check/test/build только для проектов, изменённых относительно main
```

Отдельный проект / скрипт:

```bash
NX_LOAD_DOT_ENV_FILES=false bunx nx run <project>:<script>   # например @dns-markdown/api:dev
bunx nx graph                                                # граф проектов
```

`NX_LOAD_DOT_ENV_FILES=false` не даёт Nx подмешивать корневые `.env*` файлы в окружение каждой задачи (корневые скрипты уже его выставляют).

## Переменные окружения

Все воркспейсы, включая `apps/web`, используют общие env-файлы в корне репозитория: сначала загружается `.env.<NODE_ENV>` (`.env.development`, `.env.test`, `.env.production`), затем `.env`; уже выставленные переменные не перезаписываются. Все ключи перечислены в [`.env.example`](.env.example). Next.js сам читает только `apps/web/.env*`, поэтому `apps/web/next.config.ts` загружает корневые файлы через `loadEnv()` из `@dns-markdown/env` — не кладите env-файлы в `apps/web/`. В продакшене переменные задаёт Vercel.

Исключение — `apps/mobile`: Expo читает переменные `EXPO_PUBLIC_*` (например, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`) только из `apps/mobile/.env*` и встраивает их в бандл, поэтому секреты с этим префиксом не задавайте.

## CI

GitHub Actions (`.github/workflows/`) на push/PR в `main`: ESLint, `tsc --noEmit`, тесты всех воркспейсов, актуальность `openapi.json` API, Playwright и dependency-cruiser для web. Chromatic запускается только для PR с меткой `chromatic`.

## Используемые технологии

- Bun, Nx, TypeScript, Zod
- Next.js 16, React 19, Tailwind CSS, shadcn/ui, next-intl, TanStack Query, Zustand
- Expo SDK 57, React Native, expo-router, NativeWind, EAS (мобильное приложение)
- Express 5, Swagger
- MongoDB (Mongoose), Redis (Upstash)
- Clerk Auth
- Upstash Vector DB
- OpenAI API
- cheerio, Resend (парсер)
- Storybook, Chromatic, Playwright, Bun test, Jest (mobile)
- Sentry, OpenTelemetry
