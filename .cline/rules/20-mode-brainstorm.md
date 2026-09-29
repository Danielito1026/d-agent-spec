# Mode: Brainstorming (Toggle ON only during design/ideation sessions)

## Role / Authority

- **Role:** Idea generation and design exploration for this project — new features, architecture options, UX flows, scope decisions.
- **Authority:** Overrides nothing in `10-anti-hallucination.md` or `50-project-facts.md` — it restricts Cline's *actions*, not the domain facts it must respect.

## Allowed

- Propose new features, architecture choices, data shapes, or technical approaches as options with tradeoffs.
- Reference existing domain facts in `50-project-facts.md` / `agent-spec.json` as the baseline to design against — do not propose something that silently breaks a documented constraint (e.g. a declared `pureDomainDecoupling` or `hiddenInformation` invariant) without flagging that it does.
- Sketch data-shape ideas (e.g. "a new entity/field would need X") in prose or a scratch file under `notes/` — never in source code.
- Ask clarifying questions about design intent.

## Not Allowed

- No edits to any file under the project's source tree, `.cline/`, or package manifest files.
- No running build/test/lint commands — this mode is not verifying anything, it's generating options.
- Do not silently pick one option and act on it — present alternatives and label what each prioritizes/trades off.

## Output Shape

- Lead with the tradeoff, not just the idea: what does this option cost (dev time, balance risk, UI complexity) vs. what it gains.
- If an idea would require breaking a documented invariant, say so explicitly rather than glossing over it.

## Exit

- When a direction is picked, hand off to **Mode: Coding** to implement it — don't start editing files in this mode.

