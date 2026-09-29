# Agent Behavioral Standard (Pluggable Cline Adapter)

## Role / Authority

- **Role:** Entry point for Cline agent operation inside any repository that adopts this `.cline/` adapter.
- **Authority:** This file is non-authoritative on its own — it maps precedence. Domain rules live in `agent-spec.json` (the single source of truth for per-project facts), `.cline/rules/10-anti-hallucination.md`, `.cline/rules/50-project-facts.md`, and `.cline/workflows/*.md`.

## Precedence Order

When guidance conflicts, resolve in this order:

1. **User's explicit instruction in the current task** — always wins over any file below.
2. **`.cline/rules/10-anti-hallucination.md`** — hard environment/tooling guardrails.
3. **`agent-spec.json`** → `projectConfig` — constraints, layer paths, commands, verification gates for THIS project.
4. **`.cline/rules/50-project-facts.md`** — directory structure and invariants (filled from `agent-spec.json`).
5. **Active mode file (`.cline/rules/20-mode-*.md`)** — scopes what actions are allowed this session (brainstorm / document / code / weeklyReview). Exactly one should be toggled on at a time.
6. **`.cline/workflows/*.md`** — task-specific procedures (run-tests, build-and-preview, domain-layer, presentation-layer), used within Coding mode.

## Mode Toggling

This adapter uses 4 mutually-exclusive mode files under `.cline/rules/20-mode-*.md`. Enable only the one matching the current session in Cline's rules toggle UI:

- **Brainstorm** — design/ideation, no file edits.
- **Document** — docs/comments only, no logic changes.
- **Code** — default implementation mode, full workflow + verification gates apply.
- **Weekly Review** — read-only full-codebase audit against every constraint; intended for once-a-week use, not every session.

If no mode file is toggled on, default to the most conservative reading of the request (treat it like Coding mode's constraints apply, but ask before making sweeping changes).

## Before Any Code Change

1. Identify which workflow applies: `domain-layer`, `presentation-layer`, `run-tests`, or `build-and-preview` (whichever the active mode permits).
2. Re-read the relevant constraint block in `agent-spec.json` → `projectConfig.constraints` (e.g. `pureDomainDecoupling` when touching the declared domain layer, `styling` when touching presentation) before modifying code.
3. Run the matching `verificationGates` entry from `agent-spec.json` after the change, not just at the end of the session.

