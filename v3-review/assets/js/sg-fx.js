/* Simpliigence AI — interactive effects for the v3 sections:
   card tilt + pointer glow, magnetic architect button, live office clocks, ecosystem highlighting. */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia && w.matchMedia('(pointer: fine)').matches;
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  /* ---------- tilt + pointer glow ---------- */
  $$('[data-tilt], .leader.lx').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100) + '%'); el.style.setProperty('--my', (y * 100) + '%');
      if (reduce || !fine) return;
      el.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg'); el.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  /* ---------- magnetic button ---------- */
  if (!reduce && fine) $$('[data-magnet]').forEach(function (b) {
    var zone = b.parentNode;
    zone.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.abs(dx) > r.width || Math.abs(dy) > r.height * 2.2) { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); return; }
      b.style.setProperty('--tx', (dx * 0.22).toFixed(1) + 'px'); b.style.setProperty('--ty', (dy * 0.3).toFixed(1) + 'px');
    });
    zone.addEventListener('pointerleave', function () { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); });
  });

  /* ---------- office clocks: local time, lit when in working hours ---------- */
  $$('[data-hx]').forEach(function (hx) {
    var zones = $$('[data-tz]', hx);
    function tick() {
      zones.forEach(function (z) {
        var tz = z.getAttribute('data-tz'), now = new Date(), t, h;
        try {
          t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(now);
          h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: tz }).format(now);
        } catch (e) { return; }
        var wd = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(now);
        var on = h >= 9 && h < 18 && wd !== 'Sat' && wd !== 'Sun';
        z.classList.toggle('on', on);
        z.querySelector('time').textContent = t;
      });
    }
    tick(); setInterval(tick, 30000);
  });

  /* ---------- time-of-day theme: auto / light / dark switch, live phase changes ---------- */
  var root = d.documentElement, LABEL = { auto: 'automatic by time of day', light: 'light', dark: 'dark' };
  function store(v) { try { localStorage.setItem('sg-theme', v); } catch (e) {} }
  function apply(pref, fade) {
    var p = pref === 'light' ? 'day' : pref === 'dark' ? 'night' : (w.sgPhase ? w.sgPhase(new Date().getHours()) : root.getAttribute('data-phase'));
    var t = 'Colour theme: ' + LABEL[pref];
    $$('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-label', t); b.setAttribute('title', t); });
    if (p === root.getAttribute('data-phase') && pref === root.getAttribute('data-pref')) return;
    if (fade && !reduce) { root.classList.add('theme-fade'); setTimeout(function () { root.classList.remove('theme-fade'); }, 1200); }
    root.setAttribute('data-phase', p);
    root.setAttribute('data-mode', p === 'morning' || p === 'day' ? 'light' : 'dark');
    root.setAttribute('data-pref', pref);
  }
  var stored = 'auto';
  try { stored = localStorage.getItem('sg-theme') || 'auto'; } catch (e) {}
  var pinned = /^(morning|day|evening|night)$/.test(stored);  /* review: show one phase */
  $$('[data-theme-toggle]').forEach(function (b) { var t = 'Colour theme: ' + LABEL[root.getAttribute('data-pref') || 'auto']; b.setAttribute('aria-label', t); b.setAttribute('title', t); });
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = { auto: 'light', light: 'dark', dark: 'auto' }[root.getAttribute('data-pref') || 'auto'];
      pinned = false; store(next); apply(next, true);
    });
  });
  setInterval(function () { if (!pinned && (root.getAttribute('data-pref') || 'auto') === 'auto') apply('auto', true); }, 60000);

  /* ---------- ecosystem: highlight a cluster's lines ---------- */
  $$('[data-eco]').forEach(function (eco) {
    var paths = $$('.eco-lines path', eco);
    $$('.eco-cl', eco).forEach(function (cl) {
      var g = cl.getAttribute('data-g');
      function on() { eco.classList.add('hl'); cl.classList.add('on'); paths.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-g') === g); }); }
      function off() { eco.classList.remove('hl'); cl.classList.remove('on'); paths.forEach(function (p) { p.classList.remove('on'); }); }
      cl.addEventListener('pointerenter', on); cl.addEventListener('pointerleave', off);
    });
  });
})();
