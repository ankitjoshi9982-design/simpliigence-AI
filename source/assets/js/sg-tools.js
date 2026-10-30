/* Simpliigence AI — Tools page (readiness check, time savings, agent picker) and Contact form.
   No prices or currency anywhere, per the approved copy. */
(function () {
  'use strict';
  var d = document, w = window, CFG = w.SGAI || {};
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ICO = function (n) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var contactUrl = CFG.contactUrl || '/contact/';
  function lead(data) { return (w.SG_UI && w.SG_UI.submitLead) ? w.SG_UI.submitLead(data) : Promise.resolve(true); }
  function ask(t) { if (w.SG_ASK) w.SG_ASK(t); }
  function handoff(askText) {
    return '<div class="btn-row"><button class="btn btn-sm" type="button" data-h-ask>Talk it through with our assistant</button>' +
      '<a class="btn btn-primary btn-sm" href="' + contactUrl + '?type=Book+an+AI+Health+Check">Book an AI Health Check</a></div>' +
      '<div class="mail-me"><input type="email" placeholder="Work email" aria-label="Work email" data-mail><button class="btn btn-sm" type="button" data-mail-go>Send</button></div>' +
      '<small>Email is only needed if you’d like a copy sent to you.</small>';
  }
  function wireHandoff(box, askText, summary) {
    var a = $('[data-h-ask]', box); if (a) a.addEventListener('click', function () { ask(askText); });
    var g = $('[data-mail-go]', box), m = $('[data-mail]', box);
    if (g) g.addEventListener('click', function () {
      if (!/^\S+@\S+\.\S+$/.test(m.value)) { m.focus(); return; }
      lead({ email: m.value, process: summary, source: 'tool', type: 'Tool result' }).then(function () { g.disabled = true; g.innerHTML = ICO('check'); });
    });
  }

  /* ---------- Tool 1: AI Readiness Check ---------- */
  var Q = [
    { q: 'Which systems does your team run on day to day?', o: ['Salesforce', 'Microsoft 365', 'SAP or another ERP', 'A mix of spreadsheets and email'] },
    { q: 'Where does most of your process data live?', o: ['One main system of record', 'A few connected systems', 'Scattered across several tools', 'Mostly in people’s heads'] },
    { q: 'How big is the team that would use this?', o: ['Under 10', '10 to 50', '50 to 200', '200+'] },
    { q: 'Which process takes up the most time right now?', o: ['Billing or invoicing', 'Customer or case handling', 'Quoting or sales admin', 'Onboarding or HR admin'] },
    { q: 'Who approves changes to how this process runs?', o: ['One person, quickly', 'A small team', 'A formal change board', 'Not sure yet'] },
    { q: 'Has this process been automated before?', o: ['Never tried', 'Tried, but it broke', 'Partly automated today', 'Already well automated'] },
    { q: 'How consistent is the process from one time to the next?', o: ['Very consistent', 'Mostly consistent, some exceptions', 'Changes a lot', 'Different every time'] },
    { q: 'How soon would you want to see a result?', o: ['Within weeks', 'Within a quarter', 'Within the year', 'Just exploring for now'] }
  ];
  var quiz = $('[data-quiz]');
  if (quiz) {
    var body = $('[data-quiz-body]', quiz), bar = $('[data-quiz-bar]', quiz), ans = [];
    function render(i) {
      bar.style.width = Math.round(i / Q.length * 100) + '%';
      if (i >= Q.length) return result();
      var it = Q[i];
      body.innerHTML = '<p class="qz-n">Question ' + (i + 1) + ' of ' + Q.length + '</p><h3 class="qz-q">' + esc(it.q) + '</h3><div class="qz-opts">' +
        it.o.map(function (o, k) { return '<button type="button" class="qz-opt" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div>';
      $$('.qz-opt', body).forEach(function (b) { b.addEventListener('click', function () { ans.push(+b.getAttribute('data-k')); render(i + 1); }); });
    }
    function result() {
      var score = Math.round(ans.reduce(function (s, a) { return s + (3 - a); }, 0) / (Q.length * 3) * 100);
      var steps = score >= 70
        ? ['Move straight to a Discovery Sprint on your highest-value process.', 'Agree the KPI now, so the pilot is measured from day one.']
        : score >= 40
        ? ['Start with an AI Health Check to rank your processes by value.', 'Pick one system of record to centre the first build on.']
        : ['Tidy up where this process’s data lives before automating it.', 'Start small: one process, one clear owner, one KPI.'];
      body.innerHTML = '<div class="qz-res"><div><div class="hv-gauge sm"><svg viewBox="0 0 200 200"><circle class="t" cx="100" cy="100" r="84"/><circle class="v" cx="100" cy="100" r="84" pathLength="100" style="stroke-dasharray:0 100"/></svg><div class="hg-in"><b>' + score + '</b></div></div><p class="qz-lbl">Readiness score out of 100</p></div>' +
        '<ul>' + steps.map(function (s) { return '<li>' + ICO('check') + '<span>' + esc(s) + '</span></li>'; }).join('') + '</ul></div>' + handoff();
      requestAnimationFrame(function () { setTimeout(function () { $('.v', body).style.strokeDasharray = score + ' 100'; }, 60); });
      wireHandoff(body, 'My AI readiness score is ' + score + ' out of 100. What should we do first?', 'AI Readiness Check score: ' + score + '/100');
    }
    var start = $('[data-quiz-start]');
    if (start) start.addEventListener('click', function () { ans = []; render(0); if (w.innerWidth < 900) quiz.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  }

  /* ---------- Tool 2: Time Savings Estimate (hours only) ---------- */
  var est = $('[data-est]');
  if (est) {
    var R = {}; $$('[data-r]', est).forEach(function (r) { R[r.getAttribute('data-r')] = r; });
    var out = $('[data-est-out]', est), box = $('.est-out', est), last = '';
    function fill(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); }
    function calc() {
      Object.keys(R).forEach(function (k) { fill(R[k]); $('[data-o="' + k + '"]', est).textContent = R[k].value + (k === 'err' ? '%' : ''); });
      var tx = +R.tx.value, min = +R.min.value, err = +R.err.value / 100;
      var monthly = tx * min * (1 + err) / 60 * 4.33, auto = monthly * 0.6;
      var lo = Math.round(auto * 0.7), hi = Math.round(auto * 1.1);
      last = lo === hi ? String(lo) : lo + '–' + hi; out.textContent = last;
    }
    Object.keys(R).forEach(function (k) { R[k].addEventListener('input', calc); });
    calc();
    $('[data-est-go]', est).addEventListener('click', function () { calc(); box.classList.add('on'); this.style.display = 'none'; });
    $('[data-est-ask]', est).addEventListener('click', function () { ask('Our process could free up ' + last + ' hours a month. How would you approach it?'); });
  }

  /* ---------- Tool 3: Agent Picker ---------- */
  var MAP = {
    finance: ['Invoice Follow-up Agent', 'Payment Matching Agent', 'Expense Check Agent'],
    sales: ['Lead Qualification Agent', 'Quote Drafting Agent', 'Meeting Follow-up Agent'],
    service: ['Case Triage Agent', 'First-Reply Agent', 'Claims Billing Agent'],
    operations: ['Order Tracking Agent', 'Procurement Agent', 'Scheduling Agent'],
    hr: ['Onboarding Checklist Agent', 'Policy Q&A Agent', 'Document Collection Agent'],
    marketing: ['Content Drafting Agent', 'Campaign Reporting Agent', 'Ad Performance Agent']
  };
  var LIB = {
    finance: 'Finance. Invoice follow-up, payment matching, expense checks, month-end prep.',
    sales: 'Sales. Lead qualification, quote drafting, CRM updates, meeting follow-up.',
    service: 'Customer support. Case triage, first replies, claims and billing handoffs.',
    operations: 'Operations. Order tracking, procurement capture, scheduling.',
    hr: 'HR. Onboarding checklists, policy questions, document collection.',
    marketing: 'Marketing. Content drafts, campaign reporting, ad performance summaries.'
  };
  var pick = $('[data-pick]');
  if (pick) {
    $$('[data-team] button', pick).forEach(function (b) { b.addEventListener('click', function () { $$('[data-team] button', pick).forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); }); });
    $$('[data-tools] button', pick).forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('on'); }); });
    $('[data-pick-go]', pick).addEventListener('click', function () {
      var team = ($('[data-team] .on', pick) || {}).getAttribute ? $('[data-team] .on', pick).getAttribute('data-v') : 'finance';
      var agents = MAP[team], o = $('[data-pick-out]', pick);
      o.innerHTML = '<span class="hw-k">Start with</span><ul class="pa">' + agents.map(function (a) { return '<li>' + ICO('bot') + esc(a) + '</li>'; }).join('') + '</ul><p class="pl">' + esc(LIB[team]) + '</p>' + handoff();
      wireHandoff(o, 'Which three agents should I start with? We’re looking at the ' + agents.join(', ') + '.', 'Agent Picker: ' + agents.join(', '));
    });
  }

  /* ---------- Agent library filter (when agents are added in wp-admin) ---------- */
  $$('.lib-filter').forEach(function (f) {
    var cards = $$('.agent-card', f.parentNode);
    $$('[data-team-f]', f).forEach(function (b) { b.addEventListener('click', function () {
      $$('[data-team-f]', f).forEach(function (x) { x.classList.toggle('on', x === b); });
      var t = b.getAttribute('data-team-f'); cards.forEach(function (c) { c.hidden = !!t && c.getAttribute('data-team') !== t; });
    }); });
  });

  /* ---------- Contact form ---------- */
  var form = $('[data-cform]');
  if (form) {
    var p = new URLSearchParams(w.location.search), t = p.get('type');
    var MAPT = { 'Talk to an Architect': 'Book an Architecture Session', 'Book an AI Health Check': 'Book an AI Health Check', 'Explore AI Agents': 'Explore AI Agents', 'Size an outcome contract': 'Size an outcome contract' };
    function setType(v) { $$('option', form.type).forEach(function (o) { if (o.text === v) form.type.value = v; }); $$('[data-way]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-way') === form.type.value); }); }
    if (t) setType(MAPT[t] || t); else setType(form.type.value);
    form.type.addEventListener('change', function () { setType(form.type.value); });
    $$('[data-way]').forEach(function (b) { b.addEventListener('click', function () { setType(b.getAttribute('data-way')); $('#form').scrollIntoView({ behavior: 'smooth' }); setTimeout(function () { form.name.focus({ preventScroll: true }); }, 500); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var ok = true;
      [form.name, form.email].forEach(function (f) { var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)); f.classList.toggle('err', bad); if (bad) ok = false; });
      if (!ok) return;
      var btn = $('button[type=submit]', form); btn.disabled = true;
      var size = form.size.value, route = size === 'Under 200 people' ? 'AI Agents' : size === '200 to 2,000' ? 'Automation' : size === '2,000+' ? 'Simpliigence AI' : '';
      lead({ name: form.name.value, email: form.email.value, company: form.company.value, phone: form.phone.value, type: form.type.value, size: size, route: route, process: form.process.value, source: 'contact' })
        .then(function (res) {
          btn.disabled = false;
          if (!res) { btn.insertAdjacentHTML('afterend', '<p class="fnote">Please email hello@simpliigence.ai.</p>'); return; }
          $('[data-cform-wrap]').hidden = true; var done = $('[data-cform-done]'); done.hidden = false; done.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
  }
})();
