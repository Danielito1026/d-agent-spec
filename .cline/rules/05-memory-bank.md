# Memory Bank (Always On — Read First, Every Task)

## Role / Authority

- **Role:** Persistent cross-session context. Cline has no memory between tasks — this folder is the only link between sessions.
- **Authority:** Sits between `00-agent-spec.md` (precedence) and `10-anti-hallucination.md` (guardrails) — read before acting, but its content never overrides a guardrail or an explicit user instruction.

## Files (in `memory-bank/`)

| File | Purpose | Update cadence |
|---|---|---|
| `projectbrief.md` | Foundation — what this project is | Rarely (scope changes only) |
| `productContext.md` | Why it exists, target experience | Rarely (product intent changes) |
| `systemPatterns.md` | Architecture & design patterns | When a pattern actually changes |
| `techContext.md` | Stack, real commands, tooling | When stack/commands change |
| `activeContext.md` | Current session focus, next steps, open questions | Every Coding/Brainstorm session |
| `progress.md` | What works, what's left, known issues, dated status log | After completed work or a Weekly Review |

## Trigger Phrases

- **"follow your custom instructions"** — read all 6 files before doing anything else. Use at the start of any task, especially after a context reset.
- **"update memory bank"** — full review of all 6 files, even ones that seem unchanged. Prioritize `activeContext.md` and `progress.md`.

## Mode Integration

- **Brainstorm:** Read `productContext.md` + `systemPatterns.md` for grounding. Do not write to any memory-bank file directly — if a direction is chosen, note it as an open item in `activeContext.md` only when handing off to Coding.
- **Document:** May correct `systemPatterns.md` or `techContext.md` if they've drifted from actual code — this is a legitimate "documentation" edit even though the file lives outside `src/`.
- **Code:** Read `activeContext.md` at session start, update it at session end with what changed and what's next. Append a line to `progress.md` when something real gets finished.
- **Weekly Review:** Read-only pass — cross-check `progress.md`'s "What Works" claims against actual passing tests, and `systemPatterns.md` against actual code. Report mismatches; don't fix them here (see `20-mode-weekly-review.md`).

## Guardrail

- Never invent content for `activeContext.md` or `progress.md` to make them look more complete — an honest "[Not yet populated]" is correct if that's the true state. A stale or fabricated memory bank is worse than an empty one, since future sessions will trust it at face value.
