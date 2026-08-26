# Site Redesign V3 — Minimal Editorial Design

**Status:** Approved by site owner in chat 2026-08-26, superseding the V2 dark-hero/card-grid
design (`2026-08-26-site-redesign-v2-design.md`). The V2 build was implemented and rejected
as "too similar to the old template" — same nav → hero → card-grid → about → contact skeleton,
just re-skinned. This spec replaces it with a structurally different, more restrained direction.

## Why V2 was rejected

V2 kept the exact information architecture of the original HTML5UP template (sticky nav, big
hero banner, three-column card grid, about section with image, contact section, footer) and
changed only the visual skin (dark hero, teal accent, canvas particle background). The site
owner's feedback: it read as a reskin, not a redesign, and asked for something "unmatchable"
grounded in current design trends and open-source reference work.

## Reference

Site owner pointed to [Eugene Serpokrylov's portfolio](https://branevsky.com) (via
[a1.gallery](https://www.a1.gallery/website/eugene-serpokrylov)) as the starting point: a
minimal, clean, one-page portfolio in monospace type, with a centered floating image that
subtly tilts in 3D toward the cursor and swaps to preview whichever project row is hovered.

## Direction

One page, four beats, no hero banner, no card grid:

- **Nav:** the site owner's own logo mark (`LogoMakr_8JfNbR.png` — a hand-drawn pie-chart
  monogram of "M/C", genuinely on-theme for a data analyst) + wordmark, `WORK / ABOUT /
  CONTACT`, a live local-time readout as the one whimsical detail, résumé as a quiet bracketed
  text link (`[résumé]`) rather than a button — always visible via the sticky nav.
- **Hero:** name + role in monospace, a centered floating image (idle: portrait) inside a
  `perspective`-transformed frame that tilts a few degrees toward the cursor via
  `pointermove`, and swaps to preview whichever Work row is hovered/focused. One-line bio
  carried over from the existing copy, reformatted only.
- **Work:** plain text rows (title left, tool/category tag right, hairline divider) instead of
  an image-card grid. Hovering or focusing a row drives the hero preview image. The Tableau
  project stays a button that opens an accessible modal (focus trap, Escape to close); the
  Power BI project stays honestly labeled "Coming soon" rather than a dead `href="#"` link.
- **About:** existing bio paragraph carried over, plus the career timeline — previously a
  low-fidelity gray graphic (`pic08-1.png`) — reformatted as a plain monospace date/role list.
  Same facts (transcribed from the graphic), new presentation; no new claims.
- **Contact:** plain link rows (email, LinkedIn, GitHub, Twitter) with small inline icons,
  consistent with the Work row style.

## Visual system

- **Color:** one light surface (`#f7f6f2`), ink text (`#14161a`), muted secondary text
  (`#6b6f76`), one accent (`#2f5fae`, ≥4.5:1 against the page background) used only for the
  eyebrow, hover states, and link underlines. No dark section anywhere — the whole page is one
  calm surface.
- **Type:** JetBrains Mono (open-source, loaded via Google Fonts) throughout, system-monospace
  fallback. Monospace carries the "data/code" identity without a literal terminal gimmick.
- **Motion:** the hero tilt is the only orchestrated motion on the page; it's disabled under
  `prefers-reduced-motion: reduce`. No scroll-triggered reveals, no particle backgrounds.

## Accessibility baseline (carried forward, non-negotiable)

`<html lang="en">`, no `user-scalable=no`, meaningful `alt` text, semantic landmarks, visible
focus states, `rel="noopener noreferrer"` on all `target="_blank"` links, reduced-motion
fallback for the hero tilt, and the Tableau modal keeps a real `<button>` trigger with a focus
trap and Escape-to-close.

## Non-goals (unchanged from V2)

Rewriting bio copy or project descriptions, sourcing new photography, resume content itself,
and GA4 migration are still out of scope for this visual rebuild.

## Success criteria

- Reads as structurally distinct from the original template and from the rejected V2 attempt,
  not a reskin of either.
- The hover-driven hero preview and cursor-tilt work on desktop; the page is fully usable
  without them (rows are plain links/buttons; a static idle image renders with no JS).
- Deploys cleanly to GitHub Pages with no required build step (Google Fonts is the only
  external dependency beyond the existing Tableau/GA embeds).
- Passes a manual accessibility pass: landmarks, contrast, keyboard nav through the modal,
  reduced-motion respected.
