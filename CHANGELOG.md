# Changelog

All notable changes to the Lorcana knowledgebase files are recorded here.

## Versioning

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH), adapted for docs:

- **MAJOR**: restructure or redesign (sections reorganized, layout replaced)
- **MINOR**: new sections or new content (keywords, formats, new set mechanics)
- **PATCH**: corrections, wording fixes, small rule clarifications, file moves or renames

Each file is versioned independently. Entries are newest first.

---

## Repository

### [3.18.2] - 2026-11-08
#### Added
- `.claude/settings.json` enables the `vibe-sdlc` plugin from the `vibe-tools` marketplace (GitHub `BCuison/vibeSDLC`), so `/vibe-sdlc:feature` runs here
- `CLAUDE.md` with the Agentic SDLC, Design system, Platform and Security focus sections the agents read; points to the README for full details

### [3.18.1] - 2026-11-08
#### Fixed
- Card Rarity: textured Legendaries (from Set 5) and how to read raised or textured cards

### [3.18.0] - 2026-11-08
#### Added
- Finishes chapter on the Card Rarity page: standard, foil and the special foils of Epic, Enchanted and Iconic

### [3.17.1] - 2026-11-08
#### Changed
- Card rarity symbols redrawn to match the official rarity chart, including Epic and Iconic

### [3.17.0] - 2026-11-08
#### Added
- `rarity.html`: card rarity reference with redrawn rarity symbols, pull-rate estimates, descriptions and typical USD values; linked from Quick reference and Home

### [3.16.0] - 2026-11-08
#### Added
- Keyword icons on Base Rules, styled in all three themes

### [3.15.0] - 2026-11-08
#### Added
- Story timeline at the top of the Lore page

### [3.14.0] - 2026-11-08
#### Added
- Core ink pairing grid on the Inks page

### [3.13.0] - 2026-11-08
#### Added
- Format legality chart on Rules Changes

### [3.12.1] - 2026-11-08
#### Fixed
- Diagrams use the full screen width on phones so their labels stay readable

### [3.12.0] - 2026-11-08
#### Added
- Shift stacking diagram on Base Rules

### [3.11.0] - 2026-11-08
#### Added
- Table layout diagram on Base Rules

### [3.10.0] - 2026-11-08
#### Added
- Challenge diagram on Base Rules

### [3.9.0] - 2026-11-08
#### Added
- Card anatomy diagram on Base Rules

### [3.8.0] - 2026-11-08
#### Added
- Turn flowchart diagram on Base Rules, with shared diagram styles in all three themes

### [3.7.0] - 2026-11-07
#### Added
- `rules-changes.html`: official rules updates, errata and bans, newest first, linked from Base Rules, Quick reference and Home
#### Fixed
- Underdog keyword (Winterspell) was missing; keyword count is now sixteen

### [3.6.0] - 2026-11-07
#### Added
- Newer mechanics chapter on Base Rules (Boost, Teams and new Shift variants, ink drops, Adventurous), from official release notes

### [3.5.0] - 2026-11-07
#### Added
- Lore tracker on the Tools page (`table-tools.html`, `assets/js/tools.js`), styled in all three themes

### [3.4.1] - 2026-11-07
#### Fixed
- Home links point at `index.html` instead of the folder, so they open the home page when viewing files locally, not a directory listing (all pages and `scripts/build-inks.py`; ink guides regenerated)

### [3.4.0] - 2026-11-07
#### Changed
- Illuminary is the default theme: every page and `scripts/build-inks.py` now link `illuminary.css` (ink guides regenerated)
- Theme menu lists Classic, Illuminary, Storybook in alphabetical order

### [3.3.0] - 2026-11-07
#### Added
- Illuminary theme (`assets/css/illuminary.css`), a third choice in the theme menu with full light and dark support

### [3.2.0] - 2026-11-07
#### Added
- `lore.html`, the Lorcana story set by set, linked from the Quick reference nav between Tools and Base Rules

### [3.1.0] - 2026-10-29
#### Changed
- Quick reference restored as the hub; Base Rules, The Inks and Illumineer's Quest are pages opened from its nav menu

### [3.0.0] - 2026-10-29
#### Changed
- Quick reference renamed to Base Rules (`base-rules.html`), covering Setup through Formats
- `quick-reference.html` is now a redirect to `base-rules.html`
#### Added
- `inks.html` ink guide index

### [2.3.0] - 2026-10-29
#### Added
- `quests/` folder with one rules page per Illumineer's Quest

### [2.2.0] - 2026-10-28
#### Added
- `illumineers-quest.html`, a co-op section starting with Palace Heist

### [2.1.0] - 2026-10-27
#### Added
- Theme menu with Storybook (default) and Classic designs
- `assets/css/classic.css` (v1.0.0)

### [2.0.0] - 2026-10-27
#### Changed
- Storybook design rolled out to every page
#### Added
- `scripts/build-inks.py` generator for the ink guides
#### Removed
- `assets/css/lorcana.css` (replaced by `storybook.css`)

### [1.5.0] - 2026-10-27
#### Added
- `assets/css/storybook.css` (v1.0.0), the storybook design pilot

### [1.4.0] - 2026-10-27
#### Added
- `tools.html` standalone tools page

### [1.3.0] - 2026-10-27
#### Added
- `assets/js/tools.js` (v1.0.0) for interactive tools

### [1.2.0] - 2026-10-27
#### Added
- Ink guides for Amethyst, Emerald, Ruby, Sapphire and Steel

### [1.1.1] - 2026-10-27
#### Added
- `assets/js/site.js` shared script (v1.0.0)

### [1.1.0] - 2026-10-27
#### Added
- `assets/css/lorcana.css` shared stylesheet (v1.0.0), extracted from the quick reference
- `inks/` folder for per-ink guides

### [1.0.0] - 2026-10-27
#### Added
- Git-ready folder structure (static site at root, long-form notes in `docs/`)
- `README.md` with structure, conventions, versioning and publishing steps
- `.gitignore`
- `index.html` home page (v1.0.0) linking to all pages

---

## quick-reference.html

### [4.4.0] - 2026-11-08
#### Added
- Rarity link in the section bar, after Lore

### [4.3.0] - 2026-11-07
#### Added
- Rules changes in the Base Rules list
#### Changed
- Keyword count is now sixteen

### [4.2.0] - 2026-11-07
#### Added
- Newer mechanics in the Base Rules list
#### Changed
- Keyword count is now fifteen

### [4.1.0] - 2026-11-07
#### Added
- Lore link in the nav, between Tools and Base Rules

### [4.0.1] - 2026-10-29
#### Changed
- Base Rules list ends in arrows instead of chapter numerals

### [4.0.0] - 2026-10-29
#### Changed
- Now the hub page: nav menu Tools, Base Rules, The Inks, Illumineer's Quest, each opening its own page
- Part I lists the Base Rules chapters, Part II the ink guides, Part III links to the quests
#### Removed
- Redirect to Base Rules (3.0.0)

### [3.0.0] - 2026-10-29
#### Changed
- Replaced by a redirect to `base-rules.html`; history continues there

### [2.2.0] - 2026-10-29
#### Added
- Chapter XII, Illumineer's Quest, linking to the quest list
#### Changed
- Contents bar item is now XII Illumineer's Quest

### [2.1.1] - 2026-10-29
#### Changed
- Illumineer's Quest link moved after The inks in the contents bar

### [2.1.0] - 2026-10-28
#### Added
- Illumineer's Quest link in the contents bar

### [2.0.1] - 2026-10-27
#### Fixed
- Tools link points to `table-tools.html`

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign (pilot): title page with inkwell illustration, chapters with Roman numerals, drop caps, gilt rules and fleurons
- Boxes replaced with definition lists, tables, a dictionary layout for keywords and glossary, margin notes and an ink index
- Navigation is now a contents bar; footer is now a colophon
- New fonts: IM Fell English and Alegreya
- Copy rewritten in our own voice
- Uses `storybook.css` instead of `lorcana.css`

### [1.5.0] - 2026-10-27
#### Changed
- Tools moved to its own page; the Tools nav item (still first) now opens `tools.html`
#### Removed
- Inline Tools section and coin flipper

### [1.4.0] - 2026-10-27
#### Added
- Tools section, first in the navigation bar
- Coin flipper tool: fair random flip, heads or tails result, running tally

### [1.3.1] - 2026-10-27
#### Fixed
- Home link uses the folder path so it works in the published preview and on static hosts

### [1.3.0] - 2026-10-27
#### Added
- All six ink tiles link to their guides
- Ink drops box (Hyperia City)
#### Changed
- Rules basis updated to Comprehensive Rules 2.3.0
- Formats: Core legal sets now listed as Sets 9 to 14

### [1.2.1] - 2026-10-27
#### Fixed
- Page now opens at the top on mobile instead of keeping the previous scroll position

### [1.2.0] - 2026-10-27
#### Added
- Amber ink tile links to the new Amber guide
- Inks section intro line
#### Changed
- Styles moved to shared `assets/css/lorcana.css` (no visual change)

### [1.1.1] - 2026-10-27
#### Changed
- Renamed from `lorcana-quick-reference.html` and moved to repo root
- Footer: added Home link

### [1.1.0] - 2026-10-27

#### Added
- Sticky jump nav for fast section lookup
- Keywords: Alert, Boost, Sing Together (now all 14 from the Comprehensive Rules)
- "Winning and losing" setup box
- Sing Together box in Songs and Shift
- Glossary section (ready, exert, dry, banish, full name, the bag, game state check)
- Formats section (Core vs Infinity, rotation, reprint rule)
- Footer: sources, version number, update date, rules basis, changelog link

#### Changed
- "Untap" replaced with official term "ready"
- Deck rule: copy limit is by full name (name + version); ink colors listed as 1 or 2
- Challenge targets in Main phase now include locations
- Evasive now notes Alert can also challenge it
- Shift notes the card keeps exerted or ready state
- Questing text clarified: exerted characters can be challenged
- Singing requires a dry character

#### Fixed
- Deck-out rule updated to Comprehensive Rules 2.0: you lose if you end your turn with no cards in your deck (previously: lose on drawing from an empty deck)
- Mulligan now includes shuffling after drawing replacements
- Inking now includes revealing the card first

### [1.0.0] - 2026-10-27
- Initial version imported from another agent

---

## docs/knowledgebase.md

### [1.6.0] - 2026-11-07
#### Added
- Underdog in the keyword list (now 16); pointer to `rules-changes.html`

### [1.5.0] - 2026-11-07
#### Added
- Adventurous keyword (Hyperia City); keyword count is now 15

### [1.4.2] - 2026-10-29
#### Fixed
- Links point to Base Rules and the Inks page

### [1.4.1] - 2026-10-29
#### Changed
- Links to the new quest pages; full quest release list

### [1.4.0] - 2026-10-28
#### Changed
- Palace Heist notes verified against the printed booklet; open questions narrowed to p.18 and card text

### [1.3.0] - 2026-10-28
#### Added
- Illumineer's Quest section with Palace Heist summary
- Open questions for Palace Heist rules to verify against the printed sheet

### [1.2.0] - 2026-10-27
#### Changed
- Hyperia City: Core legality and ink drops rules per CR 2.3.0
#### Fixed
- Ink drops can be saved across turns (earlier note said they must be spent the same turn)
#### Added
- Oct 27 Core meta snapshot in strategy notes

### [1.1.0] - 2026-10-27
#### Added
- Hyperia City (Set 14) release dates and ink drops mechanic (flagged unverified)
- Strategy notes: link to ink guides, Amber meta observation
#### Changed
- Open questions: Set 14 release resolved, replaced with legality and wording checks

### [1.0.1] - 2026-10-27
#### Changed
- Renamed from `lorcana-knowledgebase.md` and moved to `docs/`
- Changelog and quick reference links updated to relative repo paths

### [1.0.0] - 2026-10-27
- Initial version: rules changelog, keyword detail, formats, rulings log, open questions

---

## index.html

### [3.4.0] - 2026-11-08
#### Added
- Card rarity entry in Contents

### [3.3.0] - 2026-11-07
#### Added
- Rules changes entry in the contents
#### Changed
- Keyword count is now sixteen

### [3.2.2] - 2026-11-07
#### Changed
- Base rules description mentions newer mechanics and fifteen keywords

### [3.2.1] - 2026-11-07
#### Changed
- Tools entry mentions the lore tracker

### [3.2.0] - 2026-11-07
#### Added
- Lore entry in the contents

### [3.1.0] - 2026-10-29
#### Added
- Quick reference hub entry above Base rules

### [3.0.0] - 2026-10-29
#### Changed
- Links point to Base Rules and the new Inks page

### [2.2.0] - 2026-10-29
#### Added
- Palace Heist listed under Illumineer's Quest

### [2.1.0] - 2026-10-28
#### Added
- Illumineer's Quest entry in the contents

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: title page "The Table Book" and a table of contents with dotted leaders, inks listed individually

### [1.4.1] - 2026-10-27
#### Fixed
- Tools card points to `table-tools.html`

### [1.4.0] - 2026-10-27
#### Added
- Light/dark toggle (loads shared site.js)

### [1.3.0] - 2026-10-27
#### Added
- Tools card

### [1.2.0] - 2026-10-27
#### Changed
- Amber card replaced with an Ink Guides card covering all six inks

### [1.1.0] - 2026-10-27
#### Added
- Amber Ink Guide card

### [1.0.0] - 2026-10-27
- Initial version: site home page

---

## inks/amber.html

### [2.0.1] - 2026-10-29
#### Fixed
- Breadcrumb and back links go to the Inks page; rules links go to Base Rules

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: chapters I to VII, ink-colored title drop, facing-page Core and Infinity columns, dictionary-style mechanics and mistakes, colophon

### [1.1.1] - 2026-10-27
#### Fixed
- Breadcrumb, Rules and footer links showed "content not available" in the published preview

### [1.1.0] - 2026-10-27
#### Changed
- Core pairings refreshed with Oct 27 data including Hyperia City: Sapphire promoted to top tier, Steel and Ruby adjusted
- Page now generated from the shared ink template (no visual change)

### [1.0.1] - 2026-10-27
#### Fixed
- Page opened at the footer on mobile when tapped from the quick reference; now opens at the top

### [1.0.0] - 2026-10-27
- Pilot ink guide: identity, mechanics, game plan by turn, Core and Infinity pairings and key cards side by side, playing against Amber, common mistakes, sources

---

## assets/css/lorcana.css

### Removed - 2026-10-27
- Retired; every page now uses `storybook.css`

### [1.4.0] - 2026-10-27
#### Added
- Theme toggle button styles
#### Changed
- Header top padding increased to make room for the toggle

### [1.3.0] - 2026-10-27
#### Changed
- Coin styles for SVG faces; coin enlarged to 128px

### [1.2.0] - 2026-10-27
#### Added
- Tool, coin and button styles

### [1.1.0] - 2026-10-27
#### Added
- Accent classes for all six inks
#### Changed
- Ink hero text color works on every ink background

### [1.0.0] - 2026-10-27
- Initial shared stylesheet: tokens, base layout, components, ink guide styles

---

## assets/js/site.js

### [1.4.0] - 2026-11-07
#### Changed
- Illuminary is the default theme; a saved Classic or Storybook choice is still honored
- Theme menu sorted alphabetically

### [1.3.0] - 2026-11-07
#### Added
- Illuminary option in the theme menu

### [1.2.1] - 2026-10-30
#### Added
- Measures the contents bar height so jump links clear it when it wraps

### [1.2.0] - 2026-10-27
#### Added
- Theme menu right of the lightbulb: Storybook (default) or Classic. Swaps the stylesheet and is remembered per browser

### [1.1.0] - 2026-10-27
#### Added
- Lightbulb light/dark mode toggle, top left of every page; choice remembered per browser

### [1.0.0] - 2026-10-27
- Scroll-to-top on page load unless a section link (#id) is targeted

---

## inks/amethyst.html

### [2.0.1] - 2026-10-29
#### Fixed
- Breadcrumb and back links go to the Inks page; rules links go to Base Rules

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: chapters I to VII, ink-colored title drop, facing-page Core and Infinity columns, dictionary-style mechanics and mistakes, colophon

### [1.0.1] - 2026-10-27
#### Fixed
- Breadcrumb, Rules and footer links showed "content not available" in the published preview

### [1.0.0] - 2026-10-27
- Initial guide from the Amber template

---

## inks/emerald.html

### [2.0.1] - 2026-10-29
#### Fixed
- Breadcrumb and back links go to the Inks page; rules links go to Base Rules

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: chapters I to VII, ink-colored title drop, facing-page Core and Infinity columns, dictionary-style mechanics and mistakes, colophon

### [1.0.1] - 2026-10-27
#### Fixed
- Breadcrumb, Rules and footer links showed "content not available" in the published preview

### [1.0.0] - 2026-10-27
- Initial guide from the Amber template

---

## inks/ruby.html

### [2.0.1] - 2026-10-29
#### Fixed
- Breadcrumb and back links go to the Inks page; rules links go to Base Rules

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: chapters I to VII, ink-colored title drop, facing-page Core and Infinity columns, dictionary-style mechanics and mistakes, colophon

### [1.0.1] - 2026-10-27
#### Fixed
- Breadcrumb, Rules and footer links showed "content not available" in the published preview

### [1.0.0] - 2026-10-27
- Initial guide from the Amber template

---

## inks/sapphire.html

### [2.0.1] - 2026-10-29
#### Fixed
- Breadcrumb and back links go to the Inks page; rules links go to Base Rules

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: chapters I to VII, ink-colored title drop, facing-page Core and Infinity columns, dictionary-style mechanics and mistakes, colophon

### [1.0.1] - 2026-10-27
#### Fixed
- Breadcrumb, Rules and footer links showed "content not available" in the published preview

### [1.0.0] - 2026-10-27
- Initial guide from the Amber template

---

## inks/steel.html

### [2.0.1] - 2026-10-29
#### Fixed
- Breadcrumb and back links go to the Inks page; rules links go to Base Rules

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: chapters I to VII, ink-colored title drop, facing-page Core and Infinity columns, dictionary-style mechanics and mistakes, colophon

### [1.0.1] - 2026-10-27
#### Fixed
- Breadcrumb, Rules and footer links showed "content not available" in the published preview

### [1.0.0] - 2026-10-27
- Initial guide from the Amber template

---

## assets/js/tools.js

### [1.3.0] - 2026-11-07
#### Added
- Lore tracker logic: saved state (localStorage), undo history, win announcement through a polite live region, two-tap reset

### [1.2.1] - 2026-10-29
#### Changed
- Button reads "Flip Again" after a flip

### [1.2.0] - 2026-10-28
#### Added
- Coin click or tap flips, same as the button; repeat taps are ignored mid-flip

### [1.1.0] - 2026-10-27
#### Changed
- Coin faces swap by side instead of H/T letters

### [1.0.0] - 2026-10-27
- Coin flipper using the crypto random source, with reduced-motion support

---

## table-tools.html

### [2.2.0] - 2026-11-07
#### Added
- Tool II Lore Tracker: a Players picker (2, 3, 4), 2 to 4 players with editable names and ink seat colors, −1/+1/+2/+3 buttons, progress to 20 with a win state, Undo, and New game with a second-tap confirm. Saved in this browser

### [2.1.4] - 2026-10-29
#### Changed
- Back links go to the Quick reference hub

### [2.1.3] - 2026-10-29
#### Fixed
- Links point to Base Rules

### [2.1.2] - 2026-10-29
#### Changed
- Button reads "Flip the Coin" before the first flip

### [2.1.1] - 2026-10-29
#### Changed
- Heading and nav read "Coin Flipper"
#### Removed
- Line explaining which side is heads and tails

### [2.1.0] - 2026-10-28
#### Added
- Tap the coin itself to flip (the coin is now a button)
#### Changed
- Instructions mention tapping the coin

### [2.0.0] - 2026-10-27
#### Changed
- Storybook redesign: coin presented on a centered plate with a framed button

### [1.1.1] - 2026-10-27
#### Changed
- Renamed from `tools.html` to fix the Tools link failing in the published preview

### [1.1.0] - 2026-10-27
#### Changed
- Coin redesigned as embossed metal: heads is an original queen in profile (gold), tails an original castle (silver)

### [1.0.0] - 2026-10-27
- Initial tools page with the coin flipper

---

## assets/css/storybook.css

### [1.9.0] - 2026-11-08
#### Added
- Card rarity page styles: symbol cells, table column widths, and a stacked card layout for the table below 560px

### [1.8.0] - 2026-11-08
#### Added
- Keyword icon style (`.kw-icon`) in the theme accent; `.dictionary` joins the shared `--tk-*` color mapping

### [1.7.1] - 2026-11-08
#### Fixed
- Diagrams extend into the side padding below 560px wide so labels stay readable on phones

### [1.7.0] - 2026-11-08
#### Added
- Diagram styles (`figure.diagram` and `dg-*` SVG classes), colored through the shared `--tk-*` mapping

### [1.6.0] - 2026-11-07
#### Added
- Lore tracker styles (shared layout; theme colors mapped through `--tk-*` variables)
#### Changed
- Footer matches Classic: no "Colophon" heading, same spacing, size and layout; colors still follow the theme

### [1.5.0] - 2026-11-07
#### Added
- Footnote citation (`sup.cite`) and reference list (`ol.refs`) styles for the Lore page

### [1.4.1] - 2026-10-30
#### Fixed
- Contents bar couldn't be scrolled with a mouse. It now wraps onto extra lines at 640px and wider, or on any mouse/trackpad device; touch phones keep the swipeable row
- Section links land below the bar even when it wraps

### [1.4.0] - 2026-10-29
#### Removed
- Chapter labels ("Chapter I", "Part I", "Tool I") and Roman numerals in the contents bar

### [1.3.0] - 2026-10-28
#### Changed
- Coin flipper layout shared with Classic: centered column, fixed sizes for coin, result, tally and button
#### Added
- Coin hover lift and press feedback

### [1.2.0] - 2026-10-27
#### Added
- Theme menu styles

### [1.1.0] - 2026-10-27
#### Added
- Ink guide parts (split columns, facing-page format columns, entries, tiers), table of contents, coin and button styles

### [1.0.1] - 2026-10-27
#### Fixed
- Contents bar links have larger tap targets on phones

### [1.0.0] - 2026-10-27
- Storybook design system: ivory and night palettes, gilt accent, chapter, dictionary, table, note and colophon styles, theme toggle

---

## assets/css/classic.css

### [1.6.0] - 2026-11-08
#### Added
- Card rarity page styles: symbol cells, table column widths, and a stacked card layout for the table below 560px

### [1.5.0] - 2026-11-08
#### Added
- Keyword icon style (`.kw-icon`) in the theme accent; `.dictionary` joins the shared `--tk-*` color mapping

### [1.4.1] - 2026-11-08
#### Fixed
- Diagrams extend into the side padding below 560px wide so labels stay readable on phones

### [1.4.0] - 2026-11-08
#### Added
- Diagram styles (`figure.diagram` and `dg-*` SVG classes), colored through the shared `--tk-*` mapping

### [1.3.0] - 2026-11-07
#### Added
- Lore tracker styles (shared layout; theme colors mapped through `--tk-*` variables)

### [1.2.0] - 2026-11-07
#### Added
- Footnote citation (`sup.cite`) and reference list (`ol.refs`) styles for the Lore page

### [1.1.1] - 2026-10-30
#### Fixed
- Same contents bar wrapping fix as Storybook

### [1.1.0] - 2026-10-28
#### Fixed
- Coin flipper used a side-by-side layout that shifted controls compared with Storybook; now identical
#### Added
- Coin hover lift and press feedback

### [1.0.0] - 2026-10-27
- The original 1.x look (navy header, rounded cards, pill navigation, Fraunces and Public Sans) rebuilt over the storybook markup

---

## illumineers-quest.html

### [2.0.3] - 2026-10-29
#### Changed
- Kicker reads "Lorcana · Co-op" instead of "Part III"

### [2.0.2] - 2026-10-29
#### Changed
- Back links go to the Quick reference hub

### [2.0.1] - 2026-10-29
#### Fixed
- Links point to Base Rules instead of the quick reference

### [2.0.0] - 2026-10-29
#### Changed
- Now an index only: table of all quests in release order, linking to each quest's rules page
#### Added
- Deep Trouble and The Great Hunny Rescue, marked not added yet
#### Removed
- Palace Heist rules (moved to `quests/palace-heist.html`)

### [1.1.0] - 2026-10-28
#### Changed
- Palace Heist rewritten from the printed rules booklet
#### Added
- Jafar's draw table by player count, Ink Moat setup by difficulty, full Crown stealing and retaking rules, Jafar's reshuffle and returned-card rules, "you" and "player" wording rules
#### Fixed
- Jafar's turn has 5 steps (Ready, Set, Resolve the row, Draw, Reveal), not 4
- Only the Illumineer holding the Crown gains its 2 lore
- Stealing needs a ready character played on a previous turn from every Illumineer
- Battleground abilities are once per turn each
- Removed the unverified claim that Jafar wins if an Illumineer runs out of cards (pending booklet p.18)

### [1.0.0] - 2026-10-28
- Initial page: quest index and Palace Heist chapters (overview, setup, Jafar's turn, your turn, the Crown, winning, Battlegrounds, tips)

---

## quests/palace-heist.html

### [1.0.1] - 2026-10-29
#### Fixed
- Footer link points to Base Rules

### [1.0.0] - 2026-10-29
- Palace Heist rules moved here from `illumineers-quest.html` (content as of that page's 1.1.0)

---

## base-rules.html

### [3.8.0] - 2026-11-08
#### Added
- An original line icon beside each of the sixteen keywords (decorative; hidden from screen readers)

### [3.7.1] - 2026-11-08
#### Fixed
- Card anatomy: shorter Lore label so it doesn't run to the edge on phones

### [3.7.0] - 2026-11-08
#### Added
- Shift diagram in Songs & Shift: a new version played on top for its Shift cost, keeping damage and ready or exerted state

### [3.6.0] - 2026-11-08
#### Added
- Table layout diagram in Setup: inkwell, play area (characters, exerted, item, location), deck, discard and hand, marked face up or face down

### [3.5.0] - 2026-11-08
#### Added
- Worked challenge diagram in Challenges: both characters exerted, damage traded at once, one survives and one is banished

### [3.4.0] - 2026-11-08
#### Added
- Card anatomy diagram in Cards: cost, inkable ring, ink color, name and version, classifications, strength, willpower, rules text and lore

### [3.3.0] - 2026-11-08
#### Added
- Turn flowchart in The turn: beginning steps, main phase actions, end step and the hand-off to the opponent

### [3.2.0] - 2026-11-07
#### Added
- Underdog in Keywords (now sixteen)
- Banned cards note in Formats, linking to Rules changes
- Rules changes link in the footer

### [3.1.0] - 2026-11-07
#### Added
- Chapter IX Newer mechanics: Boost (Whispers in the Well), Team, Duo/Combo/Temporary/classification Shift and Vinelings (Attack of the Vine), ink drops and Adventurous (Hyperia City), with open questions noted
- Adventurous added to Keywords (now fifteen), linking to its section
- Links to it from Shift, the Boost keyword and the ink drops note
- Official sources for each mechanic
#### Changed
- Glossary is now Chapter X and Formats Chapter XI
#### Fixed
- Whispers in the Well release notes link pointed to the news listing instead of the notes

### [3.0.2] - 2026-10-29
#### Changed
- Kicker reads "Lorcana · Rules" instead of "Part I"

### [3.0.1] - 2026-10-29
#### Changed
- Contents bar starts with "← Quick reference"; forward links removed
- Breadcrumb added

### [3.0.0] - 2026-10-29
#### Changed
- Renamed from `quick-reference.html` (2.2.0) to Base Rules, Chapters I to X (Setup through Formats)
- Contents bar links out to Inks and Illumineer's Quest
#### Removed
- Chapter XI The inks (now `inks.html`) and Chapter XII Illumineer's Quest (now linked from the contents bar)

---

## inks.html

### [1.1.0] - 2026-11-08
#### Added
- Chapter II Pairings: a 6×6 grid of Core pairings by tier (as of Oct 27, 2026, from the ink guides); each square links to that guide's pairings

### [1.0.2] - 2026-10-29
#### Changed
- Kicker reads "Lorcana · Strategy" instead of "Part II"

### [1.0.1] - 2026-10-29
#### Changed
- Back links go to the Quick reference hub

### [1.0.0] - 2026-10-29
- Ink guide index, moved from the quick reference's Chapter XI

---

## lore.html

### [1.1.0] - 2026-11-08
#### Added
- Timeline of Sets 1–14 grouped by story arc, with years; arcs link to their chapters and set numbers to their sections
- Anchors on each set heading (`#set-1` to `#set-14`)

### [1.0.0] - 2026-11-07
#### Added
- Lore page: the realm, then the story by arc (The Flood, The Sea Witch, The Hexwell Crown, Whispers & Winter, The Vine, Hyperia City) with a subsection per set from The First Chapter to Hyperia City, plus announced 2027 sets
- Wikipedia-style numbered citations on each summary, linking to a References chapter of 20 official sources

---

## assets/css/illuminary.css

### [1.4.0] - 2026-11-08
#### Added
- Card rarity page styles: symbol cells, table column widths, and a stacked card layout for the table below 560px

### [1.3.0] - 2026-11-08
#### Added
- Keyword icon style (`.kw-icon`) in the theme accent; `.dictionary` joins the shared `--tk-*` color mapping

### [1.2.1] - 2026-11-08
#### Fixed
- Diagrams extend into the side padding below 560px wide so labels stay readable on phones

### [1.2.0] - 2026-11-08
#### Added
- Diagram styles (`figure.diagram` and `dg-*` SVG classes), colored through the shared `--tk-*` mapping

### [1.1.0] - 2026-11-07
#### Added
- Lore tracker styles (shared layout; theme colors mapped through `--tk-*` variables)
#### Changed
- Footer matches Classic: no "Colophon" heading, same spacing, size and layout; colors still follow the theme

### [1.0.0] - 2026-11-07
#### Added
- Illuminary theme, named for the Great Illuminary: a midnight header with an aurora of the six inks and glimmer specks (dark in both modes), then a quiet reading column
- Hexagon motif from the card ink-cost frame for ink drops, the ink guide drop and numbered steps
- Light mode (moonlit paper, ink-blue text) and dark mode (indigo ink, lantern gold), following the system setting or the lightbulb toggle
- Marcellus headings, Figtree body text

---

## rules-changes.html

### [1.1.0] - 2026-11-08
#### Added
- Format legality chart in At a glance: sets legal in Infinity and Core, when Sets 1–8 left Core, and current bans

### [1.0.0] - 2026-11-07
#### Added
- At a glance: current Comprehensive Rules (2.3) and Tournament Rules versions, Core legal sets and banned lists for Core, Infinity and Coconut
- Change log, newest first, from official release notes and announcements: bans (Apr 2025, Mar 2026, Nov 2026), Fabled rotation, Whispers in the Well, Winterspell (CR 2.0), Wilds Unknown (CR 2.1), Attack of the Vine (CR 2.2), Tournament Rules update, rotation explainer, Format Coconut beta, Hyperia City (CR 2.3); rules, errata and format changes for each with source links

---

## rarity.html

### [1.2.1] - 2026-11-08
#### Fixed
- Legendaries from Shimmering Skies (Set 5) on have a raised, glossy texture on parts of the art, foil or not; added to the Legendary, Standard and Foil rows
- Raised or textured cards note replaces the guess that "embossed" meant Iconic
- Two references for the Set 5 texture

### [1.2.0] - 2026-11-08
#### Added
- Chapter II Finishes: rarity-by-finish grid and a table of each finish (rarities, pull rate, look, value), most common first; note on promos and other cards outside packs
- Three references (foil process, Enchanted vs foil prices, early foil odds)
#### Changed
- What's in a pack and References renumbered to III and IV

### [1.1.0] - 2026-11-08
#### Changed
- All eight rarity symbols redrawn from the official rarity chart: line details added to Common through Legendary, and Epic (rainbow drop) and Iconic (rainbow iris) drawn instead of question marks
- Uncommon renamed "White book"; intro and ladder caption no longer call Epic and Iconic unconfirmed

### [1.0.0] - 2026-11-08
#### Added
- Rarity ladder diagram, Common to Iconic
- Table of every rarity: symbol, pull rate, description and typical value (USD), with sources
- What's in a pack: the twelve booster slots
- References (two official, the rest community trackers and price guides)
