/* Lorcana KB tools v1.4.1
   Coin flipper: fair 50/50 using the browser's crypto random source. Lore tracker and
   deck odds calculator below.
   Tap the coin itself or the button to flip. */
(function () {
  var btn = document.getElementById('coin-flip');
  if (!btn) return;
  var coin = document.getElementById('coin');
  var out = document.getElementById('coin-result');
  var tally = document.getElementById('coin-tally');
  var counts = { Heads: 0, Tails: 0 };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function flip() {
    try {
      var a = new Uint8Array(1);
      crypto.getRandomValues(a);
      return (a[0] & 1) ? 'Heads' : 'Tails';
    } catch (e) {
      return Math.random() < 0.5 ? 'Heads' : 'Tails';
    }
  }

  function show(r) {
    counts[r]++;
    coin.dataset.side = r.toLowerCase();
    out.textContent = r;
    tally.textContent = 'Heads ' + counts.Heads + ' · Tails ' + counts.Tails;
    btn.disabled = false;
    btn.textContent = 'Flip Again';
    coin.removeAttribute('aria-busy');
    busy = false;
  }

  var busy = false;
  function go() {
    if (busy) return;
    busy = true;
    var r = flip();
    btn.disabled = true;
    coin.setAttribute('aria-busy', 'true');
    out.textContent = 'Flipping…';
    if (reduce) { show(r); return; }
    coin.classList.remove('spin');
    void coin.offsetWidth; /* restart the animation */
    coin.classList.add('spin');
    setTimeout(function () { show(r); }, 700);
  }

  btn.addEventListener('click', go);
  coin.addEventListener('click', go);
})();

/* Lore tracker: 2 to 4 players, first to 20 lore wins.
   Scores, names and player count are saved in this browser (localStorage).
   Undo steps back through score and player-count changes made since the page opened.
   Dropping to fewer players clears the hidden seats' scores; Undo brings them back. */
(function () {
  var root = document.getElementById('tracker');
  if (!root) return;
  var KEY = 'lorcana-kb-tracker';
  var GOAL = 20;
  var SEATS = ['sapphire', 'ruby', 'emerald', 'amethyst'];
  var list = document.getElementById('tracker-players');
  var status = document.getElementById('tracker-status');
  var undoBtn = document.getElementById('tracker-undo');
  var resetBtn = document.getElementById('tracker-reset');
  var seatBtns = root.querySelectorAll('[data-count]');
  var history = [];
  var resetTimer = null;

  var state = { count: 2, names: ['Player 1', 'Player 2', 'Player 3', 'Player 4'], scores: [0, 0, 0, 0] };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.scores && saved.names) {
      state.count = Math.min(4, Math.max(2, saved.count | 0));
      for (var i = 0; i < 4; i++) {
        if (typeof saved.names[i] === 'string') state.names[i] = saved.names[i].slice(0, 20);
        state.scores[i] = Math.max(0, saved.scores[i] | 0);
      }
    }
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function name(i) { return state.names[i].trim() || 'Player ' + (i + 1); }

  function render() {
    list.innerHTML = '';
    list.setAttribute('data-count', state.count);
    for (var i = 0; i < state.count; i++) {
      var card = document.createElement('div');
      card.className = 'lore-card';
      card.style.setProperty('--seat', 'var(--' + SEATS[i] + ')');
      card.innerHTML =
        '<label class="sr-only" for="lore-name-' + i + '">Player ' + (i + 1) + ' name</label>' +
        '<input class="lore-name" id="lore-name-' + i + '" maxlength="20" autocomplete="off" spellcheck="false">' +
        '<div class="lore-score"><span class="lore-num"></span><span class="lore-goal">of ' + GOAL + '</span></div>' +
        '<div class="lore-meter" aria-hidden="true"><span></span></div>' +
        '<p class="lore-win">Wins</p>' +
        '<div class="lore-btns">' +
          '<button type="button" data-i="' + i + '" data-d="-1">−1</button>' +
          '<button type="button" data-i="' + i + '" data-d="1">+1</button>' +
          '<button type="button" data-i="' + i + '" data-d="2">+2</button>' +
          '<button type="button" data-i="' + i + '" data-d="3">+3</button>' +
        '</div>';
      card.querySelector('.lore-name').value = state.names[i];
      list.appendChild(card);
      update(i);
    }
    for (var j = 0; j < seatBtns.length; j++)
      seatBtns[j].setAttribute('aria-pressed', String(+seatBtns[j].getAttribute('data-count') === state.count));
    labelButtons();
    undoBtn.disabled = history.length === 0;
  }

  function labelButtons() {
    var btns = list.querySelectorAll('[data-d]');
    for (var k = 0; k < btns.length; k++) {
      var d = +btns[k].getAttribute('data-d'), i = +btns[k].getAttribute('data-i');
      btns[k].setAttribute('aria-label', (d > 0 ? 'Add ' + d : 'Remove 1') + ' lore for ' + name(i));
    }
  }

  function update(i) {
    var card = list.children[i];
    if (!card) return;
    var v = state.scores[i];
    card.querySelector('.lore-num').textContent = v;
    card.querySelector('.lore-meter span').style.width = Math.min(100, v / GOAL * 100) + '%';
    card.classList.toggle('won', v >= GOAL);
    card.querySelector('[data-d="-1"]').disabled = v === 0;
  }

  function change(i, d) {
    var prev = state.scores[i];
    var next = Math.max(0, prev + d);
    if (next === prev) return;
    history.push({ i: i, prev: prev });
    state.scores[i] = next;
    save(); update(i);
    undoBtn.disabled = false;
    status.textContent = name(i) + ': ' + next + ' lore' + (prev < GOAL && next >= GOAL ? '. ' + name(i) + ' wins!' : '.');
  }

  list.addEventListener('click', function (e) {
    var b = e.target.closest('[data-d]');
    if (b) change(+b.getAttribute('data-i'), +b.getAttribute('data-d'));
  });
  list.addEventListener('input', function (e) {
    if (!e.target.classList.contains('lore-name')) return;
    var i = +e.target.id.slice(-1);
    state.names[i] = e.target.value;
    save(); labelButtons();
  });

  for (var s = 0; s < seatBtns.length; s++) seatBtns[s].addEventListener('click', function () {
    var next = +this.getAttribute('data-count');
    if (next === state.count) return;
    history.push({ count: state.count, scores: state.scores.slice() });
    for (var k = next; k < 4; k++) state.scores[k] = 0;
    state.count = next;
    save(); render();
    status.textContent = state.count + ' players.';
  });

  undoBtn.addEventListener('click', function () {
    var h = history.pop();
    if (!h) return;
    if (h.count) {
      state.count = h.count;
      state.scores = h.scores;
      save(); render();
      status.textContent = 'Undone. ' + state.count + ' players.';
      return;
    }
    state.scores[h.i] = h.prev;
    save(); update(h.i);
    status.textContent = 'Undone. ' + name(h.i) + ': ' + h.prev + ' lore.';
    undoBtn.disabled = history.length === 0;
  });

  /* New game needs a second tap within 3 seconds, so a stray tap can't wipe the scores */
  resetBtn.addEventListener('click', function () {
    if (!resetTimer) {
      resetBtn.textContent = 'Tap again to reset';
      resetBtn.classList.add('confirm');
      resetTimer = setTimeout(disarm, 3000);
      return;
    }
    disarm();
    state.scores = [0, 0, 0, 0];
    history = [];
    save(); render();
    status.textContent = 'New game. All scores set to 0.';
  });
  function disarm() {
    clearTimeout(resetTimer); resetTimer = null;
    resetBtn.textContent = 'New game';
    resetBtn.classList.remove('confirm');
  }

  render();
})();

/* Deck odds: exact draw and inkable odds for an opening hand plus normal draws.
   The math is exposed as window.lorcanaOdds before the root guard so it can be
   tested in Node (scripts/test-odds.js). */
(function () {
  window.lorcanaOdds = {
    cardsSeen: cardsSeen, drawOdds: drawOdds, inkOdds: inkOdds, formatPct: formatPct,
    validate: validate, describe: describe
  };
  var root = document.getElementById('deck-odds-root');
  if (!root) return;

  function clamp(p) {
    return p < 0 ? 0 : (p > 1 ? 1 : p);
  }

  // Seven-card opening hand, plus one draw per turn (none on turn 1 on the play).
  function cardsSeen(turn, onPlay, D) {
    return Math.min(D, onPlay ? 6 + turn : 7 + turn);
  }

  // P(at least one of K copies among the cards seen by turn T) = 1 - C(D-K,n)/C(D,n).
  function drawOdds(D, K, T, onPlay) {
    var n = cardsSeen(T, onPlay, D);
    var ratio = 1;
    for (var i = 0; i < n; i++) {
      var num = D - K - i;
      if (num <= 0) { ratio = 0; break; }
      ratio *= num / (D - i);
    }
    return clamp(1 - ratio);
  }

  // P(inkables seen by turn t >= t for every t = 1..N), exact.
  // dist[i] = P(i inkables drawn so far and every earlier checkpoint passed).
  function inkOdds(D, K, N, onPlay) {
    var dist = [1];
    var j = 0; // cards drawn so far
    for (var t = 1; t <= N; t++) {
      var target = cardsSeen(t, onPlay, D);
      for (; j < target; j++) {
        var next = new Array(dist.length + 1);
        for (var x = 0; x < next.length; x++) next[x] = 0;
        for (var i = 0; i < dist.length; i++) {
          var p = dist[i];
          if (p === 0) continue;
          var pInk = (K - i) / (D - j);
          if (pInk > 0) next[i + 1] += p * pInk;
          if (pInk < 1) next[i] += p * (1 - pInk);
        }
        dist = next;
      }
      for (var k = 0; k < t && k < dist.length; k++) dist[k] = 0;
    }
    var sum = 0;
    for (var m = 0; m < dist.length; m++) sum += dist[m];
    return clamp(sum);
  }

  function formatPct(p) {
    return (clamp(p) * 100).toFixed(1) + '%';
  }

  // Checks deck, then count, then turn; the first error wins.
  function validate(mode, deckStr, countStr, turnStr) {
    var countName = mode === 'ink' ? 'inkables' : 'copies';
    var fields = [
      { key: 'deck', name: 'deck size', str: deckStr },
      { key: 'count', name: countName, str: countStr },
      { key: 'turn', name: 'turn number', str: turnStr }
    ];
    var values = {};
    for (var f = 0; f < fields.length; f++) {
      var fd = fields[f];
      var text = String(fd.str == null ? '' : fd.str).trim();
      var v = Number(text);
      var msg = null;
      if (text === '' || isNaN(v)) msg = 'enter a whole number for ' + fd.name + '.';
      else if (!isFinite(v) || Math.floor(v) !== v) msg = fd.name + ' must be a whole number.';
      else if (v < 0) msg = fd.name + " can't be negative.";
      else if (fd.key !== 'count' && v < 1) msg = fd.name + ' must be at least 1.';
      else if (fd.key !== 'count' && v > 999) msg = fd.name + ' must be 999 or less.';
      else if (fd.key === 'count' && v > values.deck) msg = countName + " can't be more than the deck size.";
      if (msg) return { ok: false, field: fd.key, message: 'Check the inputs: ' + msg };
      values[fd.key] = v;
    }
    return { ok: true, deck: values.deck, count: values.count, turn: values.turn };
  }

  function describe(mode, onPlay, turn, seen) {
    var seat = onPlay ? 'on the play' : 'on the draw';
    if (mode === 'ink') {
      return 'Chance to have an inkable card to ink on every turn through turn ' + turn + ', ' + seat + '.';
    }
    return 'Chance to have drawn at least one copy by turn ' + turn + ', ' + seat + '. ' + seen + ' cards seen.';
  }

  // DOM glue. Everything is written with textContent; nothing is stored.
  var DEFAULT_COUNT = { draw: '4', ink: '24' };
  var LABELS = {
    draw: { count: 'Copies in deck', turn: 'Turn number' },
    ink: { count: 'Inkable cards in deck', turn: 'Through turn' }
  };
  var inputs = {
    deck: document.getElementById('odds-deck'),
    count: document.getElementById('odds-count'),
    turn: document.getElementById('odds-turn')
  };
  var countLabel = root.querySelector('label[for="odds-count"]');
  var turnLabel = root.querySelector('label[for="odds-turn"]');
  var result = document.getElementById('odds-result');
  var numEl = result.querySelector('.odds-num');
  var textEl = result.querySelector('.odds-text');
  var modeBtns = root.querySelectorAll('[data-mode]');
  var seatBtns = root.querySelectorAll('[data-seat]');
  var mode = 'draw';
  var onPlay = true;

  function press(btns, attr, value) {
    for (var b = 0; b < btns.length; b++) {
      btns[b].setAttribute('aria-pressed', btns[b].getAttribute(attr) === value ? 'true' : 'false');
    }
  }

  function recompute() {
    var r = validate(mode, inputs.deck.value, inputs.count.value, inputs.turn.value);
    for (var key in inputs) {
      if (r.ok || key !== r.field) {
        inputs[key].removeAttribute('aria-invalid');
        inputs[key].removeAttribute('aria-describedby');
      } else {
        inputs[key].setAttribute('aria-invalid', 'true');
        inputs[key].setAttribute('aria-describedby', 'odds-result');
      }
    }
    if (!r.ok) {
      result.setAttribute('data-state', 'error');
      numEl.textContent = '';
      textEl.textContent = r.message;
      return;
    }
    result.removeAttribute('data-state');
    var p = mode === 'ink' ? inkOdds(r.deck, r.count, r.turn, onPlay) : drawOdds(r.deck, r.count, r.turn, onPlay);
    numEl.textContent = formatPct(p);
    textEl.textContent = describe(mode, onPlay, r.turn, cardsSeen(r.turn, onPlay, r.deck));
  }

  function setMode(next) {
    if (next === mode) return;
    var prev = mode;
    mode = next;
    press(modeBtns, 'data-mode', mode);
    countLabel.textContent = LABELS[mode].count;
    turnLabel.textContent = LABELS[mode].turn;
    if (inputs.count.value.trim() === DEFAULT_COUNT[prev]) inputs.count.value = DEFAULT_COUNT[mode];
    recompute();
  }

  function setSeat(next) {
    var play = next === 'play';
    if (play === onPlay) return;
    onPlay = play;
    press(seatBtns, 'data-seat', next);
    recompute();
  }

  for (var mb = 0; mb < modeBtns.length; mb++) modeBtns[mb].addEventListener('click', function () {
    setMode(this.getAttribute('data-mode'));
  });
  for (var sb = 0; sb < seatBtns.length; sb++) seatBtns[sb].addEventListener('click', function () {
    setSeat(this.getAttribute('data-seat'));
  });
  root.addEventListener('input', recompute);
  recompute();
})();
