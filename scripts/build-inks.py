# Generates inks/<ink>.html from the storybook template and the INKS data below.
# Usage (from repo root): python3 scripts/build-inks.py .
import html, sys
OUT = sys.argv[1]
E = html.escape

QR = "../base-rules.html"
INKS_PAGE = "../inks.html"
SRC = {
 "official": ("Six Top Decks for Post-Rotation Core (official, Sep 2026)", "https://www.disneylorcana.com/en-US/news/2026/09/6-top-decks"),
 "core_inks": ("Core ink tier list (inkdecks, Oct 2026)", "https://inkdecks.com/lorcana-metagame/inks"),
 "inf_inks": ("Infinity ink tier list (inkdecks)", "https://inkdecks.com/lorcana-metagame/infinity/inks"),
 "inf_meta": ("Infinity meta report (inkdecks)", "https://inkdecks.com/lorcana-metagame/infinity"),
 "quest": ("Quest Coast IV: Hyperia City results (inkdecks, Oct 24 2026)", "https://inkdecks.com/lorcana-tournaments/quest-coast-iv-hyperia-city-tournament-decks-364364"),
 "colors": ("Lorcana ink colors (Wargamer)", "https://www.wargamer.com/disney-lorcana/colors"),
 "aliens": ("Amber-Steel Aliens deck guide (Cardsrealm, 2026)", "https://lorcana.cardsrealm.com/en-us/articles/lorcana-deck-guide-amber-steel-aliens-core-2026"),
 "steelsong": ("Steelsong deck guide (lorcana.gg, 2024)", "https://lorcana.gg/amber-steel-steelsong-deck-guide/"),
 "rubysapph": ("Ruby Sapphire Items deck guide (Cardsrealm, 2024)", "https://lorcana.cardsrealm.com/en-gb/articles/lorcana-deck-guide-ruby-sapphire-items"),
}

CORE_ASOF = "As of Oct 27, 2026 · incl. Set 14"
CORE_NOTE = "Shares from inkdecks Core tier list (Oct 27). Archetype names from the official Sep writeup and Oct 24 results. Hyperia City (Set 14) is legal since its Oct 16 prerelease."
CARDS_CORE_ASOF = "Sets 9 to 13 · Sep 2026"
CARDS_CORE_NOTE = "From the official post-rotation writeup. Hyperia City cards are not reflected yet."

FONTS = '<link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Alegreya:ital,wght@0,400;0,500;0,700;1,400&family=Alegreya+Sans:wght@400;500&display=swap" rel="stylesheet">'
FLEURON = '<div class="fleuron" aria-hidden="true"><svg><use href="#fleuron"/></svg></div>'
FLEURON_DEF = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="fleuron" viewBox="0 0 26 14"><path d="M13 1.5 17 7l-4 5.5L9 7Z" fill="currentColor"/><circle cx="3.5" cy="7" r="1.4" fill="currentColor"/><circle cx="22.5" cy="7" r="1.4" fill="currentColor"/></symbol></svg>'
ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"]
TIER_TOP = {"Top tier"}

def tier(label):
    cls = "tier top" if label in TIER_TOP else "tier"
    return f'<span class="{cls}">{E(label)}</span>'

def pair_rows(rows):
    return "\n".join(
        f'        <li><div class="entry-top"><span class="drop" style="background:var(--{ink})"></span><span class="name">{E(name)}</span>{tier(lab)}</div>{E(text)}</li>'
        for ink, name, lab, text in rows)

def card_rows(rows):
    return "\n".join(
        f'        <li><div class="entry-top"><span class="name">{E(title)}</span>{tier(lab) if lab else ""}</div>{E(text)}</li>'
        for title, lab, text in rows)

def fmt(title, asof, rows, note):
    return f'''    <section>
      <h3>{title}</h3><span class="asof">{E(asof)}</span>
      <ul class="entries">
{rows}
      </ul>
      <p class="fine">{E(note)}</p>
    </section>'''

def chapter(i, cid, title, body):
    return f'''<section class="chapter" id="{cid}">
  <div class="chapter-head"><span class="num">Chapter {ROMAN[i]}</span><h2>{title}</h2></div>
{body}
</section>'''

def page(d):
    n = d["name"]
    strengths = "\n".join(f"      <li>{E(x)}</li>" for x in d["strengths"])
    weaknesses = "\n".join(f"      <li>{E(x)}</li>" for x in d["weaknesses"])
    mech = "\n".join(
        f'    <p><span class="term">{E(t)}</span>' + (f'<a class="rules-link" href="{QR}#{a}">rules →</a>' if a else "") + f'<br>{E(x)}</p>'
        for t, x, a in d["mechanics"])
    phases = "\n".join(
        f'    <div><span class="when">{E(t)}</span><h3>{E(h)}</h3><p>{E(p)}</p></div>'
        for t, h, p in zip(["Turns 1 to 3", "Turns 4 to 6", "Turns 7 and on"], d["phase_titles"], d["phases"]))
    against = "\n".join(f"    <li><span><b>{E(b)}</b> {E(t)}</span></li>" for b, t in d["against"])
    mistakes = "\n".join(f'    <p><span class="term">{E(h)}</span><br>{E(p)}</p>' for h, p in d["mistakes"])
    srcs = "\n".join(f'    <li><a href="{SRC[k][1]}" target="_blank" rel="noopener">{E(SRC[k][0])}</a></li>' for k in d["sources"])

    chapters = [
        chapter(0, "identity", "Identity", f'''  <div class="pair">
    <div><h3>Strengths</h3><ul>
{strengths}
    </ul></div>
    <div><h3>Weaknesses</h3><ul>
{weaknesses}
    </ul></div>
  </div>'''),
        chapter(1, "mechanics", "Signature mechanics", f'''  <div class="dictionary">
{mech}
  </div>'''),
        chapter(2, "plan", "Game plan", f'''  <div class="phases">
{phases}
  </div>
  <p class="note"><b>Inking</b>{E(d["ink_tip"][0].upper() + d["ink_tip"][1:])}</p>'''),
        chapter(3, "pairings", "Pairings", f'''  <p class="muted">Which second ink {n} goes with, and how often it shows up. The meta shifts with every set, so each side is dated.</p>
  <div class="folio">
{fmt("Core Constructed", CORE_ASOF, pair_rows(d["core_pairs"]), CORE_NOTE)}
{fmt("Infinity Constructed", d.get("inf_asof", "As of Jul 2026"), pair_rows(d["inf_pairs"]), d.get("inf_note", "Shares from inkdecks Infinity tier list (Jul 2026). Infinity has its own banlist."))}
  </div>'''),
        chapter(4, "cards", "Key cards", f'''  <p class="muted">Cards that define each {n} archetype, partner ink included, since that’s how decks are built.</p>
  <div class="folio">
{fmt("Core Constructed", CARDS_CORE_ASOF, card_rows(d["core_cards"]), d.get("core_cards_note", CARDS_CORE_NOTE))}
{fmt("Infinity Constructed", d.get("inf_cards_asof", "Needs verification"), card_rows(d["inf_cards"]), d["inf_cards_note"])}
  </div>'''),
        chapter(5, "against", f"Facing {n}", f'''  <ol class="rules">
{against}
  </ol>'''),
        chapter(6, "mistakes", "Common mistakes", f'''  <div class="dictionary">
{mistakes}
  </div>'''),
    ]
    body = f"\n\n{FLEURON}\n\n".join(chapters)

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="version" content="{d["version"]}">
<title>{n} Ink Guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{FONTS}
<link rel="stylesheet" href="../assets/css/storybook.css">
</head>
<body style="--accent: var(--{d["slug"]})">
{FLEURON_DEF}

<header class="titlepage col">
  <div class="crumbline"><a href="../">Home</a> · <a href="{INKS_PAGE}">The inks</a></div>
  <div class="bigdrop" aria-hidden="true" style="margin-top:22px"></div>
  <h1>{n}</h1>
  <p class="sub">{E(d["tagline"])}</p>
  <div class="rule" aria-hidden="true"></div>
</header>

<nav class="contents" aria-label="Contents">
  <ol>
    <li class="back"><a href="{INKS_PAGE}">← Inks</a></li>
    <li><a href="#identity"><b>I</b>Identity</a></li>
    <li><a href="#mechanics"><b>II</b>Mechanics</a></li>
    <li><a href="#plan"><b>III</b>Game plan</a></li>
    <li><a href="#pairings"><b>IV</b>Pairings</a></li>
    <li><a href="#cards"><b>V</b>Key cards</a></li>
    <li><a href="#against"><b>VI</b>Facing it</a></li>
    <li><a href="#mistakes"><b>VII</b>Mistakes</a></li>
  </ol>
</nav>

<main class="col">

{body}

<footer class="colophon">
  <h2>Colophon</h2>
  <p>An unofficial guide for our table. Meta chapters are snapshots and go stale with each set. Card text overrides anything here.</p>
  <ul>
{srcs}
  </ul>
  <div class="meta">
    <span class="ver">Version {d["version"]}</span>
    <span>Updated 2026-10-27</span>
    <a href="{INKS_PAGE}">All inks</a>
    <a href="{QR}">Base rules</a>
    <a href="../CHANGELOG.md">View changelog</a>
    <a href="../">Home</a>
  </div>
</footer>
</main>
<script src="../assets/js/site.js"></script>
</body>
</html>
'''


VERIFY = "Lists not verified yet. To be added as we confirm current decklists."
ROYALTY = ("Royalty (Amber/Emerald)", "", "Aurora - Holding Court (cheaper Queens and Princesses), The Queen - Regal Monarch, Elinor - Renowned Diplomat, Grandmother Willow - Ancient Advisor, Pocahontas - Peacekeeper")
RAMP = ("Ramp (Amber/Amethyst)", "", "Hamm - Piggy Bank, Grandmother Willow - Ancient Advisor, Gaston - Superior Archer (removal via Support), Demona - Scourge of the Wyvern Clan")
SONGS = ("Songs (Amber/Steel)", "", "Ariel - Ethereal Voice (card flow), Angel - Siren Singer, Ursula - Vanessa, Lilo & Stitch - Fun-Loving Friends, Strength of a Raging Fire, He Hurled His Thunderbolt")
BOOST = ("Boost control (Amber/Ruby)", "", "Webby’s Diary (draw engine), Raging Storm (sweeper), Scrooge McDuck - Ghostly Ebenezer, Sulley - The New Boss")
OMNI = ("Omnidroid (Amethyst/Steel)", "", "Omnidroid - V.8, V.9 and V.10, Omnidroid - Ultimate Iteration, Syndrome - Out for Revenge (free Shift), Morph - Little Imitator, Violet Parr - At Wits’ End")
EVAS_RA = ("Evasive (Ruby/Amethyst)", "", "Dash Parr - Dodgeball Dynamo, Randall Boggs - Envious Coworker, Vixey - Expert Fisher, Dumbo - Ninth Wonder of the Universe, Peter Pan & Tinker Bell - Fast Friends, Cheshire Cat - Inexplicable")
STEELSONG = ("Steelsong (Amber/Steel)", "Classic list", "Ariel - Spectacular Singer, Cinderella - Ballroom Sensation, Strength of a Raging Fire, Let the Storm Rage On, A Whole New World")
RS_ITEMS = ("Items (Ruby/Sapphire)", "Classic list", "One Jump Ahead, How Far I’ll Go, Be Prepared, Maleficent - Monstrous Dragon, Tamatoa - So Shiny!, Lucky Dime")
ELINOR = ("Elinor (Amber/Emerald)", "", "Elinor - Renowned Diplomat (needs three or more exerted characters at end of turn)")

INKS = [
dict(slug="amber", name="Amber", version="2.0.1",
 tagline="Songs, support and healing. Amber builds a board that gets stronger together and keeps it alive.",
 strengths=["Cheap singers play expensive songs early, for free", "Abilities that trigger off your other characters reward going wide", "Healing and protection keep key characters in play"],
 weaknesses=["Not known for dealing damage; removal usually comes from songs or the partner ink", "Wide boards are exposed to board sweepers", "Singers exert to sing, which leaves them open to challenges"],
 mechanics=[("Singer and songs", "Singer N lets a cheap character sing a song costing up to N. Songs are Amber’s main source of removal and card draw.", "songs"),
  ("Sing Together", "Big songs paid by exerting several characters at once. Fits a go-wide board.", "keywords"),
  ("Support", "Adds a questing character’s strength to another character, setting up favorable challenges.", "keywords"),
  ("Healing", "Removes damage, undoing your opponent’s chip damage and failed challenges.", None),
  ("Bodyguard", "Protects fragile engine characters by forcing challenges onto a sturdier body.", "keywords"),
  ("Board synergy", "“Whenever you play a character” and similar triggers. More bodies, more value.", None)],
 phase_titles=["Build the board", "Sing up the curve", "Close it out"],
 phases=["Play cheap characters and singers. Ink expensive or situational cards you can’t use soon. Keep at least one singer in hand.",
  "Sing songs above your ink total to remove threats or draw cards. Shift into bigger versions. Quest with characters that won’t be punished.",
  "Refill with draw songs, protect your lore engines and race to 20. Hold back if the opponent can sweep the board."],
 ink_tip="keep singers and your cheapest characters; ink duplicates of expensive cards and songs you can’t sing yet.",
 core_pairs=[("emerald", "Emerald: Royalty / Aggro", "Top tier", "About a fifth of the field. Floods the board with cheap characters, ramps into Elinor early and overwhelms before the opponent stabilizes."),
  ("sapphire", "Sapphire: Detectives / Princesses", "Top tier", "Rising with Hyperia City. Three Amber/Sapphire lists made the Top 8 of an Oct 24 event. Control leaning."),
  ("amethyst", "Amethyst: Ramp / Merida", "Top tier", "Midrange. Ramps out strong characters early, then uses card draw to set up good challenges."),
  ("steel", "Steel: Lilo & Stitch / Songs", "Playable", "Low share overall, but Lilo & Stitch took 2nd at an Oct 24 event. Cheap singers or Alien aggro."),
  ("ruby", "Ruby: Boost control", "Niche", "Builds a card-draw engine, then sweeps the board. Weak to fast starts.")],
 inf_asof="As of Oct 25, 2026",
 inf_pairs=[("emerald", "Emerald: Elinor / Aggro / Circle", "Top tier", "The most played Amber pair, about a third of the field with a strong win rate. Go-wide pressure."),
  ("steel", "Steel: Steelsong", "Popular", "Classic singers plus removal songs and Shift. Very popular, but its recent win rate is below average."),
  ("ruby", "Ruby: Damaged / Boost", "Small sample", "Shows up, but too few results to judge."),
  ("amethyst", "Amethyst: Songs / Aggro", "Niche", "Low play rate in recent reports."),
  ("sapphire", "Sapphire", "Rare", "Almost no results.")],
 inf_note="Source: inkdecks ink tier list. Infinity has its own banlist.",
 core_cards=[ROYALTY, RAMP, SONGS, BOOST],
 core_cards_note="Gaston - Superior Archer appears across several Amber lists as flexible removal. Hyperia City cards are not reflected yet.",
 inf_cards=[STEELSONG, ELINOR, ("Other archetypes", "", "To be added as we verify current lists.")],
 inf_cards_note="Steelsong cards come from a 2024 guide. Current Infinity lists may differ.",
 against=[("Pressure the singers.", "A singer that exerts to sing becomes a challenge target. Make them pay for it."),
  ("Finish what you damage.", "Healing resets chip damage, so commit to banishing a character rather than wounding it."),
  ("Punish wide boards.", "Board sweepers and mass damage hit go-wide Amber hardest."),
  ("Be fast against control builds.", "Boost and ramp decks need setup time. Early lore forces them to react.")],
 mistakes=[("Singing with a drying character", "Singing is an exert action. A character played this turn can’t sing."),
  ("Overextending", "Dumping your whole hand into a sweeper loses the game. Keep a reload in hand."),
  ("Inking your singers", "Singers are your discount engine. Ink songs you can’t cast before you ink a singer."),
  ("Questing into open challengers", "An exerted engine piece is a free target. Quest with what you can afford to lose.")],
 sources=["official", "core_inks", "quest", "inf_inks", "colors", "aliens", "steelsong"]),

dict(slug="amethyst", name="Amethyst", version="2.0.1",
 tagline="Card draw, bounce and magic. Amethyst wins on card advantage and flexible, tricky plays.",
 strengths=["Draws extra cards and digs for answers", "Bounce and recursion reset threats or reuse your best cards", "Flexible across aggro, midrange and control"],
 weaknesses=["Often relies on the partner ink for board presence", "Card-draw engines take time to pay off", "Bounce only buys time if the opponent can replay the card"],
 mechanics=[("Card draw", "Amethyst’s core strength. More cards means more options and more ink.", None),
  ("Bounce", "Return a character to its owner’s hand. Resets a big threat or removes a blocker for a turn.", None),
  ("Recursion", "Cards that come back from the discard after they’re banished or used.", None),
  ("Evasive", "Several Amethyst archetypes win by questing with characters most opponents can’t challenge.", "keywords"),
  ("Shift", "Omnidroid decks build up through bigger Shift forms.", "songs"),
  ("Disruption", "Effects that interfere with the opponent’s plans rather than fight head on.", None)],
 phase_titles=["Set up", "Take control", "Close it out"],
 phases=["Play cheap characters and card draw. You’ll see more cards than most decks, so ink freely.",
  "Bounce key blockers or threats, then use your card advantage to set up favorable challenges.",
  "Replay your strongest threats and quest with Evasive characters the opponent can’t reach."],
 ink_tip="Amethyst draws extra cards, so you can afford to ink more aggressively than most inks.",
 core_pairs=[("amber", "Amber: Ramp / Merida", "Top tier", "Midrange. Ramps strong characters early, then uses card draw to set up challenges. A Merida list made Top 8 on Oct 24."),
  ("steel", "Steel: Omnidroid", "Strong", "Shift-based. Upgrades Omnidroid through bigger forms, with Syndrome enabling a free Shift."),
  ("ruby", "Ruby: Evasive", "Playable", "Pressure with Evasive characters and card advantage while avoiding challenges."),
  ("emerald", "Emerald", "Playable", "Seen in results. Archetype details to verify."),
  ("sapphire", "Sapphire", "Rare", "Not in the current Core tier list.")],
 inf_pairs=[("ruby", "Ruby: Bounce", "Top tier", "One of the top Infinity decks. Uses bounce to stay ahead on tempo."),
  ("sapphire", "Sapphire: Pawpsicles", "Strong", "A steady second-tier performer. Details to verify."),
  ("emerald", "Emerald: Discard / Evasives", "Strong", "Attacks the opponent’s hand while questing safely."),
  ("steel", "Steel: Tempo", "Playable", "Small but consistent share."),
  ("amber", "Amber: Burn / Aggro / Songs", "Niche", "Low play rate in recent reports.")],
 core_cards=[RAMP, OMNI, EVAS_RA],
 inf_cards=[("Bounce (Amethyst/Ruby)", "", VERIFY), ("Pawpsicles (Amethyst/Sapphire)", "", VERIFY)],
 inf_cards_note="inkdecks blocked direct access to current Infinity decklists.",
 against=[("Don’t overinvest in one threat.", "Bounce sends your big play back to hand. Spread value across the board."),
  ("Pressure early.", "Card advantage snowballs. Make them spend cards on defense before the engine runs."),
  ("Keep an answer for Evasive.", "Hold an Evasive or Alert character so their questers aren’t free lore."),
  ("Watch the discard.", "Recursion means a banished card may not be gone for good.")],
 mistakes=[("Drawing instead of developing", "Card draw is useless if you fall behind on board and lore."),
  ("Bouncing low-value targets", "Save bounce for something expensive or for a lethal turn."),
  ("Shifting into removal", "Check what the opponent can answer before you stack value on one character."),
  ("Forgetting the lore race", "Amethyst can out-card the opponent and still lose to 20 lore.")],
 sources=["official", "core_inks", "quest", "inf_inks", "inf_meta", "colors"]),

dict(slug="emerald", name="Emerald", version="2.0.1",
 tagline="Tricks, evasion and disruption. Emerald harasses the opponent’s hand and board while slipping past defenses.",
 strengths=["Discard disrupts the opponent’s plans", "Evasive and Ward characters are hard to challenge or target", "Cheap characters make fast, wide starts"],
 weaknesses=["Small characters lose fair challenges", "Disruption alone doesn’t win; it needs a lore plan", "Wide boards are exposed to sweepers"],
 mechanics=[("Discard", "Makes the opponent discard cards, cutting off their best plays before they happen.", None),
  ("Evasive", "Only Evasive or Alert characters can challenge them, so they quest safely.", "keywords"),
  ("Ward", "Opponents can’t choose these characters with effects. They must challenge instead.", "keywords"),
  ("Card draw", "Extra draws to fuel tricks and keep pressure on.", None),
  ("Go wide", "Elinor - Renowned Diplomat rewards three or more exerted characters at the end of your turn.", None)],
 phase_titles=["Swarm", "Disrupt", "Close it out"],
 phases=["Play several cheap characters. Early board presence powers Emerald’s payoffs.",
  "Discard the opponent’s answers, quest with Evasive characters and avoid fair fights.",
  "Keep the hand pressure on and race to 20 before they recover."],
 ink_tip="keep your cheap characters and disruption; ink expensive cards you won’t cast soon.",
 core_pairs=[("steel", "Steel: Evasive", "Top tier", "The most played Core pair right now, about a quarter of the field. Won Quest Coast IV on Oct 24."),
  ("amber", "Amber: Royalty / Aggro", "Top tier", "About a fifth of the field. Floods the board, ramps into Elinor early and overwhelms."),
  ("amethyst", "Amethyst", "Playable", "Seen in results. Archetype details to verify."),
  ("ruby", "Ruby", "Niche", "Low share."),
  ("sapphire", "Sapphire", "Niche", "Low share with a weak win rate.")],
 inf_pairs=[("amber", "Amber: Elinor / Aggro / Circle", "Top tier", "The most played Infinity pair. Go-wide pressure."),
  ("amethyst", "Amethyst: Discard / Evasives", "Strong", "Attacks the hand while questing safely."),
  ("steel", "Steel: Discard", "Playable", "Discard backed by sturdy Steel bodies."),
  ("sapphire", "Sapphire: Items / Control", "Niche", "Low play rate."),
  ("ruby", "Ruby", "Small sample", "Too few results to judge.")],
 core_cards=[ROYALTY, ("Evasive (Emerald/Steel)", "", VERIFY + " Won Quest Coast IV on Oct 24.")],
 inf_cards=[ELINOR, ("Discard archetypes", "", VERIFY)],
 inf_cards_note="inkdecks blocked direct access to current Infinity decklists.",
 against=[("Keep an answer for Evasive.", "Hold an Evasive or Alert character, or their questers are free lore."),
  ("Play around discard.", "Use cards rather than hoarding them. A full hand is a target."),
  ("Punish wide boards.", "Sweepers and mass damage hit Emerald’s small characters hard."),
  ("Challenge Ward characters.", "Ward stops effects, not challenges. Trade with them directly.")],
 mistakes=[("Discarding into an empty hand", "Discard effects lose value when the opponent has few cards."),
  ("Taking fair fights", "Small Emerald characters lose straight challenges. Quest instead."),
  ("Ignoring the lore race", "Disruption buys time. Use it to get ahead on lore."),
  ("Overextending", "Keep a reload in hand in case the board gets swept.")],
 sources=["official", "core_inks", "quest", "inf_inks", "inf_meta", "colors"]),

dict(slug="ruby", name="Ruby", version="2.0.1",
 tagline="Aggression and damage. Ruby hits hard, hits early and removes whatever is in the way.",
 strengths=["Rush and Challenger win challenges early", "Strong removal through damage and banishing", "Big, hard-hitting characters"],
 weaknesses=["Reckless characters can’t quest", "Works best with a partner ink that stabilizes", "Runs out of steam if the opponent survives the early game"],
 mechanics=[("Rush", "Can challenge the turn it’s played, so it hits before the opponent can react.", "keywords"),
  ("Challenger", "Bonus strength while challenging. Wins trades it would otherwise lose.", "keywords"),
  ("Reckless", "Can’t quest and must challenge if able. Pure board pressure.", "keywords"),
  ("Removal", "Damage and banish effects that clear blockers and threats.", None),
  ("Evasive", "Ruby pairs with Amethyst in Evasive builds that quest safely.", "keywords")],
 phase_titles=["Strike first", "Clear the way", "Finish"],
 phases=["Play aggressive characters and start challenging early. Use Rush to punish anything they exert.",
  "Remove blockers and engine pieces, then quest with what survives.",
  "Push the last lore before the opponent stabilizes. Don’t let a stalled board drag on."],
 ink_tip="keep Rush characters and removal; ink slow or expensive cards.",
 core_pairs=[("amethyst", "Amethyst: Evasive", "Playable", "Pressure with Evasive characters and card advantage while avoiding challenges."),
  ("amber", "Amber: Boost control", "Niche", "Card-draw engine plus sweepers. Weak to fast starts."),
  ("emerald", "Emerald", "Niche", "Low share."),
  ("steel", "Steel", "Rare", "Almost no results."),
  ("sapphire", "Sapphire", "Rare", "Not in the current Core tier list.")],
 inf_pairs=[("sapphire", "Sapphire: Items / Shark", "Top tier", "Ramp and items into big Ruby threats. One of the strongest Infinity pairs."),
  ("amethyst", "Amethyst: Bounce", "Top tier", "Bounce plus aggression for tempo."),
  ("amber", "Amber", "Small sample", "Too few results to judge."),
  ("emerald", "Emerald", "Small sample", "Too few results to judge."),
  ("steel", "Steel", "Small sample", "Almost no results.")],
 core_cards=[EVAS_RA, BOOST],
 inf_cards=[RS_ITEMS, ("Bounce (Amethyst/Ruby)", "", VERIFY)],
 inf_cards_note="Items list comes from a 2024 guide. Hiram Flaversham - Toymaker from that list is now banned.",
 against=[("Don’t leave characters exposed.", "Exerted characters are Ruby’s favorite targets. Quest with what you can lose."),
  ("Use Bodyguard and Resist.", "Sturdy blockers and damage reduction blunt early challenges."),
  ("Survive to the late game.", "Ruby fades if it can’t close quickly. Trade efficiently and stabilize."),
  ("Expect Rush.", "A freshly played Ruby character may challenge right away.")],
 mistakes=[("Taking bad trades", "Challenging just because you can loses cards. Check strength and willpower first."),
  ("Forgetting to quest", "Removal clears the way, but lore wins the game."),
  ("Reckless lock", "Reckless characters must challenge. Plan for forced attacks."),
  ("Overcommitting", "Keep threats in hand in case the board gets swept.")],
 sources=["official", "core_inks", "inf_inks", "inf_meta", "colors", "rubysapph"]),

dict(slug="sapphire", name="Sapphire", version="2.0.1",
 tagline="Items, locations and control. Sapphire ramps ahead on ink and plays the long game.",
 strengths=["Ramp puts extra cards in the inkwell for early big plays", "Items and locations generate steady value and lore", "Card selection finds the right answer"],
 weaknesses=["Slow starts can fall behind on lore", "Value engines are vulnerable to item and location removal", "Fewer cheap aggressive characters"],
 mechanics=[("Ramp", "Extra cards into the inkwell. Play expensive threats ahead of schedule.", "ink"),
  ("Items", "Stay in play for ongoing effects and abilities.", "types"),
  ("Locations", "Give lore every turn and buff characters that move in.", "quest"),
  ("Card selection", "Look at the top of your deck and choose what you draw.", None),
  ("Control", "Slow the game down, answer threats and win late.", None)],
 phase_titles=["Ramp", "Stabilize", "Take over"],
 phases=["Ramp and play items or locations. It’s fine to be slightly behind on lore early.",
  "Answer the opponent’s threats with your extra ink and build a value engine.",
  "Deploy big threats and let locations and items carry you to 20."],
 ink_tip="ramp is the plan, so ink early and often; keep your engines and answers.",
 core_pairs=[("amber", "Amber: Detectives / Princesses", "Top tier", "Rising with Hyperia City. Three Amber/Sapphire lists made the Top 8 of an Oct 24 event."),
  ("emerald", "Emerald", "Niche", "Low share with a weak win rate."),
  ("steel", "Steel", "Niche", "Low share with a weak win rate."),
  ("amethyst", "Amethyst", "Rare", "Not in the current Core tier list."),
  ("ruby", "Ruby", "Rare", "Not in the current Core tier list.")],
 inf_pairs=[("ruby", "Ruby: Items / Shark", "Top tier", "Ramp and items into big Ruby threats. One of the strongest Infinity pairs."),
  ("amethyst", "Amethyst: Pawpsicles", "Strong", "A steady second-tier performer. Details to verify."),
  ("emerald", "Emerald: Items / Control", "Niche", "Low play rate."),
  ("steel", "Steel: Items / Ramp / Detectives", "Niche", "Low play rate."),
  ("amber", "Amber", "Rare", "Almost no results.")],
 core_cards=[("Detectives / Princesses (Amber/Sapphire)", "", VERIFY + " Three made Top 8 at Quest Coast IV on Oct 24.")],
 core_cards_note="Sapphire wasn’t featured in the official Sep writeup. Hyperia City brought it back.",
 inf_cards=[RS_ITEMS, ("Pawpsicles (Amethyst/Sapphire)", "", VERIFY)],
 inf_cards_note="Items list comes from a 2024 guide. Hiram Flaversham - Toymaker from that list is now banned.",
 against=[("Pressure early.", "Sapphire is slow to start. Get ahead on lore before the ramp pays off."),
  ("Remove the engines.", "Item and location removal shuts off their value."),
  ("Challenge locations.", "Locations can be challenged and can’t deal damage back."),
  ("Don’t play the long game.", "Sapphire wants a slow match. Force decisions early.")],
 mistakes=[("Ramping without a board", "Extra ink is wasted if you have nothing to play or the opponent runs away on lore."),
  ("Too many engines", "Stacking items while ignoring the board loses to aggro."),
  ("Forgetting move costs", "Locations need characters to move in. Budget ink for it."),
  ("Holding answers too long", "Control still needs to remove threats before they quest.")],
 sources=["core_inks", "quest", "inf_inks", "inf_meta", "colors", "rubysapph"]),

dict(slug="steel", name="Steel", version="2.0.1",
 tagline="Big bodies and resilience. Steel builds sturdy characters that win fights and protect the board.",
 strengths=["High strength and willpower win challenges", "Resist and Bodyguard keep the board alive", "Direct damage removes threats"],
 weaknesses=["Big bodies cost more, so starts can be slow", "Evasive threats walk past ground blockers", "Card draw usually comes from the partner ink"],
 mechanics=[("Resist", "Reduces damage taken, so characters survive repeated challenges.", "keywords"),
  ("Bodyguard", "Forces challenges onto a sturdy blocker.", "keywords"),
  ("Challenger", "Bonus strength while challenging.", "keywords"),
  ("Direct damage", "Effects that deal damage outside challenges to finish off characters.", None),
  ("Shift", "Omnidroid decks build up through bigger Shift forms.", "songs")],
 phase_titles=["Hold the line", "Win the fights", "Grind it out"],
 phases=["Play durable characters and Bodyguards. Don’t rush into bad trades.",
  "Challenge with superior stats, use direct damage to finish characters and build board control.",
  "Quest with a board the opponent can’t profitably challenge."],
 ink_tip="keep your sturdy characters and removal; ink cards that only matter late.",
 core_pairs=[("emerald", "Emerald: Evasive", "Top tier", "The most played Core pair right now, about a quarter of the field. Won Quest Coast IV on Oct 24."),
  ("amethyst", "Amethyst: Omnidroid", "Strong", "Shift-based. Upgrades Omnidroid through bigger forms, with Syndrome enabling a free Shift."),
  ("amber", "Amber: Lilo & Stitch / Songs", "Playable", "Low share overall, but Lilo & Stitch took 2nd at an Oct 24 event."),
  ("sapphire", "Sapphire", "Niche", "Low share with a weak win rate."),
  ("ruby", "Ruby", "Rare", "Almost no results.")],
 inf_pairs=[("amber", "Amber: Steelsong", "Top tier", "Classic singers plus removal songs and Shift. One of the most played Infinity decks."),
  ("emerald", "Emerald: Discard", "Playable", "Discard backed by sturdy Steel bodies."),
  ("amethyst", "Amethyst: Tempo", "Playable", "Small but consistent share."),
  ("sapphire", "Sapphire: Items / Ramp / Detectives", "Niche", "Low play rate."),
  ("ruby", "Ruby", "Small sample", "Almost no results.")],
 core_cards=[("Evasive (Emerald/Steel)", "", VERIFY + " Won Quest Coast IV on Oct 24."), OMNI, SONGS],
 inf_cards=[STEELSONG, ("Other archetypes", "", VERIFY)],
 inf_cards_note="Steelsong cards come from a 2024 guide. Current Infinity lists may differ.",
 against=[("Go around, not through.", "Evasive characters quest past Steel’s blockers."),
  ("Avoid fair fights.", "Steel usually wins straight challenges. Use effects instead."),
  ("Pressure the slow start.", "Steel’s best bodies cost more. Get ahead on lore early."),
  ("Track Resist.", "Resist reduces each instance of damage. Small hits may do nothing.")],
 mistakes=[("Playing too passively", "Big blockers don’t win alone. Quest when it’s safe."),
  ("Ignoring Evasive threats", "Plan answers for characters your board can’t challenge."),
  ("Leaving Bodyguard ready", "Only exerted characters can be challenged, so a ready Bodyguard protects nothing. Play it exerted when you need cover now."),
  ("Running out of cards", "Steel lacks draw. Don’t trade away your hand too fast.")],
 sources=["official", "core_inks", "quest", "inf_inks", "inf_meta", "colors", "steelsong"]),
]

for d in INKS:
    with open(f"{OUT}/inks/{d['slug']}.html", "w") as f:
        f.write(page(d))
print("built", len(INKS))
