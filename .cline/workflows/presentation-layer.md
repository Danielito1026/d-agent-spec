# Workflow: Presentation Layer Development

Use this workflow when creating or modifying UI components, screens/routes, or styling in the presentation layer (`agent-spec.json` → `projectConfig.layerPaths.presentationLayer` / `routes`).

## 1. Directory Structure

- Presentation components: `{{PRESENTATION_LAYER_PATH}}`.
- Routes / screens: `{{ROUTES_PATH}}`.

## 2. Styling Conventions

- If `styling.enabled` is true, use semantic theme tokens defined in `{{STYLES_PATH}}` (see `projectConfig.constraints.styling.allowedTokens`).
- **Prohibited:** hardcoded hex or arbitrary-value classes (e.g. `bg-[#1a1a1a]`, `text-[#ffffff]`) unless no semantic token fits and a new one is added to the styles file first.

## 3. Perspective & Hidden-Information Rendering (if applicable)

- If `hiddenInformation.enabled` is true, the presentation layer must render protected/internal state obscured in active views, revealing it only in the allowed context (e.g. an end/replay `viewer`), exactly as documented in `projectConfig.constraints.hiddenInformation`.
- Display-only / cosmetic concerns must never affect core state (see `projectConfig.constraints`).

## 4. Verification

Format, lint, and typecheck UI files after changes (from `projectConfig.verificationGates.afterPresentationChange`):

```bash
{{FORMAT_CMD}}
{{LINT_CMD}}
{{TYPECHECK_CMD}}
```

