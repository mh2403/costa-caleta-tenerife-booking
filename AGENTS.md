# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the React + TypeScript app; routing lives in `src/pages/` and is wired in `src/App.tsx`.
- UI building blocks live in `src/components/` (shadcn-style components in `src/components/ui/`).
- Shared logic goes in `src/hooks/`, `src/lib/`, and `src/i18n/`.
- Static assets live in `src/assets/` and `public/`.
- Supabase integration code is in `src/integrations/supabase/` and backend assets live in `supabase/` (`functions/`, `migrations/`, `config.toml`).
- Tests live alongside source under `src/**/*.{test,spec}.{ts,tsx}` with setup in `src/test/setup.ts`.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts Vite dev server (port 8080) with HMR.
- `npm run build` creates a production build in `dist/`.
- `npm run build:dev` builds with development mode settings.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint across the repo.
- `npm run test` runs Vitest once; `npm run test:watch` runs in watch mode.

## Coding Style & Naming Conventions
- Use TypeScript and ES modules; React components are `.tsx` files.
- Indentation is 2 spaces; keep JSX readable and prefer small, named components.
- Use the path alias `@` for `src` imports (e.g., `@/components/Button`).
- Styling uses Tailwind CSS; keep classes concise and colocated with components.
- Linting is configured in `eslint.config.js`; run `npm run lint` before shipping.

## Testing Guidelines
- Frameworks: Vitest + Testing Library in a `jsdom` environment.
- Name tests `*.test.tsx` or `*.spec.tsx` and keep them under `src/`.
- Add tests for new behavior and bug fixes; update `src/test/setup.ts` if new globals are required.

## Commit & Pull Request Guidelines
- Commit messages are short, sentence-case, and imperative (e.g., “Integrate backend and admin”).
- PRs should include a concise summary, relevant screenshots for UI changes, and the tests you ran (e.g., `npm run lint`, `npm run test`). Link related issues when applicable.

## Configuration & Secrets
- Do not commit secrets. Use `.env` locally for credentials and document any new required variables if added.
