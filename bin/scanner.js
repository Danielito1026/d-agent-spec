import fs from 'node:fs';
import path from 'node:path';
import {
  detectDotnet, detectDart, detectPhp, detectPython,
  detectRust, detectGo, detectJava, detectNode
} from './scanner-detectors.js';

function defaultResult(targetDir) {
  return {
    projectName: path.basename(targetDir),
    description: 'A modern software project.',
    platform: 'cross-platform',
    framework: 'Custom / Polyglot',
    bundler: 'N/A',
    styling: 'N/A',
    testing: 'Custom Test Suite',
    packageManager: 'custom',
    layerPaths: {
      domainLayer: 'src/domain',
      presentationLayer: 'src/ui',
      routes: 'src/routes',
      styles: 'src/styles',
      testSetup: 'tests/setup'
    },
    constraints: {
      pureDomainDecoupling: true,
      hiddenInformation: false,
      aiFairness: false,
      styling: true
    },
    commands: {
      test: 'npm test',
      testDomain: 'npm test -- domain',
      testPresentation: 'npm test -- ui',
      typecheck: 'npm run typecheck',
      lint: 'npm run lint',
      format: 'npm run format',
      build: 'npm run build',
      dev: 'npm run dev',
      preview: 'npm run preview'
    }
  };
}

export function scanProject(targetDir) {
  const result = defaultResult(targetDir);
  if (!fs.existsSync(targetDir)) return result;
  
  const filesInTarget = fs.readdirSync(targetDir);

  if (detectDotnet(filesInTarget, result)) return result;
  if (detectDart(filesInTarget, result)) return result;
  if (detectPhp(filesInTarget, result)) return result;
  if (detectPython(filesInTarget, result)) return result;
  if (detectRust(filesInTarget, result)) return result;
  if (detectGo(filesInTarget, result)) return result;
  if (detectJava(filesInTarget, result)) return result;
  if (detectNode(targetDir, filesInTarget, result)) return result;

  return result;
}


