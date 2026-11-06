/* Lorcana KB tools v1.2.1
   Coin flipper: fair 50/50 using the browser's crypto random source.
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
