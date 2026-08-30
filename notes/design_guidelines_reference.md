---
name: design-guidelines-reference
description: "Portfolio design guidelines for mahdishirvin.github.io — curated from article research (50 best designs) and direct technical analysis of 4 reference sites (SharpLink, PxPush, Caffe Gilli, Company Picnic)"
metadata:
  type: reference
  originSessionId: c259ba91-09a0-4f00-8400-ab53b0f45f12
  modified: 2026-08-29T03:10:33.618Z
---

# Portfolio Design Guidelines & Reference

Compiled from two sources:
1. Eleken article — "50 Best Website Design Examples"
2. Direct technical reverse-engineering of 4 user-selected reference sites

---

## Part 1 — Principles from the 50 Best Designs

### Hero / First Impression
- Cinematic hero sections win — lead with something that immediately communicates brand personality
- 3D + large typography combination is the strongest pattern for a "next-level" hero without pure decoration
- Scroll-driven storytelling: the scroll IS the narrative — sites like Pitch and Stripe Press use this
- Interactive data visualization in the hero signals competence before the user reads a word

### Typography
- Type is a design element, not just text — Abetka UA, MORAL, Art+Tech Report treat it as the primary visual
- Oversized / hero-scale type with unusual weight or spacing creates impact without imagery
- Monospaced + editorial serif pairing = "premium but unconventional" — strong for technical portfolios
- `.line__inner` clip-overflow animation (text sliding up into view) is the most common reveal pattern

### Color & Visual Language
- Dark mode with gradient highlights (violet/neon/cyan) = modern, tech-forward brand positioning
- Bold high-contrast palettes (Kovalska red/black, Tiny Wins black+pink) create instant memorability
- Intentional maximalism CAN work — but must feel deliberate, not accidental
- Minimal palette + maximum motion: SharpLink uses only 2 colors (#0E76FF + #F3F3F3) — restraint makes motion pop

### Motion & Interaction
- Micro-animations should GUIDE attention, not decorate
- Interactive data visualization (UNITED24, Enpower Trading) signals domain competence
- Gamification dramatically increases engagement (Can't Unsee, Hydra)
- Motion design should support narrative, not serve decoration

### Layout & Structure
- Grid-based layouts with movement feel dynamic while staying ordered
- Magazine/editorial layouts work well for portfolio/agency sites
- Modular card-based systems scale across content types
- Negative space prevents cognitive overload — don't fill every pixel

### Specifically Relevant for a Data/BI Portfolio
| Pattern | Why it fits |
|---|---|
| Dark UI + neon gradient | On-trend, signals modernity |
| Interactive data viz in hero | Shows the work before describing it |
| Editorial + monospaced type | Signals precision and technical credibility |
| Scroll-driven work section | Feels considered, not bolted on |
| Frosted glass nav | What the best sites are doing in 2025-26 |

---

## Part 2 — Technical Analysis of 4 Reference Sites

---

### SharpLink.com
**Awwwards SOTD** — built by Studio Freight PRO

| Layer | Technology |
|---|---|
| Framework | Vue.js |
| 3D / WebGL | Three.js |
| Animation | GSAP |
| Palette | `#0E76FF` blue + `#F3F3F3` — only 2 colors |

**Design patterns:**
- 3D page headers via Three.js WebGL
- GSAP scroll-triggered transitions throughout
- Interactive team modal with video integration
- Footer animation as a signature "closing moment"

**Key learning:** Minimum palette + maximum motion. Color restraint makes WebGL/GSAP effects hit harder.
Full stack is compatible with GitHub Pages (Vue can be compiled to static, or used as CDN).

---

### PxPush.com — Most Relevant (Work Section)
**Directly confirmed from compiled JS bundle analysis**

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 (Vue 3, SSR) |
| Animation | GSAP + ScrollTrigger + ScrollSmoother + Flip |
| Smooth scroll | Lenis |
| Text animation | Splitting.js (per-character/per-word splits) |
| Work section carousel | GSAP Marquee (custom infinite-loop) |
| Font | "SemiSqueezed" (custom/licensed, not Google) |

**How the auto-rotating work carousel works — the actual technique:**

```
DOM structure:
  <div class="marquee-track">
    [tile1][tile2][tile3][tile4][tile5][tile6]   ← original
    [tile1][tile2][tile3][tile4][tile5][tile6]   ← duplicate
  </div>

GSAP tween:
  gsap.to(".marquee-track", {
    x: "-50%",
    duration: 20,
    ease: "none",
    repeat: -1
  })

On scroll / wheel:
  gsap.globalTimeline.timeScale(velocity)  // speed up/slow down
```

Steps to replicate:
1. Render the tile list **twice** in the DOM (duplicate the nodes)
2. GSAP animates `translateX` from `0` to `-50%`, `repeat: -1`, `ease: "none"` — seamlessly loops
3. Scroll/wheel events call `gsap.globalTimeline.timeScale(factor)` to respond to user input
4. Result: auto-rotates AND responds to manual scroll
5. No Swiper, no Splide, no dependencies beyond GSAP (already loaded in v3)

**This is fully replicable without a build step via GSAP CDN.**

---

### Caffè Gilli — caffegilli.com
Blocks automated access (Cloudflare protected). Analyzed from page content.

| Layer | Technology |
|---|---|
| Type | Custom PHP or WordPress |
| Animation | Minimal — fade-ins, no GSAP |
| CMS | Unknown |

**Design patterns:**
- Full-width product photography sections, one per category
- Horizontal nav, no hamburger — clean editorial
- White/cream background, serif typeface
- Zero hero animation — photography carries all visual weight

**Key learning:** Confidence through restraint. When imagery/data is strong, animation can detract.
The "simplicity" you noticed = letting the content carry design, zero decoration.
For a portfolio: strong project screenshots + restrained motion > heavy effects + weak content.

---

### Company Picnic — companypicnic.com

| Layer | Technology |
|---|---|
| Framework | Next.js (React) |
| CMS | Sanity (cdn.sanity.io confirmed) |
| Images | Next.js image optimization |
| Animation | CSS transitions + React-sequenced loading |

**Design patterns:**
- Loading screen = branded CSS/JS sequenced reveal (not a heavy library)
- Scroll transitions use pinned sections and clip-path reveals
- Large illustrated characters as hero — no WebGL
- Grid of project cards linking out

**Key learning:** The impressive loading/transition feel comes from careful sequencing of simple CSS:
`clip-path` + `opacity` + `transform` on a pinned wrapper.
Complexity of effect ≠ complexity of code. The "wow" is in timing choreography, not library count.

---

## Part 3 — Applicability to mahdishirvin.github.io v3

| Desired effect | Source site | Technique | v3 stack can do it? |
|---|---|---|---|
| Auto-rotating large work tiles | PxPush | GSAP marquee, x: -50%, repeat: -1 | YES — ~20 lines in scroll-animations.js |
| 3D hero background | SharpLink | Three.js (same library) | YES — already in v3 |
| Impressive loading screen | Company Picnic | GSAP timeline sequence on preloader | YES — preloader.js already exists |
| Editorial simplicity | Caffe Gilli | Restraint + photography | Design decision, not a library |
| Per-character text reveals | PxPush | Splitting.js + GSAP | YES — add Splitting.js via CDN |
| Smooth scroll tied to animations | PxPush | Lenis + ScrollTrigger | YES — already in v3 |

### Recommended next priority
**Replace broken horizontal-scroll work pin with PxPush-style GSAP marquee.**
- Eliminates the scrollWidth-before-images bug in v3
- Auto-rotates (shows all projects without user action)
- Still responds to scroll (user retains control)
- Large tiles match the "N002 works section" reference the user called out specifically

### What NOT to change without explicit direction
- Logo: use existing `LogoMakr_8JfNbR.png`, rotate it 45° in CSS (`transform: rotate(45deg)`) — do NOT redesign or replace
- Color direction (violet/cyan dark): confirmed on-trend by article research
- Three.js hero: architecturally correct, keep it

---

## Part 4 — Process Rules (from this session's lessons)

1. **Get a reference first.** Never freely invent palette/hero direction — anchor to something the user pointed at before building
2. **Literal instructions = literal execution.** "Rotate 45 degrees" means `transform: rotate(45deg)` on the existing file, not a redesign
3. **Serve with `Cache-Control: no-store`** and tell user to hard-refresh every preview handoff
4. **Action-first when user is frustrated** — no explanatory paragraphs, just fix and show
5. **Test scroll with wheel events**, not `scrollIntoView()` — the latter fights Lenis virtual scroll

See [[project_mahdishirvin_portfolio]] for current branch/tag state.
See [[feedback_visual_design_iteration]] for full lesson log from failed iterations.
