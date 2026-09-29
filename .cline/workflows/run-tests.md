# Workflow: Run & Validate Tests

Use this workflow to run and validate the project's test suite, type checking, and verification gates.

## 1. Quick Test Run

Run the full configured test suite directly using the command from `agent-spec.json` → `projectConfig.commands.test` (e.g. `node node_modules/vitest/vitest.mjs run`).

## 2. Test a Single Module / Layer

To target specific suites, use the layer-targeted commands from `projectConfig.commands` (`testDomain`, `testPresentation`) and their underlying per-file equivalents.

- **Domain layer:** `{{TEST_DOMAIN_CMD}}`
- **Presentation layer:** `{{TEST_PRESENTATION_CMD}}`

## 3. Type Checking & Verification

Always combine test runs with the typecheck command (`projectConfig.commands.typecheck`):

```bash
{{TYPECHECK_CMD}}
```

## 4. Test Invariants Checklist

When adding or updating tests, reconcile against `agent-spec.json` → `projectConfig.constraints` and `additionalConstraints` (see `50-project-facts.md` §3):
- Each declared hard invariant has a corresponding passing test.
- Declared layer boundaries hold (no UI/framework imports in the pure domain layer, if declared).
- Any hidden/private-state invariants hold (never revealed on the active path outside the allowed context).
- Test-environment cleanup (e.g. localStorage reset) runs via `{{TEST_SETUP_PATH}}`.

