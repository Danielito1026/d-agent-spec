# Adopt Cline: Pluggable Agent Adapter

A universal, multi-stack CLI tool and `.cline/` template system to quickly adopt structured AI agent rules, memory-bank persistence, operational modes, and verification workflows into **any** project (C#, PHP, Dart, Python, Rust, Go, Java, TypeScript/JavaScript, etc.).

---

## 🚀 Quick Start (CLI Adoption)

You can adopt this adapter into any project directory with a single command:

```bash
# Run adoption CLI interactively on a target project
npx adopt-cline <path-to-target-project>

# Or inside this repository
node bin/cli.js <path-to-target-project>
```

### Auto-Adopt with Defaults (`-y` / `--yes`)
To adopt using auto-detected stack settings without interactive prompts:
```bash
npx adopt-cline /path/to/project -y
```

---

## 🌐 Supported Ecosystems

The CLI auto-detects the project architecture, package manager, test runners, build tools, and layer boundaries:

| Ecosystem | Detected Stack Markers | Default Test Runner | Default Linter & Typecheck | Layer Paths |
|---|---|---|---|---|
| **C# / .NET** | `*.csproj`, `*.sln` | `dotnet test` | `dotnet build`, `dotnet format` | `src/Domain`, `src/Presentation`, `src/Controllers` |
| **PHP** | `composer.json`, Laravel, Symfony | `php artisan test` / `pest` / `phpunit` | `phpstan`, `pint` | `app/Domain`, `app/Http/Controllers`, `routes/web.php` |
| **Dart / Flutter** | `pubspec.yaml` | `flutter test` / `dart test` | `flutter analyze`, `dart format` | `lib/core`, `lib/features`, `lib/routes` |
| **Python** | `pyproject.toml`, `requirements.txt`, Django, FastAPI | `pytest` | `mypy`, `ruff` | `src/domain`, `src/api` |
| **Rust** | `Cargo.toml` | `cargo test` | `cargo check`, `cargo clippy`, `cargo fmt` | `src/domain`, `src/api` |
| **Go** | `go.mod` | `go test ./...` | `go vet`, `golangci-lint` | `internal/domain`, `internal/api` |
| **Java / Kotlin** | `pom.xml`, `build.gradle` | `mvn test` / `./gradlew test` | `mvn compile` / `./gradlew check` | `src/main/java/domain`, `src/main/java/controller` |
| **TypeScript / Node** | `package.json`, Next.js, Vite, etc. | `vitest` / `jest` / `npm test` | `tsc --noEmit`, `eslint` | `src/domain`, `src/ui`, `src/routes` |
| **Custom / Other** | Prompt-driven configuration for any stack | User specified | User specified | User specified |

---

## 🛠️ What Happens During Adoption?

1. **Copies `.cline/` Directory**: Places rules, workflows, memory-bank, and spec into `<target>/.cline/`.
2. **Generates `agent-spec.json`**: Populates single-source-of-truth project facts, layer boundaries, constraints, commands, and verification gates.
3. **Replaces Placeholders**: Automatically updates `rules/`, `workflows/`, and `memory-bank/` templates with your project's commands and directories.

---

## 📋 Next Steps in Cline

1. **Enable Always-On Rules in Cline:**
   - `.cline/rules/00-agent-spec.md`
   - `.cline/rules/05-memory-bank.md`
   - `.cline/rules/10-anti-hallucination.md`
   - `.cline/rules/50-project-facts.md`

2. **Toggle Active Mode:**
   - Enable `.cline/rules/20-mode-code.md` for active development.
   - Or toggle `20-mode-brainstorm.md` / `20-mode-document.md` / `20-mode-weekly-review.md`.

3. **Seed Memory Bank:**
   - In your first prompt to Cline, tell it: `"update memory bank"`.
