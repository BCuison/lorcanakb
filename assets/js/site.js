/* Lorcana KB shared script v1.2.1
   1. Opens every page at the top unless the link targets a section (#id).
   2. Light/dark toggle (lightbulb, top left). Choice is remembered per browser.
   4. Tracks the contents bar height (--nav-h) so section links land below it when it wraps.
   3. Theme menu (right of the lightbulb): Storybook (default) or Classic.
      Swaps the page stylesheet between storybook.css and classic.css. */
(function () {
  var KEY = 'lorcana-kb-theme';
  var root = document.documentElement;

  /* ---- theme ---- */
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function current() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  var s = stored();
  if (s === 'light' || s === 'dark') root.setAttribute('data-theme', s);

  /* ---- design theme (skin) ---- */
  var SKIN_KEY = 'lorcana-kb-skin';
  var SKINS = [['storybook', 'Storybook'], ['classic', 'Classic']];
  var SKIN_RE = /(storybook|classic)\.css(\?.*)?$/;
  function skinLink() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) if (SKIN_RE.test(links[i].getAttribute('href') || '')) return links[i];
    return null;
  }
  function getSkin() { try { var v = localStorage.getItem(SKIN_KEY); return v === 'classic' ? 'classic' : 'storybook'; } catch (e) { return 'storybook'; } }
  function applySkin(name) {
    var l = skinLink(); if (!l) return;
    var href = l.getAttribute('href');
    var next = href.replace(SKIN_RE, name + '.css');
    if (next !== href) l.setAttribute('href', next);
    root.setAttribute('data-skin', name);
  }
  applySkin(getSkin());

  function addSkinMenu() {
    if (document.getElementById('skin-select') || !skinLink()) return;
    var wrap = document.createElement('div');
    wrap.className = 'skin-select';
    var label = document.createElement('label');
    label.className = 'sr-only'; label.htmlFor = 'skin-select'; label.textContent = 'Theme';
    var sel = document.createElement('select');
    sel.id = 'skin-select'; sel.title = 'Theme';
    SKINS.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o[0]; opt.textContent = o[1] + (o[0] === 'storybook' ? ' (default)' : '');
      sel.appendChild(opt);
    });
    sel.value = getSkin();
    sel.addEventListener('change', function () {
      try { localStorage.setItem(SKIN_KEY, sel.value); } catch (e) {}
      applySkin(sel.value);
    });
    wrap.appendChild(label); wrap.appendChild(sel);
    var t = document.getElementById('theme-toggle');
    if (t && t.nextSibling) document.body.insertBefore(wrap, t.nextSibling); else document.body.insertBefore(wrap, document.body.firstChild);
  }

  var BULB = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<g class="rays" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 1.5v1.8M4.2 4.2l1.3 1.3M19.8 4.2l-1.3 1.3M1.5 11h1.8M20.7 11h1.8"/></g>' +
    '<path class="glass" d="M12 5.2a5.6 5.6 0 0 0-3.3 10.1c.6.5 1 1.2 1 2V18h4.6v-.7c0-.8.4-1.5 1-2A5.6 5.6 0 0 0 12 5.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M9.8 20.2h4.4M10.6 22.5h2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  function label(btn) {
    var dark = current() === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = btn.getAttribute('aria-label');
    btn.dataset.mode = dark ? 'dark' : 'light';
  }

  function addToggle() {
    if (document.getElementById('theme-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle';
    btn.innerHTML = BULB;
    label(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      label(btn);
    });
    document.body.insertBefore(btn, document.body.firstChild);
  }

  /* ---- scroll reset ---- */
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  function toTop() {
    if (location.hash && document.getElementById(location.hash.slice(1))) return;
    window.scrollTo(0, 0);
  }

  function trackNav() {
    var nav = document.querySelector('.contents');
    if (!nav) return;
    function set() { root.style.setProperty('--nav-h', nav.offsetHeight + 'px'); }
    set();
    if (window.ResizeObserver) new ResizeObserver(set).observe(nav);
    else window.addEventListener('resize', set);
  }

  function init() { addToggle(); addSkinMenu(); trackNav(); toTop(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('pageshow', toTop);
})();
