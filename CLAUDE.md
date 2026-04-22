# CLAUDE.md - SCIMaP

## What is this project?

SCIMaP (Science & Community Impacts Mapping Project) is a data visualization platform that maps the economic, health, and employment impacts of federal science funding (NIH, NSF) across the US. It shows baseline funding, grant terminations, and projected budget cuts (FY26/FY27) at state, county, congressional district, and city levels.

The audience includes policymakers, journalists, advocacy groups, and the general public.

## Tech stack

- **Framework:** React 19 + TypeScript 5.9, built with Vite 7
- **Routing:** TanStack Router (file-based, auto code-splitting)
- **Mapping:** Deck.gl 9 + MapLibre GL + react-map-gl (MVT tiles from `data.scienceimpacts.org`)
- **Styling:** Tailwind CSS 4 + shadcn/ui components (base-nova style)
- **Data fetching:** TanStack React Query
- **Color scales:** d3-scale + d3-scale-chromatic, with pre-computed color LUTs (Uint8Array RGBA)
- **Content:** Static markdown files with YAML frontmatter in `/content`, loaded at build time via `import.meta.glob`
- **Data processing:** Python scripts (baseline.py, fy27_budget.py, etc.) generate tiles and table JSON
- **Testing:** Vitest + @testing-library/react (jsdom)

## Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run test       # Run tests (single run, not watch)
npm run lint       # ESLint (zero warnings allowed)
npm run lint:fix   # Auto-fix lint issues
npm run format     # Prettier format all files
```

### Type-checking caveat

`tsc -b` uses incremental compilation and caches results in `node_modules/.tmp/`. This means locally it can skip rechecking files it thinks haven't changed, causing type errors to go unnoticed. **Always use `tsc -b --force`** (or delete the tsbuildinfo file) when verifying the build is clean before pushing. Cloudflare Pages builds from scratch with no cache, so it will catch errors that a cached local `tsc -b` misses.

## Project structure

```
src/
  routes/           # TanStack Router file-based routes (each file = a page)
  components/       # React components
    ui/             # shadcn/ui primitives (Button, Tabs, Select, Slider)
  lib/              # Shared utilities, map configs, content loaders, constants
  hooks/            # Custom React hooks
  layers/           # Custom Deck.gl layers
  data/             # Static JSON data (legislators, tables, grants)
content/            # Markdown content (pages, news, articles, team, press-releases)
data/               # Raw CSV data and geo-reference files (used by Python scripts)
scripts/            # Python data processing scripts
```

## Key pages / routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `index.tsx` | Home page with ZIP search and key metrics |
| `/map` | `Map.tsx` | Baseline NIH funding choropleth |
| `/fy27` | `FY27Map.tsx` | FY27 budget cut impact map |
| `/fy26` | `FY26Map.tsx` | FY26 budget cut impact map |
| `/grants` | `GrantsMap.tsx` | Grant terminations map |
| `/maps` | `maps.tsx` | Maps gallery/index |
| `/insights` | `insights.tsx` | Research articles and budget visualizations |
| `/news` | `news.tsx` | Press coverage and releases |
| `/scorecard` | `scorecard.tsx` | Report card |

## Architecture patterns

### Map components

`ChoroplethMap.tsx` is the reusable base for choropleth maps. It handles viewport state, hover/click interactions, detail drawers, tooltips, and mobile responsiveness. Specialized maps (`FY27Map`, `FY26Map`, `GrantsMap`, `IDCMap`) configure it via props.

`Map.tsx` (baseline) is the original map component with its own implementation — it predates `ChoroplethMap` and has not been refactored to use it.

Each map type has a corresponding config file in `lib/` (e.g., `fy27-map-config.ts`) that defines:
- `GEO_LEVELS` — tile URLs, zoom ranges, unique ID properties per geographic level
- Layer factory functions
- Tooltip content and formatting

### Geographic levels

Maps support 4 geo levels, switching automatically by zoom:
- **States** (zoomed out) → **Counties** → **Congressional Districts** → **Cities** (zoomed in)

Configured via `GEO_LEVELS` records in each map config.

### Color lookup tables (LUTs)

For performance, color scales are pre-computed into `Uint8Array` lookup tables (`src/lib/color-lut.ts`). Available LUTs:
- `LUT_BLUES` — baseline funding
- `LUT_OR_RD` — losses/terminations
- `LUT_MAGMA_INV` — budget cuts

### Data flow

1. **Tiles:** MVT vector tiles served from `data.scienceimpacts.org`, rendered by Deck.gl
2. **Tables:** Pre-computed JSON in `src/data/table_*.json`
3. **Content:** Markdown parsed at build time from `/content`
4. **Legislators:** Static JSON mapping districts/states to representatives

### URL search params

Map pages persist viewport state (`lat`, `lng`, `zoom`, `showLocation`) in URL search params for shareable links. Validated at route level via `map-search-params.ts`.

### Content management (NocapCMS)

Content is managed through **NocapCMS**, a git-based headless CMS that commits directly to the repo (on the `cms` branch, merged to `main`). Non-technical team members edit content and upload images through the CMS UI — they do not edit code.

- Markdown files in `/content` use YAML frontmatter. Loaded eagerly at build time by `src/lib/content.ts` using Vite's `import.meta.glob`. Content types: pages, news, articles, team bios, press releases.
- **Images are uploaded through the CMS** — e.g., team photos (`photo` field), page images (`image` field). Image paths in frontmatter point to files in `public/images/` that the CMS commits.
- When adding new content-managed fields (especially images), use YAML frontmatter attributes so the CMS can manage them. Do NOT put images inline in the markdown body — use a frontmatter field and render it in the component. Follow the pattern used by team member `photo` fields.
- CMS commits follow the pattern: `Update Pages "slug"`, `Update Blog Posts "slug"`, etc.
- **Whenever you rejig content structure** (rename/add/remove frontmatter fields, change list item shapes, restructure a page, or add a new page under `content/pages/`), verify that `public/admin/config.yml` is updated to match. The CMS config and the actual frontmatter schemas must stay in sync — otherwise CMS editors see fields that don't render, or can't edit fields that do. Check both directions: every frontmatter field has a matching CMS field, and every CMS field corresponds to something the component actually reads.

## Conventions

- **Path alias:** `@/` maps to `src/` (e.g., `import { cn } from "@/lib/utils"`)
- **Styling:** Tailwind utility classes inline; `cn()` for conditional composition; CVA for component variants
- **Responsive:** Mobile breakpoint at `md:` (768px). Use `useIsMobile()` hook for JS logic.
- **Formatting:** All dollar amounts and numeric values displayed to users must use `formatCurrency()`, `formatNumber()`, or `formatMetricValue()` from `lib/constants.ts`. These use `Intl.NumberFormat` compact notation (e.g. `$240.1K`, `$1.2M`). Never render raw numbers with `toLocaleString()` or manual formatting for currency/metrics. Values under $10K display as `<$10K`.
- **No unused code:** ESLint enforces no unused locals/parameters
- **Zero lint warnings:** `npm run lint` with `--max-warnings 0`
- **Route file = page:** Each file in `src/routes/` is a page; `routeTree.gen.ts` is auto-generated (do not edit)

## Data pipeline (Python)

Python scripts in `scripts/` process raw CSV data into tiles and table JSON:
- `baseline.py` — baseline funding aggregation
- `fy27_budget.py` — FY27 budget impact calculations
- `generate_table_data.py` — table JSON for the frontend

Tiles are generated with Tippecanoe and uploaded to Cloudflare R2 via rclone. GitHub Actions runs this daily.

## CI/CD

- **test.yml** — runs `npm test` on push/PR to main
- **update_code.yml** — daily data processing + tile generation + upload
- **update-news.yml** — daily news sync from Google Sheets
