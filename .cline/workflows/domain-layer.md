# Workflow: Domain Layer Development

Use this workflow when modifying the declared domain / business-logic layer (`agent-spec.json` → `projectConfig.layerPaths.domainLayer`), e.g. core model, rules, algorithms, or any automated/AI behavior.

## 1. Layer Architecture Rules

- File location: `{{DOMAIN_LAYER_PATH}}` (from `agent-spec.json` → `projectConfig.layerPaths`).
- **Purity:** If `pureDomainDecoupling.enabled` is true, this layer is pure logic only — never import UI, framework, or DOM dependencies.
- **Invariants:** Re-read `projectConfig.constraints` and `50-project-facts.md` before changing this layer. Preserve documented business-rule fidelity over simplifying code.

## 2. Business Logic Contract

- Describe the core functions and their contracts here (mirror `agent-spec.json` → `projectConfig.constraints.additionalConstraints` and `50-project-facts.md` §2).
- Any hidden/private-state handling must respect the `hiddenInformation` constraint (if enabled).
- Any automated/AI behavior must respect the `aiFairness` constraint (if enabled): derive decisions only from public/belief inputs, never direct reads of hidden/internal state.

## 3. Verification

Always run the domain test + typecheck gates after modifying this layer (from `agent-spec.json` → `projectConfig.verificationGates.afterDomainLayerChange`):

```bash
{{TEST_DOMAIN_CMD}}
{{TYPECHECK_CMD}}
```

