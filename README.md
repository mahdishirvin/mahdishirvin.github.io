# mahdishirvin.github.io

Personal portfolio site for Mahdi Shirvin (Data / BI Analyst). Hand-built
static site — no bundler, no framework. Three.js, GSAP, and Lenis are loaded
directly as ES modules via CDN + an import map, so it still deploys to
GitHub Pages with zero build step.

## Structure

- `index.html` — the single page (intro, work, about, contact)
- `css/`
  - `reset.css` — minimal base reset
  - `tokens.css` — color, type, spacing, and motion custom properties
  - `layout.css` — page shell, nav, preloader, custom cursor, section rhythm
  - `components.css` — buttons, stat band, work gallery, timeline, modal, footer
  - `hero.css` — full-viewport hero and kinetic headline
- `js/`
  - `nav.js` — mobile nav (hamburger) toggle
  - `cursor.js` — custom cursor (dot + ring), disabled on touch devices
  - `preloader.js` — load-in counter animation; hidden by default in the HTML
    so a blocked/failed script never leaves it stuck on screen
  - `hero-scene.js` — Three.js glowing particle-sphere hero background
  - `scroll-animations.js` — GSAP + ScrollTrigger reveals, magnetic buttons,
    and the horizontal-scroll Work gallery; wires up Lenis for smooth scroll
  - `portfolio-modal.js` — accessible modal (focus trap, Escape to close) for the Tableau embed
- `images/` — portfolio and profile images
- `docs/superpowers/` — design specs for this rebuild (see the `specs/` folder
  for the full history, including the two earlier attempts that were
  rejected before this direction)

## Accessibility / resilience notes

Everything motion-heavy (the hero scene, scroll pin, cursor, preloader) is
additive: default CSS renders all content fully visible and the Work gallery
as a plain scrollable row, so a blocked CDN script degrades to a static-but-
complete page rather than a broken one. `prefers-reduced-motion: reduce`
turns off the preloader, particle animation, and scroll-pin gallery outright.

## Deploying

This is a static site served directly by GitHub Pages from the repo root —
no build step required. Edit `index.html`/`css/`/`js/` and push to `master`.
