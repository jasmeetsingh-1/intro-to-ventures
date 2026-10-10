# Prompt: generate a project JSON file

Copy everything below the line into a new Claude conversation. Fill in the three parts at the very bottom (today's date, the project notes, and the existing file if you're updating one), then send it.

---

You are helping me, Jasmeet Singh, write the data file for one of my projects. Read this whole brief before you answer.

## 1. What this is and why it matters

I have a personal website called **"JS, Founder Mode"**. It shows every product or idea I'm building as a founder:

- **The landing page** has a table listing all my projects: the name, a one-line description, the stage, the category, when it started, when it was last updated, and the next milestone.
- **Each project has its own page** (at `/v/<slug>`) that tells its story from start to now: why it exists, how it works, what it's built with, how far along it is, a dated log of what has happened, and what comes next.

The website doesn't contain any project text itself. **Everything it shows about a project comes from one JSON file per project.** The site reads those files and builds the table and the project pages from them automatically. So:

- If a field is wrong in the file, it's wrong on the live website.
- If a field is missing or mistyped, the website either hides that section or refuses to build.
- If the file follows the rules below exactly, the project appears on the site with no code changes.

**What JSON is:** JSON (JavaScript Object Notation) is a plain-text format for structured data. A JSON file is a set of `"key": value` pairs inside curly braces `{ }`. Keys are always in double quotes. A value can be:

- a string in double quotes: `"Project Atlas"`
- a list in square brackets: `["React", "Node.js"]`
- another `{ }` object, or a list of objects

JSON is strict:

- no comments
- no trailing commas after the last item
- only double quotes, never single quotes
- a line break inside a string is written as `\n`; a new paragraph is `\n\n`

Your job is to turn my rough notes about a project into one valid JSON file that follows the definition below exactly.

## 2. The file, key by key

The file is saved as `src/content/projects/<slug>.json`. Keys must be spelled exactly as written here (they're case-sensitive). **Don't add any key that isn't listed.**

### Identity: shown in the landing-page table and at the top of the project page

| Key             | Required | Type                         | What it is and where it appears                                                                                                                             | Rules                                                                                                                                                                                                                   |
| --------------- | -------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`       | yes      | string                       | Not content. It lets code editors check the file.                                                                                                           | Always exactly `"../project.schema.json"`. Always the first key.                                                                                                                                                        |
| `slug`          | yes      | string                       | The project's permanent web address: the site shows the project at `/v/<slug>`, and my portfolio links to that address.                                     | Lowercase letters, numbers and hyphens only, e.g. `"project-atlas"`. Must match the file name. **Never change it** once the project is published, or links break. Base it on the project name.                          |
| `name`          | yes      | string                       | The project's name. It's the main text in the table row and the big heading on the project page.                                                            | Short. Proper capitalization, e.g. `"Project Atlas"`.                                                                                                                                                                   |
| `oneLiner`      | yes      | string                       | One sentence saying what the project is and who it's for. It appears under the name in the table and as the subtitle on the project page.                   | One sentence, ideally under 90 characters. Concrete, no hype, e.g. `"An AI tool that turns messy meeting notes into a clear action map."`                                                                               |
| `stage`         | yes      | string                       | How far along the project is. It's shown as a colored label, and visitors can filter and sort the table by it.                                              | Exactly one of: `"idea"` (exploring, nothing real built), `"building"` (actively being built, not usable by others yet), `"beta"` (some real users are trying it), `"live"` (publicly available), `"paused"` (on hold). |
| `category`      | yes      | string                       | The broad area the project belongs to, shown as a column in the table.                                                                                      | Two or three words, e.g. `"AI tooling"`, `"Productivity"`, `"Consumer"`, `"Developer tools"`. Reuse the same wording across projects.                                                                                   |
| `startedOn`     | yes      | string                       | The month I started the project. It's shown as "Started Feb 2026" and used for sorting and for "Building since …".                                          | Format `"yyyy-mm"`, e.g. `"2026-02"`.                                                                                                                                                                                   |
| `lastUpdated`   | optional | string                       | The date of the most recent change. It's shown as "3 days ago" in the table and as the full date on the project page; the table is sorted by it by default. | Format `"yyyy-mm-dd"`. Set it to the date of the newest `journey` entry. If you leave it out, the site uses that date automatically.                                                                                    |
| `nextMilestone` | optional | string                       | The next concrete goal, shown in the table's "Next milestone" column.                                                                                       | A short phrase, e.g. `"Public launch"`, `"First 100 paying users"`. It should match the `"doing"` milestone below.                                                                                                      |
| `role`          | optional | string                       | My role on the project, shown in the facts row on the project page.                                                                                         | e.g. `"Solo founder"`, `"Co-founder & CTO"`.                                                                                                                                                                            |
| `liveUrl`       | optional | string                       | The public address of the product. It adds a "Visit live site ↗" button.                                                                                    | A full URL starting with `https://`. Only include it if the product is actually reachable.                                                                                                                              |
| `links`         | optional | list of `{ "label", "url" }` | Extra links shown next to the live-site button: repo, demo video, write-up.                                                                                 | `label` is a few words, e.g. `"Demo video"`. `url` is a full `https://` address.                                                                                                                                        |

### The story: the project page, top to bottom

| Key                | Required | Type                                   | What it is and where it appears                                                                                                                                       | Rules                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | -------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `problem`          | yes      | string                                 | The **"Why this exists"** section: the problem the project solves, the moment I noticed it, and why existing options weren't good enough. It's the heart of the page. | One to three short paragraphs, separated by `\n\n`. First person ("I"). Specific and honest. Plain text, no Markdown.                                                                                                                                                                                                                    |
| `audience`         | optional | string                                 | A highlighted **"Who it's for"** note under the story.                                                                                                                | One sentence describing the specific person or team.                                                                                                                                                                                                                                                                                     |
| `workflow`         | yes      | list of `{ "title", "detail" }`        | The **"How it works"** section: a numbered, top-to-bottom flow of how a user goes from start to result.                                                               | 3 to 6 steps, in the order they happen. `title` is 2–5 words in sentence case, e.g. `"Drop in your notes"`. `detail` is one or two sentences explaining that step.                                                                                                                                                                       |
| `stack`            | yes      | list of strings                        | The **"Under the hood"** section: the technologies used, shown as small chips.                                                                                        | Proper names, e.g. `["React", "TypeScript", "PostgreSQL", "Claude API"]`. Use `[]` if nothing is decided yet.                                                                                                                                                                                                                            |
| `architectureNote` | optional | string                                 | One paragraph under the stack chips explaining how the system fits together, or one interesting technical decision.                                                   | Plain language, two to four sentences.                                                                                                                                                                                                                                                                                                   |
| `milestones`       | yes      | list of `{ "label", "state", "date" }` | The **"Where it stands"** section: a progress track from start to finish, with a "3 of 6 milestones done" counter.                                                    | 4 to 6 items in chronological order. `label` is a short phrase. `state` is exactly `"done"`, `"doing"` or `"next"`. Every `"done"` item **must** have a `date` (`"yyyy-mm-dd"`); `"doing"` and `"next"` items have no date. Normally exactly one item is `"doing"`, with everything before it `"done"` and everything after it `"next"`. |
| `journey`          | yes      | list of entries (see below)            | The **"The journey"** section: a dated log of what happened on the project, shown newest first and grouped by month. This is the part I update most.                  | 3 or more entries. Any order (the site sorts them). No entry may be dated after today.                                                                                                                                                                                                                                                   |
| `roadmap`          | optional | list of strings                        | The **"What's next"** section: upcoming plans.                                                                                                                        | 2 to 5 short phrases, e.g. `"Team workspaces"`.                                                                                                                                                                                                                                                                                          |
| `metrics`          | optional | list of `{ "label", "value" }`         | A row of big numbers near the top of the page.                                                                                                                        | **Only real, verified numbers that I give you.** Never estimate or invent one. `value` is a string, e.g. `"1,240"` or `"38%"`. If I haven't given numbers, leave `metrics` out entirely.                                                                                                                                                 |

### A `journey` entry

Each entry in `journey` is an object with these keys:

| Key     | Required | What it is                                                      | Rules                                                                                                                                                                                                                                      |
| ------- | -------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `date`  | yes      | The day it happened.                                            | `"yyyy-mm-dd"`, not after today.                                                                                                                                                                                                           |
| `kind`  | yes      | The type of event, shown as a small colored tag.                | Exactly one of:<br>• `"shipped"`: something was released<br>• `"decision"`: a choice that changed direction<br>• `"learning"`: an insight from users or data<br>• `"milestone"`: a goal was reached<br>• `"setback"`: something went wrong |
| `title` | yes      | The headline of the entry.                                      | Short, past tense or a plain statement, e.g. `"Opened the private beta"`.                                                                                                                                                                  |
| `body`  | yes      | What happened, why it mattered, and what changed because of it. | One to four short paragraphs separated by `\n\n`. First person, plain text, no Markdown.                                                                                                                                                   |
| `links` | optional | Related links (launch post, PR, video).                         | List of `{ "label", "url" }`.                                                                                                                                                                                                              |

## 3. How to write it

- **Voice:** first person ("I"), calm and specific, like a founder writing an honest build log. No marketing language: avoid "revolutionary", "game-changing", "seamless" and similar words. No emojis.
- **Only use facts from my notes.** You may reword and tighten them, but don't invent:
  - users or customers
  - numbers or results
  - dates or events
  - features, partners or technologies
- **Dates:** use only dates I give you. If I only give a month, use the 1st of that month and tell me you did.
- **Consistency:**
  - `lastUpdated` equals the newest `journey` date.
  - `nextMilestone` matches the `"doing"` milestone.
  - The `stage` should fit the milestones and the journey. For example, a `"live"` project should have a launch among its done milestones.
- **Missing information:**
  - If something **required** is missing, ask me for it in **one short list of questions** before writing the file.
  - If I tell you to go ahead anyway, put `"TODO: <what's needed>"` in that field and list every TODO after the file.
  - If an **optional** field has no information, leave the key out completely. Don't write `""`, `null` or `[]` for optional fields.

## 4. What to send back

1. The file name on its own line, e.g. `project-atlas.json`.
2. The complete file in a single ```json code block, keys in the order of the tables above, indented with 2 spaces.
3. A short list of anything you assumed or left as TODO. Write "None" if there's nothing.

**Check before you answer:**

- The JSON is valid.
- Every required key is present.
- Every `stage`, `state` and `kind` value is one of the allowed words.
- Every date has the right format.
- Every `"done"` milestone has a date.
- No date is after today.
- `slug` matches the file name.

## 5. Example of a correct file

This shows the shape only. The content is made up; don't copy it.

```json
{
  "$schema": "../project.schema.json",
  "slug": "project-atlas",
  "name": "Project Atlas",
  "oneLiner": "An AI tool that turns messy meeting notes into a clear action map.",
  "stage": "beta",
  "category": "AI tooling",
  "startedOn": "2026-02",
  "lastUpdated": "2026-09-28",
  "nextMilestone": "Public launch",
  "role": "Solo founder",
  "links": [{ "label": "Demo video", "url": "https://example.com/demo" }],
  "problem": "After every planning meeting I ended up with pages of notes and no clear list of who owed what.\n\nExisting note apps stored the text but never turned it into decisions and owners, so I started building the tool I wanted.",
  "audience": "Small product teams who run several planning meetings a week.",
  "workflow": [
    { "title": "Paste your notes", "detail": "Drop in raw notes, a transcript, or a voice memo." },
    {
      "title": "Atlas finds the actions",
      "detail": "It pulls out decisions, owners and deadlines."
    },
    { "title": "Review the map", "detail": "Correct anything it got wrong with a click." },
    { "title": "Share it", "detail": "Send the map as a link or export it to your task tool." }
  ],
  "stack": ["React", "TypeScript", "Node.js", "PostgreSQL", "Claude API"],
  "architectureNote": "Notes are processed in one model call that returns structured actions, which are stored per meeting so edits never require reprocessing.",
  "milestones": [
    { "label": "Problem interviews", "state": "done", "date": "2026-02-20" },
    { "label": "Working prototype", "state": "done", "date": "2026-04-02" },
    { "label": "Private beta", "state": "done", "date": "2026-08-25" },
    { "label": "Public launch", "state": "doing" },
    { "label": "Team plan", "state": "next" }
  ],
  "journey": [
    {
      "date": "2026-02-14",
      "kind": "decision",
      "title": "Committed to building Atlas",
      "body": "I picked this idea over two others because I had the problem myself every week."
    },
    {
      "date": "2026-04-02",
      "kind": "shipped",
      "title": "First working prototype",
      "body": "The prototype could extract actions from typed notes. Voice memos came later."
    },
    {
      "date": "2026-08-25",
      "kind": "milestone",
      "title": "Opened the private beta",
      "body": "I invited a handful of teams from my interviews and asked them to use it for two weeks."
    },
    {
      "date": "2026-09-28",
      "kind": "learning",
      "title": "Beta teams care most about owners",
      "body": "Every team asked for clearer ownership before anything else.\n\nI'm moving owner detection to the top of the launch list."
    }
  ],
  "roadmap": ["Public launch", "Export to task tools", "Team workspaces"]
}
```

## 6. My input

**Today's date:** `<yyyy-mm-dd>`

**New file or update?** `<"New project" — or — "Update: add these events to the file below and adjust lastUpdated, milestones and stage if needed. Return the whole updated file.">`

**My notes about the project** (anything: what it is, why I started it, who it's for, how it works, tech used, what's done, dates of what happened, what's next, real numbers if any):

```
<paste your notes here>
```

**Existing file** (only when updating; otherwise delete this part):

```json
<paste the current project-xxx.json here>
```
