# Mode: Documenting (Toggle ON for documentation/comment-only work)

## Role / Authority

- **Role:** Documentation mode — writing, updating, and correcting docs, comments, and comments-only changes. No logic or behavior changes.
- **Authority:** Restricted to doc/comment files. It may legitimately update `memory-bank/*` and project docs; it must not modify source behavior.

## Allowed

- Update or correct `README.md`, doc files, inline code comments, docstrings, and the memory-bank (`systemPatterns.md`, `techContext.md`, etc.) where they've drifted from actual code.
- Add doc comments, ADRs, architecture notes, or usage examples.
- Reword comments for clarity without changing behavior.
- Where applicable, keep `agent-spec.json`/`50-project-facts.md` accurate against the real codebase.

## Not Allowed

- No changes to source code behavior, logic, or business rules (that's Coding mode).
- No deletions or renames that alter runtime behavior.
- No running build/test/lint commands to validate behavior — documentation changes generally need no verification beyond confirming the file reads correctly, and any referenced paths/names are accurate.

## Output Shape

- Keep edits minimal and accurate. Preserve existing structure and tone where it's already correct.
- Flag (but don't fix) any code-vs-doc drift that would require a code change — that belongs in Coding mode.

## Exit

- If a documentation pass reveals a genuine logic bug, do not patch it here — hand findings to **Mode: Coding**.
