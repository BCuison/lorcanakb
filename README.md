# Lorcana Knowledgebase

Personal knowledgebase for the Disney Lorcana trading card game: an at-the-table quick reference plus an in-depth companion doc that grows as we learn.

## Structure

```
lorcana-kb/
├── README.md              Repo overview (this file)
├── CHANGELOG.md           Version history for every file
├── .gitignore
├── index.html             Site home page
├── quick-reference.html   Hub: nav to Tools, Base Rules, The Inks, Illumineer's Quest
├── base-rules.html        Base rules (setup through formats)
├── inks.html              Ink guide index
├── table-tools.html       Table tools (coin flipper)
├── illumineers-quest.html Co-op quest index
├── quests/
│   └── palace-heist.html  Rules for one quest (one page per quest)
├── assets/
│   ├── css/storybook.css  Storybook theme (default)
│   ├── css/classic.css    Classic theme (original 1.x look)
│   └── js/
│       ├── site.js        Shared script (scroll reset, light/dark toggle, theme menu)
│       └── tools.js       Interactive tools (coin flipper)
├── scripts/
│   └── build-inks.py      Generates the six ink guides
├── inks/
│   └── <ink>.html         One guide per ink (amber, amethyst, emerald, ruby, sapphire, steel)
└── docs/
    └── knowledgebase.md   In-depth notes, rulings log, strategy
```

### Conventions
- **Site pages** (`.html`) live at the root so they work as-is on GitHub Pages, Netlify or any static host. Links between pages are relative.
- **Long-form notes** (`.md`) live in `docs/`. GitHub renders them; a static site generator can convert them later.
- **Design:** two themes share the same markup. Pages link `assets/css/storybook.css` (default); the theme menu in `site.js` swaps it for `classic.css`. Any new class needs styles in both files.
- **Tools** live on `table-tools.html`, linked first in the Quick Reference nav. Markup in the page, logic in `assets/js/tools.js`.
- **Quick reference is the hub.** Its nav menu opens each section page (Tools, Base Rules, The Inks, Illumineer's Quest); each section page links back with "← Quick reference".
- **Ink guides** are generated: edit the data in `scripts/build-inks.py`, then run `python3 scripts/build-inks.py .` from the repo root. Pairings and key cards use side-by-side format columns; add a format by adding a column.
- **Future folders** (create when needed):
  - `assets/img/` for images
  - `docs/decks/` for deck lists and matchup notes
  - `docs/sets/` for per-set notes
- File names are lowercase, hyphen-separated.

## Versioning

Each file has its own [Semantic Version](https://semver.org/), adapted for docs:

| Bump | When |
|------|------|
| MAJOR | Restructure or redesign |
| MINOR | New sections or content |
| PATCH | Corrections, wording, file moves |

Every change gets an entry in [CHANGELOG.md](CHANGELOG.md). The version also appears in each file (HTML footer, MD header).

## Publishing (optional)

1. `git init`, commit, push to GitHub
2. Repo Settings > Pages > Deploy from branch `main`, folder `/ (root)`
3. Site appears at `https://<username>.github.io/<repo>/`

## Disclaimer

Unofficial fan reference. Disney Lorcana is a trademark of Disney and Ravensburger. Always check the official Comprehensive Rules.
