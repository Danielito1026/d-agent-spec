# Project Brief: {{PROJECT_NAME}}

> **Template.** On first setup, replace this placeholder content with the actual project brief. Every placeholder below should be answered in plain language; keep it short.

## What This Is

- One-paragraph description of the project: what it is, who it's for, and its primary purpose. (Fill from `agent-spec.json` → `projectConfig.description` and your own context.)

## Architecture Context

- **Stack / platform:** {{FRAMEWORK}} — note the main framework, language, and key libraries here.
- **Layer boundaries:** if `pureDomainDecoupling.enabled`, note the declared pure domain layer (`{{DOMAIN_LAYER_PATH}}`) and the presentation layer (`{{PRESENTATION_LAYER_PATH}}`).
- **Porting / targets:** if the project has a secondary target (e.g. a future mobile port), note it here.

## Core Scope & Key Rules

- List the primary feature scope and the core business rules / invariants that must never be broken (reconcile with `agent-spec.json` → `projectConfig.constraints` and `50-project-facts.md`).

## Core Invariant (Never Break)

- If a purity boundary or hidden-information invariant is declared in `agent-spec.json`, restate it here as the project's core non-negotiable.

## References

- List key docs (rulebook, spec, architecture) once they exist in the project.

