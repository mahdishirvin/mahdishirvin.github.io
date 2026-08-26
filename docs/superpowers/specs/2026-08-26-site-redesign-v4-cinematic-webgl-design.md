# Site Redesign V4 — Cinematic WebGL Design

**Status:** Built per explicit site owner direction in chat 2026-08-26, superseding V3
(`2026-08-26-site-redesign-v3-minimal-editorial-design.md`, tagged `v2.2` in git — the site
owner's own archival name for it). V3 was rejected outright: "awful... not looking for
something simple, looking for something that I can show and say can you believe AI built
this." This spec documents the maximalist direction built in response, with no intermediate
approval step — the owner said "go ahead and do your best."

## Direction

Full cinematic, award-site-caliber single page. Real open-source libraries via CDN ES modules
+ an import map (no bundler needed, still deploys to GitHub Pages as static files):

- **Three.js** (`three@0.169.0`) — a glowing, additively-blended particle sphere behind the
  hero headline, built from a Fibonacci-sphere point distribution with a soft radial-gradient
  sprite texture and a violet→cyan vertex-color gradient. Slow autorotation plus a subtle
  pointer-driven parallax tilt.
- **GSAP 3.12 + ScrollTrigger** — the hero headline's per-line stagger reveal, magnetic
  buttons/icons, scroll-triggered section reveals, and a pinned horizontal-scroll gallery for
  the Work section (scroll vertically, panels translate horizontally — the classic
  Awwwards-style horizontal-scroll recipe).
- **Lenis** — inertia smooth-scroll, wired to `ScrollTrigger.update` per the standard
  integration.
- **Clash Display** (Fontshare, open-source) for all display/headline type, paired with Inter
  for body copy.
- A load-in preloader (percentage counter → wipe transition) and a custom cursor (dot + ring
  that expands over interactive elements) — both disabled under `prefers-reduced-motion` and
  the cursor additionally disabled on touch devices.

The site owner's own logo mark (`LogoMakr_8JfNbR.png`) is in the nav, inverted to white for
the dark theme, and is explicitly **never rotated or animated** — "it should look like an M"
was direct feedback after a design (V3) that also used the mark; this build keeps it fully
static everywhere it appears.

## Content changes from V3

- Work rows became full-bleed image panels in a horizontal gallery instead of plain text
  rows, each still linking to the same real project URLs (no link/target changes).
- Added a small stat band between the hero and Work (`06` — projects below, `2020` — MSc UT
  Dallas) — both self-referential/verifiable facts already stated elsewhere on the page, not
  new claims, chosen specifically to avoid any resume-inflation risk.
- Contact section ends on a large closing statement ("Let's build something extraordinary")
  rather than a plain heading, matching the more theatrical tone of this direction.
- About/timeline content is unchanged from V3 (same transcribed facts from the original
  timeline graphic).

## Resilience — this is the part that matters most given the added complexity

Every hidden/animated starting state is applied by JavaScript itself, never by static CSS,
so a blocked or failed CDN module can never leave content stuck invisible or the page
unusable:

- `.preloader` ships with the `hidden` attribute in the HTML; only `preloader.js` removes it
  (and only for the ~2s it needs — there's also a 5s hard safety timeout). No JS running at
  all = no preloader ever shown, page displays normally immediately.
- `.reveal` elements have no hidden state in CSS; `scroll-animations.js` applies
  `gsap.set(opacity:0, y:40)` immediately before animating each one in. If that script never
  runs, `.reveal` elements are simply visible by default.
- The Work gallery's default CSS is a plain horizontally-scrollable row
  (`overflow-x: auto`, scroll-snap) — this is also the exact fallback used under
  `prefers-reduced-motion`. GSAP pin/scrub is layered on top only once confirmed running, and
  switches the track to `overflow-x: hidden` at that point.
- The nav has a real background (`rgba` + backdrop-blur) rather than depending on being over
  any particular section — this was a real bug caught in testing: a fully transparent nav
  became unreadable once the pinned Work gallery's bright panel images scrolled underneath it.

## Verified in a headless-browser pass

WebGL context creation and actual pixel output (not a blank canvas), the ScrollTrigger pin
producing real horizontal `transform` changes across two scroll steps, cursor `is-active`
state on hover, modal focus-trap + Escape-close against the new theme, `prefers-reduced-motion`
correctly skipping the preloader/particle-animation/scroll-pin, real touch-device emulation
confirming the custom cursor is disabled (`display: none`), and the logo's computed
`transform` is `none` everywhere.

## Non-goals (unchanged)

Rewriting bio/project copy, new photography, resume content itself, and GA4 migration remain
out of scope.
