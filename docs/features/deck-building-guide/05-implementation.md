# 05 — Implementation notes

## T-1 — Odds math and Node test harness
- Appended a third IIFE to `assets/js/tools.js`. It first sets `window.lorcanaOdds = { cardsSeen, drawOdds, inkOdds, formatPct }` (the function declarations are hoisted), then `if (!root) return` on `#deck-odds-root`. Coin and tracker IIFEs are untouched (AC-14, AC-23).
- `cardsSeen` = min(D, play ? 6+T : 7+T). `drawOdds` uses a product of ratios. `inkOdds` is an exact DP that zeroes i<t after each turn's checkpoint. Both results are clamped to [0,1]. `formatPct` clamps, then `toFixed(1)`.
- Header comment bumped to v1.4.0 and now mentions deck odds. No deviations from the spec.
- Files: `assets/js/tools.js` (modified), `scripts/test-odds.js` (new).
- Tests: `node scripts/test-odds.js` gives **7341 passed, 0 failed**, exit 0. Covers the AC-15/16/18 vectors, K=D for N=1..60, clamping, and a brute force for D=1..12, every K, T=1..D+2, both seats (draw and ink, within 1e-9, finite and in [0,1]). Perf: `inkOdds(999,500,999,false)` comes in under 200 ms.
- Sanity: 60/20 inkables by turn 4 on the play gives 44.1%.
- Not verified: coin and tracker in a browser (no browser tools; left for QA). CHANGELOG entry is deferred to T-10 per the spec.

## T-2 — Validation and result sentences (pure)
- Added `validate(mode, deckStr, countStr, turnStr)` and `describe(mode, onPlay, turn, seen)` to the odds IIFE in `assets/js/tools.js` and to `window.lorcanaOdds` (AC-19, AC-20).
- `validate` checks deck, then count, then turn (first error wins), in the spec's per-field order, with the exact spec messages. The field name for count is "copies" (draw) or "inkables" (ink). It returns numbers on success.
- Small addition: `Infinity` (or any non-finite value) is treated as "not a whole number". Without that, `Math.floor(Infinity) === Infinity` let it fall through to "must be 999 or less", which would be misleading.
- Note: `Number()` accepts forms like `"1e2"` and `"0x10"` per the spec's `Number()` rule. They parse as whole numbers and are then range-checked, so they can't produce NaN.
- Files: `assets/js/tools.js`, `scripts/test-odds.js` (modified).
- Tests: `node scripts/test-odds.js` gives **7411 passed, 0 failed**, exit 0 (T-1 had 7341). New cases cover every message, deck-over-turn and count-over-turn priority, `"60","4","3"` ok, `"4.5"`, `"-1"`, `""`, `"1000"`, 61 of 60, and all four `describe` strings.

## T-3 — Tool III markup and DOM glue
- `table-tools.html`: added the nav entry, a fleuron, and `section.chapter#deck-odds` with the exact markup, copy and ids from the spec, plus the `noscript` note. Updated the `.sub` and the colophon ("The odds tool stores nothing."). Bumped to v2.3.0 (meta and footer) and Updated 2026-11-09 (AC-14, AC-15, AC-21).
- `assets/js/tools.js`: added DOM glue at the end of the odds IIFE, after the `#deck-odds-root` guard. Toggles keep exactly one button pressed, and clicking the pressed one does nothing. Mode switch sets both labels and swaps 4 and 24 only when the field holds the other mode's default. Recompute runs on `input` (delegated on the root), on toggle clicks and on load. Errors flag only the offending input (`aria-invalid`, `aria-describedby="odds-result"`), empty `.odds-num` and set `data-state="error"`. Output uses `textContent` only, and there's no storage (AC-19, AC-22).
- No deviations. The tools.js header version was already v1.4.0 from T-1.
- Tests: `scripts/test-odds.js` now parses the real `#deck-odds` section into a small fake DOM and runs tools.js against it. It checks 48.8%, 52.8% on the draw, 0.0% at copies 0, errors and their clearing, labels, the default swap, no-op clicks, role/aria-live, the nav entry and no innerHTML or storage. Result: **7460 passed, 0 failed**, exit 0 (T-2 had 7411).
- Not verified: real browser behavior, keyboard use, and the coin and tracker at runtime (their code is untouched). Left for QA. Styling is T-4.

## T-4 — Theme styles for the odds tool
- `illuminary.css`, `classic.css` and `storybook.css`: added `.deck-odds` to the `--tk-*` mapping selector and to both dark `--tk-on-accent` overrides (`[data-theme="dark"]` and `prefers-color-scheme`). Added an identical "deck odds" block after the lore tracker (`.odds-bar`, `.odds-fields` with one column at 560px or less, `.odds-field`, `.odds-label`, `.odds-input` with hover, `aria-invalid` and focus-visible states, `.odds-result`, `.odds-num`, `.odds-text`, `.odds-note`). Added `ol.refs a { overflow-wrap: anywhere; }`. Header versions are now 1.5.0, 1.7.0 and 1.10.0 (AC-21, AC-24, AC-25).
- The focus colors follow the tech spec: Illuminary `--glimmer`, Classic `--link`, Storybook `--gilt`.
- Small additions beyond the spec: `min-width: 0` on `.odds-field` to guard against grid overflow. The error selector is `.odds-result[data-state="error"] .odds-text`.
- Verification: I ran headless Chrome through CDP on `table-tools.html` for 3 themes × light/dark × 375px and 1280px.
  - No horizontal overflow in any of the 12 runs (scrollWidth − clientWidth = 0), including in the error state.
  - Fields: 3 columns at 1280px and 1 at 375px. Inputs are 44px high.
  - The result shows 48.8%.
  - Pressed toggles use the dark `--tk-on-accent` in dark mode, matching `.tracker`.
  - Error text and the invalid border use each theme's `--ruby`.
  - The input matches `:focus-visible` and gets a solid 2px outline in the theme focus color.
  - I checked the storybook-dark-375 and illuminary-light-1280 screenshots by eye.
- Tracker colors are unchanged, and the diff touches no existing tracker, diagram or rarity rule.
- Tests: `node scripts/test-odds.js`: **7460 passed, 0 failed**, exit 0.
- Not verified: contrast ratios were not measured numerically, and the rarity and Base Rules pages were not screenshotted. Both are left for QA.

## T-5 — Guide page: skeleton, official chapters, References
- New `deck-building.html` (1.0.0). It uses the `rarity.html` head, fonts, `illuminary.css` and `site.js`, and keeps only the fleuron symbol from the sprite. It has the header (kicker "Build"), a contents nav (back link, I, II), Ch I `#official-rules` (a "60+ / 1–2 inks / 4 per full name" `ul`, each item citing ref-1, plus a link to `rules-changes.html`), Ch II `#mulligan` (the `base-rules.html` Opening sentence word for word, plus the 2.2.2 details), `#refs` (`num` "Sources") and the colophon from the spec (AC-1, 2, 3, 7, 10).
- **Deviation (orchestrator override):** ref-1 is **CR 2.2.0** (effective 9 July 2026, `files.disneylorcana.com/Comprehensive-Rules_2.2.0-EN.pdf`) and cites 1.10.1.1, 5.2.5.1, the glossary and 2.2.1.4–2.2.3. It isn't v2.3, because the Oct 2026 PDF couldn't be read (research-sources §1). **Follow-up:** check the section numbers against `CRUpdate_EN_Oct-2026.pdf`.
- The rule that a dual-ink card counts as each of its inks is included because 5.2.5.1 confirms it.
- Files: `deck-building.html` (new).
- Verification: headless Chrome through CDP on 3 themes × light/dark × 375/1280 (12 runs). The skin CSS swaps, the toggle flips `data-theme`, and the theme menu changes and saves the skin. Overflow is 0 in every run. No JS errors; the only console error is the site-wide `favicon.ico` 404. A Python check found balanced tags, no duplicate ids, all `#` anchors resolving, and every external link with `_blank`/`noopener`. I checked the storybook-dark-375 screenshot by eye. `node scripts/test-odds.js` is unaffected.
- Not done in T-5: nav entries (T-9) and the CHANGELOG/README (T-10).

## T-6 — Guide: chapters III–VI (intro, inkables, curve, archetypes)
- Added `#community-intro` III, `#inkables` IV, `#curve` V and `#archetypes` VI before `#refs`, with fleurons and nav entries. Each opens with the spec's `p.note` "Community advice" label (AC-4).
- IV gives the uninkable range by source (10–13 / 11–13 / 13–15 / at most 15–19, aggro up to 18–20) rather than one number. It flags S9's 40–50% as an outlier and ends with the `table-tools.html#deck-odds` link (AC-5, AC-8). V lists each guide's curve counts. VI is a `ul` of aggro, midrange, control, ramp and songs, then the `inks.html#pairings` link (AC-6).
- **Research override (orchestrator):** no new web research. Only S1–S11 from research-sources.md are cited, and only the claims recorded there. Video leads aren't cited. Refs ref-2 to ref-12 are in first-cite order: S1, S5, S4, S6, S7, S10, S9, S2, S11, S8, S3. S1 is noted as community advice even though it's hosted on the official site.
- I left out S4's card-type mix (22/12/4, which doesn't sum to 60) and Karsten's "champion" title, which would be an uncited tournament claim (AC-11). There are no prices or decklists.
- Version stays 1.0.0 because the page is new and unreleased.
- Files: `deck-building.html`.
- Verification: a Python check found no duplicate ids, 0 unresolved cites, all 12 refs cited, all `#` anchors resolving, every external link with `_blank`/`noopener`, and balanced tags. I ran CDP headless Chrome on 3 themes × light/dark × 375/1280 (12 runs). Overflow was 0 and no element was wider than the viewport. I found 4 notes, and the toggle and theme menu work. The only console error is the existing `favicon.ico` 404. I checked the storybook-dark-375 screenshot by eye.

## T-7 — Guide: chapters VII–IX (roles, copies, mulligan advice)
- Added `#roles` VII "Card roles", `#copies` VIII "Copy counts" and `#mulligan-advice` IX "Mulligan advice" before `#refs`, with fleurons and nav entries. Each opens with the spec's `p.note` "Community advice" label (AC-4). Lists and paragraphs only, no tables.
- VII: a `ul` of lore-getters (S4 "Questers", S2 Evasive), removal (S1 at least 4, S9 4–8 plus 2–3 tech, S2), draw (S1 at least 4, S4 "engines"), Bodyguard blockers (S4 contesters, S2) and finishers (S4, 2–3 copies) (AC-5).
- VIII: S1's 4/3/2/1 scale and the Rule of Eight (40%/67%, 65%/90%; I checked 40% by hand: 1−C(56,7)/C(60,7) ≈ 39.9%), S4 finishers, S7 4-ofs and the starter upgrade. Ends with the `table-tools.html#deck-odds` link (AC-8).
- IX: links back to `#mulligan` (AC-7). Uses S3's inkable zones, two-question test, play/draw and archetype advice, S2's curve-building and 25% caveat, and S5's expensive-uninkables advice.
- **Research override:** no new refs. Only the existing ref-2 to ref-12 (S1–S11) are reused, and only for claims recorded in research-sources.md. Video leads aren't cited. No prices, decklists or tournament claims (AC-11).
- Files: `deck-building.html` (version stays 1.0.0 because it's unreleased).
- Verification: a Python check found no duplicate ids, 0 unresolved `#` anchors, all 12 refs cited, balanced tags, notes present in VII to IX, and every external link with `noopener`. Headless Chrome ran an iframe harness at 375px for 3 themes × light/dark (6 runs). The correct skin CSS and `data-theme` loaded each time, `scrollWidth` equalled `clientWidth`, and 0 elements in VII to IX were wider than the viewport. Browser QA by eye is still left for QA.

## T-8 — Guide: chapter X worked example diagram
- Added `#example` X "Worked example" between IX and `#refs` (with fleurons) and a nav entry. It opens with the spec's `p.note` "Community advice" (AC-4).
- `figure.diagram` SVG built exactly to spec: viewBox 0 0 520 280, `role="img"`, `aria-labelledby="curve-t curve-d"`, a title, and a desc listing all seven counts (sum 60). Bars x = 28 + i·62, width 48, height = count·14, the 12s use `dg-acc` and the rest `dg-bar`. It has a `dg-lead dg-dash` gridline at y=62, `dg-b` counts, `dg-t` cost labels, `dg-s` "Ink cost"/"Cards", and the revised figcaption (AC-9, AC-11). Only `dg-*` classes are used, so no CSS changes.
- Text: lead cites ref-2/4/6 (same as V's lead). The odds come from the shipped `lorcanaOdds` via node vm: `drawOdds(60,8,1,true)` = 65.4% and `drawOdds(60,12,3,true)` = 88.7% (9 cards seen). I cross-checked them with Python `comb`. The "2–4 at 7+" claim cites ref-5 and ref-8 (as in V). It links to `table-tools.html#deck-odds`. No new refs.
- Note: the spec's geometry leaves x 456–520 of the viewBox empty, so the chart sits slightly left of centre. I kept it as specified.
- Files: `deck-building.html` (version stays 1.0.0 because it's unreleased).
- Verification: Python found no duplicate ids, every `#` anchor resolving and balanced tags. Headless Chrome CDP ran 3 themes × light/dark × 375/1280 (12 runs). The correct skin and `data-theme` loaded each time, scrollWidth equalled clientWidth, the figure was 351px wide at 375, 0 SVG text-box overlaps, min label height 10px, `aria-labelledby` resolved, and there were no JS errors. I checked the storybook-dark-375 figure by eye. `node scripts/test-odds.js`: 7460 passed, 0 failed.

## T-9 — Navigation entries

- `quick-reference.html`: unnumbered `<li><a href="deck-building.html">Deck building</a></li>` added after Rarity (AC-12). Version 4.4.0 → 4.5.0 (meta + footer), Updated 2026-11-09.
- `index.html`: Deck building list item (kicker "Build") added after Card rarity, in the Rarity pattern (AC-13). Tools description is now "A coin flipper, a lore tracker and a deck odds calculator." Version 3.4.0 → 3.5.0 (meta + footer), Updated 2026-11-09.
- No deviations from the spec.

**Files modified:** `quick-reference.html`, `index.html`.

**Verification:** I ran headless Chrome through CDP at 375px (mobile + touch emulation), with `python3 -m http.server` serving the pages. I checked quick-reference, index and deck-building in 3 themes × light/dark, which is 18 loads.
- All 18 loads have `document.documentElement.scrollWidth` 375 = clientWidth, so there is no page scroll.
- Quick-reference nav `ol`: `overflow-x:auto`, `nowrap`, scrollWidth 564–699 > 375. The row swipes inside itself.
- The `deck-building.html` link is present on both pages, and its target exists and loads.
- There are no unit tests because the change is markup only.

## T-10 — README and CHANGELOG
- `README.md` tree: added `deck-building.html` and `scripts/test-odds.js` lines. `table-tools.html` and `tools.js` now say "deck odds calculator". The hub line adds Deck building (AC-26).
- `CHANGELOG.md`: added entries dated 2026-11-09, newest first in each existing section: Repository 3.19.0 (also records `scripts/test-odds.js`, which has no section of its own, like `build-inks.py`), quick-reference.html 4.5.0, index.html 3.5.0, tools.js 1.4.0, table-tools.html 2.3.0, storybook.css 1.10.0, classic.css 1.7.0, illuminary.css 1.5.0. Appended a new `## deck-building.html` section with 1.0.0 after `rarity.html`, with a `---` separator.
- Deviation: none. The README Conventions prose ("Quick reference is the hub…") was left as it was, because the spec names only the tree line.
- Files: `README.md`, `CHANGELOG.md`.
- Verification: grep shows that the meta and footer versions in all 4 HTML files, and the header versions in tools.js and the 3 CSS files, match their new CHANGELOG entries. `node scripts/test-odds.js` gives **7460 passed, 0 failed**, exit 0.

## Bugfix round 1

### BUG-1 — Storybook light odds error text contrast
- Root cause: `.odds-result[data-state="error"] .odds-text` used the global light `--ruby` (#c8283d), which is 4.30:1 on the panel surface `--paper-2` (#ece3cf).
- Fix (`assets/css/storybook.css` only): new scoped variable `--odds-error` on `.deck-odds`, `#b02236` in light; both dark overrides (`[data-theme="dark"]` and `prefers-color-scheme`) reset it to `var(--ruby)`. The error rule now uses `var(--odds-error)`. Global `--ruby`, the invalid-input border and the other themes are unchanged.
- Ratios (WCAG formula): Storybook light #b02236 on #ece3cf **5.26:1** (was 4.30), on `--paper` #f5efe2 5.86:1; Storybook dark #ee5568 on #1b1e36 **4.77:1** (unchanged). Illuminary/Classic not touched (QA measured 4.63-5.64).
- Versioning: no bump (still 1.10.0); added a line to the existing storybook.css 1.10.0 CHANGELOG entry.
- Tests: `node scripts/test-odds.js`: 7460 passed, 0 failed, exit 0. No automated regression test (the harness covers JS, not CSS colors); browser re-check of Storybook light/dark error state is left for QA.

### BUG-2 — Worked-example chart text too small at 375px
- Root cause: the curve SVG's viewBox was 520 wide, but at 375px the figure is 351px, so the scale was 0.675. The 15px `dg-b`/`dg-t` text rendered at about 10px and the 12.5px `dg-s` text at about 8.4px. The bars also ended at x=448, which left x 456–520 empty.
- Fix (`deck-building.html` only): tightened the viewBox to `0 0 400 280`. Bars are now 40 wide on a 52 pitch (x = 26 + i·52), labels sit at x = 46 + i·52, the gridline and baseline run 20–384, and "Ink cost" is centred at 202. The vertical geometry and counts are unchanged. I added `style="max-width: 400px"` to the figure so the chart renders at 1:1 on desktop (the same text size as other diagrams) and doesn't grow to 1.3x. Shared `dg-*` classes and the theme CSS are untouched. The version stays at 1.0.0.
- Evidence: headless Chrome CDP checked 3 themes × light/dark × 375/1280 (12 runs). At 375px the SVG is 351px wide (scale 0.8775), counts and cost labels render at 13.2px, and "Cards"/"Ink cost" at 11.0px (bounding-box heights 16–18 and 12–15). At 1280px they are 15px and 12.5px. All runs show 0 text-box overlaps, 0 labels outside the SVG, and scrollWidth equal to clientWidth (375/375, 1265/1265).
- `node scripts/test-odds.js`: 7460 passed, 0 failed. I didn't check by eye (no screenshots), so a visual re-check is left to QA.
