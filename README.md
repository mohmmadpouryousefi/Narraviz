# 📊 Narraviz

> Turn a CSV into a data story: charts, computed insights, and a written narrative.

Narraviz is a data storytelling app built with Next.js and TypeScript. You upload a CSV, Narraviz infers the column types, suggests a chart, computes insights (trends, outliers, correlations), and writes a short narrative around them.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Status

Narraviz is a portfolio project under active development. This table is the source of truth for what works today.

| Area | Status |
| --- | --- |
| Landing page (GSAP animations, pricing, features) | ✅ Done |
| CSV parsing: type inference, null handling, size and row limits | ✅ Done |
| Bar and line charts with aggregation (sum, avg, count, min, max) | ✅ Done |
| Unit and component tests (Vitest + Testing Library) | ✅ Done |
| Accounts: email/password and GitHub sign-in (Auth.js) | ✅ Done |
| PostgreSQL storage for datasets and stories (Prisma) | ✅ Done |
| REST API for datasets and stories, with validation and per-user access | ✅ Done |
| Datasets, stories, and editor pages | 🚧 In progress |
| Insights engine and AI narrative (Claude, with a stats-only fallback) | 🚧 In progress |
| PDF/PowerPoint export, share links, white-label branding | 💡 Planned |
| Dark mode toggle | 💡 Planned |

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19
- **Language:** TypeScript in strict mode
- **Styling:** Tailwind CSS 4, shadcn/ui (Radix primitives)
- **Charts:** Recharts, d3
- **Animation:** GSAP, Framer Motion
- **Data:** PostgreSQL, Prisma 7, papaparse for CSV parsing, Zod for validation
- **Auth:** Auth.js (NextAuth v5): email/password with scrypt hashing, optional GitHub OAuth
- **Testing:** Vitest, Testing Library, jsdom; API tests run against a real Postgres
- **Code review:** a multi-agent AI reviewer runs on pull requests (see `REVIEW.md`)

## Getting started

Requires Node.js 22 and Docker (for Postgres).

```bash
git clone https://github.com/mohmmadpouryousefi/Narraviz.git
cd Narraviz
npm install                  # also generates the Prisma client

cp .env.example .env         # then set AUTH_SECRET: npx auth secret
docker compose up -d         # Postgres on localhost:5432
npm run db:deploy            # apply migrations

npm run dev
```

Open http://localhost:3000 and create an account.

**GitHub sign-in (optional):** create an OAuth app at https://github.com/settings/developers with the callback URL `http://localhost:3000/api/auth/callback/github`, then set `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`. The GitHub button only appears when both are set.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks and lints) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:migrate` | Create a migration after changing `prisma/schema.prisma` |
| `npm run db:deploy` | Apply pending migrations |

## How the data pipeline works

1. **Parse** (`src/lib/csvParser.ts`): reads the CSV with papaparse, rejects files over 10 MB or 200 columns, and stops reading after 50,000 rows so large files are never fully loaded into memory.
2. **Infer types:** a column is `number`, `date`, or `boolean` only if every non-empty value fits; otherwise it stays `string`. Ambiguous formats such as `03/05/2024` are deliberately not treated as dates.
3. **Aggregate** (`src/lib/formatData.ts`): groups rows by the x column and combines y values. Time series are sorted by date; categories are sorted by value, and the long tail is merged into "Other" (only for sums and counts, where merging is meaningful).
4. **Suggest a chart:** a date column with a numeric column becomes a line chart; a low-cardinality category with a numeric column becomes a bar chart.

## API

All endpoints require a signed-in session and only ever return the caller's own data. Another user's dataset or story returns `404`, not `403`, so ids can't be probed.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/datasets` | List your datasets (without row data) |
| `POST` | `/api/datasets` | Upload a CSV (`multipart/form-data`: `file`, optional `name`); parsed on the server |
| `GET` | `/api/datasets/:id` | One dataset with columns and rows |
| `PATCH` | `/api/datasets/:id` | Rename (`{ "name": "..." }`) |
| `DELETE` | `/api/datasets/:id` | Delete a dataset and its stories |
| `GET` | `/api/stories` | List your stories |
| `POST` | `/api/stories` | Create a draft story from a dataset (`{ "datasetId": "..." }`) |
| `GET` | `/api/stories/:id` | One story with its blocks |
| `PATCH` | `/api/stories/:id` | Update title, description, status or blocks; chart columns are checked against the dataset |
| `DELETE` | `/api/stories/:id` | Delete a story |

Errors are JSON: `{ "error": "message", "fields": { "name": "message" } }`.

## Security notes

- Passwords are hashed with scrypt (Node's `crypto`), with a per-password salt and the parameters stored alongside the hash.
- Sign-in takes the same time whether or not the email exists, so response time doesn't reveal which accounts exist.
- Post-login redirects only accept same-site paths (no open redirects).
- Uploads are limited before the body is read, and CSVs are always parsed on the server.
- Not yet implemented: rate limiting on sign-in, email verification, password reset.

## Project structure

```
prisma/             Schema and migrations
src/
  app/              Routes (App Router) and API route handlers
  auth.ts           Auth.js configuration
  components/
    charts/         BarChart, LineChart
    sections/       Landing page sections
    layout/         Navbar, Footer, DashboardLayout
    ui/             shadcn/ui components
  lib/              CSV parsing, aggregation, validation, database client
  types/            Shared dataset and story types
tests/              Vitest tests
```

## Contributing

Issues and pull requests are welcome. Every pull request is reviewed by the AI reviewer described in `REVIEW.md`; please run `npm run lint`, `npm run typecheck` and `npm test` before opening one.
