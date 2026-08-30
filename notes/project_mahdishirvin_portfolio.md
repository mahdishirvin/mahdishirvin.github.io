---
name: project-mahdishirvin-portfolio
description: "Status of the mahdishirvin.github.io portfolio redesign — current checkpoint, rejected attempts, known open bug"
metadata: 
  node_type: memory
  type: project
  originSessionId: c259ba91-09a0-4f00-8400-ab53b0f45f12
  modified: 2026-08-27T13:02:28.154Z
---

The `mahdishirvin.github.io` repo (personal portfolio, Data/BI Analyst) is mid-redesign in the git worktree `.claude/worktrees/site-redesign-v2` on branch `worktree-site-redesign-v2`, replacing the original HTML5UP template.

**Version history (git tags on that branch):**
- `v2.2` — minimal-editorial monospace redesign (off-white, one-page, hover-driven hero preview). Rejected as too plain/boring.
- `v3` — cinematic WebGL redesign (Three.js particle-sphere hero, GSAP ScrollTrigger horizontal-scroll Work gallery, violet-cyan gradient palette, custom cursor). Rated "slightly better, nothing significant" by the site owner.
- Two further fix commits on top of `v3` addressed specific feedback (logo rotation, broken scroll gallery, palette, hero chart, cursor removal) but were explicitly rejected as a whole — the user said the logo fix specifically contradicted their instruction (they wanted the existing image rotated, not replaced with a new mark), called the experience "this disaster," and had the branch hard-reset back to the `v3` tag (2026-08-26).

**Current state as of the revert to `v3`:** the branch is back to the WebGL/cinematic build, which means its known issues are back too:
- `css/layout.css` sets `body { cursor: none; }` with a custom cursor-dot/cursor-ring pair — this is a real, reproducible bug (not just a caching artifact) causing the native mouse pointer to disappear. The user's "mouse pointer disappears" complaint is valid against this exact `v3` code, separate from any browser-caching confusion earlier in the conversation.
- The Work section's horizontal-scroll pin measures `track.scrollWidth` before verifying images have loaded, which can under-measure the scroll distance and strand the pinned section partway through with a dead gap afterward.

**How to apply:** don't assume `v3` is a clean baseline — it has at least the cursor bug and the scroll-measurement bug above. Before doing any further design work on this project, check in with the user rather than resuming autonomous rebuilds; the last request was to revert and "record this disaster," not to keep iterating. See [[feedback_visual_design_iteration]] for the process lessons from how this went wrong.
