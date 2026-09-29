import fs from 'node:fs';
import path from 'node:path';

export function detectDotnet(filesInTarget, result) {
  const csprojFile = filesInTarget.find(f => f.endsWith('.csproj'));
  const slnFile = filesInTarget.find(f => f.endsWith('.sln'));
  if (!csprojFile && !slnFile) return false;
  result.projectName = csprojFile ? path.basename(csprojFile, '.csproj') : path.basename(slnFile, '.sln');
  result.framework = '.NET 8 / C#';
  result.bundler = 'MSBuild / .NET CLI';
  result.styling = 'N/A (Backend / Blazor / WPF)';
  result.testing = 'xUnit / NUnit (dotnet test)';
  result.packageManager = 'dotnet / nuget';
  result.layerPaths = { domainLayer: 'src/Domain', presentationLayer: 'src/Presentation', routes: 'src/Controllers', styles: 'N/A', testSetup: 'tests/TestSetup.cs' };
  result.constraints.styling = false;
  result.commands = {
    test: 'dotnet test', testDomain: 'dotnet test --filter Category=Domain',
    testPresentation: 'dotnet test --filter Category=Presentation',
    typecheck: 'dotnet build --no-incremental', lint: 'dotnet format --verify-no-changes',
    format: 'dotnet format', build: 'dotnet build -c Release',
    dev: 'dotnet watch run', preview: 'dotnet run -c Release'
  };
  return true;
}

export function detectDart(filesInTarget, result) {
  if (!filesInTarget.includes('pubspec.yaml')) return false;
  result.framework = 'Flutter / Dart';
  result.bundler = 'Flutter Build Tools';
  result.styling = 'Flutter ThemeData (Material / Cupertino)';
  result.testing = 'flutter test';
  result.packageManager = 'flutter pub';
  result.layerPaths = { domainLayer: 'lib/core', presentationLayer: 'lib/features', routes: 'lib/routes', styles: 'lib/theme/app_theme.dart', testSetup: 'test/test_helper.dart' };
  result.commands = {
    test: 'flutter test', testDomain: 'flutter test test/core',
    testPresentation: 'flutter test test/features', typecheck: 'flutter analyze',
    lint: 'dart analyze', format: 'dart format .',
    build: 'flutter build appbundle', dev: 'flutter run', preview: 'flutter run --release'
  };
  return true;
}

export function detectPhp(filesInTarget, result) {
  if (!filesInTarget.includes('composer.json')) return false;
  const isLaravel = filesInTarget.includes('artisan');
  const isSymfony = filesInTarget.includes('symfony.lock');
  result.framework = isLaravel ? 'PHP (Laravel)' : (isSymfony ? 'PHP (Symfony)' : 'PHP');
  result.bundler = (isLaravel && filesInTarget.includes('vite.config.js')) ? 'Vite' : 'Composer';
  result.styling = isLaravel ? 'Tailwind CSS / Blade' : 'CSS / Twig';
  result.testing = isLaravel ? 'php artisan test' : 'vendor/bin/pest';
  result.packageManager = 'composer';
  result.layerPaths = { domainLayer: 'app/Domain', presentationLayer: 'app/Http/Controllers', routes: 'routes/web.php', styles: 'resources/css/app.css', testSetup: 'tests/TestCase.php' };
  result.commands = {
    test: isLaravel ? 'php artisan test' : 'vendor/bin/phpunit',
    testDomain: isLaravel ? 'php artisan test --filter=Domain' : 'vendor/bin/phpunit --filter=Domain',
    testPresentation: isLaravel ? 'php artisan test --filter=Feature' : 'vendor/bin/phpunit --filter=Feature',
    typecheck: 'vendor/bin/phpstan analyse', lint: 'vendor/bin/pint --test',
    format: 'vendor/bin/pint', build: 'composer install --no-dev --optimize-autoloader',
    dev: isLaravel ? 'php artisan serve' : 'php -S localhost:8000',
    preview: isLaravel ? 'php artisan serve --env=production' : 'php -S localhost:8000'
  };
  return true;
}
export function detectPython(filesInTarget, result) {
  if (!filesInTarget.includes('pyproject.toml') && !filesInTarget.includes('requirements.txt') && !filesInTarget.includes('Pipfile') && !filesInTarget.includes('manage.py')) return false;
  const isDjango = filesInTarget.includes('manage.py');
  const isFastAPI = filesInTarget.includes('main.py');
  result.framework = isDjango ? 'Django / Python' : (isFastAPI ? 'FastAPI / Python' : 'Python');
  result.bundler = 'N/A (Python Interpreter)';
  result.styling = 'N/A';
  result.testing = 'pytest';
  result.packageManager = filesInTarget.includes('pyproject.toml') ? 'poetry / uv' : 'pip';
  result.layerPaths = { domainLayer: 'src/domain', presentationLayer: isDjango ? 'app/views' : 'src/api', routes: isDjango ? 'app/urls.py' : 'src/routers', styles: 'N/A', testSetup: 'tests/conftest.py' };
  result.constraints.styling = false;
  result.commands = {
    test: 'pytest', testDomain: 'pytest tests/unit/domain',
    testPresentation: 'pytest tests/unit/api', typecheck: 'mypy src',
    lint: 'ruff check .', format: 'ruff format .',
    build: 'python -m build', dev: isDjango ? 'python manage.py runserver' : 'fastapi dev',
    preview: isDjango ? 'python manage.py runserver --settings=prod' : 'fastapi run'
  };
  return true;
}

export function detectRust(filesInTarget, result) {
  if (!filesInTarget.includes('Cargo.toml')) return false;
  result.framework = 'Rust';
  result.bundler = 'Cargo';
  result.styling = 'N/A';
  result.testing = 'cargo test';
  result.packageManager = 'cargo';
  result.layerPaths = { domainLayer: 'src/domain', presentationLayer: 'src/api', routes: 'src/routes.rs', styles: 'N/A', testSetup: 'tests/common/mod.rs' };
  result.constraints.styling = false;
  result.commands = {
    test: 'cargo test', testDomain: 'cargo test -- domain',
    testPresentation: 'cargo test -- api', typecheck: 'cargo check',
    lint: 'cargo clippy -- -D warnings', format: 'cargo fmt -- --check',
    build: 'cargo build --release', dev: 'cargo run', preview: 'cargo run --release'
  };
  return true;
}

export function detectGo(filesInTarget, result) {
  if (!filesInTarget.includes('go.mod')) return false;
  result.framework = 'Go';
  result.bundler = 'go build';
  result.styling = 'N/A';
  result.testing = 'go test ./...';
  result.packageManager = 'go mod';
  result.layerPaths = { domainLayer: 'internal/domain', presentationLayer: 'internal/api', routes: 'cmd/server/main.go', styles: 'N/A', testSetup: 'internal/testutil' };
  result.constraints.styling = false;
  result.commands = {
    test: 'go test ./...', testDomain: 'go test ./internal/domain/...',
    testPresentation: 'go test ./internal/api/...', typecheck: 'go vet ./...',
    lint: 'golangci-lint run', format: 'gofmt -w .',
    build: 'go build -o bin/app ./cmd/...', dev: 'go run ./cmd/server', preview: './bin/app'
  };
  return true;
}

export function detectJava(filesInTarget, result) {
  if (!filesInTarget.includes('pom.xml') && !filesInTarget.includes('build.gradle') && !filesInTarget.includes('build.gradle.kts')) return false;
  const isGradle = filesInTarget.includes('build.gradle') || filesInTarget.includes('build.gradle.kts');
  result.framework = 'Spring Boot / Java';
  result.bundler = isGradle ? 'Gradle' : 'Maven';
  result.styling = 'N/A';
  result.testing = isGradle ? './gradlew test' : 'mvn test';
  result.packageManager = isGradle ? 'gradle' : 'maven';
  result.layerPaths = { domainLayer: 'src/main/java/domain', presentationLayer: 'src/main/java/controller', routes: 'src/main/java/controller', styles: 'N/A', testSetup: 'src/test/java/TestConfig.java' };
  result.constraints.styling = false;
  result.commands = {
    test: isGradle ? './gradlew test' : 'mvn test',
    testDomain: isGradle ? './gradlew test --tests "*domain*"' : 'mvn test -Dtest=*Domain*',
    testPresentation: isGradle ? './gradlew test --tests "*controller*"' : 'mvn test -Dtest=*Controller*',
    typecheck: isGradle ? './gradlew compileJava' : 'mvn compile', lint: isGradle ? './gradlew check' : 'mvn checkstyle:check',
    format: isGradle ? './gradlew spotlessApply' : 'mvn spotless:apply', build: isGradle ? './gradlew build' : 'mvn package',
    dev: isGradle ? './gradlew bootRun' : 'mvn spring-boot:run', preview: 'java -jar target/app.jar'
  };
  return true;
}

export function detectNode(targetDir, filesInTarget, result) {
  if (!filesInTarget.includes('package.json')) return false;
  try {
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    result.projectName = pkg.name || result.projectName;
    result.description = pkg.description || result.description;
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const scripts = pkg.scripts || {};

    if (filesInTarget.includes('pnpm-lock.yaml')) result.packageManager = 'pnpm';
    else if (filesInTarget.includes('yarn.lock')) result.packageManager = 'yarn';
    else if (filesInTarget.includes('bun.lockb')) result.packageManager = 'bun';
    else result.packageManager = 'npm';

    if (deps['next']) result.framework = 'Next.js + React';
    else if (deps['@remix-run/react']) result.framework = 'Remix + React';
    else if (deps['react']) result.framework = 'React 18 / 19';
    else if (deps['vue']) result.framework = 'Vue 3';
    else if (deps['svelte'] || deps['@sveltejs/kit']) result.framework = 'SvelteKit / Svelte';
    else if (deps['@angular/core']) result.framework = 'Angular';
    else if (deps['@nestjs/core']) result.framework = 'NestJS';
    else if (deps['express']) result.framework = 'Express (Node.js)';
    else if (deps['fastify']) result.framework = 'Fastify (Node.js)';
    else result.framework = 'TypeScript / Node.js';

    if (deps['vite']) result.bundler = 'Vite';
    else if (deps['webpack']) result.bundler = 'Webpack';
    else if (deps['next']) result.bundler = 'Turbopack / Next';
    else result.bundler = 'tsc';

    if (deps['tailwindcss'] || deps['@tailwindcss/vite']) result.styling = 'Tailwind CSS';
    else if (deps['styled-components']) result.styling = 'Styled Components';
    else result.styling = 'CSS Modules / Standard CSS';

    if (deps['vitest']) result.testing = 'Vitest';
    else if (deps['jest']) result.testing = 'Jest';
    else if (deps['playwright'] || deps['@playwright/test']) result.testing = 'Playwright';
    else if (deps['mocha']) result.testing = 'Mocha';
    else result.testing = scripts.test ? 'npm test' : 'Vitest';

    result.layerPaths = {
      domainLayer: 'src/domain',
      presentationLayer: 'src/ui',
      routes: deps['next'] ? 'src/app' : 'src/routes',
      styles: deps['tailwindcss'] ? 'src/index.css' : 'src/styles/theme.ts',
      testSetup: deps['vitest'] ? 'vitest.setup.ts' : 'src/setupTests.ts'
    };

    const pmRun = result.packageManager === 'npm' ? 'npm run' : result.packageManager;
    result.commands = {
      test: scripts.test ? (result.packageManager === 'npm' ? 'npm test' : `${result.packageManager} test`) : 'node node_modules/.bin/vitest run',
      testDomain: scripts['test:domain'] ? `${pmRun} test:domain` : 'node node_modules/.bin/vitest run src/domain',
      testPresentation: scripts['test:ui'] ? `${pmRun} test:ui` : 'node node_modules/.bin/vitest run src/ui',
      typecheck: scripts.typecheck ? `${pmRun} typecheck` : (scripts['type-check'] ? `${pmRun} type-check` : 'node node_modules/.bin/tsc --noEmit'),
      lint: scripts.lint ? `${pmRun} lint` : 'node node_modules/.bin/eslint src',
      format: scripts.format ? `${pmRun} format` : 'node node_modules/.bin/prettier --write src',
      build: scripts.build ? `${pmRun} build` : 'node node_modules/.bin/vite build',
      dev: scripts.dev ? `${pmRun} dev` : (scripts.start ? `${pmRun} start` : 'node node_modules/.bin/vite'),
      preview: scripts.preview ? `${pmRun} preview` : 'node node_modules/.bin/vite preview'
    };
    return true;
  } catch {
    return false;
  }
}

