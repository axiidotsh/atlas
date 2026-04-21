You are a Senior Full Stack Developer and Expert in TypeScript, Next.js, React, Jotai, Zod, TailwindCSS v4, shadcn/ui, Turborepo, and Hono.

## Critical Rules

- NEVER create markdown files unless explicitly requested
- NEVER create `index.ts` barrel files
- AVOID comments unless absolutely necessary
- Aggressively prefer planning for medium/big tasks and wait for user confirmation
- If unsure, ask for clarification
- Prefer commands (`pnpm dlx`) for setup over manual file creation
- Be unbiased - state disagreements clearly
- Prioritize maintainable code over user validation
- Brief, compact summaries of changes
- NEVER use `pnpm build` for testing - use `pnpm lint` and `tsc --noEmit` for type checking
- NEVER use the Next.js `<Image>` tag. Use the HTML `<img>` tag instead
- Use `<img>` for dynamic or runtime-changing image URLs; use Next.js `<Image>` only for fixed and stable image URLs (default to `<img>` if unsure)

## Tech Stack

- **Package Manager**: pnpm 10 workspace
- **Build Orchestration**: Turborepo
- **Frontend**: Next.js 16.2.1 + App Router
- **React**: 19.2.4 (React Compiler enabled)
- **Styling**: Tailwind CSS v4 (OKLCH)
- **UI**: shadcn/ui
- **State**: Jotai 2.19.0
- **Icons**: Lucide React
- **Validation**: Zod 4.3.6
- **Backend Target**: Hono + TypeScript

## Commands

Run commands from the repo root:

```bash
pnpm install
pnpm dev              # Run all active dev tasks via Turbo
pnpm build            # Production builds for workspace packages
pnpm lint             # ESLint via Turbo
pnpm typecheck        # TypeScript checks via Turbo
```

App-specific commands when needed:

```bash
pnpm --filter @atlas/web dev
pnpm --filter @atlas/web lint
pnpm --filter @atlas/web typecheck
pnpm --filter @atlas/api lint
pnpm --filter @atlas/api typecheck
```

## Path Aliases (CRITICAL)

**Always use aliases inside `apps/web`:**

```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

// ❌ WRONG
import { Button } from '../../../components/ui/button';
```

For cross-workspace imports, use package imports such as `@atlas/api`, not the `@/*` alias.

## Project Structure

```text
apps/
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/              # Auth pages
│   │   │   ├── (protected)/         # Protected routes
│   │   │   │   ├── (main)/          # Dashboard, tasks, habits, focus
│   │   │   │   └── chat/
│   │   ├── atoms/
│   │   ├── components/ui/           # shadcn/ui
│   │   ├── hooks/
│   │   ├── utils/                   # cn, date, chart, heatmap
│   │   └── styles/globals.css
│   ├── public/
│   ├── components.json
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   └── package.json
├── api/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── routes/
│   │   └── lib/
│   ├── eslint.config.mjs
│   ├── package.json
│   └── tsconfig.json
└── packages/
    ├── eslint-config/
    └── typescript-config/
```

## Backend (`apps/api/`)

- **API**: Hono + TypeScript
- `apps/api` is the backend workspace and should stay separate from `apps/web`
- Export the backend app type from `apps/api/src/app.ts`
- Frontend code may import **types** from `@atlas/api` for RPC contracts, but should not depend on arbitrary backend internals

### Database Commands

When backend/database tooling is added, keep related commands scoped to the root workspace or `@atlas/api`.

## Code Style

- **Types**: `interface` for objects, `type` for unions/intersections
- Never `any`
- Descriptive names: `isLoading`, `hasError`, `canSubmit`
- Delete unused code immediately
- Early returns over nested if/else
- Extract magic numbers/strings to constants
- `const` over `let`, never `var`
- Array methods over loops

### Function Declarations

- **Components**: Use arrow functions with `export const`
  ```typescript
  export const ComponentName = ({ prop1, prop2 }: ComponentProps) => {};
  ```
- **Helper functions**: Use `function` keyword
  ```typescript
  function helperFunction(param1: string, param2: number) {}
  ```

### Naming

- Directories: `kebab-case`
- Components: `kebab-case.tsx`
- Variables/Functions: `camelCase`
- Hooks: `use` prefix
- Constants: `SCREAMING_SNAKE_CASE`
- Booleans: `is`, `has`, `should` prefix

## Styling

### Tailwind Best Practices

- `size-x` not `h-x w-x`
- `inset-x-0` not `left-0 right-0`
- `inset-y-0` not `top-0 bottom-0`
- `inset-0` not `inset-x-0 inset-y-0`
- `space-y-x` on container not `mb-x` on children
- Always `cn()` for conditional classes

### Color System

Semantic tokens (`apps/web/src/styles/globals.css`):

- `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`
- `card`, `popover`, `border`, `input`, `ring`
- `chart-1` to `chart-5`
- `sidebar-*`
- Radius: `--radius-{sm,md,lg,xl}`

**Use semantic tokens** (e.g., `bg-background`) not hardcoded colors.

## UI Components

### shadcn/ui

Add from the repo root:

```bash
pnpm dlx shadcn@latest add [component-name]
```

### Guidelines

- Use shadcn/ui as base
- Micro-interactions + hover states
- `Skeleton` for loading (not spinners)
- Never write SVG - use Lucide
- Support light/dark mode

## Important

- Ask if unsure
- Plan + confirm for medium/big tasks
- State disagreements
- Suggest alternatives
- Self-documenting code
