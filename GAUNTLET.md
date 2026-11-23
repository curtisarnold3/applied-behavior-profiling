# GAUNTLET: Build the Applied Behavior Profiling course site

You are building a production website that teaches an 8-week course on reading people from what they say. You will work in phases. **Every phase ends in a gate. You may not start the next phase until every check in the current gate passes.** If a check fails, fix it and re-run the whole gate. Record each decision in `docs/decisions.md` (D-001, D-002, ...) as you make it.

Read this entire file, then `CLAUDE.md`, `docs/syllabus.md`, and `docs/lesson-briefs.md`, before you write any code.

---

## 0. Fill these in first

Ask the owner for any value still in braces during Phase 0. Don't guess.

| Key | Value |
| --- | --- |
| Site name | Applied Behavior Profiling *(placeholder; owner may rename)* |
| GitHub owner | `{{GITHUB_OWNER}}` |
| Repo name | `{{REPO_NAME}}` *(suggest `applied-behavior-profiling`)* |
| Repo visibility | `{{public or private}}` |
| Vercel project / team | `{{VERCEL_SCOPE}}` *(owner is on Vercel Pro)* |
| Domain | `{{DOMAIN}}` *(a `*.vercel.app` subdomain is fine until a custom domain is ready)* |
| Author line | Curtis A. Arnold |

---

## 1. Mission

Turn `docs/syllabus.md` into a course website that someone can work through in 8 weeks. The site should feel like a field manual crossed with a good popular-science book: short lessons, lots of practice, and tools that make the practice easy to do and log.

A learner must be able to:

1. See the whole course at a glance and know where they are in it.
2. Read each lesson in under 10 minutes on a phone.
3. Drill each framework (needs, pillars, values) with flashcards and scenario quizzes until recognition is automatic.
4. Log real-world practice and export it.
5. Build profile sentences with a guided tool.
6. Complete the capstone and the Week 8 self-assessment, and keep their results.
7. Print pocket field cards.

---

## 2. Inputs

| Path | What it is | Rules |
| --- | --- | --- |
| `docs/syllabus.md` | Course structure, outcomes, schedule, grading, works cited | Structural source of truth. Site structure must match it |
| `docs/lesson-briefs.md` | Paraphrased notes for every lesson, plus quiz seeds and known source gaps | Content source of truth. Write lesson pages from this |
| `source/pdfs/` | Original course PDFs (error-correction reference, authority inventory, limiting-beliefs worksheet) | **Reference only. Never commit, never publish, never copy into `public/`** |
| `source/images/` | Original course graphics | **Reference only. Never commit or publish. Recreate as original SVGs** |
| `source/transcripts/` *(may be empty)* | Original lesson transcripts, if the owner adds them | Reference only, same rules |

`source/` is gitignored. Gate 1 verifies this.

---

## 3. Non-negotiable rules

### 3.1 Content and IP

- **Write original prose.** Lesson pages are written fresh from the lesson briefs. Do not paste or closely paraphrase transcripts. No passage of 15 or more words copied from any source file.
- **Don't publish source files.** No PDFs, transcripts, or original graphics in the repo or the deployed site. Recreate diagrams as original SVG components with your own layout and styling.
- **The authority inventory:** don't reproduce its item lists or wording. Build an original reflection tool that uses the same five trait names and five habit areas, with your own short level descriptions and prompts. Credit the source model on the page.
- **Naming:** don't use "NCI," "Neurocognitive Intelligence," "Nonverbal Communication Intelligence," or "Chase Hughes" anywhere on the site **except** (a) the Credits / Works Cited page and (b) the one place the inventory is credited by its title, *The Hughes Authority Behavior Inventory*. Gate 6 greps for this.
- **Credits page:** reproduce the Works Cited section of `docs/syllabus.md` exactly, in MLA format with full URLs. Link it from the footer of every page.
- **Don't port sales content.** The source course wrap-up promotes further courses. Leave that out.
- **Source gaps:** honor the "Known source gaps" list in `docs/lesson-briefs.md`. Don't invent content to fill the missing lesson 31. Write the Connection and Recognition lessons from their briefs as given.
- **Ethics framing:** every unit landing page carries one line making clear these skills are for understanding and helping people, not manipulating them.

### 3.2 Voice

Lesson copy follows the owner's writing style:

- Write like a bestselling science popularizer explaining to a curious friend. Open lessons with a short story or scene hook.
- One idea per paragraph. Short sections. Vary sentence length. Use contractions.
- Use "we/our" for the shared journey. Explain through everyday analogies.
- Say "might" or "seems" where the evidence is soft. Name uncertainty plainly ("we don't really know yet").
- Visual cues (clothing, posture) are weaker than verbal cues. Say so wherever they appear.
- No AI filler words (delve, robust, moreover, tapestry, leverage-as-a-verb-for-everything). Never make the reader feel stupid.

### 3.3 Product

- **No accounts, no backend, no analytics that collect personal data.** All learner data (progress, logs, quiz scores, assessments) lives in `localStorage` under one versioned key namespace (e.g., `abp:v1:*`), with JSON export and import plus CSV export for practice logs. Wrap every storage call in try/catch; the site must still work if storage is unavailable.
- **Mobile first.** Every page usable at 360px wide. Lessons readable one-handed.
- **Accessible.** WCAG 2.2 AA: keyboard navigable, visible focus, semantic headings, alt text or `aria-label` on every SVG diagram, color never the only signal, respects `prefers-reduced-motion`.
- **Fast.** Static generation for every content page. Lighthouse mobile ≥ 90 in Performance, Accessibility, Best Practices, and SEO on the home page, a lesson page, and a tool page.
- **Print.** Field cards and the syllabus have print stylesheets (US Letter, plus a half-letter pocket-card option).

---

## 4. Stack

Use this unless Phase 0 produces a recorded reason not to:

- **Next.js** (App Router) + **TypeScript** (strict) + **Tailwind CSS**
- Lesson content as **MDX** files in `content/` with typed frontmatter, validated at build (e.g., with Zod). A bad frontmatter field must fail the build.
- **Vitest** for unit tests, **Playwright** for end-to-end tests, **ESLint** and **Prettier**
- Hosted on **Vercel**, source on **GitHub**, deployed by the Vercel Git integration (every push to `main` → production; every PR → preview)

Check current stable versions when you install. Don't pin to versions from memory.

---

## 5. Site map

```
/                         Home: course promise, 8-week map, "start" or "resume" button
/syllabus                 Full syllabus (rendered from docs/syllabus.md content), printable
/week/[1-8]               Week page: goals, lessons, practice, deliverable, check-off list
/unit/[slug]              Unit landing: overview, ethics line, lessons, unit check (quiz)
/lesson/[slug]            Lesson page (one per brief section)
/practice                 Drill hub: flashcards + scenario quizzes, filterable by framework
/practice/log             Practice log (controlled and live), CSV/JSON export
/tools/profile-builder    Guided "If I... then people will... so I can finally..." builder
/tools/self-assessment    Week 8 authority reflection tool (original items) + milestone planner
/tools/limiting-beliefs   Belief-testing worksheet (interactive, original wording)
/capstone                 Capstone brief + three-profile submission template, printable
/field-cards              Printable pocket cards: needs, pillars, values, profile sentence
/progress                 Progress dashboard; export/import/reset all data
/credits                  Credits and Works Cited (MLA, full URLs)
```

### Lessons to build (minimum)

Use the brief headings in `docs/lesson-briefs.md`: 1.1–1.5, 2.0–2.8, 3.0–3.7, 4.0–4.10, 5.1–5.4. Each of the six needs, six pillars, and six values gets its own page.

### Diagrams to build as original SVG components

Five Stages ladder; Six Wound Types; Success Triangle; Childhood Development Triangle; Needs Map (six needs, primary vs. secondary); Four Needs Circles (concentric); Decision Pillars (six); Values (six); the profile-sentence diagram (decision → need → value); Authority Triangle (internal → external → underlying).

---

## 6. Feature acceptance criteria

| Feature | Done when |
| --- | --- |
| Progress | Learner can mark lessons and weekly deliverables complete; home shows "Resume Week N, Lesson X"; progress survives reload |
| Flashcards | One deck each for needs, pillars, values, wounds, and stages; flip, mark "know / again," spaced repeat within the session; keyboard shortcuts |
| Scenario quizzes | At least 15 items per unit check (Units 1–4), from the quiz seeds; each item gives feedback that explains *why*; includes "commonly confused" items (acceptance vs. approval, deviance vs. novelty, social vs. conformity, significance vs. recognition) |
| Practice log | Fields: date, track (controlled/live), context, exact phrase heard, need, pillar, value, my response, their reaction, notes. Filter by week; weekly count toward the target (10/week); CSV and JSON export |
| Profile builder | Learner enters a quoted statement, picks pillar, need, and value with guidance from the three listening cues (adjectives → values, justifications → pillars, repetitions → needs), records one alternative read, and gets the assembled sentence; save to the log |
| Self-assessment | Five traits rated 1–5 with original level descriptions; five habit areas rated 1–5; results summary highlights the lowest trait and area; milestone planner with dated steps; printable |
| Limiting beliefs | Learner lists beliefs, runs each through the test questions, and records the opposite belief; printable |
| Capstone | Template for three profiles matching the syllabus capstone spec; pass criteria shown; printable and exportable |
| Field cards | Needs, pillars, values, and the profile sentence each fit one half-letter card; print test shows no overflow |
| Data controls | Export all, import, and reset (with confirm) on `/progress` |

---

## 7. Phases and gates

### Phase 0 — Grill the owner

Before writing code, interview the owner. Ask one question at a time, at most 10, and record every answer as a decision. Cover at least: the values in section 0; the site name; whether the 40/20/30/10 grading should appear as a self-scoring rubric or be hidden; the visual direction (suggest 2–3 concrete directions in one line each); whether he wants a "field manual" or "book" feel; and anything in this file he wants changed.

**Gate 0**
- [ ] Every `{{...}}` value in section 0 is filled in `docs/decisions.md`
- [ ] Visual direction chosen and recorded
- [ ] Owner has confirmed the phase plan

### Phase 1 — Walking skeleton and deploy pipeline

Scaffold the app, set up lint, format, test, and Playwright, add `.gitignore` (with `source/`), create the GitHub repo with `gh repo create`, connect Vercel (`vercel link`, then Git integration), and ship a deployed home page with the site name, footer, and Credits link.

**Gate 1**
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all pass
- [ ] `git ls-files | grep -E '^source/|\.pdf$'` returns nothing
- [ ] `git log --all --name-only | grep -E '^source/'` returns nothing (source was never committed, even once)
- [ ] Production URL loads the home page; a PR produces a preview URL
- [ ] Repo README explains how to run locally and deploy

### Phase 2 — Content model and one full vertical slice

Build the MDX content pipeline with validated frontmatter. Then build **Unit 2 (Human Needs) end to end**: unit landing, all lesson pages 2.0–2.8, the Needs Map and Four Circles diagrams, the needs flashcard deck, the Unit 2 quiz, Week 3 and Week 4 pages, and progress tracking for all of it. This slice sets the pattern for everything else.

**Gate 2**
- [ ] Owner reviews the deployed Unit 2 slice and approves the look, voice, and lesson length (record approval)
- [ ] Each Unit 2 lesson reads in under 10 minutes (≈ 1,800 words max) and opens with a hook
- [ ] Unit 2 quiz has ≥ 15 items, each with explanatory feedback
- [ ] Playwright test: complete a lesson → reload → still complete → home shows correct resume point
- [ ] Every diagram has an accessible text alternative
- [ ] No source-file text ≥ 15 consecutive words (see the plagiarism check in Gate 6; run it now on Unit 2)

### Phase 3 — Remaining units

Build Units 1, 3, 4, and 5 on the Unit 2 pattern, plus all eight week pages and the syllabus page. Build units in parallel only if they touch no shared files; otherwise go in order.

**Gate 3**
- [ ] Every lesson in section 5 exists and links correctly from its unit and week pages
- [ ] Every week page matches the syllabus's lessons and deliverable for that week
- [ ] Units 1, 3, and 4 each have a ≥ 15-item quiz with commonly-confused items
- [ ] All decks exist (needs, pillars, values, wounds, stages)
- [ ] A link checker finds zero broken internal links

### Phase 4 — Tools

Build the practice log, profile builder, self-assessment and milestone planner, limiting-beliefs worksheet, capstone template, field cards, and the progress page with export, import, and reset.

**Gate 4**
- [ ] Unit tests cover storage read/write/migrate, CSV export, and JSON import validation (rejects malformed files)
- [ ] Playwright: log an entry → export CSV → file contains the entry; export JSON → reset → import → data restored
- [ ] Site works with storage blocked (tools show a clear "progress won't be saved" notice; nothing crashes)
- [ ] Field cards print on half-letter with no clipping (check the print preview PDF)
- [ ] Self-assessment shares no item wording with the source inventory

### Phase 5 — Hardening

Accessibility, performance, SEO (titles, descriptions, Open Graph image, sitemap, robots), 404 page, print styles, and a pass over copy for voice and the naming rule.

**Gate 5**
- [ ] Lighthouse mobile ≥ 90 on all four categories for home, one lesson, and the profile builder (save reports to `docs/lighthouse/`)
- [ ] axe (via Playwright) reports zero serious or critical violations on every route
- [ ] Full keyboard walkthrough of a lesson, a quiz, and the practice log works without a mouse
- [ ] Usable at 360px with no horizontal scroll

### Phase 6 — Adversarial review and launch

Start a **fresh subagent that has not seen your work** and give it this file plus the deployed URL. Have it try to fail every gate and every rule in section 3, and report findings. Fix everything it finds, then have it check again.

**Gate 6 (launch gate)**
- [ ] Naming check: `grep -rniE "nci|neurocognitive|nonverbal communication intelligence|chase hughes" app content components` returns matches only in the Credits page and the single inventory credit
- [ ] Plagiarism check: a script compares all MDX against every file in `source/` and reports any run of ≥ 15 identical words (normalize case and punctuation). Zero hits
- [ ] No sales or upsell content anywhere
- [ ] Credits page matches the syllabus Works Cited exactly, with full URLs
- [ ] Reviewer subagent's final report has no open findings
- [ ] Production deployed on `{{DOMAIN}}`; owner signs off

---

## 8. When to stop and ask the owner

- Any value in section 0 is missing
- Before the first push to a **public** repo
- Before adding any dependency that phones home or collects data
- If a rule in section 3 conflicts with something the owner asks for
- Before deleting or rewriting a file the owner wrote
- If a gate can't pass for a reason outside your control (e.g., Vercel or GitHub auth)

Otherwise keep going. When you finish a phase, post a short summary: what shipped, the gate results, and the preview or production URL.

---

## 9. Definition of done

All seven gates pass; the production site is live on the chosen domain; `docs/decisions.md` records every decision; the README covers local development, content editing (how to add or change a lesson), and deployment; and the owner has signed off.
