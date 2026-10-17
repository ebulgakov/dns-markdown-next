Русский | [English](./README.en.md)

# Dns-Markdown

Сервис по подбору уценённых товаров магазина DNS: сайт, API и парсер данных в одном монорепозитории.

## Адрес сайта

https://dns.ebulgakov.com/

## О сервисе

Это неофициальный сайт, связанный с компанией DNS. Он помогает просматривать уценённые товары, представленные на сайте DNS.

Сейчас сервис показывает товары из Самары. Вы можете добавлять товары в избранное, чтобы отслеживать обновления, такие как изменения цен или наличие товара в магазинах.

<img width="2574" height="2342" alt="image" src="https://github.com/user-attachments/assets/a6922841-1aa0-4801-9577-50f47bc80b34" />

## Воркспейсы

| Путь                  | Пакет                      | Описание                                          | Документация                    |
| --------------------- | -------------------------- | ------------------------------------------------- | ------------------------------- |
| `apps/web`            | `@dns-markdown/web`        | Сайт на Next.js (App Router), деплоится на Vercel | [README](apps/web/README.md)    |
| `apps/api`            | `@dns-markdown/api`        | Express API, деплоится на Vercel                  | [README](apps/api/README.md)    |
| `apps/parser`         | `@dns-markdown/parser`     | Скрапер/ETL уценки DNS, отправляет данные в API   | [README](apps/parser/README.md) |
| `packages/env`        | `@dns-markdown/env`        | Общая загрузка env-файлов и проверки `NODE_ENV`   |                                 |
| `packages/types`      | `@dns-markdown/types`      | Общие типы payload и ответов API                  |                                 |
| `packages/api-client` | `@dns-markdown/api-client` | Типизированный клиент ко всем эндпоинтам API      |                                 |

## Инструменты

Воркспейсы [Bun](https://bun.sh) (`apps/*`, `packages/*`) с единым `bun.lock`, оркестрация через [Nx](https://nx.dev) в package-based режиме: таргеты Nx — это скрипты `package.json` каждого воркспейса, правила кеширования лежат в `nx.json`.

## Команды

Запускаются из корня репозитория:

```bash
bun install            # установить зависимости всех воркспейсов
bun run dev            # dev-таргеты всех проектов (api, web на :3000)
bun run test           # тесты всех проектов
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

API, парсер и пакеты используют общие env-файлы в корне репозитория: сначала загружается `.env.<NODE_ENV>`, затем `.env` (см. `.env.example`). `apps/web` использует собственный `apps/web/.env` (см. `apps/web/.env-example`).

## Используемые технологии

- Bun, Nx, TypeScript
- Next.js 16, React, Tailwind CSS, shadcn/ui, next-intl
- Express, Swagger
- MongoDB, Redis (Upstash)
- Clerk Auth
- Upstash Vector DB
- OpenAI API
- Storybook, Chromatic, Playwright, Bun test
- Sentry
