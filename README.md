# JS, Founder Mode

A standalone React app for Jasmeet Singh's ventures: a landing page with every idea and product in one table, plus a journey page per venture at `/v/<slug>`. The portfolio's Ventures section links in here.

All project data lives in **`src/content/projects/`**, one JSON file per project. The landing table and every journey page are built from those files, so adding a project or posting an update never touches components. Your own intro (name, headline, contact) is in `src/content/profile.ts`.

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

## How to add a project

1. Copy a file in `src/content/projects/`, e.g. `project-comet.json` → `my-new-thing.json`.
2. Set `"slug"` to the file name without `.json` (`"my-new-thing"`). It becomes the URL `/v/my-new-thing`; **never change it once published**, because the portfolio links to it.
3. Edit the content. That's it: every `.json` file in the folder is picked up automatically.

Keep the `"$schema"` line at the top: editors like VS Code then autocomplete fields and underline mistakes, using `src/content/project.schema.json`.

Required: `slug, name, oneLiner, stage, category, startedOn, problem, workflow, stack, milestones, journey`. Optional fields (`lastUpdated`, `nextMilestone`, `role`, `liveUrl`, `links`, `audience`, `architectureNote`, `roadmap`, `metrics`) can be left out; their sections simply don't render. Only put real numbers in `metrics`.

- `stage`: `idea`, `building`, `beta`, `live` or `paused`
- dates: `startedOn` is `yyyy-mm`; every other date is `yyyy-mm-dd`
- paragraphs: in `problem` and journey `body`, separate paragraphs with `\n\n`

## How to post a journey update

1. Open the project's JSON file and add an entry to its `"journey"` array (order doesn't matter, the page sorts newest first):
   ```json
   {
     "date": "2026-10-20",
     "kind": "shipped",
     "title": "Shipped team workspaces",
     "body": "First paragraph.\n\nSecond paragraph.",
     "links": [{ "label": "Changelog", "url": "https://example.com" }]
   }
   ```
   `kind` is one of `shipped`, `decision`, `learning`, `milestone`, `setback`.
2. Bump `"lastUpdated"` to the same date (or delete `lastUpdated` and it's taken from the newest journey entry).
3. If a milestone moved, update its `"state"` (`done`, `doing`, `next`) and give `done` milestones a `"date"`.

## Checks

- **In dev**, the browser console lists problems in the project files: missing fields, an unknown stage, invalid dates, a file name that doesn't match its slug, duplicate slugs, `done` milestones without a date, future-dated entries, and a `lastUpdated` older than the newest entry.
- **On build**, a file that isn't valid JSON or is missing required fields fails `npm run build`, so a typo never reaches production.

## Portfolio data feed

`npm run build` also writes `dist/ventures.json` (`slug, name, oneLiner, stage, lastUpdated, liveUrl`), so the portfolio can fetch it and its Ventures rows never drift from this app.
