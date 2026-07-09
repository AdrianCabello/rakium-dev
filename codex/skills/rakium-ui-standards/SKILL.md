---
name: rakium-ui-standards
description: Rakium UI standards for Angular admin/frontend work. Use whenever editing Rakium screens, layouts, headers, dashboards, PrimeNG components, Tailwind classes, colors, spacing, cards, forms, tables, drawers, or any visible UI so new work follows the same palette and interaction conventions.
---

# Rakium UI Standards

Use this skill before changing any visible Rakium UI. Keep PrimeNG and Tailwind aligned to the same brand tokens instead of inventing new local colors.

## Color Tokens

Use these tokens as the source of truth:

- Page background: `#1A1C20`
- Surface/input background: `#1E1E1E`
- Card/panel/drawer surface: `#2C3550`
- Border: `#666666`
- Primary blue: `#639BF0`
- Primary hover: `#7aa8f2`
- Text: `#ffffff`
- Muted text: `#A0A0A0`
- Success: `#5ACD80`
- Danger: `#ef4444`

Prefer existing CSS variables in `src/styles/_primeng-rakium.scss`:

- `--rakium-bg`
- `--rakium-surface`
- `--rakium-card`
- `--rakium-border`
- `--rakium-primary`
- `--rakium-primary-hover`
- `--rakium-text`
- `--rakium-muted`
- `--rakium-success`
- `--rakium-danger`

## PrimeNG

- Prefer PrimeNG components for admin shell controls, drawers, dialogs, tables, buttons, menus, forms, and overlays.
- Import only the standalone module needed by the component, such as `ButtonModule`, `DrawerModule`, `TableModule`, or `InputTextModule`.
- Use the existing PrimeNG preset in `src/app/core/config/primeng-rakium.theme.ts`.
- Put cross-app PrimeNG visual overrides in `src/styles/_primeng-rakium.scss`.
- Do not rely on PrimeNG default colors when the component is in the admin UI; map it back to Rakium tokens.

## Tailwind

- Use Tailwind for layout, spacing, typography, and simple states.
- Use token-matching arbitrary colors when needed: `bg-[#1A1C20]`, `bg-[#2C3550]`, `border-[#666666]`, `text-[#A0A0A0]`, `text-[#639BF0]`.
- Avoid introducing new dominant palettes such as purple gradients, beige, orange/brown, or generic `zinc`-only screens.
- Do not use many isolated stat cards when a compact dashboard row communicates the same thing.

## Admin Shell

- Header background must match `#1A1C20`.
- Navigation should live in a left drawer, not as many header tabs.
- The menu button must be visibly primary blue with readable white icon/text.
- Drawer background must match `#1A1C20`; drawer links should use muted text and primary blue active states.
- Keep route labels source-safe with HTML entities for accents if encoding is unstable, e.g. `Gesti&oacute;n`.

## Validation

After UI edits:

1. Run `npm.cmd run build`.
2. For local browser QA, run `npx.cmd ng build --configuration=local` and serve SSR if needed.
3. Test in Chrome when the user asks for browser validation or when the change is visual.
4. Verify no console errors, no invisible controls, no unreadable contrast, and no mismatched palette.
