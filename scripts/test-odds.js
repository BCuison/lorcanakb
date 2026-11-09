#!/usr/bin/env node
/* Unit tests for the deck odds math in assets/js/tools.js.
   Run from the repo root: node scripts/test-odds.js
   Loads tools.js in a sandbox with a stub document, so every tool IIFE no-ops
   and only window.lorcanaOdds is exercised. Exits 1 on any failure. */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var src = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'tools.js'), 'utf8');
var ctx = { document: { getElementById: function () { return null; } } };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: 'tools.js' });

var odds = ctx.lorcanaOdds;
var passed = 0;
var failed = 0;

function check(cond, msg) {
  if (cond) { passed++; } else { failed++; console.log('FAIL: ' + msg); }
}
function eq(actual, expected, msg) {
  check(actual === expected, msg + ' (expected ' + expected + ', got ' + actual + ')');
}
function near(actual, expected, msg) {
  check(Math.abs(actual - expected) < 1e-9, msg + ' (expected ' + expected + ', got ' + actual + ')');
}
function valid(p, msg) {
  check(typeof p === 'number' && isFinite(p) && p >= 0 && p <= 1, msg + ' out of range: ' + p);
}

check(odds && typeof odds.drawOdds === 'function', 'window.lorcanaOdds is exposed');

// AC-15: cards seen.
eq(odds.cardsSeen(1, true, 60), 7, 'cardsSeen turn 1 on the play');
eq(odds.cardsSeen(1, false, 60), 8, 'cardsSeen turn 1 on the draw');
eq(odds.cardsSeen(3, true, 60), 9, 'cardsSeen turn 3 on the play');
eq(odds.cardsSeen(3, false, 60), 10, 'cardsSeen turn 3 on the draw');
eq(odds.cardsSeen(999, false, 60), 60, 'cardsSeen capped at deck size');

// AC-16: draw-mode vectors.
eq(odds.formatPct(odds.drawOdds(60, 4, 3, true)), '48.8%', '60/4/T3 on the play');
eq(odds.formatPct(odds.drawOdds(60, 4, 3, false)), '52.8%', '60/4/T3 on the draw');
eq(odds.formatPct(odds.drawOdds(60, 0, 3, true)), '0.0%', 'K=0');
eq(odds.formatPct(odds.drawOdds(60, 60, 1, true)), '100.0%', 'K=D draw mode');

// AC-18: inkables edge cases.
for (var n = 1; n <= 60; n++) {
  eq(odds.formatPct(odds.inkOdds(60, 60, n, true)), '100.0%', 'inkOdds K=D N=' + n);
}
eq(odds.formatPct(odds.inkOdds(60, 0, 4, true)), '0.0%', 'inkOdds K=0');
near(odds.inkOdds(60, 20, 1, true), odds.drawOdds(60, 20, 1, true), 'inkOdds N=1 equals draw mode (play)');
near(odds.inkOdds(60, 20, 1, false), odds.drawOdds(60, 20, 1, false), 'inkOdds N=1 equals draw mode (draw)');

// formatPct clamps.
eq(odds.formatPct(-0.0000001), '0.0%', 'formatPct clamps below 0');
eq(odds.formatPct(1.0000001), '100.0%', 'formatPct clamps above 1');

// AC-16 / AC-17: brute force over every arrangement of K inkables (or copies) in a deck of D.
function popcount(x) { var c = 0; while (x) { c += x & 1; x >>>= 1; } return c; }
function countInPrefix(mask, len) { return popcount(mask & ((1 << len) - 1)); }

for (var D = 1; D <= 12; D++) {
  var masks = [];
  for (var m = 0; m < (1 << D); m++) masks.push(m);
  for (var K = 0; K <= D; K++) {
    var withK = masks.filter(function (x) { return popcount(x) === K; });
    for (var T = 1; T <= D + 2; T++) {
      [true, false].forEach(function (onPlay) {
        var label = 'D=' + D + ' K=' + K + ' T=' + T + (onPlay ? ' play' : ' draw');
        var hit = 0;
        var ink = 0;
        withK.forEach(function (mask) {
          if (countInPrefix(mask, odds.cardsSeen(T, onPlay, D)) > 0) hit++;
          var ok = true;
          for (var t = 1; t <= T; t++) {
            if (countInPrefix(mask, odds.cardsSeen(t, onPlay, D)) < t) { ok = false; break; }
          }
          if (ok) ink++;
        });
        var pDraw = odds.drawOdds(D, K, T, onPlay);
        var pInk = odds.inkOdds(D, K, T, onPlay);
        valid(pDraw, 'drawOdds ' + label);
        valid(pInk, 'inkOdds ' + label);
        near(pDraw, hit / withK.length, 'drawOdds brute force ' + label);
        near(pInk, ink / withK.length, 'inkOdds brute force ' + label);
      });
    }
  }
}

// AC-20: validation. One case per message, then priority and edge inputs.
function bad(r, field, message, label) {
  eq(r.ok, false, label + ' ok');
  eq(r.field, field, label + ' field');
  eq(r.message, message, label + ' message');
}
var ok = odds.validate('draw', '60', '4', '3');
eq(ok.ok, true, '"60","4","3" ok');
eq(ok.deck, 60, '"60","4","3" deck');
eq(ok.count, 4, '"60","4","3" count');
eq(ok.turn, 3, '"60","4","3" turn');
eq(odds.validate('ink', ' 60 ', '0', '1').ok, true, 'trimmed input and count 0 ok');
eq(odds.validate('draw', '999', '999', '999').ok, true, '999 everywhere ok');

bad(odds.validate('draw', '', '4', '3'), 'deck', 'Check the inputs: enter a whole number for deck size.', 'empty deck');
bad(odds.validate('draw', '   ', '4', '3'), 'deck', 'Check the inputs: enter a whole number for deck size.', 'blank deck');
bad(odds.validate('draw', 'abc', '4', '3'), 'deck', 'Check the inputs: enter a whole number for deck size.', 'NaN deck');
bad(odds.validate('draw', '60', '', '3'), 'count', 'Check the inputs: enter a whole number for copies.', 'empty copies');
bad(odds.validate('ink', '60', '', '3'), 'count', 'Check the inputs: enter a whole number for inkables.', 'empty inkables');
bad(odds.validate('draw', '60', '4', ''), 'turn', 'Check the inputs: enter a whole number for turn number.', 'empty turn');
bad(odds.validate('draw', '4.5', '4', '3'), 'deck', 'Check the inputs: deck size must be a whole number.', 'fractional deck');
bad(odds.validate('draw', '60', '4.5', '3'), 'count', 'Check the inputs: copies must be a whole number.', 'fractional copies');
bad(odds.validate('draw', '60', '4', 'Infinity'), 'turn', 'Check the inputs: turn number must be a whole number.', 'infinite turn');
bad(odds.validate('draw', '-1', '4', '3'), 'deck', "Check the inputs: deck size can't be negative.", 'negative deck');
bad(odds.validate('ink', '60', '-1', '3'), 'count', "Check the inputs: inkables can't be negative.", 'negative inkables');
bad(odds.validate('draw', '60', '4', '-1'), 'turn', "Check the inputs: turn number can't be negative.", 'negative turn');
bad(odds.validate('draw', '0', '0', '3'), 'deck', 'Check the inputs: deck size must be at least 1.', 'deck 0');
bad(odds.validate('draw', '60', '4', '0'), 'turn', 'Check the inputs: turn number must be at least 1.', 'turn 0');
bad(odds.validate('draw', '1000', '4', '3'), 'deck', 'Check the inputs: deck size must be 999 or less.', 'deck 1000');
bad(odds.validate('draw', '60', '4', '1000'), 'turn', 'Check the inputs: turn number must be 999 or less.', 'turn 1000');
bad(odds.validate('draw', '60', '61', '3'), 'count', "Check the inputs: copies can't be more than the deck size.", 'copies 61 of 60');
bad(odds.validate('ink', '60', '61', '3'), 'count', "Check the inputs: inkables can't be more than the deck size.", 'inkables 61 of 60');
bad(odds.validate('draw', '', '4', '0'), 'deck', 'Check the inputs: enter a whole number for deck size.', 'bad deck and bad turn: deck wins');
bad(odds.validate('draw', '60', '61', '0'), 'count', "Check the inputs: copies can't be more than the deck size.", 'bad count and bad turn: count wins');

// AC-19: result sentences.
eq(odds.describe('draw', true, 3, 9), 'Chance to have drawn at least one copy by turn 3, on the play. 9 cards seen.', 'describe draw on the play');
eq(odds.describe('draw', false, 3, 10), 'Chance to have drawn at least one copy by turn 3, on the draw. 10 cards seen.', 'describe draw on the draw');
eq(odds.describe('ink', true, 4, 10), 'Chance to have an inkable card to ink on every turn through turn 4, on the play.', 'describe ink on the play');
eq(odds.describe('ink', false, 4, 11), 'Chance to have an inkable card to ink on every turn through turn 4, on the draw.', 'describe ink on the draw');

// Performance: worst case must be instant.
var start = Date.now();
var big = odds.inkOdds(999, 500, 999, false);
var ms = Date.now() - start;
valid(big, 'inkOdds(999,500,999,false)');
check(ms < 200, 'inkOdds(999,500,999,false) took ' + ms + ' ms (limit 200)');

// DOM glue (AC-14, AC-19, AC-21, AC-22): run tools.js against a tiny fake DOM
// built from the real #deck-odds-root markup in table-tools.html.
var html = fs.readFileSync(path.join(__dirname, '..', 'table-tools.html'), 'utf8');
var section = html.match(/<section class="chapter" id="deck-odds">[\s\S]*?<\/section>/);
check(!!section, 'table-tools.html has section#deck-odds');
check(/<li><a href="#deck-odds"><b>III<\/b>Deck Odds<\/a><\/li>/.test(html), 'contents nav has Deck Odds entry');
check(/The odds tool stores nothing\./.test(html), 'colophon says the odds tool stores nothing');

function FakeEl(tag, attrs) {
  this.tagName = tag; this.attrs = attrs; this.children = []; this.listeners = {};
  this.textContent = ''; this.value = attrs.value || '';
}
FakeEl.prototype.getAttribute = function (n) { return n in this.attrs ? this.attrs[n] : null; };
FakeEl.prototype.setAttribute = function (n, v) { this.attrs[n] = String(v); };
FakeEl.prototype.removeAttribute = function (n) { delete this.attrs[n]; };
FakeEl.prototype.hasAttribute = function (n) { return n in this.attrs; };
FakeEl.prototype.addEventListener = function (t, fn) { (this.listeners[t] = this.listeners[t] || []).push(fn); };
FakeEl.prototype.all = function () {
  var out = [];
  this.children.forEach(function (c) { out.push(c); out.push.apply(out, c.all()); });
  return out;
};
FakeEl.prototype.matches = function (sel) {
  var m = sel.match(/^([a-z]*)(?:\.([\w-]+))?(?:\[([\w-]+)(?:="([^"]*)")?\])?$/);
  if (!m) throw new Error('unsupported selector ' + sel);
  if (m[1] && m[1] !== this.tagName) return false;
  if (m[2] && (' ' + (this.attrs['class'] || '') + ' ').indexOf(' ' + m[2] + ' ') < 0) return false;
  if (m[3] && !(m[3] in this.attrs)) return false;
  if (m[4] !== undefined && this.attrs[m[3]] !== m[4]) return false;
  return true;
};
FakeEl.prototype.querySelectorAll = function (sel) { return this.all().filter(function (e) { return e.matches(sel); }); };
FakeEl.prototype.querySelector = function (sel) { return this.querySelectorAll(sel)[0] || null; };

// Parses the simple, well-formed markup of the section (no comments or scripts).
function parse(src) {
  var top = new FakeEl('#root', {});
  var stack = [top];
  var re = /<(\/?)([a-z0-9]+)([^>]*)>|([^<]+)/g;
  var t;
  while ((t = re.exec(src))) {
    var cur = stack[stack.length - 1];
    if (t[4] !== undefined) { cur.textContent += t[4]; continue; }
    if (t[1]) { stack.pop(); continue; }
    var attrs = {};
    t[3].replace(/([\w-]+)(?:="([^"]*)")?/g, function (_, n, v) { attrs[n] = v === undefined ? '' : v; });
    var el = new FakeEl(t[2], attrs);
    cur.children.push(el);
    if (t[2] !== 'input') stack.push(el);
  }
  return top;
}

function mountGlue() {
  var dom = parse(section[0]);
  var doc = {
    getElementById: function (id) { return dom.querySelector('[id="' + id + '"]'); }
  };
  var c = { document: doc };
  c.window = c;
  vm.createContext(c);
  vm.runInContext(src, c, { filename: 'tools.js' });
  var root = doc.getElementById('deck-odds-root');
  return {
    root: root,
    $: function (id) { return doc.getElementById(id); },
    num: function () { return root.querySelector('.odds-num').textContent; },
    text: function () { return root.querySelector('.odds-text').textContent; },
    click: function (sel) { var b = root.querySelector(sel); b.listeners.click.forEach(function (fn) { fn.call(b); }); },
    type: function (id, v) {
      var el = doc.getElementById(id); el.value = v;
      root.listeners.input.forEach(function (fn) { fn.call(root, { target: el }); });
    },
    pressed: function (sel) { return root.querySelector(sel).getAttribute('aria-pressed'); },
    label: function (id) { return root.querySelector('label[for="' + id + '"]').textContent; }
  };
}

var g = mountGlue();
var resEl = g.$('odds-result');
eq(resEl.getAttribute('role'), 'status', 'result role=status');
eq(resEl.getAttribute('aria-live'), 'polite', 'result aria-live=polite');
['odds-deck', 'odds-count', 'odds-turn'].forEach(function (id) {
  check(!!g.root.querySelector('label[for="' + id + '"]'), 'label for ' + id);
});
eq(g.num(), '48.8%', 'load result');
eq(g.text(), 'Chance to have drawn at least one copy by turn 3, on the play. 9 cards seen.', 'load sentence');
eq(resEl.getAttribute('data-state'), null, 'load not in error');

g.click('[data-seat="draw"]');
eq(g.num(), '52.8%', 'on the draw');
eq(g.pressed('[data-seat="draw"]'), 'true', 'draw seat pressed');
eq(g.pressed('[data-seat="play"]'), 'false', 'play seat unpressed');
g.click('[data-seat="draw"]');
eq(g.pressed('[data-seat="draw"]'), 'true', 'clicking pressed seat is a no-op');
g.click('[data-seat="play"]');
eq(g.num(), '48.8%', 'back on the play');

g.type('odds-count', '0');
eq(g.num(), '0.0%', 'copies 0');
g.type('odds-count', '4');

// Errors: only the offending input is flagged; the number is emptied.
g.type('odds-turn', '');
eq(g.num(), '', 'error empties number');
eq(g.text(), 'Check the inputs: enter a whole number for turn number.', 'empty turn message');
eq(resEl.getAttribute('data-state'), 'error', 'data-state=error');
eq(g.$('odds-turn').getAttribute('aria-invalid'), 'true', 'turn aria-invalid');
eq(g.$('odds-turn').getAttribute('aria-describedby'), 'odds-result', 'turn aria-describedby');
eq(g.$('odds-deck').getAttribute('aria-invalid'), null, 'deck not flagged');
g.type('odds-count', '61');
eq(g.$('odds-count').getAttribute('aria-invalid'), 'true', 'count flagged (count beats turn)');
eq(g.$('odds-turn').getAttribute('aria-invalid'), null, 'turn cleared when count error wins');
eq(g.text(), "Check the inputs: copies can't be more than the deck size.", 'count message');
g.type('odds-count', '4');
g.type('odds-turn', '3');
eq(g.num(), '48.8%', 'valid again');
eq(resEl.getAttribute('data-state'), null, 'data-state cleared');
['odds-deck', 'odds-count', 'odds-turn'].forEach(function (id) {
  eq(g.$(id).getAttribute('aria-invalid'), null, id + ' aria-invalid cleared');
  eq(g.$(id).getAttribute('aria-describedby'), null, id + ' aria-describedby cleared');
});

// Mode switch: labels, default swap, sentence.
g.click('[data-mode="ink"]');
eq(g.pressed('[data-mode="ink"]'), 'true', 'ink pressed');
eq(g.pressed('[data-mode="draw"]'), 'false', 'draw unpressed');
eq(g.label('odds-count'), 'Inkable cards in deck', 'ink count label');
eq(g.label('odds-turn'), 'Through turn', 'ink turn label');
eq(g.$('odds-count').value, '24', 'default 4 swapped to 24');
eq(g.num(), (odds.inkOdds(60, 24, 3, true) * 100).toFixed(1) + '%', 'ink result');
eq(g.text(), 'Chance to have an inkable card to ink on every turn through turn 3, on the play.', 'ink sentence');
g.type('odds-count', '61');
eq(g.text(), "Check the inputs: inkables can't be more than the deck size.", 'ink field name in message');
g.type('odds-count', '20');
g.click('[data-mode="draw"]');
eq(g.label('odds-count'), 'Copies in deck', 'draw count label');
eq(g.label('odds-turn'), 'Turn number', 'draw turn label');
eq(g.$('odds-count').value, '20', 'user value kept on mode switch');
g.click('[data-mode="draw"]');
eq(g.pressed('[data-mode="draw"]'), 'true', 'clicking pressed mode is a no-op');
g.type('odds-count', '24');
g.click('[data-mode="ink"]');
eq(g.$('odds-count').value, '24', '24 kept going to ink (not the draw default)');
g.click('[data-mode="draw"]');
eq(g.$('odds-count').value, '4', 'default 24 swapped back to 4');

// AC-22: no innerHTML or storage in the odds IIFE.
var oddsSrc = src.slice(src.indexOf('window.lorcanaOdds'));
check(!/innerHTML|localStorage|sessionStorage/.test(oddsSrc), 'odds IIFE uses no innerHTML or storage');

console.log(passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
