import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const TEST_SANDBOX = path.resolve('temp-test-sandbox');

function setupSandbox() {
  if (fs.existsSync(TEST_SANDBOX)) {
    fs.rmSync(TEST_SANDBOX, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_SANDBOX, { recursive: true });
}

function cleanupSandbox() {
  if (fs.existsSync(TEST_SANDBOX)) {
    fs.rmSync(TEST_SANDBOX, { recursive: true, force: true });
  }
}

console.log('🧪 Starting Multi-Stack CLI Test Suite...');

try {
  setupSandbox();

  // Test 1: Rust Project Detection
  const rustDir = path.join(TEST_SANDBOX, 'my-rust-app');
  fs.mkdirSync(rustDir, { recursive: true });
  fs.writeFileSync(path.join(rustDir, 'Cargo.toml'), '[package]\nname = "my-rust-app"\nversion = "0.1.0"\n');

  console.log('Testing Rust adoption...');
  execSync(`node bin/cli.js "${rustDir}" --yes`, { stdio: 'pipe' });
  assert(fs.existsSync(path.join(rustDir, '.cline', 'agent-spec.json')), 'Rust .cline/agent-spec.json must exist');
  
  const rustSpec = JSON.parse(fs.readFileSync(path.join(rustDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(rustSpec.projectConfig.targetEnvironment.framework, 'Rust');
  assert.strictEqual(rustSpec.projectConfig.commands.test, 'cargo test');

  // Test 2: Python / FastAPI Project Detection
  const pyDir = path.join(TEST_SANDBOX, 'my-fastapi-app');
  fs.mkdirSync(pyDir, { recursive: true });
  fs.writeFileSync(path.join(pyDir, 'requirements.txt'), 'fastapi\nuvicorn\npytest\n');
  fs.writeFileSync(path.join(pyDir, 'main.py'), '# FastAPI app\n');

  console.log('Testing Python/FastAPI adoption...');
  execSync(`node bin/cli.js "${pyDir}" --yes`, { stdio: 'pipe' });
  assert(fs.existsSync(path.join(pyDir, '.cline', 'agent-spec.json')), 'Python .cline/agent-spec.json must exist');
  
  const pySpec = JSON.parse(fs.readFileSync(path.join(pyDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(pySpec.projectConfig.targetEnvironment.framework, 'FastAPI / Python');
  assert.strictEqual(pySpec.projectConfig.commands.test, 'pytest');

  // Test 3: C# / .NET Project Detection
  const dotnetDir = path.join(TEST_SANDBOX, 'MyDotnetApp');
  fs.mkdirSync(dotnetDir, { recursive: true });
  fs.writeFileSync(path.join(dotnetDir, 'MyDotnetApp.csproj'), '<Project Sdk="Microsoft.NET.Sdk">\n</Project>');

  console.log('Testing .NET adoption...');
  execSync(`node bin/cli.js "${dotnetDir}" --yes`, { stdio: 'pipe' });
  assert(fs.existsSync(path.join(dotnetDir, '.cline', 'agent-spec.json')), '.NET .cline/agent-spec.json must exist');
  
  const dotnetSpec = JSON.parse(fs.readFileSync(path.join(dotnetDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(dotnetSpec.projectConfig.targetEnvironment.framework, '.NET 8 / C#');
  assert.strictEqual(dotnetSpec.projectConfig.commands.test, 'dotnet test');

  // Test 4: Flutter / Dart Project Detection
  const dartDir = path.join(TEST_SANDBOX, 'my_flutter_app');
  fs.mkdirSync(dartDir, { recursive: true });
  fs.writeFileSync(path.join(dartDir, 'pubspec.yaml'), 'name: my_flutter_app\ndescription: A new Flutter project.\n');

  console.log('Testing Flutter/Dart adoption...');
  // Test 5: PHP / Laravel
  const phpDir = path.join(TEST_SANDBOX, 'my_laravel_app');
  fs.mkdirSync(phpDir, { recursive: true });
  fs.writeFileSync(path.join(phpDir, 'composer.json'), '{"name": "laravel/laravel"}');
  fs.writeFileSync(path.join(phpDir, 'artisan'), '#!/usr/bin/env php\n');

  console.log('Testing PHP/Laravel adoption...');
  execSync(`node bin/cli.js "${phpDir}" --yes`, { stdio: 'pipe' });
  const phpSpec = JSON.parse(fs.readFileSync(path.join(phpDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(phpSpec.projectConfig.targetEnvironment.framework, 'PHP (Laravel)');
  assert.strictEqual(phpSpec.projectConfig.commands.test, 'php artisan test');

  // Test 6: Go Project Detection
  const goDir = path.join(TEST_SANDBOX, 'my-go-service');
  fs.mkdirSync(goDir, { recursive: true });
  fs.writeFileSync(path.join(goDir, 'go.mod'), 'module github.com/user/my-go-service\n\ngo 1.22\n');

  console.log('Testing Go adoption...');
  execSync(`node bin/cli.js "${goDir}" --yes`, { stdio: 'pipe' });
  const goSpec = JSON.parse(fs.readFileSync(path.join(goDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(goSpec.projectConfig.targetEnvironment.framework, 'Go');
  assert.strictEqual(goSpec.projectConfig.commands.test, 'go test ./...');

  // Test 7: Java / Gradle Project Detection
  const javaDir = path.join(TEST_SANDBOX, 'my-spring-app');
  fs.mkdirSync(javaDir, { recursive: true });
  fs.writeFileSync(path.join(javaDir, 'build.gradle'), 'plugins { id "org.springframework.boot" }\n');

  console.log('Testing Java/Gradle adoption...');
  execSync(`node bin/cli.js "${javaDir}" --yes`, { stdio: 'pipe' });
  const javaSpec = JSON.parse(fs.readFileSync(path.join(javaDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(javaSpec.projectConfig.targetEnvironment.framework, 'Spring Boot / Java');
  assert.strictEqual(javaSpec.projectConfig.commands.test, './gradlew test');

  // Test 8: Next.js + React Detection
  const nextDir = path.join(TEST_SANDBOX, 'my-nextjs-app');
  fs.mkdirSync(nextDir, { recursive: true });
  fs.writeFileSync(path.join(nextDir, 'package.json'), JSON.stringify({
    name: 'my-nextjs-app',
    dependencies: { next: '^14.0.0', react: '^18.2.0', tailwindcss: '^3.4.0' },
    devDependencies: { vitest: '^1.0.0' }
  }));

  console.log('Testing Next.js adoption...');
  execSync(`node bin/cli.js "${nextDir}" --yes`, { stdio: 'pipe' });
  const nextSpec = JSON.parse(fs.readFileSync(path.join(nextDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(nextSpec.projectConfig.targetEnvironment.framework, 'Next.js + React');
  assert.strictEqual(nextSpec.projectConfig.targetEnvironment.styling, 'Tailwind CSS');
  assert.strictEqual(nextSpec.projectConfig.layerPaths.routes, 'src/app');

  execSync(`node bin/cli.js "${dartDir}" --yes`, { stdio: 'pipe' });
  assert(fs.existsSync(path.join(dartDir, '.cline', 'agent-spec.json')), 'Flutter .cline/agent-spec.json must exist');
  
  const dartSpec = JSON.parse(fs.readFileSync(path.join(dartDir, '.cline', 'agent-spec.json'), 'utf8'));
  assert.strictEqual(dartSpec.projectConfig.targetEnvironment.framework, 'Flutter / Dart');
  assert.strictEqual(dartSpec.projectConfig.commands.test, 'flutter test');

  // Test 5: Verify Template Placeholder Replacement
  const factsMd = fs.readFileSync(path.join(rustDir, '.cline', 'rules', '50-project-facts.md'), 'utf8');
  assert(!factsMd.includes('{{DOMAIN_LAYER_PATH}}'), 'Placeholders like {{DOMAIN_LAYER_PATH}} must be replaced');
  assert(factsMd.includes('src/domain'), 'Replaced path must appear in 50-project-facts.md');

  console.log('✅ All CLI multi-stack tests passed successfully!');
} finally {
  cleanupSandbox();
}
