# 03 — Design spec: Deck building guide and Deck Odds tool

Design approach: reuse the existing vocabulary (rarity.html skeleton, `.note`, `figure.diagram` + `dg-*`, `.seat-btn` toggles, `.tracker`-style `--tk-*` mapping). One new component family (`.deck-odds`, `.odds-*`) is the only new pattern, flagged below. No new fonts, colors, scripts or storage.

## 1. Page layout: `deck-building.html`

Skeleton copied from `rarity.html` (AC-1, AC-2): `svg#fleuron` sprite, `header.titlepage.col` (crumbline "Home · Quick reference", kicker "Build", h1 "Deck building", `.sub`), `nav.contents` (back link first, then roman numerals), `main.col`, `section.chapter` blocks separated by `div.fleuron`, `footer.colophon` with version 1.0.0.

Chapter order (official first, then community, then References):

| # | id | Title | Kind |
|---|----|-------|------|
| I | `official-rules` | Official rules | Official |
| II | `mulligan` | The official mulligan | Official |
| III | `community-intro` | How to read the advice | Community lead-in (short; explains the label) |
| IV | `inkables` | Inkable count | Community |
| V | `curve` | Cost curve | Community |
| VI | `archetypes` | Archetypes | Community |
| VII | `roles` | Card roles | Community |
| VIII | `copies` | Copy counts | Community |
| IX | `mulligan-advice` | Mulligan advice | Community |
| X | `example` | Worked example | Community (illustrative) |
| (unnumbered) | `refs` | References | Sources |

Contents nav: `← Quick reference`, then I..X as `<a href="#id"><b>I</b>Name</a>`. Chapter-head `num` for References is "Sources" (match rarity.html pattern). On touch phones the nav stays the single swipeable row (existing rule); desktop wraps (existing rule). Do not add per-link extra text beyond short names so the row stays compact at 375px.

Content notes per chapter:
- I: a `ul` of three rules (60 cards minimum; one or two inks; up to 4 copies per full name, name plus version), each ending with `sup.cite` to the Comprehensive Rules. A closing sentence links to `rules-changes.html` for format legality and bans.
- II: describes the official mulligan (put any number on the bottom, draw that many, shuffle, once). Wording must match `base-rules.html` Setup.
- IV and VIII each end with a link-styled sentence to the calculator (`table-tools.html#deck-odds`); V links nothing; VI links `inks.html#pairings`.
- X: the cost-curve figure, then 2 to 3 sentences. Labeled illustrative, not a real or tournament decklist (AC-11).

## 2. Community-advice labeling (AC-4)

Reuse the existing `.note` class; no new class.

- Every community chapter (III to X) opens with, directly under `chapter-head` and above any body text: `<p class="note"><b>Community advice</b>Not an official rule. Opinions from fan guides; see the cited sources.</p>`.
- Chapter-head `num` for these chapters reads "Community" plus the numeral is kept in the nav only? No: keep the numeral in `num` for consistency with rarity.html, and rely on the note for labeling. The nav `<b>` numeral is unchanged.
- Official chapters I and II carry no note; instead their first paragraph begins "Official rule." in plain text and cites the Comprehensive Rules, so the two kinds are distinguishable by text, not color alone.
- Chapter III explains this: "Chapters I and II are rules. Chapters IV to X are community advice."
- `.note` already exists in all three themes (dashed card in Illuminary/Classic, gilt left rule and small caps label in Storybook), so light/dark is already handled. Verify contrast of `.note` text against its background in each theme (muted on bg) during QA.

## 3. Worked-example diagram (AC-9)

`<figure class="diagram">` with `<svg viewBox="0 0 520 280" role="img" aria-labelledby="curve-t curve-d">`, `<title id="curve-t">Example 60-card cost curve</title>`, `<desc id="curve-d">` listing the counts per cost. `figcaption`: "An illustrative 60-card curve, not a real decklist. Hollow bars show cost; bar height shows how many cards."

Layout inside the SVG (reuse only `dg-*`):
- Baseline: `dg-line` horizontal at y=230. Gridline at the 12-card level: `dg-lead dg-dash`.
- Seven bars, cost 1 to 7+, width 48, gap 14, left margin 28. Counts (sum 60): 8, 12, 12, 10, 8, 6, 4. Bar height = count x 14 px. Peak bars (the two 12s) use `dg-acc`; the rest use `dg-bar`. The accent is not the only cue: count numbers sit above every bar.
- Count above each bar: `dg-n` is too large; use `dg-b` (15px bold), centered. Cost label under baseline: `dg-t`. Axis caption "Ink cost" centered under labels: `dg-s`. Y-axis note "Cards" top-left: `dg-s`.
- No new classes, no hard-coded colors. All colors come through `--tk-*`, so it works in 3 themes, light and dark.
- Phone: existing `.diagram` rules at max-width 560px break the figure out to near full width. Minimum text renders about 11px at 375px; keep labels at most 3 characters ("7+") so nothing collides. No horizontal scroll.

## 4. Calculator: Tool III `#deck-odds` on `table-tools.html`

Changes: nav `<li><a href="#deck-odds"><b>III</b>Deck Odds</a></li>`; new `section.chapter#deck-odds` after a `div.fleuron`, chapter-head `num` "Tool III", h2 "Deck Odds"; intro `p.muted` below it. Update header `.sub` to "Small helpers for the table: who goes first, who's winning, and what your deck will draw." and colophon sentence to mention that the odds tool stores nothing.

### Markup structure (class names are the contract)

```
section.chapter#deck-odds
  chapter-head
  p.muted  (intro)
  div.deck-odds#deck-odds-root
    div.odds-bar
      div.tracker-seats[role=group][aria-labelledby=odds-mode-label]
        span.tracker-label#odds-mode-label "Question"
        button.seat-btn[data-mode=draw][aria-pressed=true] "Draw a card"
        button.seat-btn[data-mode=ink][aria-pressed=false] "Inkables"
      div.tracker-seats[role=group][aria-labelledby=odds-seat-label]
        span.tracker-label#odds-seat-label "You are"
        button.seat-btn[data-seat=play][aria-pressed=true] "On the play"
        button.seat-btn[data-seat=draw][aria-pressed=false] "On the draw"
    div.odds-fields
      div.odds-field  label[for=odds-deck] + input#odds-deck
      div.odds-field  label[for=odds-count] + input#odds-count   (label text changes by mode)
      div.odds-field  label[for=odds-turn] + input#odds-turn
    div.odds-result[role=status][aria-live=polite]#odds-result
      p.odds-num   (big percentage, or empty)
      p.odds-text  (explanation, or error)
    p.odds-note  "Mulligans are not modeled. Cards seen = 7 plus one per turn (the player on the play skips the first draw)."
  noscript p.note
```

Inputs: `<input type="number" inputmode="numeric" min="…" step="1">` with defaults deck 60, copies 4 (draw mode) / 24 (ink mode, swapped when mode changes only if the field still holds the other mode's default; otherwise keep user's value), turn 3. Reusing `.seat-btn` for toggles keeps the tracker look and `aria-pressed` semantics (same pattern as the Players selector). Only one toggle in each group is pressed at all times; no "none" state.

### Interaction states (element x state)

| Element | Default | Hover | Active/pressed | Focus-visible | Disabled | Error | Empty / other |
|---|---|---|---|---|---|---|---|
| Mode / play-draw `.seat-btn` | `--tk-surface` bg, `--tk-line` border | border `--tk-accent` | `aria-pressed=true`: `--tk-accent` bg, `--tk-on-accent` text | 2px outline in the theme's link/gilt color, 2px offset | never disabled | n/a | Click re-computes immediately; clicking the pressed one is a no-op |
| `.odds-input` | `--tk-field` bg, 1px `--tk-line` border, `--tk-text`, 44px min height | border `--tk-accent` | n/a | Same 2px outline as buttons (must be added; the existing global rules only list a, button, select) plus border `--tk-accent` | never disabled | `aria-invalid="true"`: border `--ruby`; message linked by `aria-describedby="odds-result"` | Empty: shows "Enter a deck size." etc. (below); no number is shown |
| `.odds-label` | `--tk-text`, .9rem | n/a | n/a | n/a | n/a | n/a | Mode changes the copies label text |
| `.odds-result` (status) | Number plus explanation | n/a | n/a | not focusable | n/a | Number hidden; error text in `--ruby`, prefixed "Check the inputs:" | Initial load shows the default result immediately (60/4/turn 3/play = 48.8%) |
| Result number `.odds-num` | `--display` font, large, tabular figures, `--tk-text`; `--tk-accent` not used for text | n/a | n/a | n/a | n/a | Empty string | Min-height reserved so the layout does not jump between result and error |
| `noscript` note | `.note` "Needs JavaScript" | | | | | | Shown only without JS; the calculator root hidden via script is not needed (inputs inert without JS) |

Behavior: recompute on `input` and on toggle click (AC-19). Never debounce visibly. Error states are per-field where possible: only the offending input gets `aria-invalid`; all clear on a valid recompute. Only the first applicable error message is shown, in this priority: deck size, then copies, then turn.

Wrapped-in result: `role="status"` plus `aria-live="polite"` on one container, and the container is updated as a whole (number and sentence), so screen readers read it once, e.g. "48.8%. Chance to have drawn at least one by turn 3 on the play." (AC-21)

### Visual spec

- `.deck-odds` is a `.tracker`-like card: no outer card; `.odds-bar` reuses the tracker bar's flex layout (`display:flex; flex-wrap:wrap; gap:8px; margin:14px 0 12px`), toggles `justify-content:space-between` on wide, stacked on narrow via wrapping.
- `.odds-fields`: `display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:12px`. At max-width 560px: single column. Each `.odds-field` is label above input, `gap:4px`. Inputs: `width:100%; box-sizing:border-box; font: inherit; font-size:1rem` (16px minimum prevents iOS zoom); `padding:8px 10px; border-radius:8px`.
- `.odds-result`: `margin-top:16px; padding:16px; text-align:center; border:1px solid var(--tk-line); border-radius:10px; background:var(--tk-surface)`; `min-height:7.5rem` to avoid layout shift. `.odds-num`: `font-family:var(--display); font-size:clamp(2.8rem, 12vw, 3.6rem); line-height:1`, matching `.lore-num`. `.odds-text`: `.95rem; color:var(--tk-muted)`; margin 6px 0 0.
- `.odds-note`: `.85rem`, `--tk-muted`, left-aligned, margin-top 10px.
- Panel width follows `main.col`; nothing wider than the viewport at 375px. Long result sentences wrap; no truncation.

### New classes and theming (AC-24)

New classes: `.deck-odds`, `.odds-bar`, `.odds-fields`, `.odds-field`, `.odds-label`, `.odds-input`, `.odds-result`, `.odds-num`, `.odds-text`, `.odds-note`. Required in `illuminary.css`, `classic.css`, `storybook.css`:

1. Add `.deck-odds` to the `--tk-*` mapping selector (`.tracker, .diagram, .dictionary, .rarity, .deck-odds`) so surface, field, line, text, muted, accent and on-accent resolve in every theme.
2. Add `.deck-odds` to the existing dark `--tk-on-accent` overrides (both the `:root[data-theme="dark"]` rule and the `prefers-color-scheme: dark` rule), exactly as `.tracker` does, so pressed toggles stay legible in dark mode. Without this, pressed toggles can fail contrast in dark mode.
3. The layout rules above are identical in all three files (the pattern the tracker and diagram follow); only color comes from `--tk-*`. Error color uses the existing `--ruby` variable, which every theme defines.
4. Focus rule for inputs: `.odds-input:focus-visible { outline: 2px solid <theme focus color>; outline-offset: 2px; border-color: var(--tk-accent); }`. Focus color per theme matches the existing a/button rule: Illuminary and Classic `var(--link)`, Storybook `var(--gilt)`.
5. `.odds-input[aria-invalid="true"] { border-color: var(--ruby); }`.
6. Hide native number spinners? No. Leave them; do not remove. Keep `font-variant-numeric: tabular-nums` on the inputs.

Verify: 3 themes x light/dark, tracker and rarity diagrams unchanged (regression).

## 5. User flows and traceability

| Story | Flow | Exit state | ACs |
|---|---|---|---|
| US-1 | Home or Quick reference: "Deck building" link, then Chapter I (rules with citations), then optional link to `rules-changes.html` | Reader knows the legality limits | AC-1, 2, 3, 4, 7, 10, 12, 13 |
| US-2 | Same page, continue to chapters III to IX; each opens with the "Community advice" note; follow `sup.cite` to References (`#ref-N`, `li:target` is highlighted by existing rule) | Reader can tell advice from rules | AC-4, 5, 6, 10, 11 |
| US-3 | Chapter VIII or IV link, "Try the odds calculator", lands on `#deck-odds` in Draw mode; edit inputs; read result | Percentage with explanation | AC-8, 14 to 16, 19 to 22 |
| US-4 | On Tool III choose "Inkables"; set deck, inkables, turn, seat; read result | Percentage with explanation | AC-14, 17, 18 to 22 |
| US-5 | Home list item and Quick reference nav link to the guide; inside the guide, `inks.html#pairings` and `table-tools.html#deck-odds` links | Reachable from all entry points | AC-6, 8, 12, 13 |
| US-6 | Chapter X reads the figure and caption | Concrete example seen | AC-9, 11 |
| Regression | Coin flipper and Lore Tracker untouched | | AC-23, 25, 26 |

Navigation additions: `quick-reference.html` nav gets an unnumbered link "Deck building" in the same pattern as Tools/Lore/Rarity; if the row overflows at 375px, rely on the existing swipeable row. `index.html` list item: title "Deck building", one line "Official deck rules, community advice and a worked example, plus an odds calculator."; match the Rarity entry markup.

## 6. Calculator modes and copy

Labels per mode:

| Field | Draw mode label | Inkables mode label |
|---|---|---|
| `#odds-deck` | "Deck size" | "Deck size" |
| `#odds-count` | "Copies in deck" | "Inkable cards in deck" |
| `#odds-turn` | "Turn number" | "Through turn" |

Intro `p.muted`: "Work out your chances of drawing a card, or of inking every turn. Results update as you type."

Result sentences (`.odds-text`):
- Draw: "Chance to have drawn at least one copy by turn {T}, {on the play | on the draw}." (cards seen shown in a second short line: "{n} cards seen.")
- Inkables: "Chance to have an inkable card to ink on every turn through turn {T}, {on the play | on the draw}."
- Number format: one decimal and a percent sign (e.g. "48.8%"). Rounding must never display "100.0%" for a value below 100 or "0.0%" for a value above 0 less than 0.05; it is acceptable to show "100.0%" / "0.0%" after standard rounding.
- Footnote `.odds-note`: "Mulligans are not modeled. Cards seen = 7 plus one per turn, but the player on the play skips the first draw."

Error messages (displayed in `.odds-text`, number blank; text color `--ruby`, never color alone: prefix "Check the inputs:"):
- Empty or non-numeric field: "Check the inputs: enter a whole number for {field name}."
- Non-integer: "Check the inputs: {field name} must be a whole number."
- Negative: "Check the inputs: {field name} can't be negative."
- Deck size < 1: "Check the inputs: deck size must be at least 1."
- Copies or inkables > deck size: "Check the inputs: {copies | inkables} can't be more than the deck size."
- Turn < 1: "Check the inputs: turn number must be at least 1."
- Very large values (turn or deck larger than a defensible cap, e.g. above 999): "Check the inputs: {field name} must be 999 or less." (developer: pick the cap so the DP stays instant.)

Noscript: "Needs JavaScript — The odds calculator runs in your browser. Turn on JavaScript to use it." (same `.note` pattern as the lore tracker)

Other copy:
- Guide `h1` "Deck building"; `.sub` "The rules for a legal deck, then community advice for a good one."
- Calculator links in guide: "Try this on the odds calculator" -> `table-tools.html#deck-odds`.
- Pairings link: "See which ink pairings exist on the Inks page." -> `inks.html#pairings`.
- Chapter III body: "Chapters I and II are official rules. Chapters IV to X are community advice: useful, but opinions, and the meta changes."
- Icon-only controls: none in this design.

## 7. Accessibility requirements

- Every input has a visible `<label for>`; no placeholder-only labels. The copies label updates with the mode (script sets `textContent`).
- Tab order: contents nav, mode toggle (2 buttons), play/draw toggle (2), deck size, copies, turn, then the rest of the page. Toggles are native `<button>`, activated by Enter and Space. No custom Escape behavior is needed (no popups). Arrow keys remain native in number inputs (increment).
- Focus-visible on buttons and inputs: 2px outline, 2px offset, theme focus color, at least 3:1 against both the surface and the page background in light and dark. Check inputs explicitly because the global rules do not cover them.
- Pressed toggle: text/background pair `--tk-on-accent` on `--tk-accent` must meet 4.5:1 in all 6 theme-modes (see the dark override above). Error text `--ruby` on `--tk-surface` must meet 4.5:1; check dark mode and bump to the existing lighter ruby token if a theme defines one. Muted explanation text: 4.5:1 on `--tk-surface`.
- Result region: one `role="status"` (`aria-live="polite"`) container, not re-created, text replaced through `textContent`. Error states also set `aria-invalid="true"` and `aria-describedby="odds-result"` on the offending input. Do not move focus on error.
- Diagram: `role="img"` with `aria-labelledby` pointing to `<title>` and `<desc>` that state all seven counts, so the data is available without sight; the count numbers are also visible text in the SVG.
- Do not rely on color: peak bars are marked by accent fill and the numbers above; the pressed state of a toggle changes fill and is exposed through `aria-pressed`.
- Touch targets: toggles and inputs at least 40px high (inputs 44px); fields do not overlap at 375px.
- Links in References use `target="_blank" rel="noopener"`; `ol.refs li:target` highlight is retained for `sup.cite` jumps.

## 8. Phone behavior (about 375px, AC-25)

- Guide: single column (`.col`); contents nav is the swipeable row; the figure breaks out to near full width via the existing `.diagram` max-width 560px rule; no tables are introduced (archetypes and roles use short paragraphs or `ul`, not wide tables). Long URLs in References wrap (`overflow-wrap:anywhere` on `ol.refs a`, only if not already present).
- Calculator: toggles wrap onto separate lines (`.odds-bar` is `flex-wrap`); each toggle group may itself wrap its buttons; fields stack in one column; result number scales with `clamp()`; no horizontal scroll in any theme. Inputs at 16px font size prevent browser zoom on focus.

## 9. Motion

None. The design is static; results update instantly. No transitions are added, so no reduced-motion fallback is needed.

## 10. Flagged for the developer

- New pattern: the `.deck-odds` / `.odds-*` form components are the only new UI; everything else reuses `.note`, `.seat-btn`, `.tracker-seats`, `.tracker-label`, `figure.diagram`, `dg-*`, `sup.cite`, `ol.refs`.
- The dark `--tk-on-accent` override is mandatory for `.deck-odds` in all three CSS files (easy to miss).
- Input focus-visible styling is new (existing global focus rules list only a/button/select).
- Chapter wording for official rules must be checked against `base-rules.html` before publishing; the design only fixes structure and labeling.
