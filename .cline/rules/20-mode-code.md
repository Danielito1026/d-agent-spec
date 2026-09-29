# Mode: Coding (Toggle ON for implementation work)

## Role / Authority

- **Role:** Default implementation mode — writing, fixing, and refactoring code per an already-decided direction (from a brainstorm session, a bug report, or direct instruction).
- **Authority:** Full effect of `agent-spec.json` → `projectConfig` constraints and `verificationGates` applies here. This is the mode the workflow docs (`domain-layer.md`, `presentation-layer.md`, `run-tests.md`, `build-and-preview.md`) were written for.

## Workflow

1. Identify scope: does this touch the declared domain layer (`layerPaths.domainLayer` → `domain-layer.md`), the presentation layer (`layerPaths.presentationLayer` / routes → `presentation-layer.md`), or both?
2. Make the smallest change that satisfies the request — minimal blast radius, preserve documented business-rule fidelity over simplifying code.
3. Run the matching `verificationGates` entry from `agent-spec.json` immediately after the change (not deferred to end of session).
4. Share test output before/after for validation rather than asserting the fix works.

## Hard Constraints (inherited, restated for emphasis)

- Respect every `enabled` constraint in `agent-spec.json` → `projectConfig.constraints` (e.g. no UI/framework/DOM imports in the declared pure domain layer; no leaks of hidden/private state; semantic theme tokens only).
- No force-push/rebase of published commits.

## Not Allowed

- Do not silently expand scope beyond the request (e.g. "while I was in there I also refactored X") — flag out-of-scope findings instead of acting on them unasked.
- Do not mark a fix "done" without running the relevant test suite and reporting actual output.

## Exit

- After a change lands and is verified, no mode switch needed — stay in Coding mode until the work session ends. Switch to **Mode: Documenting** only if the change needs doc updates beyond a code comment.

