# Tech Context: {{PROJECT_NAME}}

> **Template.** Fill from `agent-spec.json` → `projectConfig` and the actual tooling. Every placeholder below should be replaced with the real stack on first setup.

## Stack

- **Framework:** {{FRAMEWORK}}
- **Bundler:** {{BUNDLER}}
- **Styling:** {{STYLING}}
- **Testing:** {{TESTING}}
- **Platform (dev):** cross-platform (win32 reference)
- **Package manager:** npm
- **Other notable tooling:** list anything else (e.g. PWA plugin, state library, linter).

## Real Commands (invoked exactly as in `agent-spec.json` → `projectConfig.commands`)

```bash
# Full suite
{{TEST_CMD}}

# Layer-targeted
{{TEST_DOMAIN_CMD}}
{{TEST_PRESENTATION_CMD}}

# Type check
{{TYPECHECK_CMD}}

# Lint
{{LINT_CMD}}

# Format
{{FORMAT_CMD}}

# Build / dev / preview
{{BUILD_CMD}}
{{DEV_CMD}}
{{PREVIEW_CMD}}
```

## Verification State

- Note the current passing-test counts and any environment warnings here after the first verified run.

## Documentation Reference

- List the project's docs once they exist.

## Tooling Setup (agent side)

- Note the agent/tooling setup in use (e.g. Cline CLI with `.cline/` rules/workflows described in `agent-spec.json`).

## This File's Role

The "what's installed and how to run it" reference. Update when the stack or commands actually change — a version bump or a new test file doesn't need an update unless it changes how something is invoked.

