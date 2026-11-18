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
