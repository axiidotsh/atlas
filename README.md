# Atlas

Atlas is a Turborepo-managed `pnpm` monorepo with a Next.js frontend in `apps/web` and a scaffolded backend workspace in `apps/api` for a future Hono API.

## Workspace Layout

```text
.
├── apps
│   ├── api
│   └── web
├── packages
│   ├── eslint-config
│   └── typescript-config
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Apps

- `apps/web`: Next.js app router frontend
- `apps/api`: placeholder backend workspace for the future Hono + TypeScript API

## Packages

- `packages/typescript-config`: shared TypeScript base, Next.js, and API configs
- `packages/eslint-config`: shared ESLint presets for the workspace

## Getting Started

Install dependencies once from the repo root:

```bash
pnpm install
```

Run the workspace in development mode from the repo root:

```bash
pnpm dev
```

The frontend is available at [http://localhost:3000](http://localhost:3000).

## Root Commands

Run these from the repo root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

## App-Specific Commands

Run commands for a single workspace when needed:

```bash
pnpm --filter @atlas/web dev
pnpm --filter @atlas/web lint
pnpm --filter @atlas/web typecheck

pnpm --filter @atlas/api lint
pnpm --filter @atlas/api typecheck
```

## Frontend Notes

- Frontend source lives in `apps/web/src`
- Frontend static assets live in `apps/web/public`
- The `@/*` alias in `apps/web` points to its local `src/*`
- `shadcn/ui` config lives in `apps/web/components.json`

## Backend Notes

- `apps/api` is scaffolded but not implemented as a real Hono app yet
- The current placeholder exports `AppType` from `apps/api/src/app.ts` so the package shape is ready for future RPC integration
- When the Hono app is added, `web` can consume type-only API contracts from `@atlas/api`
