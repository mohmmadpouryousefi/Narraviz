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
| Accounts: GitHub and email/password sign-in (Auth.js) | 🚧 In progress |
| PostgreSQL storage for datasets and stories (Prisma) | 🚧 In progress |
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
- **Data:** papaparse for CSV parsing, Zod for validation, Zustand for client state
- **Testing:** Vitest, Testing Library, jsdom
- **Code review:** a multi-agent AI reviewer runs on pull requests (see `REVIEW.md`)

## Getting started

Requires Node.js 22.

```bash
git clone https://github.com/mohmmadpouryousefi/Narraviz.git
cd Narraviz
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks and lints) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## How the data pipeline works

1. **Parse** (`src/lib/csvParser.ts`): reads the CSV with papaparse, rejects files over 10 MB or 200 columns, and stops reading after 50,000 rows so large files are never fully loaded into memory.
2. **Infer types:** a column is `number`, `date`, or `boolean` only if every non-empty value fits; otherwise it stays `string`. Ambiguous formats such as `03/05/2024` are deliberately not treated as dates.
3. **Aggregate** (`src/lib/formatData.ts`): groups rows by the x column and combines y values. Time series are sorted by date; categories are sorted by value, and the long tail is merged into "Other" (only for sums and counts, where merging is meaningful).
4. **Suggest a chart:** a date column with a numeric column becomes a line chart; a low-cardinality category with a numeric column becomes a bar chart.

## Project structure

```
src/
  app/              Routes (App Router)
  components/
    charts/         BarChart, LineChart
    sections/       Landing page sections
    layout/         Navbar, Footer, DashboardLayout
    ui/             shadcn/ui components
  lib/              CSV parsing, aggregation and formatting
  types/            Shared dataset and story types
tests/              Vitest tests
```

## Contributing

Issues and pull requests are welcome. Every pull request is reviewed by the AI reviewer described in `REVIEW.md`; please run `npm run lint`, `npm run typecheck` and `npm test` before opening one.
