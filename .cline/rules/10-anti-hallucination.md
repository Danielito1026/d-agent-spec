# Anti-Hallucination Guardrails (Pluggable Cline Adapter)

## Role / Authority

- **Role:** Explicit constraints preventing the model from assuming tooling, commands, or architecture that don't exist in this repo.
- **Authority:** Operational guardrails — takes precedence over workflow docs when they conflict.

## 1. Only Use Commands That Actually Exist

All test/lint/format/typecheck commands are invoked exactly as declared in `agent-spec.json` → `projectConfig.commands` (typically directly via `node node_modules/<pkg>/...`), **not** via bare shorthand you assume exists (`npm test`, `npx vitest`, global binaries). Do not substitute a shorter-looking command you think exists — use exactly what's in `agent-spec.json`.

- Do NOT invent flags for these commands (e.g. `--coverage`, `--watch=false`) unless the user asks for them or they already appear in `package.json`.
- Do NOT assume a CI config, Docker setup, or deployment pipeline exists unless you have actually opened a file that proves it.

## 2. Respect the Declared Layer Boundaries (if any)

- If `agent-spec.json` → `projectConfig.constraints.pureDomainDecoupling.enabled` is true, its declared layer (see `layerPaths.domainLayer`) must compile with zero UI/framework/DOM imports. If a change there seems to require a UI import, that's a signal the logic belongs in the presentation layer instead — do not add the import.
- Do not invent a purity boundary the project hasn't declared; but if one is declared, treat it as a hard boundary, not a style preference.

## 3. Hidden / Private State Cannot Be "Temporarily" Exposed

- If `projectConfig.constraints.hiddenInformation.enabled` is true, never add a debug flag, console log, or dev-only UI path that prints the protected internal state during active (non-allowed-context) use — even for local testing. If you need to inspect hidden state while debugging, log it to a file/tool output the user won't see, or gate it behind a build that is never shipped.

## 4. Styling Guardrail

- If `projectConfig.constraints.styling.enabled` is true, before adding any arbitrary-value styling class (e.g. `bg-[#...]`, `text-[#...]`, `border-[#...]`), stop and check the project's styles file (see `layerPaths.styles`) for an existing semantic token. Only add a new semantic token (and use it) if none fits — never hardcode.

## 5. Derive Domain Specifics From the Project, Not From Memory

- Always derive project-specific formulas, constants, or data shapes from what's documented in `agent-spec.json` → `projectConfig` or `50-project-facts.md` / project docs — never from general knowledge that may mislead (e.g. assuming generic board/dataset dimensions when the project defines its own).

## 6. Git Hygiene

- Never force-push or rebase published commits (`gitHistory` constraint, and any external-sync requirement like Lovable). If a fix requires history rewriting, stop and ask the user first.

