/* Inlined in <head> before the CSS paints: picks the look for the visitor's local time of day.
   Preference (localStorage "sg-theme"): auto (default) | light | dark. Phases: morning 6-11, day 11-17, evening 17-20, night 20-6. */
(function () {
  var d = document.documentElement, pref = 'auto';
  try { pref = localStorage.getItem('sg-theme') || 'auto'; } catch (e) {}
  var q = /[?&]phase=(morning|day|evening|night)\b/.exec(location.search); /* review links: ?phase=evening */
  if (q) { pref = q[1]; try { localStorage.setItem('sg-theme', q[1]); } catch (e) {} }
  function phase(h) { return h >= 6 && h < 11 ? 'morning' : h >= 11 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'evening' : 'night'; }
  var forced = { light: 'day', dark: 'night', morning: 'morning', day: 'day', evening: 'evening', night: 'night' };
  var p = forced[pref] || phase(new Date().getHours());
  d.setAttribute('data-phase', p);
  d.setAttribute('data-mode', p === 'morning' || p === 'day' ? 'light' : 'dark');
  d.setAttribute('data-pref', pref === 'light' || pref === 'dark' ? pref : 'auto');
  window.sgPhase = phase;
})();
