# Review rules for Narraviz

These rules are read by the AI reviewer (`.github/ai-review`) on every pull request.
The reviewer reads this file from `main`, so changes here take effect after they are merged.

## Stack context

- Next.js 15 App Router, React 19, TypeScript (strict), Tailwind, shadcn/ui, Zustand, Zod.
- Users upload CSV datasets, which are parsed (papaparse), visualized (d3, recharts) and turned into stories.

## Always flag

### Critical
- API route handlers (`src/app/api/**/route.ts`) that read or change user data without checking the session.
- Request bodies, query params or uploaded files used without Zod validation.
- Secrets or API keys in client components, `NEXT_PUBLIC_*` variables, or committed files.
- User-controlled content rendered with `dangerouslySetInnerHTML`, or inserted into d3 with `.html()`.
- User data or CSV content placed into an LLM prompt without separating it from instructions (prompt injection).

### Major
- CSV parsing that loads unbounded files into memory, or has no row/size limit.
- Data access that returns another user's datasets or stories (missing ownership check).
- Server-only code (database, secrets, `fs`) imported into a file marked `"use client"`.
- `useEffect` with missing dependencies or no cleanup for GSAP timelines, ScrollTriggers, d3 listeners or video elements (leaks on route change).
- Async errors that are swallowed, or API routes that return 200 on failure.
- Zustand stores that hold server data without a way to refresh or invalidate it.

### Minor
- Charts that crash on empty datasets, `NaN`, or missing columns.
- Large client components that could be Server Components.

## Do not flag

- Formatting, import order, naming: ESLint handles these.
- Generated shadcn/ui components in `src/components/ui/` unless the PR changes their behavior.
- Empty placeholder files (several routes and hooks are stubs that are not built yet).
- Marketing copy and animation timing values.
