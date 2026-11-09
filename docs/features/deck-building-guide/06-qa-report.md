# QA report: deck-building-guide

## Round 1

### Pass A1

Suite: `node scripts/test-odds.js` -> 7460 passed, 0 failed.

| AC | Result | Evidence |
|---|---|---|
| AC-1 | PASS | deck-building.html: version meta 1.0.0 (l.6), crumbline "Home · Quick reference" (l.20), nav.contents with "← Quick reference" (l.28), numbered section.chapter + chapter-head, fleurons, footer.colophon "Version 1.0.0" |
| AC-2 | PASS | Links illuminary.css (l.11), same Google Fonts href as rarity.html (diff identical), site.js (l.241). Browser: theme select changed to Classic and light/dark toggle clicked, no errors |
| AC-3 | PASS | Chapter I states 60+, 1-2 inks, 4 copies per full name, each with sup.cite to ref-1 (Comprehensive Rules 2.2.0); links rules-changes.html (l.52) |
| AC-4 | PASS | Every community chapter (III-X) has a "Community advice ... Not an official rule" note; chapters I-II are labelled "Official rule" |
| AC-5 | PASS | Chapters IV inkable (refs 2-8,10), V curve, VI archetypes (aggro/midrange/control/ramp/songs, refs 11, 2, 7), VII roles incl. Bodyguard and finishers (refs 2,4,8,9), VIII copy counts, IX mulligans (ref 12); all in References 1-12 |
| AC-6 | PASS | l.120 links inks.html#pairings; id="pairings" exists in inks.html:48 |

Bugs: none. Note (not a bug): only console error is the missing /favicon.ico 404 from the static server (affects all pages).

### Pass A2

Suite not re-run (A1 passed). Static/code inspection of deck-building.html, quick-reference.html, base-rules.html, theme CSS.

| AC | Result | Evidence |
|---|---|---|
| AC-7 | PASS | Chapter II (l.57-62) "Official rule", precedes community chapters (III+); text matches base-rules.html:77 (bottom any number, draw that many, shuffle, once); cites ref-1; community mulligan advice only in Ch. IX |
| AC-8 | PASS | `table-tools.html#deck-odds` linked in Ch. IV inkables (l.88), Ch. VIII copies (l.152), and example (l.205); `id="deck-odds"` exists in table-tools.html:124 |
| AC-9 | PASS | figure.diagram (l.178) svg role=img aria-labelledby="curve-t curve-d", `<title>`+`<desc>`, figcaption (l.201); only dg-* classes (acc,b,bar,lead,line,s,t,dash), all defined in illuminary/classic/storybook css; no hardcoded fill/stroke colors |
| AC-10 | PASS | section#refs, ol.refs, li#ref-1..12; all 12 refs cited in text via sup.cite (12 distinct hrefs resolve); every external ref link has target=_blank rel=noopener (no non-conforming http links) |
| AC-11 | PASS | grep for prices/$/tournament/win rate/champion: no hits; example curve captioned "illustrative, not a real decklist"; spot-checked claims vs research-sources.md (20.4% uninkable, items 40%, 40-50% outlier flagged) match |
| AC-12 | PASS | quick-reference.html:41 `<li><a href="deck-building.html">Deck building</a></li>`, unnumbered, after Rarity |

Bugs: none new.

### Pass A3

Suite not re-run (A1 passed). Real browser (Playwright) on http://127.0.0.1:8765/table-tools.html#deck-odds; expected values independently computed in python (math.comb, exact DP over joint hypergeometric).

| AC | Result | Evidence |
|---|---|---|
| AC-13 | PASS | index.html:49 `<li><a><span.t/><span.lead-dots/><span.k/></a><span.d>one-line description</span></li>`, identical pattern to Rarity at :48 |
| AC-14 | PASS | `section#deck-odds` (table-tools.html:124) with root `#deck-odds-root`, nav entry l.29 "III Deck Odds" (anchor works, page loaded at #deck-odds); logic in tools.js (IIFE no-op check per A1/T-n) |
| AC-15 | PASS | Mode "Draw a card" has Deck size/Copies/Turn + play/draw toggle; play turn 3 shows "9 cards seen", draw turn 3 "10 cards seen" (=7+T-1 / 7+T); turn 1 play "7 cards seen"; note "Mulligans are not modeled" displayed |
| AC-16 | PASS | D=60,K=4,T3: play 48.8%, draw 52.8%; K=0 -> 0.0%; explanatory text shown |
| AC-17 | PASS | Inkables D=60,K=24: T3 draw 85.6%, T3 play 78.9% (python exact DP: 0.8559, 0.7887, match); T1 play 97.8%, T1 draw 98.8% (match). Exact, not approximate |
| AC-18 | PASS | inkables=60 -> 100.0%; inkables=0 -> 0.0%; N=1, K=24 play: inkables 97.8% = Draw-mode 97.8%; draw: inkables 98.8% = expected 1-C(36,8)/C(60,8)=0.98817 |

Notes (not bugs): switching mode resets the copies/inkables field to 4. Only console error is /favicon.ico 404. Layout/375px, validation, a11y not in scope for A3.

Bugs: none new.

### Pass A4

Suite not re-run (A1 passed). Real browser (Playwright) on http://127.0.0.1:8765/table-tools.html; server stopped after.

| AC | Result | Evidence |
|---|---|---|
| AC-19 | PASS | ArrowUp on Turn field updated result live (turn 2 play: 44.5%, 8 cards seen); toggling play/draw and mode updated without reload; text "Chance to have drawn at least one copy by turn N, on the play. X cards seen." |
| AC-20 | PASS | Messages, no number shown: deck 2.5 "deck size must be a whole number"; deck empty "enter a whole number for deck size"; deck 0 "must be at least 1"; copies -1 "can't be negative"; copies 50 > deck 40 and inkables 61 > 60 "can't be more than the deck size"; turn 0 "at least 1". Deck 10, K=4, turn 999 (cards seen >= deck) -> 100.0%, "10 cards seen", no error. No NaN/Infinity seen. Inputs get aria-invalid + aria-describedby |
| AC-21 | PASS | table-tools.html:142-152 `<label for>` on all 3 inputs (accessible names confirmed in snapshot, incl. relabel in Inkables mode); `#odds-result role=status aria-live=polite`; keyboard: click-free ArrowUp on number input, Shift+Tab reached toggle buttons, Enter toggled aria-pressed (On the draw) |
| AC-22 | PASS | tools.js:290 odds glue uses textContent only (l.330-346); no innerHTML in the diff additions (`git diff -U0` grep = 0); no new localStorage keys (only pre-existing KEY at l.73/82); no new script/external refs in table-tools.html diff |
| AC-23 | PASS | Coin flip runs ("Flipping…", button disabled, then re-enabled); lore tracker kept pre-existing saved state (Brian 7), +1 -> 8, page reload -> still 8 with name intact |
| AC-24 | PASS | All 9 .odds-* classes (bar, field, fields, input, label, note, num, result, text) have rules in illuminary, classic, storybook css; `.deck-odds` added to the --tk-* mapping selector (+dark overrides) in all three (illuminary:261-263, classic:208-210, storybook:253-255). Screenshots reviewed, all legible/themed: classic light+dark, storybook light+dark, illuminary light+dark (.playwright-mcp/qa-*.png) |

Notes (not bugs): only console error is /favicon.ico 404. 375px layout not in AC-19..24 scope. Storybook renders the tool without a bordered panel (Classic/Illuminary have one); cosmetic, matches that theme's other sections as far as seen, not judged a defect.

Bugs: none new.

### Pass A5 (AC-25, AC-26)

| AC | Result | Evidence |
|---|---|---|
| AC-25 | PASS (caveat) | Scratch iframe harness (deleted after), pages deck-building.html and table-tools.html x 3 skins x light/dark x 375px/1280px = 24 cases: scrollWidth == clientWidth in all (360/360 and 1265/1265, scrollbar excluded), and no element's right edge exceeds the viewport. Caveat: harness set the skin/theme via localStorage but did not separately confirm each stylesheet swap rendered; legibility/contrast not judged here (Pass B). |
| AC-26 | PASS | Each changed/new file's version equals the newest CHANGELOG entry (2026-11-09): deck-building.html 1.0.0 (new); table-tools.html 2.2.0 -> 2.3.0; quick-reference.html 4.4.0 -> 4.5.0; index.html 3.4.0 -> 3.5.0; tools.js 1.3.0 -> 1.4.0; classic.css 1.6.0 -> 1.7.0; illuminary.css 1.4.0 -> 1.5.0; storybook.css 1.9.0 -> 1.10.0 (all MINOR; CSS/JS carry no in-file version, same as before, so CHANGELOG is the record). Repository entry 3.18.2 -> 3.19.0 covers README.md and scripts/test-odds.js (no version header in test-odds.js; none required). README tree lists deck-building.html (l.17), scripts/test-odds.js (l.33); table-tools.html and tools.js descriptions mention the deck odds calculator (l.19, l.30). Newest-first order kept. |

New bugs: none.

### Pass B (browser and accessibility)

Real browser (Playwright) on http://127.0.0.1:8765. Themes switched with the on-page theme select (stylesheet change confirmed visually each time) and the light/dark button. Screenshots in `docs/features/deck-building-guide/qa-shots/`. Contrast figures computed from the CSS token values (python, WCAG formula).

| Check | Result | Evidence |
|---|---|---|
| deck-building.html diagram, 3 themes x light/dark (1280px) | PASS | `qb-{il,cl,sb}-{light,dark}-fig.png`: all bar counts, axis labels, dashed guide, caption legible; no overlap; peak bars distinct by fill and by numbers |
| `.note` community labels, 6 modes | PASS | `qb-*-note.png`: label and text legible in all six; Storybook uses small-caps gilt label, others bold/regular |
| Chart centering | PASS (cosmetic note) | Chart plot sits about 20px left of the text column center (plot 393-829 vs column center 632 at 1280px, `qb-sb-dark-desk.png`) because the SVG reserves the "Cards" axis label on the left; caption is centered. Reads as natural, not a defect |
| Odds tool pressed toggles, 6 modes | PASS | `qb-il-dark-odds-focus1.png`, `qb-{il,cl,sb}-{light,dark}-odds.png`; on-accent/accent contrast 5.03 to 11.43 (all >= 4.5) |
| Odds error state, 6 modes | PASS with BUG-1 | Message "Check the inputs: deck size must be at least 1.", number hidden, input gets ruby border; ruby on surface 4.63-5.64 except Storybook light |
| Focus-visible outlines, buttons and inputs | PASS | Toggle (`focus1`) and input (`focus2`) show 2px outline plus offset in Illuminary dark; focus color vs surface/page bg >= 3:1 in all 6 (lowest Storybook light gilt on paper-2 3.95) |
| Keyboard-only | PASS | Tab order: toggle, toggle, play/draw x2, deck, copies, turn (spec s7); Enter/Space toggles (A4); spinner arrows native |
| Heading order, landmarks | PASS | deck-building: h1, then h2 per chapter; header, nav[aria-label=Contents], main, footer. table-tools: h1 "Tools", h2 "Deck Odds"; groups labelled via aria-labelledby |
| Labels, status | PASS | `label for` on 3 inputs; `#odds-result role=status aria-live=polite` is a single persistent container; aria-describedby set only while invalid (tools.js:322-325) |
| SVG naming | PASS | `role=img aria-labelledby="curve-t curve-d"`; title plus desc list all 7 counts (deck-building.html:179-181); accessibility tree exposes the full text |
| 375px, deck-building (Storybook dark) and odds (Illuminary light) | PASS | `qb-m-sb-dark-ex2.png`, `qb-m-il-light-odds2.png`: fields stack, toggles wrap, error wraps, no horizontal scroll, chart fits |
| Console | PASS | Only the pre-existing /favicon.ico 404 |

### Bugs (Pass B)

- BUG-1 (minor): Storybook light, error text `--ruby` (#c8283d) on `.odds-result` surface (`--paper-2` #ece3cf) is 4.30:1, under the 4.5:1 the design spec s7 requires. Repro: Storybook theme, light mode, Deck Odds, set Deck size to 0. Expected >= 4.5:1; actual 4.30:1. Location: storybook.css:309 (`.odds-result[data-state="error"] .odds-text`). Legible in the screenshot, so no AC fails.
- BUG-2 (minor, polish): at 375px the SVG scales down to about 0.7x, so count numbers and axis labels render around 8-10px (`qb-m-sb-dark-ex2.png`); readable but small. Also the sticky contents nav takes about 225px of an 800px viewport at 375px (existing nav pattern). Not an AC failure.

Not covered: Classic dark and Illuminary dark at 375px, and the 375px sweep of every theme (A5 covered overflow numerically); Windows high-contrast mode.

No Pass B verdict (pass C writes it). New bugs: 0 critical, 0 major, 2 minor.

### Pass C (regression, exploratory, verdict)

| Check | Result | Evidence |
|---|---|---|
| `node scripts/test-odds.js` | PASS | 7460 passed, 0 failed, exit 0 |
| Shared CSS diff (3 themes) | PASS | Only change to existing rules: `.deck-odds` added to the `--tk-*` mapping and the `.tracker` dark on-accent rule widened; plus `ol.refs a` overflow-wrap. No existing selector values changed |
| table-tools Lore tracker, Storybook dark | PASS | `qc-sb-dark-tools.jpg`: saved 4-player state kept, winner highlight, buttons, Coin Flipper intact |
| rarity.html, Illuminary dark | PASS | `qc-il-dark-rarity.jpg`: ladder diagram, finish matrix, both tables, notes, refs fine |
| base-rules.html, Illuminary light | PASS (coarse) | `qc-il-light-baserules.jpg`: diagrams and tables render, no overlap visible (downscaled full-page shot) |
| inks.html grid, Illuminary light | PASS | `qc-il-light-inks.jpg`; 0 console errors |
| lore.html | PASS (load only) | Loads; its 1 console entry is the pre-existing favicon 404 |
| Calculator: deck 99999999999999999999 | PASS | "deck size must be 999 or less", number hidden |
| Calculator: deck 5, turn 3 (cards seen > deck) | PASS | 100.0%, "5 cards seen" (capped) |
| Calculator: turn 4.5 | PASS | "turn number must be a whole number", input flagged |
| Calculator: copies "1e1" | PASS | Accepted, no error on that field |
| Calculator: rapid mode switching (dblclick Inkables, play/draw, back and forth) | PASS | `qc-il-light-odds-rapid.png`: labels switch to "Inkable cards in deck / Through turn", pressed states consistent, error persists correctly |
| test-odds.js versioning | NO BUG | Matches existing convention: `scripts/build-inks.py` also has no version header and is tracked only under the Repository entry. README Versioning covers site/doc files. test-odds.js is listed in README tree and CHANGELOG 3.19.0 |

Not covered: all-theme light/dark sweep of the regression pages (only the pages and modes listed above); Classic theme regression; real clipboard paste (used fill, which sets values directly).

New bugs this pass: none. Open bugs: BUG-1 (minor), BUG-2 (minor). Pass A/B ACs all passed per their sections.

### Round 1 verdict

Open bugs: 0 critical, 0 major, 2 minor (BUG-1 Storybook light error contrast 4.30:1, BUG-2 small chart text at 375px).

VERDICT: PASS

## Round 2 (re-test)

Suite: `node scripts/test-odds.js` gave 7460 passed, 0 failed, exit 0.

| Bug | Status | Evidence |
|---|---|---|
| BUG-1 | FIXED | storybook.css:310-313 sets `--odds-error` #b02236 (light), `var(--ruby)` in dark. Computed contrast #b02236 on #ece3cf = 5.26:1 (was 4.30); dark #ee5568 on #1b1e36 = 4.77:1 (unchanged). Browser: `qa-shots/r2-odds-err-sb-light.png` (darker ruby text on the panel), `r2-odds-err-sb-dark.png` and `r2-odds-err-ill-dark.png` show no regression (message and ruby input border intact). |
| BUG-2 | FIXED | Viewport screenshots in 3 themes x light/dark x 375/1280 (`qa-shots/r2-{ill,cls,sb}-{light,dark}-{375,1280}.png`). Count numbers, cost labels, "Cards" and "Ink cost" are legible, no overlaps. At 375px the SVG scales about 0.88 (351px wide / 400 viewBox), so 15px text renders about 13px and 12.5px text about 11px. At 1280px it renders 1:1. |

| AC | Result | Evidence |
|---|---|---|
| AC-9 (diagram) | PASS | Chart renders correctly with accessible name, bars and counts 8/12/12/10/8/6/4, in all 12 combinations. |
| AC-24 (themes) | PASS | Chart and odds error state correct in all 3 themes, both modes. |
| AC-25 (no overflow) | PASS (with gap) | No horizontal scrollbar and no clipped content in the 375px screenshots. I could not read `scrollWidth` directly (no script tool in this session); the developer's CDP check reported 375/375. |

Console: only a favicon.ico 404 from the static server (not caused by the feature). No new bugs.

Open bugs: 0.

VERDICT: PASS
