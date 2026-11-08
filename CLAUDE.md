# Lorcana Knowledgebase

A personal Disney Lorcana knowledgebase: a static HTML site plus long-form notes in `docs/`. It's an unofficial fan reference. See [README.md](README.md) for the full structure, conventions and versioning rules.

## Agentic SDLC

- Feature work uses the `vibe-sdlc` plugin (GitHub `BCuison/vibeSDLC`), enabled in `.claude/settings.json`. Run it with `/vibe-sdlc:feature <description>`. The agents are named `vibe-sdlc:<name>`.
- Feature artifacts go in `docs/features/<slug>/`. Keep them, because they're how the agents hand work to each other. This is a new folder alongside the existing `docs/knowledgebase.md`.
- Only the developer agent modifies source.

## Design system

- Three themes share the same markup. `assets/css/illuminary.css` is the default, with a midnight header and a hexagon ink motif. The others are `classic.css` and `storybook.css`. The theme menu in `assets/js/site.js` swaps between them and lists them alphabetically.
- Any new class needs styles in **all three** theme files. Each theme supports light and dark mode.
- Fonts come from Google Fonts. Every page links IM Fell English, IM Fell English SC, Alegreya and Alegreya Sans, which Storybook uses. Illuminary imports Marcellus and Figtree in its CSS, and Classic imports Fraunces and Public Sans.
- Colors for shared components (the lore tracker, diagrams, dictionary, rarity tables) are mapped per theme through `--tk-*` variables, so shared layout rules stay identical across themes.
- Navigation: `quick-reference.html` is the hub. Section pages link back with "← Quick reference", and sub-pages link back to their section ("← Inks", "← Quests"). Interactive tools live on `table-tools.html`, with the markup in the page and the logic in `assets/js/tools.js`.

## Platform

- Plain static HTML, CSS and JS. Pages have no build step, and there are no dependencies or package manager.
- Site pages sit at the repo root and use relative links, so the site works on any static host (GitHub Pages ready).
- **The ink guides are generated.** Never hand-edit `inks/<ink>.html`. Edit the data in `scripts/build-inks.py`, then run `python3 scripts/build-inks.py .` from the repo root.
- **Preview and browser QA:** run `python3 -m http.server 8000` from the repo root and open `http://localhost:8000/`. For any visual change, check every theme in both light and dark mode, and check phone width (about 375px).
- Small state is saved in `localStorage` under `lorcana-kb-skin` (theme), `lorcana-kb-theme` (light/dark) and `lorcana-kb-tracker` (lore tracker). Changing its shape must not break values users already have saved.
- **Versioning:** every file has its own semantic version, shown in the HTML footer (and `<meta name="version">`) or the Markdown header, and every change gets a `CHANGELOG.md` entry, newest first. A feature isn't done until the version and changelog are updated. See the README's Versioning section.
- File names are lowercase and hyphen-separated.

## Security focus

- Low risk: there's no backend, no auth and no user accounts. A security review is only needed when a change:
  - adds third-party scripts, embeds or CDN resources (today the only external resource the site loads is Google Fonts; other external URLs are plain outbound links);
  - uses `innerHTML` or similar with anything not hard-coded (`site.js` and `tools.js` already use `innerHTML`, so check new uses);
  - stores new data in `localStorage`;
  - changes how `build-inks.py` escapes data (it uses `html.escape`, so keep that).
