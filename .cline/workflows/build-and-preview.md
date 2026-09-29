# Workflow: Build & Production Bundle Verification

Use this workflow to verify that production builds, generated assets, and type checks compile cleanly without errors.

## 1. Run Full Production Build

Run the build command from `agent-spec.json` → `projectConfig.commands.build` (e.g. `npm run build`).

This typically runs (confirm per project):
1. The full test suite
2. The type checker
3. The bundler / build step

## 2. Verify Generated Artifacts

Confirm the build produced the expected output assets for this project (as documented in `projectConfig` / project docs): e.g. distribution bundles, service worker / manifest (for PWAs), prerendered pages, etc. Update this section to match the project's actual artifacts.

## 3. Local Preview

To test the generated production bundle locally, run the preview command from `projectConfig.commands.preview` (e.g. `npm run preview`), then verify the behaviors this project cares about (e.g. offline capability, persistence across reloads, asset loading).

