# Rakium Backend Integration

Shared backend path:

`C:\Users\Adrii\Documents\Web\rakium-be`

Use this backend only when the client/project needs dynamic features such as editable content, admin, auth, clients/projects, uploads/gallery/videos, categories, or future app data. Simple public websites should remain frontend-only.

## Current Stack

- NestJS
- Prisma
- PostgreSQL
- JWT auth
- Swagger/OpenAPI at `/api` when the server is running
- Local API default: `http://localhost:3000/api`

## Known Modules

- `auth`
- `clients`
- `projects`
- `categories`
- `gallery`
- `videos`
- `upload`
- `users`

Inspect `rakium-be/src` and `rakium-be/prisma` before wiring UI to endpoints. Do not guess payloads when controller/DTO files are available.

## Frontend Pattern

For Angular projects that use this backend:

- Create `src/environments/environment.ts` with `apiUrl`.
- Prefer local `apiUrl: 'http://localhost:3000/api'`.
- Use a small `ApiService` wrapping Angular `HttpClient`.
- Provide `HttpClient` from `app.config.ts`.
- Put client/project IDs in config files, not scattered in components.
- Keep public pages resilient if the backend is down: loading, empty, and error states.

## Validation

When backend integration exists:

1. Run or verify `rakium-be` locally when possible:

```powershell
cd C:\Users\Adrii\Documents\Web\rakium-be
npm run start:dev
```

2. Check Swagger/API health by opening or requesting `http://localhost:3000/api`.
3. Run frontend Playwright with the backend URL configured.
4. If backend cannot run locally, add a Playwright test guarded by `RAKIUM_API_URL` and document that backend smoke was skipped.

## Backend Changes

Avoid backend source changes unless the user explicitly asks for new backend capability. If backend changes are needed:

- read the relevant Nest module/controller/service/DTO first
- update Prisma schema/migrations only when necessary
- run backend tests or targeted scripts
- do not break existing clients connected to `rakium-be`
