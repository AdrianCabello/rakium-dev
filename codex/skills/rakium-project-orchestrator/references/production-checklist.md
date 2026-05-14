# Production Checklist

Use this before calling a project done.

## Build

- `npm ci` or clean dependency install succeeds.
- `npm run build` succeeds.
- SSR server starts locally when SSR is enabled.
- No unused placeholder routes, copy, assets, or default Angular content remain.

## UI

- Mobile viewport works at 375px width.
- Desktop viewport works at 1440px width.
- Header/navigation does not overlap content.
- Buttons and CTAs fit text.
- Interactive states are visible: hover, focus, active/pressed where applicable.
- Motion is smooth and does not hide critical content.

## Content

- Page title and meta description are project-specific.
- Open Graph/Twitter metadata are present for public sites when practical.
- Favicon/app icons are project-specific or intentionally neutral.
- Canonical URL is correct or marked pending when the domain is unknown.
- JSON-LD structured data is present for businesses, people, products, organizations, or local services when applicable.
- `og:image`/Twitter image points to a real generated asset.
- Contact links, WhatsApp links, email links, and social links are real or clearly marked pending.
- No lorem ipsum or generic filler remains.

## Accessibility

- Main landmark exists.
- Images have useful alt text or empty alt when decorative.
- Form fields have labels.
- Keyboard navigation reaches primary controls.
- Color contrast is readable in normal and dark states if dark mode exists.

## SEO And Deploy

- `robots.txt` and `sitemap.xml` exist when the site has public routes.
- Canonical/domain values are correct if a domain is known.
- Dockerfile builds the same app name as `angular.json` and `package.json`.
- `DOKPLOY.md` includes port, env vars, health check, and DNS/SSL steps.
- Live URL smoke test passes after deploy.

## Optional Rakium Backend

- Backend is needed by the client; otherwise no backend code/config was added.
- Frontend uses `environment.apiUrl`, not hard-coded API URLs in components.
- Local API URL defaults to `http://localhost:3000/api`.
- Production API URL is confirmed with the user or discovered from existing Rakium config.
- `rakium-be` endpoints were checked before wiring UI.
- CORS/auth/upload requirements are documented if the client needs admin features.
- Backend smoke test passes when backend is running.

## Playwright

- Homepage render test passes.
- Navigation/CTA test passes.
- Mobile smoke test passes.
- Console error collection is enabled for the main user path.
- Live URL test is run when the deploy URL exists.
- API smoke test is included when backend integration exists.
