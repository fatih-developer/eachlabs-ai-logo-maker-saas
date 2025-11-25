# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages and API routes (e.g., `app/api/predictions`).
- `components/`: UI and landing sections (`components/logo-maker.tsx`, `components/landing/*`).
- `db/`: Drizzle schema and connection; migrations output in `drizzle/`.
- `lib/`, `hooks/`: Shared helpers and React hooks.
- `public/`: Static assets.
- Docs live under `docs/` (API registry, PRD, platform notes).

## Build, Test, and Development Commands
- `bun dev`: Run the dev server (Turbopack).
- `bun run build`: Production build.
- `bun start`: Start the production server.
- `bun lint`: ESLint checks (see existing warning on `<img>` in `components/logo-maker.tsx`).
- `bun run db:generate | db:migrate | db:push | db:studio`: Drizzle workflows.

## Coding Style & Naming Conventions
- TypeScript-first; App Router. Prefer functional components with hooks.
- Tailwind CSS v4 utility classes; avoid inline styles unless needed for animations.
- Use `cn` helper for class merging. Keep copy in English.
- Linting: ESLint 9. Run `bun lint` before pushing.
- Filenames: kebab-case for files, PascalCase for components, camelCase for variables/functions.

## Testing Guidelines
- No formal test suite yet. Add tests alongside features when feasible.
- For new API logic, prefer lightweight integration tests (Next.js route handlers) and unit tests for helpers.
- Name test files `*.test.ts` / `*.test.tsx`; colocate near source or under `__tests__/`.

## Commit & Pull Request Guidelines
- Commit messages: short imperative summary (e.g., “Rebrand app to LogoLoco”, “Update README for bun workflow”).
- Pull requests: include summary of changes, relevant screenshots for UI tweaks, and note any lint/test runs. Link issues when applicable.

## Security & Configuration Tips
- Required envs: `DATABASE_URL`, `EACHLABS_API_KEY`; set `DATABASE_SSL=true` in production.
- Do not commit secrets. `.env.local` is ignored.
- Drizzle relies on `DATABASE_URL`; API calls rely on `EACHLABS_API_KEY`.

## Architecture Overview
- Client submits form → `POST /api/predictions` persists request and calls Eachlabs API → client polls `GET /api/predictions/[id]` until status is `succeeded`.
- DB table: `logo_generations` with status/images/provider IDs; indexes on `created_at`, `status`, `provider_prediction_id`.
