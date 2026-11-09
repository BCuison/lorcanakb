# 04 — Tech spec: Deck building guide plus odds calculator

**No conflicts need the user's judgment.** Upstream conflicts resolved here:
- Illuminary focus color: design says `--link`, but Illuminary's existing focus rule uses `--glimmer`. Use each theme's existing focus color: Illuminary `--glimmer`, Classic `--link`, Storybook `--gilt`.
- Rounding (design §6 contradicts itself): clamp to [0,1], then standard `toFixed(1)`. The design allows this and it matches the AC-16 vectors.
- Figcaption "Hollow bars" is wrong because the bars are filled. Revised caption in T-8.
- "{n} cards seen." goes after the sentence in the same `.odds-text` (the markup has only two `p`s).
- Footnote: use the §6 wording (two versions exist).
- References: `num` "Sources", not in the nav (design §1; rarity.html differs).
- **Input maximum: 999** for deck size and turn. Copies are bounded by deck size. Worst-case DP is about 10⁶ steps, which is instant.
- Error color hook: `data-state="error"` on `#odds-result` (no new class).

## 1. Approach

- **Math:** pure functions in a third IIFE in `tools.js`, exposed as `window.lorcanaOdds` *before* the `#deck-odds-root` guard, so Node can test them. Draw mode is a product of ratios for C(D−K,n)/C(D,n). Inkables mode is an exact DP over (cards drawn, inkables drawn) that zeroes failing states after each turn's checkpoint.
- **UI:** markup in `table-tools.html`. The DOM glue calls `validate` → `drawOdds`/`inkOdds` → `formatPct`/`describe` and writes only with `textContent`.
- **Tests:** `scripts/test-odds.js` loads `tools.js` in `vm` with a stub `document`, so all three IIFEs no-op. It runs known vectors plus a brute-force enumeration of deck orders.
- **Guide:** a static page cloned from `rarity.html`, built chapter by chapter. Each task researches and cites its own sources.
- Each task bumps versions in its files. The changelog and README follow in T-10, because of the 3-file limit.

Rejected:
- Monte Carlo: AC-17 requires exact results.
- Closed-form inclusion–exclusion for inkables: error-prone, while the DP is short.
- A separate `odds.js`: AC-14 puts the logic in `tools.js`.
- BigInt binomials: not needed, since ratios are stable up to 999.
- A headless-browser test rig: no deps allowed.

**Failure modes:** no service worker, storage, external API or ports, so none of those apply.
- JS disabled: the `noscript` note shows.
- A thrown error in the odds IIFE can't stop the coin or tracker, because they run first in separate IIFEs.
- Bad input never reaches the math, because `validate` gates it.
- Float drift is clamped.

## 2. File map

| File | Purpose |
|---|---|
| `assets/js/tools.js` | Odds IIFE: math, validation, copy, DOM glue (v1.4.0) |
| `scripts/test-odds.js` (new) | Node unit tests for odds math and validation |
| `table-tools.html` | Tool III markup, nav, sub, colophon (v2.3.0) |
| `assets/css/illuminary.css`, `classic.css`, `storybook.css` | `.deck-odds`/`.odds-*` rules, `--tk-*` mapping (1.5.0 / 1.7.0 / 1.10.0) |
| `deck-building.html` (new) | The guide (1.0.0) |
| `quick-reference.html`, `index.html` | Nav entries (4.5.0 / 3.5.0) |
| `README.md`, `CHANGELOG.md` | Structure tree and entries |

## 3. Tasks

### T-1 Odds math and Node test harness
**Files:** `assets/js/tools.js`, `scripts/test-odds.js` (new)
**ACs:**
- AC-15: cards seen = 7+(T−1) on the play, 7+T on the draw.
- AC-16: P = 1 − C(D−K,n)/C(D,n). Vectors: 60/4/turn 3 on the play → 48.8%, on the draw → 52.8%, K=0 → 0.0%.
- AC-17: exact P that inkables seen by turn t ≥ t for every t=1..N.
- AC-18: inkables = D → 100.0%, 0 → 0.0%, N=1 equals draw mode.
- AC-14: own IIFE that no-ops without its root.
- AC-23: coin and tracker unchanged.

**Build:**
- Update the header comment to `v1.4.0` and mention deck odds.
- Append an IIFE. First line: `window.lorcanaOdds = { cardsSeen, drawOdds, inkOdds, formatPct }`. Then `var root = document.getElementById('deck-odds-root'); if (!root) return;`.
- `cardsSeen(turn, onPlay, D)` = `min(D, onPlay ? 6+turn : 7+turn)`.
- `drawOdds(D,K,T,onPlay)`: ratio = Π over i<n of (D−K−i)/(D−i), which is 0 once a numerator ≤ 0. Return 1−ratio.
- `inkOdds(D,K,N,onPlay)`: `dist[i]` = P(i inkables drawn and all checks passed). Draw one card at a time up to `cardsSeen(t)`; the card is inkable with probability (K−i)/(D−j). After turn t, zero every `dist[i]` with i<t. Return the sum. (If N > D, the result is 0 unless K ≥ N, which is correct.)
- Clamp both results to [0,1]. `formatPct(p)` = `(clamp(p)*100).toFixed(1)+'%'`.

**Test file:**
- Use the `vm` context `{document:{getElementById:()=>null}}` with `ctx.window=ctx`.
- Assert the vectors, including K=D for N ≤ D.
- Brute force for D=1..12, every K, turns 1..D+2, both seats: enumerate every bitmask with popcount K, compare to both functions within 1e-9, and check results are finite and in [0,1].
- `inkOdds(999,500,999,false)` must run in under 200 ms.
- Exit with code 1 on any failure.

**Verify:**
- `/opt/homebrew/bin/node scripts/test-odds.js` passes.
- On `table-tools.html`, the coin and tracker still work with no console errors.

### T-2 Validation and result sentences (pure)
**Files:** `assets/js/tools.js`, `scripts/test-odds.js`
**ACs:**
- AC-20: invalid input shows a message, never NaN, Infinity or a value outside 0–100.
- AC-19: visible explanation of the result.

**Build:** add these to the odds IIFE and to `window.lorcanaOdds`.
- `validate(mode, deckStr, countStr, turnStr)` returns `{ok:true,deck,count,turn}` or `{ok:false,field:'deck'|'count'|'turn',message}`.
- Check deck, then count, then turn. The first error wins.
- Checks per field, in order: trimmed empty or `Number()` NaN; not an integer; < 0; (deck or turn) < 1; (deck or turn) > 999; count > deck.
- Field names: "deck size"; "copies" (draw) or "inkables" (ink); "turn number".
- Exact messages:
  - "Check the inputs: enter a whole number for {field}."
  - "Check the inputs: {field} must be a whole number."
  - "Check the inputs: {field} can't be negative."
  - "Check the inputs: deck size must be at least 1."
  - "Check the inputs: turn number must be at least 1."
  - "Check the inputs: {field} must be 999 or less."
  - "Check the inputs: {copies|inkables} can't be more than the deck size."
- `describe(mode, onPlay, turn, seen)` returns:
  - draw: "Chance to have drawn at least one copy by turn {T}, {on the play|on the draw}. {seen} cards seen."
  - ink: "Chance to have an inkable card to ink on every turn through turn {T}, {on the play|on the draw}."

**Tests:**
- One case per message.
- Priority: a bad deck and a bad turn give the deck message.
- `"60","4","3"` is ok.
- `"4.5"`, `"-1"`, `""`, `"1000"`, and count 61 with deck 60.
- Both `describe` strings.

**Verify:** `node scripts/test-odds.js` passes.

### T-3 Tool III markup and DOM glue
**Files:** `table-tools.html`, `assets/js/tools.js`
**ACs:**
- AC-14: tool chapter plus nav entry.
- AC-15: the UI says mulligans aren't modeled.
- AC-19: live update.
- AC-21: labels, keyboard use, `aria-live`.
- AC-22: `textContent` only, no storage.
- AC-23: coin and tracker unchanged.

**Markup:**
- Nav: `<li><a href="#deck-odds"><b>III</b>Deck Odds</a></li>`.
- After the Lore Tracker section, add `div.fleuron` then `section.chapter#deck-odds`. The chapter-head `num` is "Tool III" and the h2 is "Deck Odds".
- `p.muted`: "Work out your chances of drawing a card, or of inking every turn. Results update as you type."
- `div.deck-odds#deck-odds-root` contains:
  - `div.odds-bar` with two `div.tracker-seats[role=group]`:
    - `span.tracker-label#odds-mode-label` "Question"; `button.seat-btn[data-mode=draw][aria-pressed=true]` "Draw a card"; `[data-mode=ink]` "Inkables".
    - `#odds-seat-label` "You are"; `[data-seat=play]` "On the play" (pressed); `[data-seat=draw]` "On the draw".
  - `div.odds-fields` with three `div.odds-field`, each a `label.odds-label[for]` plus `input.odds-input[type=number][inputmode=numeric][step=1]`:
    - `#odds-deck`: "Deck size", value 60, min 1, max 999.
    - `#odds-count`: "Copies in deck", value 4, min 0.
    - `#odds-turn`: "Turn number", value 3, min 1, max 999.
  - `div.odds-result#odds-result[role=status][aria-live=polite]` containing `p.odds-num` and `p.odds-text`.
  - `p.odds-note`: "Mulligans are not modeled. Cards seen = 7 plus one per turn, but the player on the play skips the first draw."
- `noscript`: `<p class="note"><b>Needs JavaScript</b>The odds calculator runs in your browser. Turn on JavaScript to use it.</p>`
- `.sub`: "Small helpers for the table: who goes first, who’s winning, and what your deck will draw."
- Colophon: add "The odds tool stores nothing."
- Version 2.3.0 in the meta and footer; Updated 2026-11-09.

**Glue:**
- Each group keeps exactly one button pressed. Clicking the pressed button does nothing.
- Ink mode sets the labels to "Inkable cards in deck" and "Through turn".
- Swap count between 4 and 24 only if the field holds the other mode's default.
- Recompute on `input` within the root, on toggle clicks, and on load.
- Error: set `aria-invalid="true"` and `aria-describedby="odds-result"` on that input only, empty the number, put the message in the text, and set `data-state="error"`.
- Valid: clear those attributes and show the result.

**Verify:**
- Loads at 48.8%. On the draw it shows 52.8%. Copies 0 shows 0.0%.
- Each error shows its message, and keyboard use works.
- Coin and tracker still work. Tests pass.

### T-4 Theme styles for the odds tool
**Files:** `assets/css/illuminary.css`, `classic.css`, `storybook.css`
**ACs:**
- AC-24: all three themes, `--tk-*` mapping.
- AC-25: no horizontal scroll, 3 themes × light/dark, desktop and 375px.
- AC-21: focus is visible.

**Build:** in each file:
- Add `.deck-odds` to the `.tracker, .diagram, .dictionary, .rarity` mapping selector.
- Add `.deck-odds` to both dark `--tk-on-accent` overrides, the `[data-theme="dark"]` one and the `prefers-color-scheme` one, next to `.tracker`.
- Append identical layout rules after the lore tracker block:
  - `.odds-bar`: flex, wrap, `space-between`, gap 8px, margin 14px 0 12px. `.odds-bar .tracker-seats`: `flex-wrap:wrap`.
  - `.odds-fields`: grid, `repeat(3,minmax(0,1fr))`, gap 12px. One column at `max-width:560px`.
  - `.odds-field`: grid, gap 4px. `.odds-label`: `--tk-text`, .9rem.
  - `.odds-input`: width 100%, border-box, `font:inherit`, 1rem, `tabular-nums`, padding 8px 10px, radius 8px, min-height 44px, `--tk-field` background, 1px `--tk-line` border, `--tk-text`. `:hover` border `--tk-accent`. `[aria-invalid="true"]` border `--ruby`.
  - `.odds-input:focus-visible`: 2px outline in the theme focus color (`--glimmer` / `--link` / `--gilt`), offset 2px, border `--tk-accent`.
  - `.odds-result`: margin-top 16px, padding 16px, centered, 1px `--tk-line` border, radius 10px, `--tk-surface` background, min-height 7.5rem. `[data-state="error"] .odds-text`: `--ruby`.
  - `.odds-num`: `--display`, `clamp(2.8rem,12vw,3.6rem)`, line-height 1, tabular, `--tk-text`, margin 0.
  - `.odds-text`: .95rem, `--tk-muted`, margin 6px 0 0.
  - `.odds-note`: .85rem, `--tk-muted`, margin-top 10px.
- Add `ol.refs a { overflow-wrap:anywhere; }`.
- Header versions: 1.5.0 / 1.7.0 / 1.10.0.

**Verify:**
- 6 theme-modes at desktop and 375px: pressed toggles are legible, error text is ruby, and there's no horizontal scroll.
- Tracker and rarity diagrams are unchanged.

### T-5 Guide page: skeleton, official chapters, References
**Files:** `deck-building.html` (new)
**ACs:**
- AC-1: rarity.html skeleton, version 1.0.0.
- AC-2: illuminary.css, fonts link, site.js.
- AC-3: 60+ cards; 1–2 inks; at most 4 per full name (name + version); link to `rules-changes.html`; each cites the Comprehensive Rules.
- AC-7: official mulligan.
- AC-10: `#refs`, `ol.refs`, `li#ref-N`, `sup.cite`, `target="_blank" rel="noopener"`.

**Build:**
- Clone the head, fleuron sprite, header, nav, footer and script from `rarity.html` (drop the rarity symbols). `<title>`: "Lorcana Deck Building".
- Kicker "Build", h1 "Deck building", `.sub` "The rules for a legal deck, then community advice for a good one."
- Nav: back link, then `#official-rules` I "Official rules" and `#mulligan` II "The official mulligan".
- Ch I: the first paragraph starts with "Official rule." Then a `ul` of the three rules, each with `sup.cite` → ref-1. A closing sentence links `rules-changes.html` for format legality and bans.
- Ch II: "Official rule." then match `base-rules.html`: "Shuffle, choose a first player, and draw seven. Once, you may put any number of cards on the bottom of your deck, draw that many, then shuffle." Cite ref-1.
- `section#refs`: `num` "Sources", h2 "References", `p.muted` "Retrieved {date}. Only [1] is official."
- **Research (owned here):** find the official Comprehensive Rules (v2.3, Oct 2026) on disneylorcana.com and confirm the deck and mulligan sections. Cite only what you opened. If it can't be confirmed, stop and report.
- Colophon: "An unofficial fan guide. Rules come from the Comprehensive Rules; everything else is community opinion." Version 1.0.0, Updated 2026-11-09.

**Verify:** the page renders in 3 themes, the theme and light/dark toggles work, and there are no console errors.

### T-6 Guide: chapters III–VI (intro, inkables, curve, archetypes)
**Files:** `deck-building.html`
**ACs:**
- AC-4: community chapters labeled.
- AC-5: inkable count, cost curve, archetypes (aggro, midrange, control, ramp, songs), each cited.
- AC-6: link to `inks.html#pairings`.
- AC-8: calculator link from the inkables chapter.
- AC-11: no prices, no database decklists, no uncited tournament claims.

**Build:**
- Before the refs section, add `#community-intro` III "How to read the advice", `#inkables` IV "Inkable count", `#curve` V "Cost curve" and `#archetypes` VI "Archetypes". Separate them with fleurons, use `chapter-head` `num` "Chapter III" and so on, and add the nav entries.
- Every chapter opens, directly under `chapter-head`, with `<p class="note"><b>Community advice</b>Not an official rule. Opinions from fan guides; see the cited sources.</p>`
- III body: "Chapters I and II are official rules. Chapters IV to X are community advice: useful, but opinions, and the meta changes."
- IV ends with `<a href="table-tools.html#deck-odds">Try this on the odds calculator</a>`.
- VI covers all five archetypes as a `ul` or short paragraphs (no tables) and includes "See which ink pairings exist on the Inks page." linking `inks.html#pairings`.
- **Research (owned here):** real fan guides or videos for inkables, curve and archetypes, at least one per topic. Use web search and open each page; cite only claims it makes. Append refs from ref-2. Never invent URLs.

**Verify:**
- Every `sup.cite` resolves to an existing `li#ref-N`.
- At 375px nothing overflows.

### T-7 Guide: chapters VII–IX (roles, copies, mulligan advice)
**Files:** `deck-building.html`
**ACs:**
- AC-4: labeled.
- AC-5: card roles (lore-getters, removal, draw, Bodyguard blockers, finishers), copy counts, mulligans, each cited.
- AC-7: community mulligan advice comes after the official chapter II.
- AC-8: calculator link from the copy-count chapter.
- AC-11: as in T-6.

**Build:**
- Add `#roles` VII "Card roles", `#copies` VIII "Copy counts" and `#mulligan-advice` IX "Mulligan advice" before the refs, with fleurons and nav entries.
- Each opens with the same note: `<p class="note"><b>Community advice</b>Not an official rule. Opinions from fan guides; see the cited sources.</p>`
- VIII ends with `<a href="table-tools.html#deck-odds">Try this on the odds calculator</a>`.
- IX may link back to `#mulligan` for the official procedure.
- Use a `ul` or paragraphs, no tables.
- **Research (owned here):** at least one real cited fan guide or video per topic. Reuse existing refs where they fit and append new ones after the last id. Never invent URLs.

**Verify:** all cites resolve; at 375px nothing overflows.

### T-8 Guide: chapter X worked example diagram
**Files:** `deck-building.html`
**ACs:**
- AC-9: `figure.diagram` inline SVG with `<title>`/`aria-labelledby` and a `figcaption`, `dg-*` only.
- AC-11: illustrative, not a real decklist.
- AC-4: labeled.

**Build:**
- `#example` X "Worked example" with the community note: `<p class="note"><b>Community advice</b>Not an official rule. Opinions from fan guides; see the cited sources.</p>`
- `<svg viewBox="0 0 520 280" role="img" aria-labelledby="curve-t curve-d">` with `<title id="curve-t">Example 60-card cost curve</title>` and a `<desc id="curve-d">` giving all seven counts.
- Bars for costs 1–7+ with counts 8, 12, 12, 10, 8, 6, 4:
  - Width 48. x = 28 + i·62.
  - Height = count·14. Baseline `dg-line` at y=230 from x=20 to 456.
  - The two 12s use `dg-acc`; the others use `dg-bar`.
- Gridline `dg-lead dg-dash` at y=62.
- Count above each bar as `dg-b`, `text-anchor=middle`, at bar top −8.
- Cost labels ("1"…"7+") as `dg-t` at y=250. "Ink cost" as `dg-s` centered at y=272. "Cards" as `dg-s` at top-left.
- figcaption: "An illustrative 60-card curve, not a real decklist. Each bar is one ink cost; its height and the number above it show how many cards."
- Then 2–3 sentences, optionally citing existing refs.

**Verify:**
- 6 theme-modes and 375px: labels don't collide and the figure breaks out to full width.
- A screen reader reads the title and desc.

### T-9 Navigation entries
**Files:** `quick-reference.html`, `index.html`
**ACs:**
- AC-12: unnumbered Quick reference nav link, like Tools/Lore/Rarity.
- AC-13: Home list item in the Rarity pattern.

**Build:**
- In `quick-reference.html`, after the Rarity `li`: `<li><a href="deck-building.html">Deck building</a></li>`. Version 4.5.0.
- In `index.html`, after the Card rarity `li`: `<li><a href="deck-building.html"><span class="t">Deck building</span><span class="lead-dots"></span><span class="k">Build</span></a><span class="d">Official deck rules, community advice and a worked example, plus an odds calculator.</span></li>`.
- Change the Tools description to "A coin flipper, a lore tracker and a deck odds calculator."
- Version 3.5.0.
- Both pages: meta and footer version, Updated 2026-11-09.

**Verify:** links work, and at 375px the nav row swipes without page scroll, in 3 themes.

### T-10 README and CHANGELOG
**Files:** `README.md`, `CHANGELOG.md`
**ACs:** AC-26: version bumps, changelog entries for every changed or new file, README tree.

**Build:**
- README tree:
  - Add `deck-building.html` ("Deck building guide: official rules, community advice, worked example").
  - Add `scripts/test-odds.js` ("Node tests for the deck odds math").
  - `table-tools.html` and `tools.js` descriptions gain "deck odds calculator".
  - The hub line adds Deck building.
- CHANGELOG, newest first within each existing section, dated 2026-11-09, using `#### Added`:
  - Repository 3.19.0
  - quick-reference.html 4.5.0
  - index.html 3.5.0
  - tools.js 1.4.0
  - table-tools.html 2.3.0
  - storybook.css 1.10.0, classic.css 1.7.0, illuminary.css 1.5.0
- Append a new `## deck-building.html` section with 1.0.0 after `rarity.html`, using the `---` separator.

**Verify:** each version in the files matches its changelog entry, and `node scripts/test-odds.js` still passes.

## 4. Testing strategy

- **Unit:** `node scripts/test-odds.js` (no deps or package.json). It covers the AC-16/18 vectors, the brute-force cross-check of both modes for D ≤ 12, the [0,1] range, performance at the 999 cap, every validation message and its priority, and the result sentences. Run it after T-1, T-2, T-3 and T-10.
- **Manual (browser, `python3 -m http.server 8000`):**
  - The calculator's live updates, keyboard, aria and error states (T-3).
  - 3 themes × light/dark × desktop and 375px (T-4, T-8, T-9).
  - Tracker saved state and the rarity diagrams as regression checks.
  - No console errors, and only Google Fonts in the Network tab.
  - Every `sup.cite` resolves (T-5–T-8).

## 5. Risks

- **Changelog lag:** versions are bumped in T-1–T-9 but recorded in T-10. Stopping early leaves the changelog stale.
- **Fabricated citations:** cite only pages actually opened. If a topic has no source, stop and report.
- **The CR URL may be a versioned PDF:** prefer the official rules page.
- **Edge semantics:** with N > D the inkables result is 0% (you can't ink more cards than the deck holds). That's correct, but say so if questioned.
- **Number inputs:** `type=number` returns `""` for junk, so it gets the "enter a whole number" message.
- **Dark contrast:** missing `.deck-odds` from the dark `--tk-on-accent` override breaks pressed toggles. `dg-bar` may be faint; check its 3:1 contrast.
- **Nav length:** 11 guide links rely on the swipe row at 375px.
