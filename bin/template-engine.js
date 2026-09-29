import fs from 'node:fs';
import path from 'node:path';

export function copyDirSync(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

export function replacePlaceholdersInTemplates(targetClineDir, replacements) {
  const files = getAllFiles(targetClineDir);

  for (const filePath of files) {
    if (filePath.endsWith('.md')) {
      let content = fs.readFileSync(filePath, 'utf8');
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(regex, value);
      }
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}
export function generateAgentSpecJson(config) {
  return {
    "$schema": "https://agent-spec.local/schemas/spec.v1.schema.json",
    "name": config.projectName,
    "version": "2.0.0",
    "description": `Pluggable Cline adapter for ${config.projectName}. Single source of truth for project facts, constraints, commands, and verification gates.`,
    "_setup": {
      "how": "1) This .cline configuration was adopted via `adopt-cline`. 2) Use 'update memory bank' trigger to refresh context anytime. See .cline/README.md for reference."
    },
    "projectConfig": {
      "projectName": config.projectName,
      "description": config.description,
      "targetEnvironment": {
        "platform": config.platform || "cross-platform",
        "framework": config.framework,
        "bundler": config.bundler,
        "styling": config.styling,
        "testing": config.testing,
        "packageManager": config.packageManager
      },
      "layerPaths": {
        "domainLayer": config.layerPaths.domainLayer,
        "presentationLayer": config.layerPaths.presentationLayer,
        "routes": config.layerPaths.routes,
        "styles": config.layerPaths.styles,
        "testSetup": config.layerPaths.testSetup
      },
      "constraints": {
        "pureDomainDecoupling": {
          "enabled": config.constraints.pureDomainDecoupling,
          "path": config.layerPaths.domainLayer,
          "rule": "This layer must remain pure business/domain logic (no UI, framework, or DOM dependencies).",
          "_note": "Set enabled:false if your project has no separate domain layer boundary."
        },
        "hiddenInformation": {
          "enabled": config.constraints.hiddenInformation,
          "paths": [],
          "rule": "Hidden or private state must never leak to public/external views during active use.",
          "_note": "Optional. Relevant for hidden-state games, private credentials, or role-based security boundaries."
        },
        "aiFairness": {
          "enabled": config.constraints.aiFairness,
          "rule": "AI/automated agents must derive decisions only from public/belief inputs, never direct reads of hidden state.",
          "_note": "Optional. Relevant for AI opponents or simulation logic."
        },
        "styling": {
          "enabled": config.constraints.styling,
          "rule": `Use semantic tokens/theme definitions defined in ${config.layerPaths.styles}; avoid unvetted arbitrary hardcoded styles.`,
          "allowedTokens": [],
          "prohibited": "arbitrary inline values or hardcoded raw hex styling",
          "_note": "Fill allowedTokens with semantic tokens if applicable."
        },
        "gitHistory": {
          "rule": "Never force-push or rebase published commits without explicit permission."
        },
        "additionalConstraints": [
          "Preserve project invariants, type safety, and test coverage before declaring tasks complete."
        ]
      },
      "commands": {
        "test": config.commands.test,
        "testDomain": config.commands.testDomain,
        "testPresentation": config.commands.testPresentation,
        "typecheck": config.commands.typecheck,
        "lint": config.commands.lint,
        "format": config.commands.format,
        "build": config.commands.build,
        "dev": config.commands.dev,
        "preview": config.commands.preview
      },
      "verificationGates": {
        "afterDomainLayerChange": ["testDomain", "typecheck"],
        "afterPresentationChange": ["format", "lint", "typecheck"],
        "beforeRelease": ["test", "typecheck", "build"]
      }
    },
    "memoryBank": {
      "path": "memory-bank/",
      "files": [
        "projectbrief.md",
        "productContext.md",
        "systemPatterns.md",
        "techContext.md",
        "activeContext.md",
        "progress.md"
      ],
      "triggerPhrases": {
        "read": "follow your custom instructions",
        "fullUpdate": "update memory bank"
      },
      "note": "Standard Cline Memory Bank pattern. activeContext.md and progress.md are volatile; update regularly."
    },
    "rulesIndex": {
      "alwaysOn": [
        ".cline/rules/00-agent-spec.md",
        ".cline/rules/05-memory-bank.md",
        ".cline/rules/10-anti-hallucination.md",
        ".cline/rules/50-project-facts.md"
      ],
      "toggleOneAtATime": {
        "brainstorm": ".cline/rules/20-mode-brainstorm.md",
        "document": ".cline/rules/20-mode-document.md",
        "code": ".cline/rules/20-mode-code.md",
        "weeklyReview": ".cline/rules/20-mode-weekly-review.md"
      },
      "note": "Enable exactly one mode file at a time alongside the always-on baseline."
    },
    "workflows": [
      ".cline/workflows/run-tests.md",
      ".cline/workflows/build-and-preview.md",
      ".cline/workflows/domain-layer.md",
      ".cline/workflows/presentation-layer.md"
    ]
  };
}
