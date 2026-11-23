# CLAUDE.md

Project: **Applied Behavior Profiling** — an 8-week course website (Next.js on Vercel, source on GitHub).

## Start here

1. Read `GAUNTLET.md` in full. It is the build spec: phases, gates, rules, and acceptance criteria.
2. Read `docs/syllabus.md` (structure) and `docs/lesson-briefs.md` (content).
3. Begin with **Phase 0**: interview the owner before writing code.

## Hard rules (summary — GAUNTLET.md section 3 is authoritative)

- `source/` holds copyrighted reference material. **Never commit it, never publish it, never copy from it into site content.** It's gitignored; keep it that way.
- Write original lesson prose from the briefs. No run of 15+ words copied from any source file.
- Don't use "NCI" or "Chase Hughes" on the site except on the Credits page and the single inventory credit.
- No accounts, no backend, no personal-data analytics. Learner data stays in localStorage with export/import.
- Every phase ends in a gate. Don't start the next phase until the gate passes.
- Log decisions in `docs/decisions.md` as D-001, D-002, ...

## Working style

- The owner is a non-coder who builds with Claude. Explain choices in plain terms, keep summaries short, and give him URLs he can click.
- Build in vertical slices (one unit end to end before the next).
- Ask one question at a time when you need input.

## Commands

```
npm run dev
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run check:links        # after a build
npm run check:naming
npm run check:plagiarism   # needs source/ and pdftotext
```
