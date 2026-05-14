# SEO And Social Metadata Standard

Every public Rakium project should include the important metadata before handoff.

Default all human-readable metadata content to Spanish for Spanish-language client projects. Do not translate protocol keys such as `og:type`, `twitter:card`, `@context`, or schema.org property names.

## Required In `src/index.html`

- `<html lang="...">` matching the site language.
- Specific `<title>`.
- Specific meta description.
- Spanish keywords meta when useful for the market/category.
- `robots` meta.
- `author` when known.
- `theme-color`.
- `color-scheme`.
- responsive viewport.
- canonical URL when the domain is known; use a pending placeholder only during draft.
- SVG favicon and ICO fallback.
- apple touch icon.
- Open Graph tags:
  - `og:type`
  - `og:locale`
  - `og:site_name`
  - `og:title`
  - `og:description`
  - `og:url`
  - `og:image`
  - `og:image:alt`
- Twitter tags:
  - `twitter:card`
  - `twitter:title`
  - `twitter:description`
  - `twitter:image`
- JSON-LD structured data when applicable.

## Required Public Assets

- `public/favicon.svg`
- `public/apple-touch-icon.svg`
- `public/og-image.svg` or `public/og-image.png`
- `public/robots.txt`
- `public/sitemap.xml`

## Domain Rule

If the domain is unknown, use a clear placeholder domain from the project slug and mention it in the final response as pending. Before deploy, replace canonical, `og:url`, `og:image`, `robots.txt`, and `sitemap.xml` with the real domain.

## Structured Data

Choose the closest schema type:

- `LocalBusiness` for local service companies.
- `InsuranceAgency` for insurance producers/agencies.
- `Organization` for general companies.
- `Person` for portfolio/personal brands.
- `WebSite` when no richer type fits.

Keep JSON-LD truthful. Do not invent addresses, phone numbers, ratings, or social links.
For Spanish projects, keep JSON-LD text values in Spanish when the schema allows free text, for example `description`, `areaServed`, and `contactType`.
