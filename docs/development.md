# Developer notes

How to run, edit, and deploy the course site. The course itself is described in the [README](../README.md).

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the site locally with live reload |
| `npm run build` | Build the production site (fails on a bad lesson file) |
| `npm run lint` | Check code style |
| `npm run typecheck` | Check types |
| `npm test` | Run unit tests (storage, CSV, import validation, content) |
| `npm run test:e2e` | Run browser tests (run `npm run build` first) |
| `npm run check:links` | Crawl the built site for broken internal links |
| `npm run check:naming` | Confirm restricted names appear only where allowed |
| `npm run check:plagiarism` | Compare site text against `source/` for copied runs of 15+ words |

## Editing content

Lessons are plain text files in `content/lessons/`, one per lesson, named for their web address (`content/lessons/significance.mdx` becomes `/lesson/significance`).

Each file starts with a short header:

```mdx
---
id: "2.1"
title: Significance
unit: 2
week: 3
summary: One or two sentences that describe the lesson.
practice: An optional practice prompt shown at the end.
---

The lesson text goes here, in Markdown.
```

- **To change a lesson**, edit its file and save. Commit and push, and the site updates itself.
- **To add a lesson**, copy an existing file, rename it, and give it a new `id`. It appears on its unit and week pages automatically.
- The build **fails on purpose** if a header field is missing or misspelled, or if a lesson runs past 1,800 words (about a 10-minute read).
- Lessons can use diagrams and callouts, e.g. `<NeedsMap />` or `<Callout label="Field rule">...</Callout>`. The full list is in `components/mdx.tsx`.

Everything else that reads like content lives in `content/` too: units and weeks (`course.ts`), the needs, pillars, and values (`frameworks.ts`), quiz questions (`quizzes/`), and flashcards (`decks.ts`).

## Deploying

The site is hosted on Vercel and connected to this GitHub repository:

- every push to `main` goes to production;
- every pull request gets its own preview address.

There's nothing to configure and no environment variables are required. To attach a custom domain later, add it under **Vercel → Project → Settings → Domains**, then set `NEXT_PUBLIC_SITE_URL` to the new address.

## Ground rules for this repository

- `source/` holds copyrighted reference material. It is gitignored and must never be committed or published.
- Lesson text is original writing. See `GAUNTLET.md` section 3 for the full content rules, and `docs/decisions.md` for every decision made along the way.
- Credits for the underlying frameworks are on the site's Credits page.
