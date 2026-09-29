# System Patterns: {{PROJECT_NAME}}

> **Template.** Replace placeholder content with the actual architecture and patterns once established. The framing below is a generic starting point for most layered projects; adapt to your real structure.

## Architectural Boundaries

- `{{DOMAIN_LAYER_PATH}}` — **pure domain / business logic** (if `pureDomainDecoupling.enabled`). Zero UI/framework/DOM imports.
- `{{PRESENTATION_LAYER_PATH}}` — presentation / UI layer; consumes the domain layer but never the reverse.
- `{{ROUTES_PATH}}` — routing / screens.
- Any other notable directories (hooks, lib/persistence, shared utilities) — list them.

## Key Design Patterns

- **Immutable state transitions** (if used): describe how state updates return new values rather than mutating in place.
- **Stateful coordinator over pure engine** (if used): a thin coordinator that owns orchestration/edge-case state while the core stays pure.
- **Belief-based / hidden-state derivation** (if applicable): how the system derives decisions without direct reads of hidden/private state (see `aiFairness` / `hiddenInformation`).
- **Viewer-scoped rendering** (if applicable): how the UI reveals internal state only in the allowed context.
- **Semantic theming** (if `styling.enabled`): all styling routes through semantic tokens in `{{STYLES_PATH}}`.

## Canonical Constants / Formulas

- If the project defines canonical math, constants, or data-shape formulas, document them here (they must be derived from the project, never assumed from memory).

## References

- List the project's architectural docs once they exist.

