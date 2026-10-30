/* ============================================================
   SIMPLIIGENCE AI — AI assistant (replaces keyword search)
   Phase 1: answers only from the content already published on
   the site (window.SG_CONTENT). A 2-3 line excerpt + "Read more"
   button for a matched query; an unrelated question is redirected
   to Contact / Talk to an Architect, exactly as specified.
   Copy below (welcome line, chips, standard lines, lead-capture
   script) is taken verbatim from the approved copy document.
   ============================================================ */
(function () {
  'use strict';
  var CONTENT = window.SG_CONTENT;
  if (!CONTENT) return;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  var STANDARD = {
    noAnswer: 'That’s a good one for an architect rather than me. Want me to set up a quick call?',
    price: 'Pricing depends on the process and the model you choose, so an architect walks you through it. Shall I book that for you?',
    clientName: 'We keep client names private, but I can share the industry, what we built and the result.',
    offTopic: 'I can only help with Simpliigence AI and how we approach AI, automation and agents. Is there a process you’d like to talk through?'
  };

  var PRICE_RE = /\b(price|pricing|cost|how much|fee|fees)\b/i;
  var CLIENT_RE = /\b(client name|which clients|who are your clients|customer name)\b/i;
  var BUY_INTENT_RE = /\b(price|pricing|cost|book|schedule|timeline|how long|how fast|demo|call|meeting|health check|discovery sprint)\b/i;

  function renderResultHTML(item) {
    return '<div class="ai-response">' +
      esc(item.excerpt) +
      '<div class="ai-response-actions"><a class="btn btn-ghost btn-sm" href="' + item.url + '">Read more <i class="fa-solid fa-arrow-right"></i></a></div>' +
      '</div>';
  }

  function renderNoAnswerHTML(contactUrl) {
    return '<div class="ai-response">' + esc(STANDARD.noAnswer) +
      '<div class="ai-response-actions">' +
      '<a class="btn btn-primary btn-sm" href="' + contactUrl + '?type=Talk+to+an+Architect">Talk to an Architect</a>' +
      '<a class="btn btn-ghost btn-sm" href="' + contactUrl + '">Contact us</a>' +
      '</div></div>';
  }

  function answerFor(query, contactUrl) {
    if (CLIENT_RE.test(query)) return '<div class="ai-response">' + esc(STANDARD.clientName) + '</div>';
    if (PRICE_RE.test(query)) return '<div class="ai-response">' + esc(STANDARD.price) + '</div>';
    var item = CONTENT.search(query);
    if (item) return renderResultHTML(item);
    return renderNoAnswerHTML(contactUrl);
  }

  /* ---------- Homepage hero search bar (#aiSearchForm) ---------- */
  var heroForm = document.getElementById('aiSearchForm');
  if (heroForm) {
    var panel = document.getElementById('aiPanel');
    var panelBody = document.getElementById('aiPanelBody');
    var panelQuery = document.getElementById('aiPanelQuery');
    var panelClose = document.getElementById('aiPanelClose');
    var input = document.getElementById('aiSearchInput');
    var contactUrl = (window.SGAI && SGAI.contactUrl) || '/contact/';

    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      panelQuery.textContent = '“' + q + '”';
      panelBody.innerHTML = answerFor(q, contactUrl);
      panel.classList.add('open');
    });
    document.querySelectorAll('#chipRow .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = chip.textContent;
        heroForm.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    });
    if (panelClose) panelClose.addEventListener('click', function () { panel.classList.remove('open'); });
  }

  /* ---------- Floating persistent assistant ---------- */
  var CHIPS_BY_PAGE = {
    home: ['Find the leak in our billing', 'Speed up our quotes', 'Which agents fit a 50-person team?', 'Put Copilot to real work'],
    ai: ['Can you build on our Copilot licence?', 'Does our data leave our tenant?', 'What happens in a Health Check?'],
    automation: ['How does outcome pricing work?', 'RPA or an AI agent?', 'What KPIs can you move?'],
    agents: ['Which three agents should I start with?', 'Do I need an IT team?', 'What tools do agents work with?'],
    industries: ['What would you automate first in manufacturing?', 'Real estate', 'Field services', 'Payments'],
    resources: ['What is an AI automation platform?', 'Show me a real result']
  };

  var contactUrlGlobal = (window.SGAI && SGAI.contactUrl) || '/contact/';
  var pageKey = document.body.getAttribute('data-sg-page') || 'home';
  var chips = CHIPS_BY_PAGE[pageKey] || CHIPS_BY_PAGE.home;

  document.body.insertAdjacentHTML('beforeend',
    '<div class="fab-label" id="fabLabel">👋 Ask our AI assistant</div>' +
    '<button class="fab" id="fab" aria-label="Open AI assistant" aria-expanded="false"><i class="fa-solid fa-atom" id="fabIcon"></i></button>' +
    '<section class="assistant" id="assistant" role="dialog" aria-label="Simpliigence AI assistant" aria-modal="false">' +
    '  <div class="assistant-head">' +
    '    <span class="ai-avatar"><i class="fa-solid fa-atom"></i></span>' +
    '    <div><b>Simpliigence AI assistant</b><small>Answers from our own content. A person is one click away.</small></div>' +
    '    <button class="assistant-close" id="assistantClose" aria-label="Close assistant"><i class="fa-solid fa-xmark"></i></button>' +
    '  </div>' +
    '  <div class="assistant-body" id="chatBody"></div>' +
    '  <div class="chip-row" id="assistantChipRow" style="padding:0 16px 10px"></div>' +
    '  <form class="assistant-input" id="chatForm">' +
    '    <input id="chatInput" placeholder="Ask about a process you’d like to fix" autocomplete="off" aria-label="Message the AI assistant">' +
    '    <button type="submit" aria-label="Send message"><i class="fa-solid fa-paper-plane"></i></button>' +
    '  </form>' +
    '  <p style="font-size:11px;color:var(--text-3);padding:0 16px 14px;margin:0">Chats are stored to improve our answers. <a href="' + ((window.SGAI && SGAI.privacyUrl) || '#') + '">See our privacy notice.</a></p>' +
    '</section>'
  );

  var fab = document.getElementById('fab');
  var assistantPanel = document.getElementById('assistant');
  var body = document.getElementById('chatBody');
  var form = document.getElementById('chatForm');
  var chatInput = document.getElementById('chatInput');
  var chipRow = document.getElementById('assistantChipRow');
  var opened = false;
  var leadStep = null; // null | 'name' | 'email' | 'company' | 'process'
  var leadData = {};

  function addMsg(html, who) {
    var div = document.createElement('div');
    div.className = 'msg ' + (who || 'bot');
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  chips.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'chip';
    b.textContent = c;
    b.addEventListener('click', function () { handleQuery(c); });
    chipRow.appendChild(b);
  });

  function open() {
    if (opened) return;
    opened = true;
    assistantPanel.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    if (!body.children.length) {
      addMsg(esc('Hi, I can tell you how we’d approach a process, which agents might fit, and what results we’ve seen. What’s taking up your team’s time?'));
    }
  }
  fab.addEventListener('click', open);
  document.getElementById('assistantClose').addEventListener('click', function () {
    opened = false;
    assistantPanel.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
  });

  function startLeadCapture() {
    leadStep = 'name';
    leadData = {};
    addMsg(esc('Sounds like this is worth a proper look. Would you like an AI Health Check? I just need a few details.'));
    addMsg('What’s your name?');
  }

  function handleLeadStep(text) {
    if (leadStep === 'name') {
      leadData.name = text;
      leadStep = 'email';
      addMsg('What’s your work email?');
      return;
    }
    if (leadStep === 'email') {
      leadData.email = text;
      leadStep = 'company';
      addMsg('Which company are you with?');
      return;
    }
    if (leadStep === 'company') {
      leadData.company = text;
      leadStep = 'process';
      addMsg('And which process would you like to fix?');
      return;
    }
    if (leadStep === 'process') {
      leadData.process = text;
      leadStep = null;
      leadData.source = 'assistant';
      leadData.type = 'Book an AI Health Check';
      window.SG_UI.submitLead(leadData).then(function (ok) {
        if (ok) {
          addMsg(esc('Thanks, ' + (leadData.name || '') + '. A Solution Architect will reach out within one business day. Anything else I can answer meanwhile?'));
        } else {
          addMsg('Something went wrong saving that — please use the <a href="' + contactUrlGlobal + '">contact form</a> instead, or email hello@simpliigence.ai.');
        }
      });
    }
  }

  function handleQuery(text) {
    addMsg(esc(text), 'user');
    if (leadStep) { handleLeadStep(text); return; }

    if (CLIENT_RE.test(text)) { addMsg(esc(STANDARD.clientName)); return; }

    var item = CONTENT.search(text);
    if (item) {
      addMsg(renderResultHTML(item));
      if (BUY_INTENT_RE.test(text)) startLeadCapture();
      return;
    }
    if (PRICE_RE.test(text)) { addMsg(esc(STANDARD.price)); return; }
    if (BUY_INTENT_RE.test(text)) { startLeadCapture(); return; }

    // Off-topic / no match in the knowledge base
    addMsg(esc(STANDARD.offTopic));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    handleQuery(text);
  });
})();
