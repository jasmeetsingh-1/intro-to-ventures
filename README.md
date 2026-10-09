# JS, Founder Mode

A standalone React app for Jasmeet Singh's ventures: a landing page with every idea and product in one table, plus a journey page per venture at `/v/<slug>`. The portfolio's Ventures section links in here.

All content lives in typed data files under `src/content/`. Adding a venture or posting an update never requires touching components.

## Run, build, deploy

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # vite build + writes dist/ventures.json
npm run preview      # serve dist/ locally
npm run typecheck && npm run lint
```

Deploy to Vercel as a static site (framework preset: Vite, output: `dist`). `vercel.json` rewrites every path to `/index.html`, so deep links like `/v/project-atlas` work on refresh, and serves `/ventures.json` with a CORS header.

### Environment

| Variable             | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `VITE_PORTFOLIO_URL` | Your portfolio's URL, no trailing slash. Falls back to `https://example.com`. |

Copy `.env.example` to `.env.local` for local work, and set the variable in Vercel's project settings.

## How to add a venture

1. Copy a file in `src/content/ventures/`, e.g. `project-comet.ts` → `my-new-thing.ts`.
2. Change the exported name, the `slug` and the content. The slug becomes the URL (`/v/my-new-thing`); **never change it once published**, because the portfolio links to it.
3. Register it in `src/content/ventures/index.ts` by importing it and adding it to the `registered` array.

Optional fields (`metrics`, `roadmap`, `audience`, `architectureNote`, `liveUrl`, `links`, `role`) can be left out; their sections simply don't render. Only put real numbers in `metrics`.

## How to post a journey update

1. Open the venture's file and add an entry to its `journey` array (order doesn't matter, the UI sorts newest first):
   ```ts
   {
     date: '2026-10-20',
     kind: 'shipped', // shipped | decision | learning | milestone | setback
     title: 'Shipped team workspaces',
     body: 'First paragraph.\n\nSecond paragraph.',
     links: [{ label: 'Changelog', url: 'https://…' }],
   },
   ```
2. Bump `lastUpdated` to the same date (or remove `lastUpdated` and it's derived from the newest journey entry).
3. If a milestone moved, update its `state` (and give `done` milestones a `date`).

In dev, `src/content/validate.ts` warns in the console about duplicate slugs, invalid dates, `done` milestones without a date, future-dated entries, and a `lastUpdated` older than the newest entry.

## Portfolio data feed

`npm run build` also writes `dist/ventures.json` (`slug, name, oneLiner, stage, lastUpdated, liveUrl`), so the portfolio can fetch it and its Ventures rows never drift from this app.
