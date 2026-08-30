---
name: feedback-git-workflow
description: "Never commit or merge without explicit user instruction — user controls all git commits and merges on this project"
metadata:
  type: feedback
  originSessionId: c259ba91-09a0-4f00-8400-ab53b0f45f12
  modified: 2026-08-29T03:37:43.070Z
---

Never commit or merge without the user explicitly saying to commit or merge.

**Why:** User said "I did not ask to commit / you can never commit or merge, I will do these two." This applies to all git operations on the mahdishirvin.github.io project.

**How to apply:**
- Write code, make file changes freely — but stop before any `git commit`, `git merge`, `git push`, or `git tag`
- When work is done, tell the user the files are ready and let them decide what to do with git
- The user may choose to keep changes uncommitted, as a branch, or decide later — do not assume

See [[project_mahdishirvin_portfolio]] for branch structure.
