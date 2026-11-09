# 01 — Requirements: Deck building guide plus odds calculator

## Problem statement
- Request: "add deck building guide plus odds calculator".
- Underlying need: the KB covers rules, inks and rarity but nothing on *how to build a deck*. Players need (a) the hard legality rules in one place, kept apart from (b) community strategy, which is opinion, and (c) a quick way to check consistency ("how many copies / inkables do I need?") without a spreadsheet.
- The official deck rules already appear in passing in `base-rules.html` (Setup, line ~76). The guide gathers and expands them without contradicting that page.

## User stories
- US-1 [must-have] As a player, I want the official deck construction rules in one place so I can build a legal deck.
- US-2 [must-have] As a newer player, I want community deckbuilding advice (inkables, curve, archetypes, card roles, copy counts, mulligans), clearly labeled and cited, so I can tell advice from rules.
- US-3 [must-have] As a player, I want to calculate the chance of drawing at least one copy of a card by a given turn so I can choose copy counts.
- US-4 [must-have] As a player, I want to calculate the chance of having an inkable card to ink every turn through turn N so I can choose my inkable count.
- US-5 [must-have] As a reader, I want the guide reachable from the home page and the Quick reference hub, and linked to the inks pairing grid and the calculator.
- US-6 [nice-to-have] As a reader, I want a worked example deck with a diagram so the advice is concrete.

## Acceptance criteria

### Guide page
- AC-1: A new page `deck-building.html` exists at the repo root, using the same skeleton as `rarity.html` (header, crumbline "Home · Quick reference", `nav.contents` with "← Quick reference" back link, numbered `section.chapter` blocks with `chapter-head`, fleurons, `footer.colophon`, `<meta name="version" content="1.0.0">`, version in footer).
- AC-2: The page links `assets/css/illuminary.css`, the same Google Fonts link as other pages, and `assets/js/site.js`; the theme menu and light/dark toggle work on it.
- AC-3: An "Official rules" chapter states: at least 60 cards; one or two inks; at most 4 copies of a card with the same full name (name + version); and links to `rules-changes.html` for format legality/bans. Each statement cites the Ravensburger Comprehensive Rules in References.
- AC-4: Official content and community content are visually and textually separated: every community chapter/section is explicitly labeled as community advice (e.g. a "Community advice" label or note) and is not presented as a rule.
- AC-5: Community content covers each of: inkable count, cost curve, archetypes (aggro, midrange, control, ramp, songs), card roles (lore-getters, removal, draw, Bodyguard blockers, finishers), copy counts, mulligans. Each topic has at least one citation to a fan guide or video in References.
- AC-6: The archetypes section links to `inks.html#pairings`.
- AC-7: The mulligan section describes the official mulligan (put any number on the bottom, draw that many, shuffle, once) consistent with `base-rules.html`, labeled as official, before any community advice.
- AC-8: The guide links to the calculator on `table-tools.html` (anchor of the new tool section) at least from the inkable-count and copy-count sections.
- AC-9: A worked example section includes at least one `figure.diagram` inline SVG (e.g. cost curve or deck composition) with a `<title>`/`aria-labelledby` text alternative and a `figcaption`, using only `dg-*` classes / `--tk-*` colors so it renders in all themes.
- AC-10: A final "References" chapter (`id="refs"`, `ol.refs`, `li id="ref-N"`) lists every cited source; in-text citations use `sup.cite` links to those ids; external links use `target="_blank" rel="noopener"`.
- AC-11: No card prices, decklists from a database, or claims of tournament results without a citation.

### Navigation
- AC-12: `quick-reference.html` section nav includes a link to `deck-building.html` (unnumbered, like Tools/Lore/Rarity).
- AC-13: `index.html` lists the guide with a one-line description in the same list-item pattern as the Rarity entry.

### Odds calculator (table-tools.html + assets/js/tools.js)
- AC-14: `table-tools.html` gets a new tool chapter (e.g. "Tool III — Deck Odds", own `id`) and a matching entry in its contents nav; markup lives in the page, logic in `assets/js/tools.js` in its own IIFE that no-ops if its root element is absent.
- AC-15: Mode "Draw a card": inputs are deck size, copies in deck, turn number, and on the play / on the draw. Cards seen by turn T = 7 + (T − 1) on the play, 7 + T on the draw (mulligan not modeled; the UI says so).
- AC-16: Result = P(at least one copy among cards seen) = 1 − C(D−K, n)/C(D, n), shown as a percentage to one decimal place. Test vectors: D=60, K=4, turn 3 on the play → 48.8%; turn 3 on the draw → 52.8%; K=0 → 0.0%.
- AC-17: Mode "Inkables": inputs are deck size, inkable cards in deck, turn N, play/draw. Result = exact probability that for every turn t = 1..N, inkables among the cards seen by turn t ≥ t (so a card can be inked each turn), shown to one decimal place. Not an approximation or simulation.
- AC-18: Inkables test vectors: inkables = deck size → 100.0%; inkables = 0 → 0.0%; for N=1, the result equals the "Draw a card" result with copies = inkables, same deck size and play/draw.
- AC-19: Results update when any input changes (no page reload); there is a visible text explanation of what the number means (e.g. "Chance to have drawn at least one by turn 3").
- AC-20: Validation: non-integer, empty, negative, copies/inkables > deck size, deck size < 1, or turn < 1 shows a readable message instead of a result; the page never shows `NaN`, `Infinity` or a value outside 0–100%. If cards seen ≥ deck size the result is computed correctly (no error).
- AC-21: Inputs are labeled `<label>`s, keyboard operable, and the result region is announced to screen readers (e.g. `aria-live="polite"`).
- AC-22: Results are written with `textContent` (no `innerHTML` with input-derived values); no new `localStorage` keys; no external scripts or resources.
- AC-23: Existing Coin Flipper and Lore Tracker behave as before, including saved `lorcana-kb-tracker` state.

### Theming, layout, versioning
- AC-24: Every new class has rules in all three of `illuminary.css`, `classic.css`, `storybook.css`; shared components take colors from `--tk-*` variables (add the new component to the `--tk-*` mapping selector in each theme).
- AC-25: Guide and calculator are legible with no horizontal page scroll in all 3 themes × light/dark, at desktop width and at 375px.
- AC-26: Version bumps + `CHANGELOG.md` entries (newest first, existing structure) for every changed/new file: `deck-building.html` 1.0.0; MINOR bumps for `table-tools.html`, `assets/js/tools.js`, the three CSS files, `quick-reference.html`, `index.html`; `README.md` structure tree lists `deck-building.html` and the tools.js/table-tools descriptions mention the odds calculator.

## Success metrics
- No new external resources: the only third-party origin loaded by the new/changed pages remains Google Fonts (checkable in the browser Network tab).
- No console errors on `deck-building.html`, `table-tools.html`, `index.html`, `quick-reference.html` in any theme.

## Risks & impact
- `assets/js/tools.js`: shared by coin flipper and lore tracker; a top-level error in the new code could break both. Keep it in a guarded IIFE.
- `table-tools.html`: contents nav and chapter numbering change.
- Three CSS files: adding to the `.tracker, .diagram, .dictionary, .rarity` `--tk-*` selector or form styles could alter the tracker/diagram look; regression-check the tracker and rarity diagrams.
- `quick-reference.html` / `index.html` nav changes could wrap badly at 375px.
- Content accuracy: official rules must match `base-rules.html` (deck, mulligan, full name) and the current Comprehensive Rules; community claims must be cited.

## Codebase context
- `rarity.html` (v1.2.1): template for the guide — chapters, `figure.diagram` SVG, `sup.cite`, `ol.refs`.
- `base-rules.html`: existing official deck/mulligan wording (Setup ~line 74–77, "Full name" glossary).
- `inks.html#pairings`: ink pairing grid; `rules-changes.html`: bans/format updates.
- `table-tools.html` (v2.2.0): tools as `section.chapter` "Tool I/II"; `assets/js/tools.js`: one IIFE per tool, `getElementById` lookups.
- `quick-reference.html` (v4.4.0) nav lines ~36–45; `index.html` (v3.4.0) list ~line 46–48.
- CSS: `assets/css/{illuminary,classic,storybook}.css`; `--tk-*` mapping at illuminary.css ~line 260; diagram rules ~302–326 (mobile breakout at narrow widths).
- Conventions: lowercase hyphenated file names; relative links; no build, no deps; per-file semver + `CHANGELOG.md`.
- Preview/QA: `python3 -m http.server 8000` from repo root, open `http://localhost:8000/`; check 3 themes × light/dark × 375px.
- Do not touch `inks/*.html` or `scripts/build-inks.py`.

## Out of scope
- Full deck builder, decklist import/export, card database or card search.
- Saving calculator inputs; mulligan modeling in the odds math; multi-card combo odds.
- PWA/mobile install work; sitewide search.
- Multiplayer/other-format deck rules beyond linking `rules-changes.html`.

## Open questions
- None that change the acceptance criteria. (Assumed: page name `deck-building.html`; mulligans not modeled in odds; copies input not capped at 4 so it can count a group of similar cards.)

## Pipeline Recommendation
- complexity: medium
- api-design: no — no storage, messaging or external API; pure client-side math and static content
- design: yes — new page, new diagram, new interactive tool UI across three themes and mobile
- security-review: no — no new third-party resources, no localStorage, AC-22 forbids innerHTML with input; only outbound links added
