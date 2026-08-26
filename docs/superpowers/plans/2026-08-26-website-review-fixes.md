# Portfolio Site Review & Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the correctness, accessibility, security, performance, SEO, and repo-hygiene problems found in a full review of the `mahdishirvin.github.io` static portfolio site.

**Architecture:** This is a static HTML/CSS/JS site (HTML5 UP "Prologue" template + particles.js) deployed via GitHub Pages — no build step, no server, no test framework. There is no separate spec document; the "Problems & Solutions" section below is the spec this plan implements, derived directly from reading `index.html`, `assets/js/main.js`, `js/app.js`, `assets/css/main.css`, and the repo file tree.

**Tech Stack:** Plain HTML5, CSS (compiled from `assets/sass/`), jQuery-based template scripts (`assets/js/*.js`), particles.js. Python 3.11 + Pillow available locally for image processing (no ImageMagick/ffmpeg/cwebp/gifsicle installed).

**Spec:** This document — see "Problems & Solutions" below.

## Global Constraints

- Do not introduce a build system, framework, or bundler — keep the site plain static HTML/CSS/JS deployable as-is to GitHub Pages.
- Do not change the visual design/layout beyond what a fix requires (this is a personal brand site — preserve look and feel).
- Do not remove content or features without flagging it in the task (e.g. dead code is fixed or removed, never silently altered in behavior).
- All fixes must be verifiable by opening `index.html` in a browser and/or a static check (grep, W3C validator, browser console) — there is no test runner in this repo.
- Commit after each task with a descriptive message; do not bundle unrelated fixes into one commit.

---

## Problems & Solutions

1. **Repo hygiene — third-party/template files masquerading as project files.**
   `package.json` and `bower.json` at repo root are literally particles.js's own library metadata (`"name": "particles.js"`, describes itself as a particle library), not this portfolio's. `README.md`/`README.txt` at root is particles.js's README, not a description of Mahdi's site. `LICENSE.md` and `LICENSE.txt` are duplicate license files from different templates. `demo/` and `About/` are leftover HTML5UP/particles.js demo scaffolding never meant to ship. `images/background.html` is a stray leftover demo file.
   **Solution:** Delete the leftover demo/template artifacts; replace root `README.md` with a real one-paragraph description of the portfolio; drop the vendored `package.json`/`bower.json`/duplicate `README.txt`/`LICENSE.txt` since nothing in this repo consumes them (particles.js is vendored as a plain `<script src="../particles.js">`, not installed via npm/bower).

2. **Orphaned/duplicate particles.js config files.**
   `js/app.js` inlines its own particles config object directly in the `particlesJS(...)` call. The root `particles.json` and `assets/particles.json` are two *different*, unused leftover config files nothing loads.
   **Solution:** Delete both orphaned JSON files; keep the working inline config in `js/app.js`.

3. **Invalid/broken HTML — mismatched tags in "About Me" and "Contact" sections.**
   `index.html:203-205`: a `<p align=" justify">` is closed with `</div>` instead of `</p>`. `index.html:220-226`: closing tags `</div></div></form>` appear with no matching opening `<div>`/`<form>` (leftover from a removed contact form).
   **Solution:** Close the About paragraph with `</p>`; remove the orphaned `</div></div></form>` in Contact so the section's tags balance.

4. **Broken modal JavaScript — references a non-existent element.**
   `assets/js/main.js:127-137` looks up `document.getElementById("img01")` (doesn't exist anywhere in `index.html`) and, on click of `#myImg`, does `modalImg.src = this.src` — `modalImg` is `null`, so this throws a `TypeError` in the browser console every time the food-price modal image is clicked, and the caption text never updates. The actual modal content is a static Tableau embed, not an image swap.
   **Solution:** Remove the dead `img01`/caption-rewrite logic that doesn't apply to this modal's actual (static Tableau) content, keeping only the open/close behavior that works (`modal.style.display`).

5. **Accessibility issues.**
   - `<html>` (`index.html:14`) has no `lang` attribute.
   - `<meta name="viewport" ... user-scalable=no>` (`index.html:36`) disables pinch-zoom — a WCAG 1.4.4 violation for low-vision users.
   - The LinkedIn icon's screen-reader-only label reads "Facebook" (`index.html:75`), mismatched from what it links to.
   - Portfolio image `alt` text is non-descriptive placeholder text: `alt="Loading"` / `alt="Loading..."` (`index.html:126,132,140,146,156,182,201`), which is what screen readers announce instead of a description of the artifact.
   **Solution:** Add `lang="en"`; remove `user-scalable=no`; fix the mislabeled icon to "LinkedIn"; replace each placeholder `alt` with a short description of that portfolio piece.

6. **Security — `target="_blank"` links without `rel="noopener noreferrer"`.**
   9 anchors across the header social icons and portfolio section open in a new tab without `rel="noopener noreferrer"` (`index.html:75-78,126,132,140,146,217`), which lets the opened page access `window.opener` (reverse-tabnabbing risk).
   **Solution:** Add `rel="noopener noreferrer"` to every `target="_blank"` anchor.

7. **Performance — unoptimized images.**
   `images/` totals ~6.7MB uncompressed for a landing page: `giphy.gif` 2.0MB, `airbnb.gif` 1.1MB, `airbnb.jpg` 753KB, `foodprice.jpg` 631KB, `pic05.png` 578KB, `pic03.png` 515KB, `pic04.png` 359KB. None of the `<img>` tags declare `width`/`height`, so images cause layout shift while loading, and none use `loading="lazy"` even though most are below the fold.
   **Solution:** Resize/recompress the static raster images (jpg/png) with Pillow to reasonable display dimensions and quality; add explicit `width`/`height` attributes matching the resized images; add `loading="lazy"` to below-the-fold portfolio images. The two animated GIFs cannot be safely recompressed with the tools available in this environment (no ffmpeg/gifsicle/ImageMagick installed) — flagged as a manual follow-up, not automated here.

8. **SEO issues.**
   - No `robots.txt`.
   - `sitemap.xml` `lastmod` dates are frozen at July 2020.
   - No Open Graph / Twitter Card meta tags, so shared links (LinkedIn, Twitter) show no preview.
   - Google Analytics uses a Universal Analytics property (`UA-173009769-1`, `index.html:20-27`) — UA stopped processing hits in July 2023, so this tracking snippet currently collects nothing.
   - Broken outbound link: `href="Utdallas.edu"` (`index.html:203`) is missing a protocol, so it resolves as a relative path on this domain instead of navigating to the university's site.
   - Typo: "enthousiast" in the meta description (`index.html:32`).
   **Solution:** Add a `robots.txt`; refresh `sitemap.xml` lastmod; add Open Graph/Twitter meta tags; fix the UT Dallas link protocol; fix the typo. Migrating to GA4 requires the site owner's own GA4 Measurement ID (not something derivable from the repo), so that step documents exactly what to replace and where, for the owner to complete with their own ID.

---

## Task 1: Repo hygiene — remove leftover/third-party files, add a real README

**Files:**
- Delete: `package.json`, `bower.json`, `README.txt`, `LICENSE.txt`, `demo/`, `About/`, `images/background.html`, `particles.json`, `assets/particles.json`
- Modify: `README.md` (replace content entirely)

**Interfaces:** None — file deletions and a doc rewrite, nothing else in the repo references these paths (verified: `js/app.js` inlines its particles config; nothing loads `particles.json`/`assets/particles.json`; nothing loads `package.json`/`bower.json`; GitHub Pages serves `index.html` directly, it doesn't read `package.json`).

- [ ] **Step 1: Confirm nothing references the files to be deleted**

Run: `grep -rn "particles.json\|package.json\|bower.json" --include="*.html" --include="*.js" .`
Expected: only match is the unrelated `README.txt`/`README.md` prose (particles.js's own docs mentioning its own `particles.json` usage pattern) — no `<script>`/`<link>`/`fetch` in `index.html` or `js/app.js` actually loads any of these paths.

- [ ] **Step 2: Delete the leftover/duplicate files**

```bash
git rm -r package.json bower.json README.txt LICENSE.txt demo About images/background.html particles.json assets/particles.json
```

- [ ] **Step 3: Replace root README.md with a real project description**

```markdown
# mahdishirvin.github.io

Personal portfolio site for Mahdi Shirvin (Data / BI Analyst), built on the
[Prologue](https://html5up.net/prologue) template by HTML5 UP with a
[particles.js](https://github.com/VincentGarreau/particles.js) background
effect.

## Structure

- `index.html` — the single page (intro, portfolio, about, contact)
- `assets/` — compiled CSS (`assets/css/main.css`, source in `assets/sass/`),
  template JS (`assets/js/`), fonts, and images
- `js/app.js` — particles.js configuration for the landing header
- `particles.js` — vendored particles.js library, loaded via `<script src="../particles.js">`

## Deploying

This is a static site served directly by GitHub Pages from the repo root —
no build step required. Edit `index.html`/`assets/` and push to `main`.
```

- [ ] **Step 4: Verify the site still loads with the same visible content**

Open `index.html` in a browser (or `python -m http.server` from the repo root and visit `http://localhost:8000/`). Expected: page renders identically to before — header, portfolio grid, about, contact, footer all present; browser console shows no new 404s for `particles.json`, `package.json`, etc.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "chore: remove leftover template/demo files, replace vendored README with project README"
```

---

## Task 2: Fix invalid HTML in About and Contact sections

**Files:**
- Modify: `index.html:203-206` (About), `index.html:209-226` (Contact)

**Interfaces:** None — markup-only fix, no JS/CSS depends on the removed stray tags (confirmed: no selector in `assets/css/main.css` targets a `<form>` inside `#contact`, and no script queries a form there).

- [ ] **Step 1: Reproduce the current broken markup**

Run: `sed -n '200,227p' index.html`
Expected output shows the `<p align=" justify">...</div>` mismatch in About and the orphaned `</div></div></form>` before `</section>` in Contact.

- [ ] **Step 2: Fix the About section's paragraph close**

Change (`index.html:203-206`):
```html
							<p align=" justify">I am a professional Data Analyst, graduated from <a href="Utdallas.edu">University of Texas at Dallas</a> 
								in May 2020 with a Master of Management Science. What drew me to world of data was the dynamic nature of the industry. 
								Engagements and client needs change regularly which means there’s always something new to learn and I love the process of researching new technical solutions and testing them.</div>
					</section>
```
to:
```html
							<p align=" justify">I am a professional Data Analyst, graduated from <a href="https://www.utdallas.edu">University of Texas at Dallas</a> 
								in May 2020 with a Master of Management Science. What drew me to world of data was the dynamic nature of the industry. 
								Engagements and client needs change regularly which means there’s always something new to learn and I love the process of researching new technical solutions and testing them.</p>
					</section>
```
(this also fixes the broken `Utdallas.edu` link from problem 8 while we're touching this line)

- [ ] **Step 3: Remove the orphaned closing tags in Contact**

Change (`index.html:216-226`):
```html
							<p align=" justify">Feel free to contact me for any question. For open source projects,
								 please open an issue or pull request on <a href="https://github.com/mahdishirvin" target="_blank">Github</a>.
								 Otherwise, send me an email at <a href="mailto:mahdishirvin@gmail.com" target="_blank">mahdishirvin@gmail.com</a>.</p>


									</div>
								</div>
							</form>

						</div>
					</section>
```
to:
```html
							<p align=" justify">Feel free to contact me for any question. For open source projects,
								 please open an issue or pull request on <a href="https://github.com/mahdishirvin" target="_blank">Github</a>.
								 Otherwise, send me an email at <a href="mailto:mahdishirvin@gmail.com" target="_blank">mahdishirvin@gmail.com</a>.</p>

						</div>
					</section>
```

- [ ] **Step 4: Validate the fixed markup**

Run the file through the W3C HTML validator: https://validator.w3.org/nu/#file — upload `index.html`. Expected: no more "end tag for element that is not open" or "stray end tag" errors for `p`, `div`, or `form` in the About/Contact sections. (Pre-existing, unrelated warnings from the template itself, if any, are out of scope for this task.)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "fix: correct mismatched/orphaned tags in About and Contact sections"
```

---

## Task 3: Fix broken modal JavaScript

**Files:**
- Modify: `assets/js/main.js:126-145`

**Interfaces:**
- Consumes: `#myModal`, `#myImg`, `.close` from `index.html:156-172` (unchanged)
- Produces: none consumed by later tasks

- [ ] **Step 1: Reproduce the bug**

Open `index.html` in a browser, open DevTools console, click the food-price image (`#myImg`, "Food Price Story with Tableau" card). Expected: console shows `Uncaught TypeError: Cannot set properties of null (setting 'src')` at `assets/js/main.js:135`, because `document.getElementById("img01")` (`main.js:131`) returns `null` — there is no element with id `img01` anywhere in `index.html`. The modal's Tableau content is static, not an image that gets swapped in.

- [ ] **Step 2: Remove the dead image-swap/caption logic, keep the working open/close behavior**

Change (`assets/js/main.js:126-145`):
```javascript
// Get the modal 
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}
```
to:
```javascript
// Get the modal
var modal = document.getElementById("myModal");

// Get the image that opens the modal (modal content itself is a static Tableau embed)
var img = document.getElementById("myImg");
img.onclick = function(){
  modal.style.display = "block";
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
```

- [ ] **Step 3: Verify the fix in the browser**

Reload `index.html`, open DevTools console, click `#myImg` again. Expected: modal opens showing the Tableau "Please wait. Connecting to Tableau Server..." content, no console errors. Click the `×` close button. Expected: modal closes, still no console errors.

- [ ] **Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "fix: remove dead image-swap code in modal handler causing a runtime TypeError"
```

---

## Task 4: Accessibility fixes

**Files:**
- Modify: `index.html:14` (lang attribute), `index.html:36` (viewport), `index.html:75` (icon label), `index.html:126,132,140,146,156,182,201` (alt text)

**Interfaces:** None — attribute-only changes.

- [ ] **Step 1: Add a `lang` attribute to `<html>`**

Change (`index.html:14`):
```html
<html>
```
to:
```html
<html lang="en">
```

- [ ] **Step 2: Allow pinch-zoom by removing `user-scalable=no`**

Change (`index.html:36`):
```html
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
```
to:
```html
		<meta name="viewport" content="width=device-width, initial-scale=1" />
```

- [ ] **Step 3: Fix the mislabeled LinkedIn icon**

Change (`index.html:75`):
```html
							<li><a href="https://www.linkedin.com/in/mahdi-shirvin/" target="_blank" class="icon brands fa-linkedin"><span class="label">Facebook</span></a></li>
```
to:
```html
							<li><a href="https://www.linkedin.com/in/mahdi-shirvin/" target="_blank" class="icon brands fa-linkedin"><span class="label">LinkedIn</span></a></li>
```

- [ ] **Step 4: Replace placeholder `alt` text with descriptions**

Change each of the following in `index.html`:
- Line 126: `alt="Loading"` → `alt="Airbnb price forecast regression notebook screenshot"`
- Line 132: `alt="Loading..."` → `alt="US population over time animated chart"`
- Line 140: `alt="Loading..."` → `alt="Apple.com network graph visualization"`
- Line 146: `alt="Loading..."` → `alt="ArcGIS analysis for new restaurant location"`
- Line 156: `alt="loading..."` → `alt="Food price variation Tableau dashboard preview"`
- Line 182: `alt="Loading..."` → `alt="Power BI dashboard demo"`
- Line 201: `alt="loading..."` → `alt="Mahdi Shirvin"`

- [ ] **Step 5: Verify with the browser accessibility tree**

Open `index.html`, DevTools → Elements → Accessibility pane (or run a Lighthouse accessibility audit). Expected: `<html>` reports `lang: en`; each portfolio/about image's accessible name matches the new descriptive text; the LinkedIn list item's accessible name is "LinkedIn"; pinching/zooming the page in a mobile device emulation view is no longer blocked.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "fix: accessibility issues (lang attribute, pinch-zoom, mislabeled icon, descriptive alt text)"
```

---

## Task 5: Add `rel="noopener noreferrer"` to all `target="_blank"` links

**Files:**
- Modify: `index.html:75,76,77,78,126,132,140,146,217,218`

**Interfaces:** None — attribute-only change.

- [ ] **Step 1: Confirm the current count**

Run: `grep -c 'target="_blank"' index.html`
Expected: `10` (9 external-navigation links plus the `mailto:` link at line 78/218 — `mailto:` links are included for consistency even though they don't carry the opener risk).

- [ ] **Step 2: Add `rel="noopener noreferrer"` to every `target="_blank"` anchor**

For each of the 10 occurrences in `index.html` (lines 75, 76, 77, 78, 126, 132, 140, 146, 217, 218), change `target="_blank"` to `target="_blank" rel="noopener noreferrer"`. Example (`index.html:75`):
```html
							<li><a href="https://www.linkedin.com/in/mahdi-shirvin/" target="_blank" rel="noopener noreferrer" class="icon brands fa-linkedin"><span class="label">LinkedIn</span></a></li>
```

- [ ] **Step 3: Verify every `target="_blank"` now has the rel attribute**

Run: `grep -c 'target="_blank" rel="noopener noreferrer"' index.html`
Expected: `10`, matching the count from Step 1.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "fix: add rel=noopener noreferrer to all target=_blank links"
```

---

## Task 6: Optimize static images and prevent layout shift

**Files:**
- Create: `scripts/optimize_images.py`
- Modify: `images/airbnb.jpg`, `images/foodprice.jpg`, `images/pic03.png`, `images/pic04.png`, `images/pic05.png` (recompressed in place)
- Modify: `index.html:126,132,140,146,156` (add `width`, `height`, `loading="lazy"` to the corresponding `<img>` tags)

**Interfaces:** None — a standalone script plus attribute additions matching the script's output dimensions.

- [ ] **Step 1: Install Pillow**

Run: `pip install pillow`
Expected: installs successfully (`Successfully installed pillow-...`).

- [ ] **Step 2: Record current dimensions and sizes before changing anything**

Run: `python -c "from PIL import Image; import os; [print(f, Image.open(f).size, os.path.getsize(f)) for f in ['images/airbnb.jpg','images/foodprice.jpg','images/pic03.png','images/pic04.png','images/pic05.png']]"`
Expected: prints each file's current `(width, height)` and byte size — keep this output to compare against Step 4.

- [ ] **Step 3: Write the resize/recompress script**

```python
"""One-off script: resize and recompress oversized portfolio screenshots in place.
Run once with `python scripts/optimize_images.py`, then delete or keep for future images."""
from PIL import Image
import os

MAX_WIDTH = 1200

TARGETS = [
    "images/airbnb.jpg",
    "images/foodprice.jpg",
    "images/pic03.png",
    "images/pic04.png",
    "images/pic05.png",
]

for path in TARGETS:
    img = Image.open(path)
    if img.width > MAX_WIDTH:
        new_height = round(img.height * (MAX_WIDTH / img.width))
        img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

    before = os.path.getsize(path)
    if path.lower().endswith((".jpg", ".jpeg")):
        img.convert("RGB").save(path, "JPEG", quality=80, optimize=True)
    else:
        img.save(path, "PNG", optimize=True)
    after = os.path.getsize(path)

    print(f"{path}: {img.width}x{img.height}, {before} -> {after} bytes")
```

- [ ] **Step 4: Run the script and confirm size reduction**

Run: `python scripts/optimize_images.py`
Expected: printed output shows each file's new dimensions and a smaller byte size than recorded in Step 2 (JPEGs at quality 80 typically drop 50-80%; resized PNGs drop with the width reduction).

- [ ] **Step 5: Visually spot-check the recompressed images**

Open each of the 5 modified files directly in a browser or image viewer. Expected: no visible quality degradation at normal viewing size (these are screenshots/charts displayed in a ~400px-wide grid card, so 1200px source width is still well above display resolution).

- [ ] **Step 6: Update the corresponding `<img>` tags with `width`/`height` and lazy-loading**

Using the exact dimensions printed in Step 4, change (`index.html:126,132,140,146,156` — example for line 126, substitute the real printed width/height for each):
```html
<a href="https://github.com/mahdishirvin/ML-Airbnb/blob/Phase-2/Project1_Regression_Mahdi.ipynb" target="_blank" rel="noopener noreferrer" class="image fit"><img src="images/airbnb.jpg" alt="Airbnb price forecast regression notebook screenshot" /></a>
```
to (widths/heights below are placeholders for "the value Step 4 printed for this file" — copy the real numbers from your Step 4 output, do not guess):
```html
<a href="https://github.com/mahdishirvin/ML-Airbnb/blob/Phase-2/Project1_Regression_Mahdi.ipynb" target="_blank" rel="noopener noreferrer" class="image fit"><img src="images/airbnb.jpg" alt="Airbnb price forecast regression notebook screenshot" width="1200" height="900" loading="lazy" /></a>
```
Repeat for `pic05.png` (line 132), `pic04.png` (line 140), `pic03.png` (line 146), and `foodprice.jpg` (line 156), each with that image's own printed width/height. Do not add `loading="lazy"` to the avatar (`index.html:54`) or the About photo (`index.html:201`'s img) — those are above/near the fold.

- [ ] **Step 7: Verify no layout shift and confirm lazy-loading is wired up**

Open `index.html` with DevTools Network tab open, throttled to "Slow 3G". Expected: portfolio image `<img>` requests only fire as you scroll them into view (Network tab shows them loading late, not all at once on page load); Lighthouse's "Cumulative Layout Shift" for the portfolio section drops to ~0 because the boxes now reserve space via `width`/`height` before the image loads.

- [ ] **Step 8: Commit**

```bash
git add scripts/optimize_images.py images/airbnb.jpg images/foodprice.jpg images/pic03.png images/pic04.png images/pic05.png index.html
git commit -m "perf: resize/recompress oversized portfolio images, add width/height and lazy loading"
```

**Note — out of scope for this task:** `images/airbnb.gif` (1.1MB) and `images/giphy.gif` (2.0MB) are animated and cannot be safely recompressed with the tools available in this environment (no ffmpeg/gifsicle/ImageMagick installed). Recommended manual follow-up: convert both to muted, looping `<video>` elements (`.mp4`/`.webm`) using a tool of your choice — this typically shrinks animated content by 80-90% over GIF — then swap the `<img>` for a `<video autoplay muted loop playsinline>` tag pointing at the new file.

---

## Task 7: SEO fixes

**Files:**
- Create: `robots.txt`
- Modify: `sitemap.xml` (refresh `lastmod`)
- Modify: `index.html:29-42` (Open Graph/Twitter meta tags, typo fix — `Utdallas.edu` link already fixed in Task 2)

**Interfaces:** None — static metadata additions.

- [ ] **Step 1: Add a robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://mahdishirvin.github.io/sitemap.xml
```

- [ ] **Step 2: Refresh sitemap.xml lastmod dates**

Change each `<lastmod>` value in `sitemap.xml` (currently `2020-07-18T20:57:53+00:00` / `2020-07-16T00:45:47+00:00`) to today's date in the same ISO-8601 format, e.g. `2026-08-26T00:00:00+00:00`, reflecting that this review actually updated the page content.

- [ ] **Step 3: Fix the meta description typo**

Change (`index.html:32`):
```html
		<meta name="description" content="Welcome to Mahdi Shirvin's homepage. I'm a data analysis and visualisation enthousiast.">
```
to:
```html
		<meta name="description" content="Welcome to Mahdi Shirvin's homepage. I'm a data analysis and visualisation enthusiast.">
```

- [ ] **Step 4: Add Open Graph and Twitter Card meta tags**

Add immediately after the existing `<meta name="author" ...>` line (`index.html:34`):
```html
		<meta name="author" content="Mahdi Shirvin">

		<meta property="og:type" content="website">
		<meta property="og:title" content="Mahdi Shirvin | Data - BI Analyst">
		<meta property="og:description" content="Welcome to Mahdi Shirvin's homepage. I'm a data analysis and visualisation enthusiast.">
		<meta property="og:url" content="https://mahdishirvin.github.io/">
		<meta property="og:image" content="https://mahdishirvin.github.io/images/logo-white.png">
		<meta name="twitter:card" content="summary">
		<meta name="twitter:title" content="Mahdi Shirvin | Data - BI Analyst">
		<meta name="twitter:description" content="Welcome to Mahdi Shirvin's homepage. I'm a data analysis and visualisation enthusiast.">
		<meta name="twitter:image" content="https://mahdishirvin.github.io/images/logo-white.png">
```

- [ ] **Step 5: Verify the new meta tags render correctly**

Use a social-share debugger such as https://www.opengraph.xyz/ against `https://mahdishirvin.github.io/` (after deploying) — or, before deploying, `grep -c "property=\"og:" index.html` locally. Expected: preview shows the title, description, and `logo-white.png` image; grep count is `5`.

- [ ] **Step 6: Commit**

```bash
git add robots.txt sitemap.xml index.html
git commit -m "seo: add robots.txt, refresh sitemap, add Open Graph/Twitter meta tags, fix description typo"
```

**Manual follow-up (requires the site owner's own credentials, not automatable here):** The Google Analytics snippet at `index.html:19-27` uses Universal Analytics property `UA-173009769-1`, which Google stopped processing in July 2023 — it currently tracks nothing. To fix: create a GA4 property in your Google Analytics account, get its Measurement ID (format `G-XXXXXXXXXX`), and replace both occurrences of `UA-173009769-1` in `index.html:20,26` with that ID (the `gtag.js` snippet's URL and shape already match GA4's format, only the ID needs to change).

---

## Self-Review Notes

- **Spec coverage:** All 8 problems in "Problems & Solutions" map to a task: 1→Task 1, 2→Task 1, 3→Task 2, 4→Task 3, 5→Task 4, 6→Task 5, 7→Task 6, 8→Task 7.
- **Placeholder scan:** Task 6 Step 6 explicitly calls out that the width/height values shown are illustrative and must be replaced with each file's own Step 4 output — this is a necessary consequence of not knowing the post-resize dimensions until the script runs, not a vague instruction; the script and every other step contain concrete, runnable content. The GA4 Measurement ID in Task 7 is a credential only the site owner has — the step names the exact lines to edit and the exact format expected, which is the most concrete a plan can be about an external, owner-only value.
- **Type/attribute consistency:** `LinkedIn` label (Task 4) matches the `rel="noopener noreferrer"` addition (Task 5) at the same line — Task 5's example snippet for line 75 already includes both fixes combined so an executor applying tasks in order doesn't overwrite one with the other.
