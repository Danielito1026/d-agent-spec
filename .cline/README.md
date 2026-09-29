# Pluggable Cline Adapter

A project-agnostic `.cline/` configuration you can drop into **any** new project to give Cline a consistent memory-bank, mode system, rules, and workflow discipline out of the box.

## How It Works

- **`agent-spec.json` is the single source of truth** for per-project facts (name, stack, layer paths, constraints, commands, verification gates).
- The **markdown** under `.cline/rules/`, `.cline/workflows/`, and `.cline/memory-bank/` are **generic templates**. They reference `agent-spec.json` and generic concepts (domain layer, presentation layer, the 4 modes) — they do **not** hardcode any one project.
- To adopt it for a new project you edit **only** `agent-spec.json` (plus optionally the placeholder lines in `memory-bank/` and the `{{PLACEHOLDER}}` tokens woven through the docs).

## Plugging Into a New Project (5 steps)

1. **Copy** this `.cline/` folder into the new project's root.

2. **Edit `agent-spec.json` → `projectConfig`** with the project's real facts:
   - `projectName` and `description`
   - `targetEnvironment` (framework, bundler, styling, testing)
   - `layerPaths` (domain layer, presentation layer, routes, styles, test setup — or delete keys you don't have)
   - `constraints` (enable/disable `pureDomainDecoupling`, `hiddenInformation`, `aiFairness`, `styling`; fill `allowedTokens`; extend `additionalConstraints` with the project's hard invariants)
   - `commands` (the actual test/typecheck/lint/format/build/dev/preview commands)
   - `verificationGates` if your gates differ from the defaults

3. **Toggle modes in Cline.** Enable the always-on rules (`00-agent-spec`, `05-memory-bank`, `10-anti-hallucination`, `50-project-facts`) plus exactly one of `20-mode-*` (`brainstorm` / `document` / `code` / `weeklyReview`). The `code` mode is the default for implementation.

4. **Replace `{{PLACEHOLDER}}` tokens** in the memory-bank and docs with the project's real values. The placeholders mirror `projectConfig`, so most of it is already set once step 2 is done. (The memory-bank template sections are meant to be filled in with the project's actual brief, product context, patterns, and tech context.)

5. **Seed the memory bank.** On your first session, say `update memory bank` — Cline re-reads the templates, fills in the volatile files with the project's actual state, and records a first `progress.md` entry.

> **Note:** Leave the generic `.cline/rules/` and `.cline/workflows/` markdown mostly untouched. If you need a genuinely project-specific pattern or workflow, add a new file (e.g. `.cline/workflows/my-feature.md` and reference it in `agent-spec.json` → `workflows`) rather than overwriting the generic ones.

## Quick Example

Below is a concrete `projectConfig` for a fictional TypeScript + React + Vite project called **TaskFlow**. It shows what the `{{PLACEHOLDER}}` tokens look like once filled in. Your real project will have different values, but the structure is the same.

```jsonc
"projectConfig": {
  "projectName": "TaskFlow",
  "description": "A lightweight Kanban board for managing team tasks.",

  "targetEnvironment": {
    "platform": "cross-platform (win32 reference dev env)",
    "framework": "React 18 + TypeScript",
    "bundler": "Vite 5",
    "styling": "Tailwind CSS 4 (utility-first)",
    "testing": "Vitest + React Testing Library",
    "packageManager": "pnpm"
  },

  "layerPaths": {
    "domainLayer": "src/domain",
    "presentationLayer": "src/ui",
    "routes": "src/routes",
    "styles": "src/styles/theme.ts",
    "testSetup": "vitest.setup.ts"
  },

  "constraints": {
    "pureDomainDecoupling": {
      "enabled": true,
      "path": "src/domain",
      "rule": "This layer must remain 100% pure (no UI/framework/DOM imports). If a change seems to need a UI import, that logic belongs in the presentation layer.",
      "_note": "Set enabled:false if your project has no such boundary."
    },
    "hiddenInformation": {
      "enabled": false,
      "paths": [],
      "rule": "If your project has hidden/internal/private state that must never leak to the outside, document the invariant here (what is hidden, under what viewer/context it may be revealed) and forbid any debug path that exposes it during active use.",
      "_note": "Optional. Only relevant for games, multi-tenant apps, or apps with secret state."
    },
    "aiFairness": {
      "enabled": false,
      "rule": "If an AI/automated agent exists, it must derive decisions only from public/belief-derived inputs, never direct reads of hidden state.",
      "_note": "Optional. Only relevant if the project contains an AI/opponent."
    },
    "styling": {
      "enabled": true,
      "rule": "Use semantic theme tokens from src/styles/theme.ts; no hardcoded hex or arbitrary-value classes.",
      "allowedTokens": ["bg-surface", "bg-surface-hover", "text-primary", "text-secondary", "border-default", "border-focus", "radius-sm", "radius-md", "radius-lg", "shadow-sm", "shadow-md"],
      "prohibited": "arbitrary value classes like bg-[#1a1a1a] or text-[#ffffff]",
      "_note": "Fill allowedTokens with this project's semantic token names."
    },
    "gitHistory": {
      "rule": "Never force-push or rebase published commits. If the repo syncs with an external service (e.g. Lovable), ask before rewriting history."
    },
    "additionalConstraints": [
      "Board state must be serializable to JSON for undo/redo history.",
      "A task cannot be moved to a column that is at its WIP limit."
    ]
  },

  "commands": {
    "test": "node node_modules/.bin/vitest run",
    "testDomain": "node node_modules/.bin/vitest run src/domain",
    "testPresentation": "node node_modules/.bin/vitest run src/ui",
    "typecheck": "node node_modules/.bin/tsc --noEmit",
    "lint": "node node_modules/.bin/eslint src",
    "format": "node node_modules/.bin/prettier --write src",
    "build": "node node_modules/.bin/vite build",
    "dev": "node node_modules/.bin/vite",
    "preview": "node node_modules/.bin/vite preview"
  },

  "verificationGates": {
    "afterDomainLayerChange": ["testDomain", "typecheck"],
    "afterPresentationChange": ["format", "lint", "typecheck"],
    "beforeRelease": ["test", "typecheck", "build"]
  }
}
```

**Key points to notice in the example:**

- **`commands`** uses explicit `node node_modules/.bin/...` paths (not bare `vitest` or `npx`) — this avoids the anti-hallucination rule flagging invented commands.
- **`constraints.styling.allowedTokens`** is filled with the project's real semantic token names — Cline will enforce these instead of hardcoding hex values.
- **`constraints.hiddenInformation`** and **`aiFairness`** are `enabled: false` because this Kanban app has neither hidden state nor an AI opponent — the guardrails silently skip them.
- **`constraints.additionalConstraints`** lists project-specific business rules that have no generic equivalent.
- **`layerPaths`** uses real directory paths — if your project has no separate domain/presentation split, delete those keys and set `pureDomainDecoupling.enabled: false`.
- **`verificationGates`** names match the keys in `commands` — Cline runs the referenced command by name after each change.

## Directory Layout

```
.cline/
  agent-spec.json                 # Single source of truth for per-project facts
  README.md                       # This file
  rules/
    00-agent-spec.md              # Precedence + mode map (always-on)
    05-memory-bank.md             # Memory-bank protocol (always-on)
    10-anti-hallucination.md      # Guardrails (always-on)
    20-mode-brainstorm.md         # Mode: ideation, no edits
    20-mode-document.md           # Mode: docs/comments only
    20-mode-code.md               # Mode: implementation (default)
    20-mode-weekly-review.md      # Mode: read-only audit
    50-project-facts.md           # Project structure + invariants (always-on; placeholders)
  workflows/
    run-tests.md                  # Test + typecheck + invariant checklist
    build-and-preview.md          # Build + artifact + preview verification
    domain-layer.md               # Changing the pure domain layer
    presentation-layer.md         # Changing UI/routes/styling
  memory-bank/
    projectbrief.md               # What the project is (template)
    productContext.md             # Why it exists (template)
    systemPatterns.md             # Architecture/patterns (template)
    techContext.md                # Stack/commands (template)
    activeContext.md              # Volatile: current session
    progress.md                   # Volatile: historical log
```

## Design Principles

- **One edit point per project:** project specifics live in `agent-spec.json`, not scattered through markdown.
- **Guardrails are universal:** no-hallucination (use real commands), git hygiene, and the memory-bank protocol apply to every project by default.
- **Constraints are opt-in:** `pureDomainDecoupling`, `hiddenInformation`, `aiFairness`, and `styling` are each `enabled: true/false` in the config, so a project only enforces what it actually declares.
- **Consistent context discipline:** the 6-file Memory Bank and the 4 mutually-exclusive modes give every project the same, predictable agent behavior.
