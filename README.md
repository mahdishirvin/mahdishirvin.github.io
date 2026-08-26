# mahdishirvin.github.io

Personal portfolio site for Mahdi Shirvin (Data / BI Analyst). Hand-built
static site — no template, no framework, no build step.

## Structure

- `index.html` — the single page (intro, portfolio, about, contact)
- `css/`
  - `reset.css` — minimal base reset
  - `tokens.css` — color, type, spacing, and motion custom properties
  - `layout.css` — page shell, nav, section rhythm, grids
  - `components.css` — buttons, cards, modal, icons, footer
  - `hero.css` — hero section layout
- `js/`
  - `nav.js` — mobile nav (hamburger) toggle
  - `hero-background.js` — canvas dot-grid hero animation, respects `prefers-reduced-motion`
  - `portfolio-modal.js` — accessible modal (focus trap, Escape to close) for the Tableau embed
- `images/` — portfolio and profile images
- `docs/superpowers/` — design spec and implementation plan for this rebuild

## Deploying

This is a static site served directly by GitHub Pages from the repo root —
no build step required. Edit `index.html`/`css/`/`js/` and push to `master`.
