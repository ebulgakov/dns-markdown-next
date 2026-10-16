## DNS Markdown API — документация

### Базовый URL

- **Production / staging**: зависит от окружения деплоя (например, Vercel).
- **Базовый путь API**: все публичные маршруты начинаются с префикса `/api`, служебные — с `/service`, вебхуки Clerk — с `/clerk`.
- `GET /health` — проверка доступности сервиса, без авторизации.

### Аутентификация и заголовки

- **Общий доступ к `/api/*`**
  - Все маршруты под `/api` защищены двумя слоями:
    - **Clerk**: `clerkMiddleware()` ожидает, что запрос идёт от аутентифицированного пользователя Clerk (cookies / заголовки авторизации от Clerk).
    - **Секрет фронтенда**: middleware `authPublicMiddleware` требует заголовок:
      - `X-Internal-API-Secret: <API_SECRET_KEY>`
  - Значение `API_SECRET_KEY` задаётся в переменных окружения и валидируется в `env.ts`.

- **Служебные эндпоинты `/service/*`**
  - Защищены middleware `authServiceMiddleware`.
  - Требуемый заголовок:
    - `Authorization: Bearer <API_SERVICE_KEY>`
  - Значение `API_SERVICE_KEY` задаётся в переменных окружения и должно совпадать с токеном в запросе.

- **Вебхуки Clerk `/clerk/*`**
  - Проверка подписи вебхука с помощью `CLERK_WEBHOOK_SIGNING_SECRET` (через `svix`), ожидаются заголовки `svix-id`, `svix-timestamp`, `svix-signature`.
  - `/clerk/create-user` использует `express.raw({ type: "application/json" })` для валидации подписи по необработанному телу.

- **CORS**
  - Разрешённые origin’ы берутся из переменной окружения `CORS_ORIGIN` (список через запятую).
  - Разрешённые методы: `GET`, `POST`, `OPTIONS`.
  - Разрешённые заголовки: `Content-Type`, `Authorization`, `X-Internal-API-Secret`.

### Формат ошибок

- **400 Bad Request** (валидация запроса)
  - Тело ответа: `{ "errors": "<zod-описание ошибки>" }`.
- **500 Internal Server Error**
  - Тело ответа:
    - В продакшене: `{ "error": "Internal Server Error" }`
    - В дев-окружении: `{ "error": "Internal Server Error", "details": "<сообщение ошибки>" }`

### Документация по эндпоинтам

Полное описание каждого эндпоинта (параметры, тела запросов, схемы ответов) генерируется из zod-схем и живёт как OpenAPI-спека:

- **Swagger UI**: `/docs`, доступен во всех окружениях. Страница статическая (спека встроена), но реальные запросы через "Try it out" всё равно требуют `X-Internal-API-Secret` — вводится через диалог "Authorize" в самом Swagger UI. В проде доступ к URL ограничивается Vercel Deployment Protection, а не заголовком (его нельзя выставить обычной навигацией браузера).
- **Сырой спек**: [`openapi.json`](./openapi.json) в корне репозитория — источник истины, перегенерируется через `bun run generate:openapi` и проверяется в CI (`.github/workflows/openapi.yml`) на актуальность.

При добавлении/изменении эндпоинта — обновляй zod-схему и `RouteDoc` рядом с хендлером (`src/*-routes/helpers/schemas.ts`), а не этот файл.
