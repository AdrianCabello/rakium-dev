param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')]
  [string]$Slug,

  [Parameter(Mandatory = $false)]
  [string]$Name,

  [Parameter(Mandatory = $false)]
  [string]$Workspace = "C:\Users\Adrii\Documents\Web",

  [switch]$UseRakiumBackend,
  [string]$ClientId,
  [string]$ApiUrl = "http://localhost:3000/api",
  [string]$ProductionApiUrl = "https://rakium-be-production.up.railway.app/api",
  [string]$Domain,
  [string]$Description,

  [switch]$SkipInstall,
  [switch]$SkipGitHub
)

$ErrorActionPreference = "Stop"

if (-not $Name) {
  $Name = ($Slug -split '-' | ForEach-Object {
    if ($_.Length -eq 0) { $_ } else { $_.Substring(0,1).ToUpperInvariant() + $_.Substring(1) }
  }) -join ' '
}

if (-not $Domain) {
  $Domain = "$Slug.com"
}

if (-not $Description) {
  $Description = "$Name - sitio web profesional desarrollado por Rakium."
}

$SiteUrl = "https://$Domain/"

$ProjectPath = Join-Path $Workspace $Slug
if (Test-Path $ProjectPath) {
  throw "Project path already exists: $ProjectPath"
}

New-Item -ItemType Directory -Force -Path $Workspace | Out-Null
Set-Location $Workspace

Write-Output "Creating Angular project '$Slug' in $Workspace"
npx -y @angular/cli@latest new $Slug --routing --style=scss --ssr --skip-git=false --package-manager npm

Set-Location $ProjectPath

if (-not $SkipInstall) {
  Write-Output "Installing baseline dependencies"
  npm install lucide-angular
  npm install -D @playwright/test
  npx playwright install chromium
}

$dockerfile = @"
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=builder /app/dist/$Slug ./dist/$Slug
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node", "dist/$Slug/server/server.mjs"]
"@
Set-Content -Path (Join-Path $ProjectPath "Dockerfile") -Value $dockerfile -Encoding UTF8

$dockerignore = @"
node_modules
dist
.angular
.git
.github
playwright-report
test-results
*.log
.env
"@
Set-Content -Path (Join-Path $ProjectPath ".dockerignore") -Value $dockerignore -Encoding UTF8

$dokploy = @"
# Dokploy

Proyecto Angular con SSR servido por Node/Express.

## App

- Tipo: Dockerfile
- Dockerfile: Dockerfile
- Puerto interno: 4000
- Variable recomendada: PORT=4000
- Health check: `/`
- Dominio: HTTPS activo con Let's Encrypt

## Build local

```bash
npm ci
npm run build
node dist/$Slug/server/server.mjs
```

## DNS

Cuando el dominio este definido, apuntar el registro `A` o `CNAME` al servidor de Dokploy y agregar el dominio en la app con:

- Path: `/`
- Internal path: `/`
- Container port: `4000`
- HTTPS: activo
- Certificate provider: Let's Encrypt
"@
Set-Content -Path (Join-Path $ProjectPath "DOKPLOY.md") -Value $dokploy -Encoding UTF8

$playwrightConfig = @"
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm start -- --host 127.0.0.1 --port 4200',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
"@
Set-Content -Path (Join-Path $ProjectPath "playwright.config.ts") -Value $playwrightConfig -Encoding UTF8

New-Item -ItemType Directory -Force -Path (Join-Path $ProjectPath "e2e") | Out-Null
$e2e = @"
import { expect, test } from '@playwright/test';

test('homepage renders without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveTitle(/.+/);
  expect(errors).toEqual([]);
});

test('primary content is visible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
"@
Set-Content -Path (Join-Path $ProjectPath "e2e\home.spec.ts") -Value $e2e -Encoding UTF8

$checklist = @"
# Production Checklist

- [ ] npm run build succeeds.
- [ ] Playwright E2E passes.
- [ ] Mobile viewport checked at 375px.
- [ ] Desktop viewport checked at 1440px.
- [ ] No console errors on primary path.
- [ ] Metadata is project-specific.
- [ ] Contact/social links are real or marked pending.
- [ ] Dockerfile builds successfully.
- [ ] Dokploy app uses port 4000 and PORT=4000.
- [ ] Dokploy domain uses HTTPS with Let's Encrypt.
- [ ] Live URL smoke test passes after deploy.
"@
Set-Content -Path (Join-Path $ProjectPath "PRODUCTION_CHECKLIST.md") -Value $checklist -Encoding UTF8

$packageJsonPath = Join-Path $ProjectPath "package.json"
$package = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
$package.scripts | Add-Member -MemberType NoteProperty -Name "e2e" -Value "playwright test" -Force
$package.scripts | Add-Member -MemberType NoteProperty -Name "e2e:ui" -Value "playwright test --ui" -Force
$package | ConvertTo-Json -Depth 20 | Set-Content -Path $packageJsonPath -Encoding UTF8

$indexHtml = @"
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>$Name</title>
    <meta name="description" content="$Description">
    <meta name="keywords" content="$Name, sitio web profesional, servicios, contacto, Rakium">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="author" content="$Name">
    <meta name="theme-color" content="#1A3A5C">
    <meta name="color-scheme" content="light">
    <meta name="format-detection" content="telephone=no">
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="canonical" href="$SiteUrl">
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="alternate icon" type="image/x-icon" href="favicon.ico">
    <link rel="apple-touch-icon" href="apple-touch-icon.svg">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_AR">
    <meta property="og:site_name" content="$Name">
    <meta property="og:title" content="$Name">
    <meta property="og:description" content="$Description">
    <meta property="og:url" content="$SiteUrl">
    <meta property="og:image" content="${SiteUrl}og-image.svg">
    <meta property="og:image:alt" content="$Name">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="$Name">
    <meta name="twitter:description" content="$Description">
    <meta name="twitter:image" content="${SiteUrl}og-image.svg">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "$Name",
        "description": "$Description",
        "url": "$SiteUrl",
        "areaServed": "Argentina",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Atención al cliente",
          "availableLanguage": "Español"
        }
      }
    </script>
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
"@
Set-Content -Path (Join-Path $ProjectPath "src\index.html") -Value $indexHtml -Encoding UTF8

$faviconSvg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="$Name">
  <rect width="64" height="64" rx="14" fill="#1A3A5C"/>
  <path d="M32 10 47 16v13c0 11.5-6.1 20-15 25-8.9-5-15-13.5-15-25V16l15-6Z" fill="#0C447C" stroke="#B5D4F4" stroke-width="4" stroke-linejoin="round"/>
  <path d="M32 19.8 38.3 22.3v6.2c0 4.8-2.2 8.9-6.3 12.1-4.1-3.2-6.3-7.3-6.3-12.1v-6.2L32 19.8Z" fill="#E8A020"/>
</svg>
"@
Set-Content -Path (Join-Path $ProjectPath "public\favicon.svg") -Value $faviconSvg -Encoding UTF8
Set-Content -Path (Join-Path $ProjectPath "public\apple-touch-icon.svg") -Value $faviconSvg -Encoding UTF8

$ogImage = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="$Name">
  <rect width="1200" height="630" fill="#1A3A5C"/>
  <circle cx="1020" cy="100" r="230" fill="#2C7EBB" opacity="0.28"/>
  <circle cx="1060" cy="550" r="180" fill="#E8A020" opacity="0.18"/>
  <text x="80" y="230" fill="#FFFFFF" font-family="Montserrat, Arial, sans-serif" font-size="72" font-weight="900">$Name</text>
  <text x="84" y="320" fill="#B5D4F4" font-family="Open Sans, Arial, sans-serif" font-size="32" font-weight="600">$Description</text>
</svg>
"@
Set-Content -Path (Join-Path $ProjectPath "public\og-image.svg") -Value $ogImage -Encoding UTF8

$robots = @"
User-agent: *
Allow: /

Sitemap: ${SiteUrl}sitemap.xml
"@
Set-Content -Path (Join-Path $ProjectPath "public\robots.txt") -Value $robots -Encoding UTF8

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>$SiteUrl</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
"@
Set-Content -Path (Join-Path $ProjectPath "public\sitemap.xml") -Value $sitemap -Encoding UTF8

if ($UseRakiumBackend) {
  Write-Output "Adding optional rakium-be integration"

  $backendPath = Join-Path $Workspace "rakium-be"
  if (-not (Test-Path $backendPath)) {
    Write-Output "Warning: rakium-be was not found at $backendPath. Frontend config will still be generated."
  }

  $envDir = Join-Path $ProjectPath "src\environments"
  New-Item -ItemType Directory -Force -Path $envDir | Out-Null

  $clientValue = if ($ClientId) { "'$ClientId'" } else { "null" }
  $environment = @"
export const environment = {
  production: false,
  apiUrl: '$ApiUrl',
  rakiumClientId: $clientValue,
};
"@
  Set-Content -Path (Join-Path $envDir "environment.ts") -Value $environment -Encoding UTF8

  $environmentProd = @"
export const environment = {
  production: true,
  apiUrl: '$ProductionApiUrl',
  rakiumClientId: $clientValue,
};
"@
  Set-Content -Path (Join-Path $envDir "environment.prod.ts") -Value $environmentProd -Encoding UTF8

  $coreDir = Join-Path $ProjectPath "src\app\core"
  New-Item -ItemType Directory -Force -Path $coreDir | Out-Null

  $apiService = @'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

type QueryValue = string | number | boolean | null | undefined;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  get<T>(path: string, params?: Record<string, QueryValue>) {
    return this.http.get<T>(this.url(path), { params: this.params(params) });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(this.url(path), body);
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<T>(this.url(path), body);
  }

  delete<T>(path: string) {
    return this.http.delete<T>(this.url(path));
  }

  private url(path: string) {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }

  private params(params?: Record<string, QueryValue>) {
    let httpParams = new HttpParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }
}
'@
  Set-Content -Path (Join-Path $coreDir "api.service.ts") -Value $apiService -Encoding UTF8

  $appConfigPath = Join-Path $ProjectPath "src\app\app.config.ts"
  if (Test-Path $appConfigPath) {
    $appConfig = Get-Content $appConfigPath -Raw
    if ($appConfig -notmatch "@angular/common/http") {
      $appConfig = "import { provideHttpClient, withFetch } from '@angular/common/http';`r`n" + $appConfig
    }
    if ($appConfig -notmatch "provideHttpClient") {
      $appConfig = $appConfig -replace "providers:\s*\[", "providers: [provideHttpClient(withFetch()), "
    } elseif ($appConfig -notmatch "provideHttpClient\(withFetch\(\)\)") {
      $appConfig = $appConfig -replace "providers:\s*\[", "providers: [provideHttpClient(withFetch()), "
    }
    Set-Content -Path $appConfigPath -Value $appConfig -Encoding UTF8
  } else {
    Write-Output "Warning: app.config.ts not found. Add provideHttpClient(withFetch()) manually."
  }

  $backendSpec = @"
import { expect, test } from '@playwright/test';

const apiUrl = process.env.RAKIUM_API_URL;

test('rakium-be API responds when configured', async ({ request }) => {
  test.skip(!apiUrl, 'Set RAKIUM_API_URL to run backend smoke test');

  const response = await request.get(apiUrl!);
  expect(response.status()).toBeLessThan(500);
});
"@
  Set-Content -Path (Join-Path $ProjectPath "e2e\backend.spec.ts") -Value $backendSpec -Encoding UTF8

  $backendDoc = @"
# Rakium Backend Integration

This project is configured to connect to the shared Rakium backend when needed.

## Paths

- Backend repo: $backendPath
- Local API: $ApiUrl
- Production API: $ProductionApiUrl

## Client

- rakiumClientId: $(if ($ClientId) { $ClientId } else { "pending" })

## Local Backend

~~~powershell
cd $backendPath
npm run start:dev
~~~

Swagger/OpenAPI is available at:

~~~text
http://localhost:3000/api
~~~

## Frontend

- Environment config: src/environments/environment.ts
- API wrapper: src/app/core/api.service.ts
- Backend smoke test: e2e/backend.spec.ts

Run backend smoke test with:

~~~powershell
`$env:RAKIUM_API_URL="$ApiUrl"; npm run e2e
~~~
"@
  Set-Content -Path (Join-Path $ProjectPath "BACKEND_INTEGRATION.md") -Value $backendDoc -Encoding UTF8
}

if (-not $SkipGitHub) {
  $gh = Get-Command gh -ErrorAction SilentlyContinue
  if ($gh) {
    $auth = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
      git status --short
      git add .
      git commit -m "Initial Angular project"
      gh repo create $Slug --private --source . --remote origin --push
    } else {
      Write-Output "GitHub CLI is installed but not authenticated. Skipping repo creation."
      Write-Output $auth
    }
  } else {
    Write-Output "GitHub CLI not found. Skipping repo creation."
  }
}

Write-Output "Project created: $ProjectPath"
Write-Output "Next: customize UI/content, run npm run build, then npm run e2e."
