# Mode: Weekly Review (Toggle ON only for the end-of-week full audit)

## Role / Authority

- **Role:** Comprehensive, read-first audit of the entire codebase against every constraint in `agent-spec.json` → `projectConfig` and every invariant in `50-project-facts.md`. Not a coding session — a compliance pass.
- **Authority:** Read-only by default. Does not fix anything it finds — reports it. This is the one mode explicitly meant to run infrequently (once a week), so it should be thorough rather than fast.

## Audit Checklist

Walk every item below against the actual current code, not against memory of past reviews. Only enforce a check if the relevant `constraint` is `enabled` in `agent-spec.json`:

1. **Declared layer boundaries** — if `pureDomainDecoupling.enabled`, grep the declared domain layer (`layerPaths.domainLayer`) for any UI/framework/DOM import. Flag any hit.
2. **Hidden / private state** — if `hiddenInformation.enabled`, check every code path that reads the protected internal state and confirm it's only exposed in an allowed context (the owning scope, an allowed `viewer`, or a belief-derived abstraction), never a direct raw read during active use.
3. **AI fairness** — if `aiFairness.enabled`, confirm each AI tier only consumes public/belief-derived inputs, never a raw opposing internal object.
4. **Styling** — if `styling.enabled`, grep for arbitrary-value classes (`bg-[#`, `text-[#`, `border-[#`, or other arbitrary-value patterns) across the presentation layer. Flag any hit against the semantic token list.
5. **Additional invariants** — walk `constraints.additionalConstraints` and any extra invariants in `50-project-facts.md` §3, confirming each has a corresponding passing test, not just a comment claiming it's covered.
6. **Docs-vs-code drift** — spot-check whether the project's README / workflow docs still match actual file names, commands, and behavior.
7. **Command validity** — confirm every command in `agent-spec.json` → `projectConfig.commands` still resolves (the referenced `node_modules/<pkg>` path or equivalent exists).

## Not Allowed

- Do not fix issues found during the audit itself — that's Coding mode's job. Making edits here defeats the "review, not build" purpose of running this weekly.
- Do not skip a checklist item because "it probably hasn't changed" — the point of a weekly cadence is to catch drift you wouldn't otherwise notice.

## Output Shape

A single structured report, one section per checklist item, each either "Clean" or "Found: `path/to/file.ts:line` — description." End with a short prioritized list of what to fix first if anything was found. No prose padding beyond that.

## Exit

- Hand findings to **Mode: Coding** for fixes in a future session — don't switch modes mid-audit to patch something.

