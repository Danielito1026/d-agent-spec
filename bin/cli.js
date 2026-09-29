#!/usr/bin/env node

/**
 * adopt-cline
 * Multi-stack CLI tool to adopt pluggable Cline agent rules, workflows,
 * and memory-bank into any project (C#, PHP, Dart, Python, Rust, Go, JS/TS, etc.)
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { scanProject } from './scanner.js';
import { copyDirSync, generateAgentSpecJson, replacePlaceholdersInTemplates } from './template-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADAPTER_SOURCE_DIR = path.resolve(__dirname, '..', '.cline');

const fmt = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

function printBanner() {
  console.log(`\n${fmt.cyan}${fmt.bold}======================================================${fmt.reset}`);
  console.log(`${fmt.green}${fmt.bold}       🤖 Adopt Cline: Pluggable Agent Adapter       ${fmt.reset}`);
  console.log(`${fmt.dim}   Multi-stack rules, memory-bank, and workflow setup${fmt.reset}`);
  console.log(`${fmt.cyan}${fmt.bold}======================================================${fmt.reset}\n`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let targetDir = process.cwd();
  let nonInteractive = false;
  let showHelp = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--yes' || arg === '-y') nonInteractive = true;
    else if (arg === '--help' || arg === '-h') showHelp = true;
    else if (!arg.startsWith('-')) targetDir = path.resolve(process.cwd(), arg);
  }

  return { targetDir, nonInteractive, showHelp };
}

function showHelpMessage() {
  console.log(`
${fmt.bold}Usage:${fmt.reset}
  npx adopt-cline [target-directory] [options]
  node bin/cli.js [target-directory] [options]

${fmt.bold}Arguments:${fmt.reset}
  target-directory    The target project directory (default: current directory)

${fmt.bold}Options:${fmt.reset}
  -y, --yes           Auto-accept all detected / default configuration values
  -h, --help          Show this help message

${fmt.bold}Supported Ecosystems:${fmt.reset}
  • C# / .NET         (*.csproj, *.sln)
  • PHP               (composer.json, Laravel, Symfony)
  • Dart / Flutter    (pubspec.yaml)
  • Python            (pyproject.toml, requirements.txt, Django, FastAPI)
  • Rust              (Cargo.toml)
  • Go                (go.mod)
  • Java / Kotlin     (pom.xml, build.gradle)
  • TypeScript / JS   (package.json, Next.js, Vite, etc.)
  • Custom / Other    (Prompt-driven configuration for any architecture)
`);
}

async function promptWithDefault(rl, label, defaultValue) {
  const promptText = `${fmt.bold}${label}${fmt.reset} ${fmt.dim}[${defaultValue}]${fmt.reset}: `;
  const answer = (await rl.question(promptText)).trim();
  return answer || defaultValue;
}

async function promptBoolean(rl, label, defaultValue) {
  const defaultStr = defaultValue ? 'Y/n' : 'y/N';
  const promptText = `${fmt.bold}${label}${fmt.reset} ${fmt.dim}[${defaultStr}]${fmt.reset}: `;
  const answer = (await rl.question(promptText)).trim().toLowerCase();
  if (!answer) return defaultValue;
  return answer === 'y' || answer === 'yes';
}

async function runInteractive(rl, detected) {
  const config = {
    ...detected,
    layerPaths: { ...detected.layerPaths },
    constraints: { ...detected.constraints },
    commands: { ...detected.commands }
  };

  console.log(`${fmt.magenta}${fmt.bold}--- 1. Project Information ---${fmt.reset}`);
  config.projectName = await promptWithDefault(rl, 'Project Name', detected.projectName);
  config.description = await promptWithDefault(rl, 'Project Description', detected.description);

  console.log(`\n${fmt.magenta}${fmt.bold}--- 2. Tech Stack & Tools ---${fmt.reset}`);
  config.framework = await promptWithDefault(rl, 'Framework / Language', detected.framework);
  config.bundler = await promptWithDefault(rl, 'Bundler / Build System', detected.bundler);
  config.styling = await promptWithDefault(rl, 'Styling / UI Theme System', detected.styling);
  config.testing = await promptWithDefault(rl, 'Testing Framework', detected.testing);
  config.packageManager = await promptWithDefault(rl, 'Package Manager / Tool', detected.packageManager);

  console.log(`\n${fmt.magenta}${fmt.bold}--- 3. Architecture & Layer Paths ---${fmt.reset}`);
  config.layerPaths.domainLayer = await promptWithDefault(rl, 'Domain / Core Logic Layer Path', detected.layerPaths.domainLayer);
  config.layerPaths.presentationLayer = await promptWithDefault(rl, 'Presentation / UI / Controllers Path', detected.layerPaths.presentationLayer);
  config.layerPaths.routes = await promptWithDefault(rl, 'Routes / Endpoints Path', detected.layerPaths.routes);
  config.layerPaths.styles = await promptWithDefault(rl, 'Styles / Theme File Path', detected.layerPaths.styles);
  config.layerPaths.testSetup = await promptWithDefault(rl, 'Test Setup / Config Path', detected.layerPaths.testSetup);

  console.log(`\n${fmt.magenta}${fmt.bold}--- 4. Behavioral Constraints ---${fmt.reset}`);
  config.constraints.pureDomainDecoupling = await promptBoolean(rl, 'Enforce pure domain layer decoupling (no UI/framework imports)?', detected.constraints.pureDomainDecoupling);
  config.constraints.hiddenInformation = await promptBoolean(rl, 'Enable hidden/private state protection guardrails?', detected.constraints.hiddenInformation);
  config.constraints.aiFairness = await promptBoolean(rl, 'Enable AI opponent / agent fairness constraints?', detected.constraints.aiFairness);
  config.constraints.styling = await promptBoolean(rl, 'Enforce semantic styling tokens / no hardcoded raw styles?', detected.constraints.styling);

  console.log(`\n${fmt.magenta}${fmt.bold}--- 5. Development & Verification Commands ---${fmt.reset}`);
  config.commands.test = await promptWithDefault(rl, 'Test command (full suite)', detected.commands.test);
  config.commands.testDomain = await promptWithDefault(rl, 'Domain test command', detected.commands.testDomain);
  config.commands.testPresentation = await promptWithDefault(rl, 'Presentation / UI test command', detected.commands.testPresentation);
  config.commands.typecheck = await promptWithDefault(rl, 'Typecheck / Compilation command', detected.commands.typecheck);
  config.commands.lint = await promptWithDefault(rl, 'Lint command', detected.commands.lint);
  config.commands.format = await promptWithDefault(rl, 'Format command', detected.commands.format);
  config.commands.build = await promptWithDefault(rl, 'Build command', detected.commands.build);
  config.commands.dev = await promptWithDefault(rl, 'Development server command', detected.commands.dev);
  config.commands.preview = await promptWithDefault(rl, 'Production preview command', detected.commands.preview);

  return config;
}
async function main() {
  const { targetDir, nonInteractive, showHelp } = parseArgs();
  if (showHelp) {
    showHelpMessage();
    process.exit(0);
  }

  printBanner();
  console.log(`${fmt.cyan}Target Directory:${fmt.reset} ${fmt.bold}${targetDir}${fmt.reset}\n`);

  if (!fs.existsSync(ADAPTER_SOURCE_DIR)) {
    console.error(`${fmt.red}Error: Source adapter template directory not found at: ${ADAPTER_SOURCE_DIR}${fmt.reset}`);
    process.exit(1);
  }

  console.log(`${fmt.dim}🔍 Scanning project structure and tech stack...${fmt.reset}`);
  const detected = scanProject(targetDir);
  console.log(`${fmt.green}✓ Detected Stack:${fmt.reset} ${fmt.bold}${detected.framework}${fmt.reset} (Package Manager: ${detected.packageManager}, Testing: ${detected.testing})\n`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const destClineDir = path.join(targetDir, '.cline');

    if (fs.existsSync(destClineDir)) {
      if (nonInteractive) {
        console.log(`${fmt.yellow}Notice: .cline directory already exists. Overwriting with detected configuration.${fmt.reset}`);
      } else {
        const overwrite = await promptBoolean(rl, `⚠️  ${destClineDir} already exists. Overwrite?`, false);
        if (!overwrite) {
          console.log(`\n${fmt.yellow}Adoption cancelled. Existing .cline folder was preserved.${fmt.reset}`);
          process.exit(0);
        }
      }
    }

    const config = nonInteractive ? detected : await runInteractive(rl, detected);

    console.log(`\n${fmt.dim}📦 Copying .cline template files into target project...${fmt.reset}`);
    copyDirSync(ADAPTER_SOURCE_DIR, destClineDir);

    console.log(`${fmt.dim}⚙️  Generating agent-spec.json...${fmt.reset}`);
    const agentSpecData = generateAgentSpecJson(config);
    fs.writeFileSync(
      path.join(destClineDir, 'agent-spec.json'),
      JSON.stringify(agentSpecData, null, 2),
      'utf8'
    );

    console.log(`${fmt.dim}📝 Updating markdown templates & replacing placeholders...${fmt.reset}`);
    const placeholderMap = {
      ADAPTER_NAME: config.projectName,
      PROJECT_NAME: config.projectName,
      FRAMEWORK: config.framework,
      BUNDLER: config.bundler,
      STYLING: config.styling,
      TESTING: config.testing,
      PACKAGE_MANAGER: config.packageManager,
      DOMAIN_LAYER_PATH: config.layerPaths.domainLayer,
      PRESENTATION_LAYER_PATH: config.layerPaths.presentationLayer,
      ROUTES_PATH: config.layerPaths.routes,
      STYLES_PATH: config.layerPaths.styles,
      TEST_SETUP_PATH: config.layerPaths.testSetup,
      TEST_CMD: config.commands.test,
      TEST_DOMAIN_CMD: config.commands.testDomain,
      TEST_PRESENTATION_CMD: config.commands.testPresentation,
      TYPECHECK_CMD: config.commands.typecheck,
      LINT_CMD: config.commands.lint,
      FORMAT_CMD: config.commands.format,
      BUILD_CMD: config.commands.build,
      DEV_CMD: config.commands.dev,
      PREVIEW_CMD: config.commands.preview
    };

    replacePlaceholdersInTemplates(destClineDir, placeholderMap);

    console.log(`\n${fmt.green}${fmt.bold}🎉 Success! Pluggable Cline Adapter has been adopted into:${fmt.reset}`);
    console.log(`   ${fmt.cyan}${destClineDir}${fmt.reset}\n`);

    console.log(`${fmt.bold}Next Steps in Cline:${fmt.reset}`);
    console.log(` 1. ${fmt.cyan}Enable Always-On Rules in Cline UI:${fmt.reset}`);
    console.log(`    • .cline/rules/00-agent-spec.md`);
    console.log(`    • .cline/rules/05-memory-bank.md`);
    console.log(`    • .cline/rules/10-anti-hallucination.md`);
    console.log(`    • .cline/rules/50-project-facts.md`);
    console.log(` 2. ${fmt.cyan}Toggle Mode (e.g. for coding tasks):${fmt.reset}`);
    console.log(`    • Enable .cline/rules/20-mode-code.md`);
    console.log(` 3. ${fmt.cyan}Initialize / Seed the Memory Bank:${fmt.reset}`);
    console.log(`    • Prompt Cline: ${fmt.yellow}"update memory bank"${fmt.reset}\n`);

  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(`\n${fmt.red}Fatal Error:${fmt.reset}`, err);
  process.exit(1);
});

