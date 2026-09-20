# AGENTS.md — Guidance for Cursor agents working on MEC

This repository is the Metropolitan Engineering Competition (MEC) marketing website.
Content and design change frequently. Prefer **surgical, section-scoped edits**.

## Architecture map

| Area | Primary files |
|------|----------------|
| App assembly | `src/app/App.tsx` |
| Global tokens / grid | `src/styles/tokens.css`, `src/styles/globals.css` |
| Static grid layer | `src/components/layout/GridBackground.tsx` + `.css` |
| Header / Footer | `src/components/layout/Header.tsx`, `Footer.tsx` |
| Shared UI | `src/components/ui/*` |
| Hero | `src/components/sections/Hero/*` + `src/data/siteContent.ts` |
| About | `src/components/sections/About/*` + `siteContent.ts` (`about`, `aboutPhotos`) |
| Competitions | `src/components/sections/Competitions/*` + `src/data/competitions.ts` |
| Sponsors | `src/components/sections/Sponsors/*` + `src/data/sponsors.ts` |
| FAQ | `src/components/sections/FAQ/*` + `src/data/faq.ts` |
| Chairs / form | `src/components/sections/Chairs/*` + `src/data/chairs.ts` + `src/services/formSubmission.ts` |
| Team carousel | `src/components/sections/Team/*` + `src/data/team.ts` |
| Types | `src/types/index.ts` |

## Mandatory workflow

1. **Identify the section** named in the user request before editing.
2. **Inspect relevant files** (component + CSS + data) before changing them.
3. **Modify only what is required** for the request.
4. **Do not redesign unrelated sections.**
5. **Preserve existing functionality** unless explicitly asked to change it.
6. **Preserve the black grid background** unless the user specifically requests a background change. It should scroll with the page (absolute within `#root`), not stay fixed to the viewport, unless the user asks otherwise. Never add parallax, particles, or cursor-driven grid motion unless requested.
7. **Preserve responsive behaviour** across desktop, tablet, mobile portrait, and mobile landscape (including short landscape viewports).
8. Keep **section-specific styles** in that section’s CSS file.
9. Prefer section CSS over changing **global CSS variables** when a change should only affect one section.
10. Keep content in **`src/data/*`** — do not hardcode frequently updated copy inside presentation components.
11. Reuse existing shared components (`Button`, `Polaroid`, `Sticker`, `Accordion`, etc.) when appropriate.
12. **Do not rewrite the entire website** to change a single section.
13. Maintain **TypeScript type safety**.
14. Preserve **keyboard accessibility and touch interactions**. Essential info must not be hover-only.
15. After visual changes, mentally validate (or test) desktop, tablet, mobile portrait, and mobile landscape.
16. Inspect shared components before editing them — changes can ripple across sections.
17. Run `npm run typecheck` and/or `npm run build` after non-trivial changes.
18. In your reply, **state which files were modified and why**.
19. Preserve official branding assets, photographs, and event information unless the user asks to replace them.
20. Leave registration / social / document URLs empty when unknown — never invent fake destinations.

## Grid background rules (critical)

- One continuous layer behind the whole page (`GridBackground`), absolutely positioned so it **scrolls with the document** (not fixed to the viewport).
- Colour and spacing live in `src/styles/tokens.css` (`--color-background`, `--color-grid`, `--grid-opacity`, `--grid-size`).
- Sections should stay largely transparent so the grid remains visible in negative space.
- `pointer-events: none` on the grid layer at all times.
- Do not add parallax, particles, or cursor-driven grid motion unless the user asks.

## Content updates

Prefer editing data files:

- Event date/location/registration → `src/data/siteContent.ts`
- Competitions → `src/data/competitions.ts`
- Sponsors → `src/data/sponsors.ts`
- FAQ → `src/data/faq.ts`
- Chairs → `src/data/chairs.ts`
- Team → `src/data/team.ts`

Images live under `public/images/`.

## Form submissions

Do not fake successful form submissions. Configure `VITE_FORMSPREE_ENDPOINT` (see `.env.example` and README).
