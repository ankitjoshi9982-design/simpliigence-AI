/* Simpliigence AI — site script: motion, navigation, AI assistant.
   Assistant phase 1: answers only from published content (window.SG_CONTENT).
   All assistant wording is verbatim from the approved copy document. */
(function () {
  'use strict';
  var d = document, w = window, CFG = w.SGAI || {};
  d.documentElement.classList.remove('no-js');
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ARROW = '<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg>';
  var contactUrl = CFG.contactUrl || '/contact/';
  function link(u) { /* static preview only: map /page/#x to page/index.html#x */
    if (!CFG.staticBase || !u || u.charAt(0) !== '/') return u;
    var p = u.split('#'), path = p[0].replace(/^\/|\/$/g, '');
    return CFG.staticBase + (path ? path + '/' : '') + 'index.html' + (p[1] ? '#' + p[1] : '');
  }

  /* ---------- header ---------- */
  var hdr = $('#hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('scrolled', w.scrollY > 12); }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var sheet = $('#sheet'), burger = $('#burger');
  function sheetSet(open) { if (!sheet) return; sheet.classList.toggle('open', open); sheet.setAttribute('aria-hidden', !open); if (burger) burger.setAttribute('aria-expanded', open); d.body.style.overflow = open ? 'hidden' : ''; }
  if (burger) burger.addEventListener('click', function () { sheetSet(true); });
  if ($('#sheetX')) $('#sheetX').addEventListener('click', function () { sheetSet(false); });

  /* ---------- reveal + counters ---------- */
  function count(el) {
    var to = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0), suf = el.getAttribute('data-suffix') || '';
    if (reduce) return;
    var t0 = null, dur = 1400;
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = (to * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(step); else el.textContent = to.toFixed(dec) + suf; }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in w && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(count);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- card glow follows pointer ---------- */
  $$('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });


  /* ---------- hero neural field ---------- */
  var cv = $('[data-neural]');
  if (cv && cv.getContext) {
    var cx = cv.getContext('2d'), pts = [], W, H, dpr = Math.min(w.devicePixelRatio || 1, 2), mouse = { x: -999, y: -999 };
    function size() { W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, W * H / 14000)); pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 }); }
    size(); w.addEventListener('resize', size);
    cv.parentNode.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    var vis = true;
    if ('IntersectionObserver' in w) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(cv);
    function frame() {
      if (vis) {
        cx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i]; if (!reduce) { p.x += p.vx; p.y += p.vy; }
          if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
          for (var j = i + 1; j < pts.length; j++) {
            var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, dd = dx * dx + dy * dy;
            if (dd < 17000) { cx.strokeStyle = 'rgba(115,161,226,' + (0.18 * (1 - dd / 17000)) + ')'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); }
          }
          var md = Math.hypot(p.x - mouse.x, p.y - mouse.y), hot = md < 160;
          if (hot) { cx.strokeStyle = 'rgba(115,161,226,' + (0.5 * (1 - md / 160)) + ')'; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mouse.x, mouse.y); cx.stroke(); }
          cx.fillStyle = hot ? '#ffffff' : 'rgba(115,161,226,.75)'; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
        }
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------- how-we-help tabs (auto-advance until the visitor takes over) ---------- */
  $$('[data-hw]').forEach(function (hw) {
    var tabs = $$('.hw-tab', hw), panels = $$('.hw-panel', hw), cur = 0, timer = null, auto = !reduce;
    function show(i) {
      cur = i;
      tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); t.classList.remove('run'); t.setAttribute('aria-selected', k === i); });
      panels.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      if (auto) { void tabs[i].offsetWidth; tabs[i].classList.add('run'); clearTimeout(timer); timer = setTimeout(function () { show((cur + 1) % tabs.length); }, 6000); }
    }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { auto = false; clearTimeout(timer); show(k); }); });
    if ('IntersectionObserver' in w) new IntersectionObserver(function (e) { if (e[0].isIntersecting && auto && !timer) show(0); }, { threshold: .4 }).observe(hw);
  });


  /* ---------- mobile swipe carousels: progress dots ---------- */
  $$('.swipe').forEach(function (sw) {
    var n = sw.children.length; if (n < 2) return;
    var dots = d.createElement('div'); dots.className = 'swipe-dots'; dots.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < n; i++) dots.appendChild(d.createElement('i'));
    sw.parentNode.insertBefore(dots, sw.nextSibling);
    function upd() {
      var kids = sw.children, best = 0, bd = 1e9, left = sw.getBoundingClientRect().left;
      for (var i = 0; i < kids.length; i++) { var dd = Math.abs(kids[i].getBoundingClientRect().left - left - 16); if (dd < bd) { bd = dd; best = i; } }
      $$('i', dots).forEach(function (el, k) { el.classList.toggle('on', k === best); });
    }
    sw.addEventListener('scroll', upd, { passive: true }); upd();
  });

  /* footnotes open the sources list */
  $$('a[href^="#src-"]').forEach(function (a) { a.addEventListener('click', function () { var s = $('.sources'); if (s) s.open = true; }); });

  /* ---------- leads ---------- */
  function submitLead(data) {
    if (!CFG.ajaxUrl) return Promise.resolve(true); // static preview
    var body = new URLSearchParams(Object.assign({ action: 'sgai_capture_lead', nonce: CFG.nonce || '' }, data));
    return fetch(CFG.ajaxUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      .then(function (r) { return r.json(); }).then(function (j) { return !!j.success; }).catch(function () { return false; });
  }
  w.SG_UI = { submitLead: submitLead };

  /* ---------- chat history (saved in WordPress: wp-admin → Chat History) ---------- */
  var SID = (function () { var k = 'sgai_sid', v = null; try { v = w.sessionStorage.getItem(k); } catch (e) {}
    if (!v) { v = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); try { w.sessionStorage.setItem(k, v); } catch (e) {} } return v; })();
  var queue = [], qt = null;
  function flush(beacon) {
    if (!queue.length || !CFG.ajaxUrl) { queue = []; return; }
    var body = new URLSearchParams({ action: 'sgai_chat_log', nonce: CFG.nonce || '', session: SID, page: w.location.href, items: JSON.stringify(queue) }); queue = [];
    if (beacon && navigator.sendBeacon) navigator.sendBeacon(CFG.ajaxUrl, body); else fetch(CFG.ajaxUrl, { method: 'POST', body: body, keepalive: true }).catch(function () {});
  }
  function track(role, text, meta) { queue.push(Object.assign({ role: role, text: String(text).slice(0, 2000) }, meta || {})); clearTimeout(qt); qt = setTimeout(flush, 1200); }
  w.addEventListener('pagehide', function () { flush(true); });

  /* ---------- assistant ---------- */
  var STD = {
    welcome: 'Hi, I can tell you how we’d approach a process, which agents might fit, and what results we’ve seen. What’s taking up your team’s time?',
    noAnswer: 'That’s a good one for an architect rather than me. Want me to set up a quick call?',
    price: 'Pricing depends on the process and the model you choose, so an architect walks you through it. Shall I book that for you?',
    client: 'We keep client names private, but I can share the industry, what we built and the result.',
    offTopic: 'I can only help with Simpliigence AI and how we approach AI, automation and agents. Is there a process you’d like to talk through?',
    offer: 'Sounds like this is worth a proper look. Would you like an AI Health Check? I just need a few details.'
  };
  var CHIPS = {
    home: ['Find the leak in our billing', 'Speed up our quotes', 'Which agents fit a 50-person team?', 'Put Copilot to real work'],
    ai: ['Can you build on our Copilot licence?', 'Does our data leave our tenant?', 'What happens in a Health Check?'],
    automation: ['How does outcome pricing work?', 'RPA or an AI agent?', 'What KPIs can you move?'],
    agents: ['Which three agents should I start with?', 'Do I need an IT team?', 'What tools do agents work with?'],
    industries: ['What would you automate first in manufacturing?', 'Real estate', 'Field services', 'Payments'],
    resources: ['What is an AI automation platform?', 'Show me a real result']
  };
  var PRICE_RE = /\b(price|prices|cost|costs|how much|fees?|charge|charges|rates?|budget|quote me|expensive|cheap)\b/i;
  var YES_RE = /^\s*(yes|yeah|yep|sure|ok|okay|please|go ahead|book it|let's do it|sounds good)\b/i;
  var CLIENT_RE = /\b(client names?|which clients|who are your clients|customer names?|name (a|your) client)\b/i;
  var INTENT_RE = /\b(price|pricing|cost|book|booking|schedule|timeline|how long|how fast|demo|call|meeting|health check)\b/i;
  var PROCESS_RE = /\b(our|my|we|we're|we are)\b[^?.!]*\b(process|invoic\w*|billing|bills?|quot\w+|claims?|onboarding|payments?|reconcil\w*|orders?|tickets?|cases|tenders?|timesheets?|month-end|close|backlog|manual|spreadsheets?|hours)\b/i;
  var ASKS = [['name', 'Your name?'], ['email', 'Your work email?'], ['company', 'Your company?'], ['process', 'The process you’d like to fix?']];

  /* ================= Assistant UI: full-screen chat, ChatGPT/Claude-style ================= */
  var AV = '<span class="ai-av" aria-hidden="true"></span>';
  var ICO = function (n) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  function Assistant(root) {
    this.root = root; this.log = $('[data-log]', root); this.scroll = $('[data-scroll]', root) || this.log;
    this.form = $('[data-form]', root); this.input = this.form && this.form.q; this.hello = $('[data-hello]', root);
    this.lead = null; this.started = true; this.busy = false;
    var self = this, key = d.body.getAttribute('data-sg-page') || 'home', chips = CHIPS[key] || CHIPS.home;
    var starters = $('[data-starters]', root), railChips = $('[data-chips]', root);
    var ICONS = ['spark', 'zap', 'bot', 'cpu', 'target', 'chat'];
    chips.forEach(function (c, i) {
      if (starters) starters.insertAdjacentHTML('beforeend', '<button class="starter" type="button">' + ICO(ICONS[i % ICONS.length]) + '<span>' + esc(c) + '</span></button>');
      if (railChips) railChips.insertAdjacentHTML('beforeend', '<button class="ai-rail-q" type="button">' + ICO('chat') + '<span>' + esc(c) + '</span></button>');
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.starter,.ai-rail-q,.ai-follow'); if (b) { self.ask(b.textContent.trim()); return; }
      var c = e.target.closest('[data-copy]'); if (c) { var t = c.closest('.m').querySelector('.bd').innerText; try { navigator.clipboard.writeText(t); } catch (x) {} c.classList.add('ok'); return; }
      var r = e.target.closest('[data-rate]'); if (r && !r.parentNode.classList.contains('rated')) { r.parentNode.classList.add('rated'); r.classList.add('on'); track('user', '[Rated answer: ' + (r.getAttribute('data-rate') === 'up' ? 'helpful' : 'not helpful') + ']', { matched: r.closest('.m').getAttribute('data-src') || '' }); }
    });
    if (this.form) {
      this.form.addEventListener('submit', function (e) { e.preventDefault(); var v = self.input.value.trim(); if (!v || self.busy) return; self.input.value = ''; grow(self.input); self.ask(v); });
      autoGrow(this.input, this.form);
    }
  }
  function grow(t) { if (!t) return; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 180) + 'px'; }
  function autoGrow(t, form) {
    if (!t) return;
    t.addEventListener('input', function () { grow(t); });
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); } });
  }
  Assistant.prototype.toEnd = function () { var s = this.scroll; s.scrollTop = s.scrollHeight; };
  Assistant.prototype.add = function (html, who) {
    if (this.hello) this.hello.hidden = true;
    var m = d.createElement('div'); m.className = 'm ' + (who === 'me' ? 'me' : 'bot');
    m.innerHTML = who === 'me' ? '<div class="bd">' + html + '</div>' : AV + '<div class="bw"><div class="bd">' + html + '</div></div>';
    this.log.appendChild(m); this.toEnd(); return m;
  };
  /* Text streams in word by word; buttons, sources and follow-ups fade in after. */
  Assistant.prototype.say = function (html) {
    var self = this, meta = this.meta || {}; this.meta = null;
    var cut = html.search(/<div class="(btn-row|rel|srcw)/); var text = cut < 0 ? html : html.slice(0, cut), extra = cut < 0 ? '' : html.slice(cut);
    var plain = text.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
    if (this.asked) track('bot', plain, meta);
    var m = this.add('<span class="thinking"><i></i><i></i><i></i></span>'), bd = $('.bd', m);
    if (meta.matched) m.setAttribute('data-src', meta.matched);
    this.busy = true;
    return new Promise(function (res) {
      setTimeout(function () {
        var words = text.split(/(\s+)/), i = 0;
        bd.innerHTML = '<span class="st"></span><span class="caret"></span>';
        var st = $('.st', bd);
        (function tick() {
          if (reduce) i = words.length; else i = Math.min(words.length, i + 3);
          st.innerHTML = words.slice(0, i).join('');
          self.toEnd();
          if (i < words.length) return setTimeout(tick, 28);
          bd.innerHTML = text;
          var tools = (self.asked && meta.matched) ? '<div class="m-tools"><button type="button" data-copy aria-label="Copy">' + ICO('file') + '</button><button type="button" data-rate="up" aria-label="Helpful">' + ICO('check') + '</button><button type="button" data-rate="down" aria-label="Not helpful">' + ICO('x') + '</button></div>' : '';
          if (extra || tools) { var x = d.createElement('div'); x.className = 'm-extra'; x.innerHTML = extra + tools; bd.parentNode.appendChild(x); }
          self.busy = false; self.toEnd(); res();
        })();
      }, reduce ? 0 : 520);
    });
  };
  Assistant.prototype.reset = function () {
    $$('.m', this.log).forEach(function (m) { m.remove(); });
    if (this.hello) this.hello.hidden = false;
    this.lead = null; this.offered = false; this.leadOffered = false;
  };
  Assistant.prototype.start = function () {};
  Assistant.prototype.contactBtns = function () {
    return '<div class="btn-row"><a class="btn btn-primary btn-sm" href="' + contactUrl + '?type=Talk+to+an+Architect">Talk to an Architect</a><a class="btn btn-sm" href="' + contactUrl + '">Contact</a></div>';
  };
  Assistant.prototype.startLead = function () {
    var self = this; this.lead = { i: 0, data: {} }; this.leadOffered = true;
    return this.say(esc(STD.offer)).then(function () { return self.say(esc(ASKS[0][1])); });
  };
  Assistant.prototype.leadStep = function (v) {
    var L = this.lead, self = this, k = ASKS[L.i][0];
    if (/^\s*(no|nope|not now|no thanks|later|cancel|stop)\b/i.test(v)) { this.lead = null; return this.say(esc('What’s taking up your team’s time?')); }
    if (k !== 'process' && (/\?\s*$/.test(v) || /^\s*(how|what|why|when|where|who|which|can|could|do|does|did|is|are|will|would|should|tell|show|explain)\b/i.test(v) || PRICE_RE.test(v) || v.split(/\s+/).length > (k === 'company' ? 6 : 5))) { this.lead = null; this.retry = true; return this.ask(v); }
    if (k === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return this.say(esc(ASKS[L.i][1]));
    L.data[k] = v; L.i++;
    if (L.i < ASKS.length) return this.say(esc(ASKS[L.i][1]));
    this.lead = null; L.data.source = 'assistant'; L.data.session = SID; L.data.type = 'Book an AI Health Check';
    return submitLead(L.data).then(function (ok) {
      return self.say(ok ? esc('Thanks, ' + L.data.name + '. A Solution Architect will reach out within one business day. Anything else I can answer meanwhile?')
        : 'Please use the <a href="' + contactUrl + '">contact form</a> or email hello@simpliigence.ai.');
    });
  };
  function label(t) { return esc(t.replace(/^.*? — /, '').replace(/\.$/, '')); }
  function pageOf(t) { return esc((t.split(' — ')[0] || '').trim()); }
  Assistant.prototype.ask = function (v) {
    var self = this;
    this.asked = true;
    if (!this.retry) { this.add(esc(v), 'me'); track('user', this.lead ? (ASKS[this.lead.i][0] === 'process' ? v : '[' + ASKS[this.lead.i][0] + ' shared for the Health Check]') : v); }
    this.retry = false;
    if (this.lead) return this.leadStep(v);
    if (this.offered && YES_RE.test(v)) { this.offered = false; return this.startLead(); }
    this.offered = false;
    if (CLIENT_RE.test(v)) { this.meta = { matched: 'Standard line: client names' }; return this.say(esc(STD.client)); }
    if (PRICE_RE.test(v)) { this.offered = true; this.meta = { matched: 'Standard line: pricing' }; return this.say(esc(STD.price) + this.contactBtns()); }
    if (w.SG_CONTENT && CFG.kbUrl && !this.kbReady) {
      return w.SG_CONTENT.ready(CFG.kbUrl).then(function () { self.kbReady = true; self.retry = true; self.ask(v); });
    }
    var hit = w.SG_CONTENT && w.SG_CONTENT.search(v);
    if (hit) {
      var rel = (w.SG_CONTENT.related ? w.SG_CONTENT.related(v) : []).map(function (r) {
        return '<a class="ai-rel" href="' + link(r.url) + '">' + ICO('arrow') + '<span><small>' + pageOf(r.title) + '</small>' + label(r.title) + '</span></a>';
      }).join('');
      this.meta = { matched: hit.title };
      return this.say(esc(hit.excerpt) +
        '<div class="srcw"><a class="src-card" href="' + link(hit.url) + '">' + ICO('book') + '<span><small>' + pageOf(hit.title) + '</small><b>' + label(hit.title) + '</b></span><em>Read more' + ARROW + '</em></a></div>' +
        (rel ? '<div class="rel"><span>Related</span>' + rel + '</div>' : ''))
        .then(function () { if (!self.leadOffered && (INTENT_RE.test(v) || PROCESS_RE.test(v))) return self.startLead(); });
    }
    if (!this.leadOffered && (INTENT_RE.test(v) || PROCESS_RE.test(v))) return this.startLead();
    this.meta = { unanswered: 1 };
    if (w.SG_CONTENT && w.SG_CONTENT.known && !w.SG_CONTENT.known(v)) return this.say(esc(STD.offTopic));
    if (v.split(/\s+/).length > 2) { this.offered = true; return this.say(esc(STD.noAnswer) + this.contactBtns()); }
    return this.say(esc(STD.offTopic));
  };

  /* full-screen assistant */
  var panel = $('#ai'), fab = $('#fab'), bot = panel ? new Assistant(panel) : null, lastFocus = null;
  function drawerSet(open) {
    if (!panel) return;
    if (open) { lastFocus = d.activeElement; panel.hidden = false; requestAnimationFrame(function () { panel.classList.add('open'); }); d.documentElement.classList.add('ai-lock'); setTimeout(function () { if (w.innerWidth > 700) bot.input.focus({ preventScroll: true }); }, 250); }
    else { panel.classList.remove('open'); d.documentElement.classList.remove('ai-lock'); setTimeout(function () { if (!panel.classList.contains('open')) panel.hidden = true; }, 300); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
    if (fab) fab.setAttribute('aria-expanded', open);
  }
  if (panel) {
    $$('[data-close]', panel).forEach(function (b) { b.addEventListener('click', function () { drawerSet(false); }); });
    $$('[data-new]', panel).forEach(function (b) { b.addEventListener('click', function () { bot.reset(); bot.input.focus(); }); });
  }
  if (fab) fab.addEventListener('click', function () { drawerSet(panel.hidden); });
  $$('[data-open-asst]').forEach(function (b) { b.addEventListener('click', function () { sheetSet(false); drawerSet(true); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (panel && !panel.hidden) drawerSet(false); sheetSet(false); } });
  w.SG_ASK = function (text) { sheetSet(false); drawerSet(true); if (text) setTimeout(function () { bot.ask(text); }, 280); };
  $$('[data-ask]').forEach(function (b) { b.addEventListener('click', function () { w.SG_ASK(b.getAttribute('data-ask')); }); });
  /* Home: the hero composer hands the question to the full-screen assistant */
  $$('[data-launch]').forEach(function (f) {
    var t = f.q; autoGrow(t, f);
    f.addEventListener('submit', function (e) { e.preventDefault(); var v = t.value.trim(); if (!v) { t.focus(); return; } t.value = ''; grow(t); w.SG_ASK(v); });
  });
  w.SG_BOT = bot;
})();
