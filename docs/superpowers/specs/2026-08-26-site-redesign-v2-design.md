# Site Redesign V2 — Design Spec

**Status:** Approved by site owner (design direction confirmed in chat 2026-08-26). Full creative latitude was explicitly delegated for sub-projects 2-6; sub-project 1's direction was walked through and approved section by section.

## Goal

Replace the current HTML5UP "Prologue" template (jQuery, particles.js, ~2900-line generated CSS) with a hand-built, modern-minimal static site: same domain, same GitHub Pages deployment, same core content — new visual language, new markup, no template/jQuery/particles.js dependencies.

## Scope & Non-Goals

**In scope:** visual design, page structure/markup, CSS, minimal vanilla JS for interactivity (nav toggle, hero background animation, portfolio modal), responsive behavior, accessibility, removing old template code.

**Explicitly out of scope (deferred to a later content phase, per site owner):**
- Rewriting bio copy, project descriptions, or the About Me timeline graphic content
- Sourcing new/replacement photography for portfolio cover images
- Resume content itself (the PDF is swapped in as-is; only its link/button styling is this project's concern)
- GA4 migration (flagged in a prior review, needs the owner's own Measurement ID — untouched here)

Where this project's shell needs to *accommodate* future content (e.g. tag rows on portfolio cards, a differently-sized About photo), it's built to hold that gracefully — but the content itself is not authored now.

## Cross-Cutting Requirements (apply to every sub-project below)

- **Recruiter-scan optimization:** the "Resume" CTA stays visible at all times via the sticky top nav, not just in the hero.
- **Accessibility baseline carried forward, non-negotiable:** `<html lang="en">`, no `user-scalable=no`, meaningful `alt` text on every image, semantic landmarks (`<nav>`, `<main>`, `<section>` with headings in order), visible focus states, `rel="noopener noreferrer"` on all `target="_blank"` links, and (new for this rebuild) a `prefers-reduced-motion` fallback for the hero background animation.
- **No build tooling:** plain HTML/CSS/JS, deploys to GitHub Pages as-is. No jQuery, no particles.js, no Font Awesome — small inline SVGs for the ~4 social icons instead.
- **Performance:** carry forward the image-optimization discipline from the prior review (explicit `width`/`height`, `loading="lazy"` below the fold); no new heavy dependencies.

## Architecture / File Structure

Full rebuild, new file layout (old `assets/`, `js/`, `particles.js`, `particles.json`, `bower.json`-era leftovers all removed in sub-project 6):

```
index.html
css/
  reset.css        -- minimal reset (box-sizing, margins, etc.)
  tokens.css        -- CSS custom properties: color, type scale, spacing scale
  layout.css        -- page shell, nav, section rhythm, grid/max-width
  components.css     -- buttons, cards, modal, icons
  hero.css          -- hero-specific styles
js/
  nav.js            -- mobile nav toggle (hamburger)
  hero-background.js -- canvas dot-grid animation, respects prefers-reduced-motion
  portfolio-modal.js -- accessible modal (focus trap, Escape to close, real <button> trigger)
images/            -- unchanged, images kept from the prior review's optimization work
```

Five small CSS files instead of one 2900-line file: each has one responsibility, stays small enough to hold in context, and lets later content-phase work (e.g. new card content) touch `components.css` without wading through unrelated layout rules.

## Sub-project 1: Design System & Page Shell

**Visual language:**
- Dark hero (near-black, e.g. `#0b0e14`) with a custom canvas dot-grid/constellation animation that drifts slowly and responds to cursor proximity — deliberately more restrained than the old particles.js default (fewer nodes, slower motion, connecting lines only within a small radius). Pauses/simplifies under `prefers-reduced-motion: reduce`.
- Below the hero, an off-white content background (e.g. `#FAFAF8`) with near-black text (e.g. `#1A1A1A`) — the classic dark-hero/light-body pattern.
- One muted accent color (blue-teal, e.g. in the `#3E7C9A`–`#4F9DDE` range — exact hex finalized during implementation against WCAG AA contrast on both the dark hero and light body) used only for links, buttons, hover/focus states.
- Single type family: system-first sans stack (`Inter`, falling back to `-apple-system, "Segoe UI", sans-serif`), weight/size contrast for hierarchy rather than mixing families.

**Layout & navigation:**
- Sticky top nav bar (not the old fixed sidebar): name/logo left, section links + "Resume" button right; collapses to a hamburger menu under ~768px.
- Centered content column, max-width ~1150px, generous vertical section padding (desktop ~96–128px, mobile ~48–64px).

**Deliverable:** `css/tokens.css`, `css/reset.css`, `css/layout.css`, the nav markup/behavior (`js/nav.js`), and the hero background engine (`js/hero-background.js`) — the shell every other sub-project drops content into.

## Sub-project 2: Hero / Intro Section

- Full-viewport-height dark section using the sub-project-1 background engine.
- Content: name + role, one-line value statement (lightly tightened version of the existing bio sentence — reformatting, not new claims), small circular avatar, primary "Resume" button (download), secondary "View Portfolio" link that scrolls to the portfolio section.
- Small scroll-cue affordance at the bottom of the viewport hinting there's more content below.

## Sub-project 3: Portfolio Section

- Responsive card grid: 3 columns desktop, 2 tablet, 1 mobile.
- Card shell: image (existing files, `object-fit: cover`, fixed aspect ratio), title, a one-line description slot, and a tag-row slot (visually present but empty/hidden until the content phase fills it in) — so the content phase is a fill-in, not a redesign.
- External-link cue (small icon) on cards that open in a new tab, since all portfolio links currently do.
- **Ruling on the "Power BI Dashboard" card's dead `href="#"` link:** a fake link is a real credibility risk on a job-search site. This card renders as a static (non-linked) card — image + title, no anchor wrapper — until real content/a real link exists. This is a design decision, not a content one: no new copy is invented, an existing broken affordance is just not shipped as clickable.
- Tableau modal rebuilt accessibly: real `<button>` trigger (not a bare `<a>` with no `href`), `Escape` closes it, focus is trapped while open and returns to the trigger on close.

## Sub-project 4: About Me Section

- Two-column layout on desktop (bio text alongside the existing timeline graphic), stacked on mobile.
- Existing bio copy carried over as-is (reformatted for the new type system, not rewritten).
- The timeline graphic (`images/pic08-1.png`) sits in a fixed-aspect image container sized to look intentional now, but built so a differently-proportioned replacement image drops in cleanly during the later content phase.

## Sub-project 5: Contact Section + Footer

- Short, centered section: one-line prompt, email link, and the ~4 social icons (inline SVG, replacing Font Awesome).
- Footer: copyright line only. The "Design: HTML5UP" credit is dropped — once the template itself is gone, that attribution no longer applies.

## Sub-project 6: Cross-Cutting Polish & QA

- Responsive QA at ~375px, ~768px, ~1280px, ~1600px.
- Accessibility re-verification: landmark/heading structure, color-contrast check on the accent color against both backgrounds, focus-visible states, modal focus trap, `prefers-reduced-motion` behavior.
- Delete all old template artifacts: `assets/` (old CSS/JS/webfonts/sass), `js/app.js`, `particles.js`, `particles.json`, and any other now-orphaned files from the previous template.
- Update `README.md` to describe the new file structure.
- Final review pass (same review discipline as the prior bug-fix branch: task-scoped review per sub-project, one final whole-branch review at the end).

## Success Criteria

- Deploys cleanly to GitHub Pages with no build step.
- No jQuery, particles.js, Font Awesome, or other template remnants remain in the repo.
- Passes a manual accessibility pass (landmarks, contrast, keyboard nav through the modal, reduced-motion respected).
- Visually and structurally matches the modern-minimal direction approved above — dark interactive hero, light airy body, single accent color, sticky nav with persistent Resume CTA.
- All existing portfolio links continue to work (except the intentionally-de-linked Power BI placeholder card) and all images carry the accessible, accurate alt text already established.
