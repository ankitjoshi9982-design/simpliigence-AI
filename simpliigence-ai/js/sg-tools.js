/* ============================================================
   SIMPLIIGENCE AI — Tools page: AI Readiness Check,
   Time Savings Estimate, Agent Picker. No prices anywhere,
   matching the sitewide rule. Only runs on the Tools page.
   ============================================================ */
(function () {
  'use strict';
  if (document.body.getAttribute('data-sg-page') !== 'tools') return;

  /* ---------- Tool 1: AI Readiness Check ---------- */
  var QUESTIONS = [
    { q: 'Which systems does your team run on day to day?', options: ['Salesforce', 'Microsoft 365', 'SAP or another ERP', 'A mix of spreadsheets and email'] },
    { q: 'Where does most of your process data live?', options: ['One main system of record', 'A few connected systems', 'Scattered across several tools', 'Mostly in people’s heads'] },
    { q: 'How big is the team that would use this?', options: ['Under 10', '10 to 50', '50 to 200', '200+'] },
    { q: 'Which process takes up the most time right now?', options: ['Billing or invoicing', 'Customer or case handling', 'Quoting or sales admin', 'Onboarding or HR admin'] },
    { q: 'Who approves changes to how this process runs?', options: ['One person, quickly', 'A small team', 'A formal change board', 'Not sure yet'] },
    { q: 'Has this process been automated before?', options: ['Never tried', 'Tried, but it broke', 'Partly automated today', 'Already well automated'] },
    { q: 'How consistent is the process from one time to the next?', options: ['Very consistent', 'Mostly consistent, some exceptions', 'Changes a lot', 'Different every time'] },
    { q: 'How soon would you want to see a result?', options: ['Within weeks', 'Within a quarter', 'Within the year', 'Just exploring for now'] }
  ];

  var quizBox = document.getElementById('quizContent');
  var quizProgress = document.getElementById('quizProgress');
  var answers = [];

  function renderQuestion(i) {
    if (!quizBox) return;
    if (i >= QUESTIONS.length) { renderScore(); return; }
    var item = QUESTIONS[i];
    quizProgress.style.width = Math.round((i / QUESTIONS.length) * 100) + '%';
    var html = '<p style="font-size:12px;color:var(--text-3);margin-bottom:8px">Question ' + (i + 1) + ' of ' + QUESTIONS.length + '</p>' +
      '<h3 style="margin-bottom:16px">' + item.q + '</h3>';
    item.options.forEach(function (opt, idx) {
      html += '<button type="button" class="quiz-option" data-idx="' + idx + '" style="display:block;width:100%;text-align:left;margin-bottom:10px">' + opt + '</button>';
    });
    quizBox.innerHTML = html;
    quizBox.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        answers.push(parseInt(btn.dataset.idx, 10));
        renderQuestion(i + 1);
      });
    });
  }

  function renderScore() {
    quizProgress.style.width = '100%';
    // Simple scoring: more "mature" answers (lower option index generally = more ready) push the score up.
    var raw = answers.reduce(function (sum, a) { return sum + (3 - a); }, 0);
    var max = QUESTIONS.length * 3;
    var score = Math.round((raw / max) * 100);
    var steps = score >= 70
      ? ['Move straight to a Discovery Sprint on your highest-value process.', 'Agree the KPI now, so the pilot is measured from day one.']
      : score >= 40
      ? ['Start with an AI Health Check to rank your processes by value.', 'Pick one system of record to centre the first build on.']
      : ['Tidy up where this process’s data lives before automating it.', 'Start small: one process, one clear owner, one KPI.'];

    quizBox.innerHTML =
      '<div class="text-center">' +
      '<div class="score-ring" style="margin:0 auto 16px"><span class="score-num">' + score + '</span></div>' +
      '<p style="color:var(--text-2);margin-bottom:16px">Readiness score out of 100</p>' +
      '<ul class="check-list" style="text-align:left;max-width:480px;margin:0 auto 20px">' +
      steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') +
      '</ul>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
      '<a class="btn btn-primary btn-sm" href="' + ((window.SGAI && SGAI.contactUrl) || '/contact/') + '?type=Book+an+AI+Health+Check">Book an AI Health Check</a>' +
      '<button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById(\'fab\').click();">Talk it through with our assistant</button>' +
      '</div></div>';
  }

  if (quizBox) renderQuestion(0);

  /* ---------- Tool 2: Time Savings Estimate (hours only, no currency) ---------- */
  var rTx = document.getElementById('rTx'), rMin = document.getElementById('rMin'), rErr = document.getElementById('rErr'), rPpl = document.getElementById('rPpl');
  var vTx = document.getElementById('vTx'), vMin = document.getElementById('vMin'), vErr = document.getElementById('vErr'), vPpl = document.getElementById('vPpl');
  var roiResult = document.getElementById('roiResult');

  function computeHours() {
    if (!rTx) return;
    var tx = parseFloat(rTx.value), min = parseFloat(rMin.value), err = parseFloat(rErr.value) / 100, ppl = parseFloat(rPpl.value);
    vTx.textContent = tx; vMin.textContent = min; vErr.textContent = Math.round(err * 100) + '%'; vPpl.textContent = ppl;

    // Weekly hours currently spent on the process (including rework), x4.33 weeks/month,
    // then apply a conservative 60% automatable share — a placeholder until a Discovery Sprint measures the real number.
    var weeklyMinutes = tx * min * (1 + err);
    var weeklyHours = weeklyMinutes / 60;
    var monthlyHours = weeklyHours * 4.33;
    var automatable = monthlyHours * 0.6;
    var lo = Math.round(automatable * 0.7), hi = Math.round(automatable * 1.1);
    if (roiResult) roiResult.textContent = (lo === hi ? lo : lo + '–' + hi) + ' hrs/mo';
  }

  [rTx, rMin, rErr, rPpl].forEach(function (el) { if (el) el.addEventListener('input', computeHours); });
  computeHours();

  /* ---------- Tool 3: Agent Picker ---------- */
  var AGENT_MAP = {
    finance: ['Invoice Follow-up Agent', 'Payment Matching Agent', 'Expense Check Agent'],
    sales: ['Lead Qualification Agent', 'Quote Drafting Agent', 'Meeting Follow-up Agent'],
    service: ['Case Triage Agent', 'First-Reply Agent', 'Claims Billing Agent'],
    operations: ['Order Tracking Agent', 'Procurement Agent', 'Scheduling Agent'],
    hr: ['Onboarding Checklist Agent', 'Policy Q&A Agent', 'Document Collection Agent'],
    marketing: ['Content Drafting Agent', 'Campaign Reporting Agent', 'Ad Performance Agent']
  };
  var apSubmit = document.getElementById('apSubmit');
  if (apSubmit) {
    apSubmit.addEventListener('click', function () {
      var team = (document.getElementById('apTeam').value || 'Finance').toLowerCase();
      var agents = AGENT_MAP[team] || AGENT_MAP.finance;
      var sink = (document.getElementById('apSink').value || '').trim();
      var resultEl = document.getElementById('apResult');
      resultEl.innerHTML =
        '<div class="glass" style="padding:20px;border-radius:16px">' +
        '<p style="color:var(--text-2);margin-bottom:12px">' + (sink ? 'For &ldquo;' + sink.replace(/[<>&]/g, '') + '&rdquo;, s' : 'S') + 'tart with:</p>' +
        '<ul class="check-list">' + agents.map(function (a) { return '<li><strong>' + a + '</strong></li>'; }).join('') + '</ul>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">' +
        '<a class="btn btn-primary btn-sm" href="' + ((window.SGAI && SGAI.contactUrl) || '/contact/') + '?type=Explore+AI+Agents">Book an AI Health Check</a>' +
        '<button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById(\'fab\').click();">Talk it through with our assistant</button>' +
        '</div></div>';
    });
  }
})();
