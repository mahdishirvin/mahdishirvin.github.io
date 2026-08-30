---
name: feedback-visual-design-iteration
description: "Lessons from a failed multi-round visual redesign of mahdishirvin.github.io — don't repeat this pattern on open-ended design work"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c259ba91-09a0-4f00-8400-ab53b0f45f12
  modified: 2026-08-27T13:02:06.752Z
---

Across roughly six rebuild attempts of the mahdishirvin.github.io portfolio (dark-hero/teal → minimal-editorial/monospace → violet-cyan WebGL "cinematic" → navy/gold → deep-pine/gold), every fully-improvised aesthetic direction was rejected. The user ultimately called it "this disaster of an experience with AI" and had me hard-revert to an earlier checkpoint (git tag `v3`).

**Root causes, so the pattern isn't repeated:**

1. **Guessed palettes/hero visuals repeatedly without a concrete reference.** Only one round (the `branevsky.com` reference for the "minimal editorial" attempt) was grounded in something the user actually pointed at — and even that got rejected on the very next ask for something "jaw-dropping." Open-ended instructions like "make it look professional/impressive" were treated as license to freely reinvent the whole visual language each time, rather than anchoring to something concrete before building at scale.
2. **Misread a literal, mechanical instruction.** The user said "rotate my logo 45 degrees so it looks like an M" — a specific fix to a specific existing image asset. This got reinterpreted as "the logo needs a full redesign," and the original raster file was replaced with an invented SVG mark, directly contradicting what was asked. **How to apply:** when a user gives a literal, mechanical instruction about an existing asset (rotate by N degrees, keep this exact file), execute exactly that — don't substitute a "better" solution unless explicitly invited to design something new.
3. **Verification gaps produced false confidence.** Headless-browser screenshots repeatedly "confirmed" fixes while the user's real-browser experience differed — some of that was genuine bugs (a horizontal-scroll pin measured `scrollWidth` before images finished loading), but some was very likely browser caching of a stale build on a long-lived `localhost` tab, since the same port was reused across many rebuilds without cache-busting headers and without consistently telling the user to hard-refresh. **How to apply:** for any local-preview workflow reused across many iterations, serve with explicit `Cache-Control: no-store` from the start, and tell the user to hard-refresh every single time a URL is handed back — not just after the problem is suspected.
4. **Long justification paragraphs compounded frustration.** Each fix round explained reasoning at length; once a user is expressing frustration, action-first and terse is the right register, not a design essay.

See [[project_mahdishirvin_portfolio]] for the concrete version history and where the project stands.
