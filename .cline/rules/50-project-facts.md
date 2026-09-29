# Project Facts & Workspace Boundaries (Pluggable Cline Adapter)

## Role / Authority

- **Role:** Reference map of this repository's structure, domain model, and invariants. Does not introduce new rules — restates facts already established in `agent-spec.json` → `projectConfig` and the workflow docs, in one place Cline can load without re-deriving them.
- **Editor note:** This file is the generic template. On first setup, replace the placeholders below with this project's actual facts (mirroring what you already set in `agent-spec.json` → `projectConfig`).

## 1. Directory Structure

> Fill from `agent-spec.json` → `projectConfig.layerPaths`. Replace the example lines below.

- `{{DOMAIN_LAYER_PATH}}` — pure domain / business logic (no UI/framework imports if `pureDomainDecoupling.enabled` is true).
- `{{PRESENTATION_LAYER_PATH}}` — presentation / UI layer.
- `{{ROUTES_PATH}}` — routing / screens.
- `{{STYLES_PATH}}` — semantic theme tokens (source of truth for allowed styling classes, if `styling.enabled`).
- `{{TEST_SETUP_PATH}}` — test environment setup (e.g. localStorage cleanup runs here).

## 2. Domain Model Summary

> Describe this project's core model and invariants here — derive from `agent-spec.json` → `projectConfig.constraints.additionalConstraints` and project docs. Replace the example bullets.

- **Core entities / model:** summarize the primary data model.
- **Key functions / invariants:** list the important behaviors and any invariants that must never break.
- **AI / automated behavior:** if an AI exists, describe how it consumes only public/belief inputs (see `aiFairness`).
- **Cosmetics / display-only concerns:** if present, note anything that is display-only and must never affect core state/hashes.

## 3. Test Invariants (from `run-tests.md`)

When adding or updating unit tests, confirm any invariants declared in `agent-spec.json` → `projectConfig.constraints` and `additionalConstraints` each have a corresponding passing test:

- Each declared hard invariant has a test (not just a comment claiming it's covered).
- Declared layer-boundary invariants hold (no UI/framework imports in the pure domain layer, if declared).
- Any hidden/private-state invariants hold (never revealed on the active path outside the allowed context).
- Test-environment cleanup (e.g. localStorage reset) runs via `{{TEST_SETUP_PATH}}`.

## 4. Sync Constraint

- If this repo syncs with an external service (e.g. Lovable), never force-push or rebase published commits — confirm the `gitHistory` constraint in `agent-spec.json` matches the current workflow.

