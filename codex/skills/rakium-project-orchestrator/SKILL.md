---
name: rakium-project-orchestrator
description: End-to-end Rakium project orchestrator for creating new Angular projects from zero in C:\Users\Adrii\Documents\Web, using the latest stable Angular verified at runtime, high-quality responsive UI, optional motion/animation, optional shared rakium-be backend integration, GitHub repo creation/push, Docker/Dokploy-ready deployment, and Playwright end-to-end QA. Use when Adrian asks to create, scaffold, publish, deploy, QA, connect to backend, or launch a new web project/site/app/client project from this local workspace.
---

# Rakium Project Orchestrator

## Goal

Create production-ready Angular projects end to end: modern Angular, strong design, SSR when useful, GitHub publishing, deploy readiness, and Playwright validation. Prefer doing the work, not only proposing it.

Default workspace: `C:\Users\Adrii\Documents\Web`.
Shared backend when needed: `C:\Users\Adrii\Documents\Web\rakium-be`.

## Trigger Prompts

Use this skill for requests like:

- "crea un proyecto nuevo"
- "crear web para cliente"
- "nuevo proyecto Angular y subilo a GitHub"
- "deploy en Dokploy"
- "hacer todo end to end con Playwright"
- "usa el agente/orquestador de proyectos Rakium"

## Operating Rules

1. Verify the current state before deciding.
   Run `scripts/check-rakium-prereqs.ps1` from this skill if available.
2. Use the latest stable Angular at execution time.
   Check with `npm view @angular/core version` and use `npx @angular/cli@latest` unless the user explicitly asks for a pinned version.
3. Prefer Angular SSR for public websites that need SEO, share previews, or fast first paint.
4. Use a real visual direction, not a generic landing page.
   Ask for missing brand basics only if they are impossible to infer. Otherwise make tasteful assumptions and document them.
5. Add motion only where it improves the experience.
   Prefer CSS transitions, Angular animations, or a focused motion library when justified by the UI.
6. Add Playwright end-to-end tests before calling the project done.
7. Publish to GitHub with `gh` when authenticated.
   If auth is missing, stop at local git init and tell the user the exact missing auth step.
8. Deploy or prepare deploy based on available access.
   If Dokploy API/CLI credentials are unavailable, create Docker/Dokploy files and give the exact manual action needed. Do not pretend a deploy happened.
9. Keep existing projects untouched unless the user explicitly asks to reuse or modify one.

## Workflow

### 1. Intake

Collect or infer:

- project slug, brand/name, domain if known
- business/person/product type
- pages/sections needed
- language and audience
- deploy target, defaulting to Dokploy-style Docker deployment when unspecified
- whether this client needs backend/admin/editable content/auth/uploads; default to no backend for simple public sites

If the user gave only a name, create a polished one-page or multi-section website with sensible defaults.

Backend rule: do not create a new backend by default. If the client needs backend features, connect the frontend to the shared `rakium-be` and read `references/rakium-backend.md`.

### 2. Prerequisites

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Adrii\.codex\skills\rakium-project-orchestrator\scripts\check-rakium-prereqs.ps1"
```

Then inspect:

```powershell
gh auth status
npm view @angular/core version
npm view @angular/cli version
```

Use the results in the implementation summary.

### 3. Create Project

From `C:\Users\Adrii\Documents\Web`, create the project with the latest Angular CLI:

```powershell
npx -y @angular/cli@latest new <slug> --routing --style=scss --ssr --skip-git=false
```

If the latest CLI changes flags, run `npx -y @angular/cli@latest new --help` and adapt.

Preferred factory script:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Adrii\.codex\skills\rakium-project-orchestrator\scripts\new-rakium-project.ps1" -Slug "<slug>" -Name "<Brand Name>"
```

The script creates the Angular project, installs Playwright, adds Docker/Dokploy files, writes starter E2E tests, and creates production checklists. Read and adapt generated files before final delivery.

For projects that should connect to `rakium-be`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Adrii\.codex\skills\rakium-project-orchestrator\scripts\new-rakium-project.ps1" -Slug "<slug>" -Name "<Brand Name>" -UseRakiumBackend -ClientId "<client-id-if-known>"
```

Recommended additions:

```powershell
cd <slug>
npm install lucide-angular
npm install -D @playwright/test
npx playwright install chromium
```

Use Tailwind, PrimeNG, Angular Material, or another UI library only when it helps the requested product. Do not add a heavy dependency for a simple static site.

### 4. Build The Product

Use the existing Angular app structure unless the project needs a different layout.

Minimum expected result:

- responsive desktop/tablet/mobile UI
- semantic content and complete SEO/social metadata
- accessible navigation and focus states
- no placeholder lorem ipsum
- optimized images/assets
- favicon, apple touch icon, Open Graph/Twitter preview image, `robots.txt`, and `sitemap.xml`
- production build succeeds
- Dockerfile and deploy notes if deploying to Dokploy

For design standards, read `references/design-standards.md` only when implementing the UI.

If backend is needed, create a thin frontend API layer rather than hard-coding fetch calls in components. Use environment-based `apiUrl`, local default `http://localhost:3000/api`, and production default from `rakium-be` deployment unless the user gives a different URL.

### 5. GitHub

Use the authenticated account unless the user specifies an org:

```powershell
git status
git add .
git commit -m "Initial Angular project"
gh repo create <repo-name> --private --source . --remote origin --push
```

Use `--public` only if the user asks for a public repo. If the repo already exists, connect the remote and push a branch instead of overwriting history.

### 6. Deploy

Default deploy target is Docker/Dokploy.

Create or verify:

- `Dockerfile`
- `.dockerignore`
- `DOKPLOY.md`
- internal port `4000`
- `PORT=4000`
- SSR start command points at `dist/<slug>/server/server.mjs`
- domain configuration uses HTTPS enabled with certificate provider `Let's Encrypt` whenever a public domain is configured
- domain path `/`, internal path `/`, and container port `4000` unless the app explicitly uses a different route/port

Read `references/deploy-dokploy.md` before editing deployment files.
Read `references/dokploy-automation.md` when trying to deploy automatically.

If a working Dokploy API/CLI/session is available, deploy, configure the public domain with HTTPS + `Let's Encrypt`, and verify the live HTTPS URL. If not, make the repo deploy-ready and state the missing access.

### 7. Playwright E2E

Create Playwright config and tests that cover:

- homepage renders without console errors
- primary navigation works
- important CTA links are valid
- responsive smoke checks at mobile and desktop widths
- deploy/live URL smoke test when a URL exists
- backend health/API smoke test when the project uses `rakium-be`

Run:

```powershell
npm run build
npx playwright test
```

If Angular SSR build creates a server, run it locally and point Playwright at the local server.

Before final delivery, read `references/production-checklist.md` and satisfy every applicable item.
Read `references/seo-metadata.md` whenever creating or updating a public website.

### 8. Final Response

Return:

- project path
- GitHub URL
- deploy URL or deploy-ready status
- tests run and result
- any credentials/access still needed

Keep it concise and concrete.

## Optional Subagents

When the user explicitly asks for agents or parallel work, use these roles:

- Design/UI worker: owns Angular components, styling, responsive layout, motion.
- GitHub/Deploy worker: owns GitHub repo, Dockerfile, Dokploy notes/deploy.
- QA worker: owns Playwright config, e2e tests, console/error checks.
- Backend integration worker: owns `rakium-be` discovery, endpoint mapping, env config, API services, CORS/auth assumptions, and backend smoke tests.

Tell workers they are not alone in the codebase and must not revert others' edits.
