/* Lorcana KB tools v1.3.0
   Coin flipper: fair 50/50 using the browser's crypto random source. Lore tracker below.
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
   Undo steps back through score changes made since the page opened. */
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
    state.count = +this.getAttribute('data-count');
    save(); render();
    status.textContent = state.count + ' players.';
  });

  undoBtn.addEventListener('click', function () {
    var h = history.pop();
    if (!h) return;
    if (h.i < state.count) {
      state.scores[h.i] = h.prev;
      save(); update(h.i);
      status.textContent = 'Undone. ' + name(h.i) + ': ' + h.prev + ' lore.';
    }
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
