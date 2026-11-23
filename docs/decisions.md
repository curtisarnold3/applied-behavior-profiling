# Decision Log

Record every decision as it's made. Newest at the bottom.

| ID | Date | Decision | Why | Phase |
| --- | --- | --- | --- | --- |
| D-001 | 2026-11-23 | Course content limited to the profiling track (needs, decisions, values) plus authority/self-development; physical behavior monitoring is a separate course | Owner split the source material into two tracks | Pre-build |
| D-002 | 2026-11-23 | Remove NCI and Chase Hughes references from site content; credit them only on the Credits page and the inventory credit | Owner instruction | Pre-build |
| D-003 | 2026-11-23 | GitHub owner `curtisarnold3`, repo `applied-behavior-profiling` | Owner answer (Phase 0, Q1) | 0 |
| D-004 | 2026-11-23 | Repo visibility: **public**. Public push pre-approved by owner | Owner answer (Q2) and plan confirmation (Q9, "Go, fewer pauses") | 0 |
| D-005 | 2026-11-23 | Treat the source material as fact. Lessons teach the frameworks as given, with no editorial arguing against them; effort goes to design. Soft-evidence wording is used only where the briefs themselves hedge (e.g. visual cues are weaker than verbal ones) | Owner instruction mid-interview | 0 |
| D-006 | 2026-11-23 | Domain: free `*.vercel.app` address for launch (target `applied-behavior-profiling.vercel.app`); owner will buy a custom domain later | Owner answer (Q3) | 0 |
| D-007 | 2026-11-23 | Vercel scope: owner's personal Pro account, project `applied-behavior-profiling` | Owner answer (Q4) | 0 |
| D-008 | 2026-11-23 | Site name: "People Don't Want to Be Fixed... They Want to Be Seen & Not Judged". Short form "Seen, Not Fixed" for the header, browser tabs, and storage/print labels. "Applied Behavior Profiling" stays as the course descriptor | Owner answers (Q5, Q6) | 0 |
| D-009 | 2026-11-23 | Grading appears as a private self-scoring rubric on `/progress` using the 40/20/30/10 weights | Owner answer (Q7) | 0 |
| D-010 | 2026-11-23 | Visual direction: "Field notebook" (field-manual feel): warm paper background, dark ink, one signal-orange accent, typewriter-style labels, numbered manual sections | Owner answer (Q8) | 0 |
| D-011 | 2026-11-23 | Phase plan confirmed as written in GAUNTLET.md. Pause points: Unit 2 review (Gate 2) and launch sign-off (Gate 6) only | Owner answer (Q9) | 0 |
| D-012 | 2026-11-23 | Author line: Curtis A. Arnold. Stack as specified in GAUNTLET.md section 4 (Next.js App Router, TypeScript strict, Tailwind, MDX + Zod, Vitest, Playwright) | Spec default; no reason found to deviate | 0 |
| D-013 | 2026-11-23 | GitHub repo created by the owner (cloud sessions can't create repos); Vercel connected by the owner importing the repo at vercel.com/new (Git integration: push to `main` → production, PR → preview). No Vercel CLI or token is used | This workspace has no Vercel login; the Git integration is what the spec asks for anyway | 1 |
| D-014 | 2026-11-23 | Fonts (Source Serif 4, Archivo, IBM Plex Mono; all SIL OFL) are self-hosted from the repo, not loaded from Google | No third-party requests from learners' browsers; faster first paint | 1 |
| D-015 | 2026-11-23 | Lessons are MDX files validated with Zod at build; the build also fails if a lesson exceeds 1,800 words | Makes the "under 10 minutes" rule impossible to break by accident | 1 |
| D-016 | 2026-11-23 | Lesson 1.1 keeps the five stages and six wound types on one page (one page per brief heading); every need, pillar, and value gets its own page | Matches GAUNTLET section 5 and the brief headings | 2 |
| D-017 | 2026-11-23 | Flashcard keyboard shortcuts (Space, 1, 2) work only while the card has focus | Single-key shortcuts that fire anywhere on the page break WCAG 2.1.4 and hijack typing | 2 |
| D-018 | 2026-11-23 | The plagiarism check also compares against `docs/lesson-briefs.md`, not just `source/`. Example-phrase lists were reordered so no 15-word run matches even the briefs | Stricter than the gate requires; the briefs are paraphrases of the transcripts, so matching them closely is the nearest proxy while `source/transcripts/` is empty | 2 |
| D-019 | 2026-11-23 | Unit 4 gets a quiz too (the gate requires ≥15 items for Units 1–4), but it stays out of the grade, which counts Units 1–3 as the syllabus says | Reconciles GAUNTLET section 6 with the syllabus grading table | 2 |
| D-020 | 2026-11-23 | Pages for later phases (tools, syllabus, progress) exist as short "being built" placeholders until their phase | Keeps every internal link working during review | 2 |
