# Metropolitan Engineering Competition (MEC) Website

Marketing site for the Metropolitan Engineering Competition — a two-day engineering event with nine competition streams. Built as a static frontend for easy deployment and frequent content updates.

## Technology stack

- React + TypeScript
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Motion for React (animations)
- Lucide React (icons)

## Getting started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

### Typecheck

```bash
npm run typecheck
```

## Project architecture

```
src/
  app/App.tsx                 # Assembles sections in order
  components/
    layout/                   # Header, Footer, GridBackground, SectionContainer
    ui/                       # Button, Polaroid, Sticker, Accordion, …
    sections/                 # Hero, About, Competitions, Sponsors, FAQ, Chairs, Team
  data/                       # Editable content arrays/objects
  styles/                     # tokens.css, globals.css, animations.css
  services/formSubmission.ts  # Chairs question form
  types/index.ts
public/images/                # Logos, photos, placeholders
```

Each major section is modular: its own folder, CSS, and data source. Update content in `src/data/*` without rewriting layout components.

## Sections

1. **Hero** — logo, title, date/location placeholders, CTAs  
2. **About** — editorial copy + Polaroid collage of past events  
3. **Competitions** — nine stream cards with two document buttons each  
4. **Sponsors** — three tier “boxes” with sticker-style logos  
5. **FAQ** — accessible accordion (single-open by default)  
6. **Chairs** — two chair profiles + participant question form  
7. **Meet the Team** — circular Polaroid carousel  

## Global black grid background

Implemented as a fixed decorative layer in `src/components/layout/GridBackground.tsx`.

Tokens in `src/styles/tokens.css`:

| Variable | Purpose | Default idea |
|----------|---------|--------------|
| `--color-background` | Page background | `#080808` |
| `--color-grid` | Grid line RGB channels | `255, 255, 255` |
| `--grid-opacity` | Line opacity | `0.045` |
| `--grid-size` | Spacing | `48px` (desktop), `36px` (mobile) |
| `--grid-line-thickness` | Stroke width | `1px` |

The grid scrolls with the page (not fixed to the viewport). No animation, parallax, or pointer interaction unless requested.

## Colour palette & typography

Edit CSS variables in `src/styles/tokens.css`:

- Text: `--color-text`, `--color-text-muted`, `--color-accent`
- Surfaces: `--color-surface`, `--color-surface-elevated`
- Fonts: `--font-display` (Brigends), `--font-body` (Lexend Deca). Local files live in `public/fonts/` and are declared in `src/styles/fonts.css`.

## Replacing the MEC logo

1. Add your logo / hero image under `public/images/hero/` (e.g. `mec-logo.svg` or `.png`).
2. Update `logoSrc` / `logoAlt` in `src/data/siteContent.ts` (and `hero.logoSrc` if different), e.g. `'/images/hero/mec-logo.svg'`.

## Updating content by section

### Hero

Edit `siteContent.hero` in `src/data/siteContent.ts` (title, copy, date, location, CTAs, `registrationUrl`).

Place Hero images in `public/images/hero/` and reference them as `/images/hero/your-file.png`.

Leave `registrationUrl` empty until official — the Register button stays disabled and does not invent a destination.

### About photographs

Edit `siteContent.aboutPhotos`. Place images in `public/images/about/`. Each photo supports caption, rotation, and optional desktop positioning.

### Competitions

Edit `src/data/competitions.ts`. Set `documentOneUrl` / `documentTwoUrl` when PDFs are ready; empty strings keep buttons disabled.

### Sponsors

Edit `src/data/sponsors.ts` (`sponsorTiers` + `sponsors`). Change a sponsor’s `tier` field to move them between boxes. Logos in `public/images/sponsors/`.

### FAQ

Edit `src/data/faq.ts`. Accordion API: `allowMultiple` on `Accordion` (default `false` = single-open).

### Chairs

Edit `src/data/chairs.ts`. Images in `public/images/chairs/`.

### Team carousel

Edit `src/data/team.ts`. Add/remove members — the carousel recalculates the orbit. Behaviour/sizing lives in `TeamCarousel.tsx` + `Team.css`.

## Configuring the participant question form

1. Create a form at [Formspree](https://formspree.io) (or your own endpoint).
2. Copy `.env.example` to `.env`.
3. Set:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

4. Restart `npm run dev`.

Until configured, submit shows a clear **unavailable** message — success is never simulated.

Logic lives in `src/services/formSubmission.ts`, independent of the Chairs UI.

## Responsive layouts

Section CSS files contain orientation-aware rules (including `max-height` + `orientation: landscape` for short mobile landscape). Prefer adjusting the relevant section CSS rather than global tokens when tuning one section.

## Animations

Motion is used for hero entrance, polaroids, FAQ, chairs, and the team carousel. Global reduced-motion support is in `src/styles/animations.css` and `usePrefersReducedMotion`.

## Deployment

Any static host works (Netlify, Vercel, GitHub Pages, Cloudflare Pages, university hosting):

```bash
npm run build
```

Deploy the `dist/` folder. Set `VITE_FORMSPREE_ENDPOINT` in the host’s environment variables if the form should work in production.

For GitHub Pages with a project path, set Vite `base` in `vite.config.ts`.

## How to Request Future Design Changes in Cursor

Ask for **one section at a time** and name the section. Agents should follow `AGENTS.md` and avoid unrelated rewrites.

Example prompts:

- “Update the Hero supporting statement and accent button colour only.”
- “In About, replace the three Polaroid images and tighten mobile gallery spacing.”
- “Rename competition placeholders in `competitions.ts` and enable rules PDFs.”
- “Restyle the Sponsors tier-1 box; leave Competitions and FAQ alone.”
- “Make the Team carousel orbit smaller on tablet portrait.”
- “Do not change the black grid — only increase FAQ item padding.”

Avoid: “Redesign the whole site” when you only need a section tweak.
