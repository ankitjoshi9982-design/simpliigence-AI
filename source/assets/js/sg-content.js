/* ============================================================
   SIMPLIIGENCE AI — published-content index
   Phase 1 of the AI assistant: no LLM backend yet, so the
   assistant can only ever say what is already published here.
   Each entry is a short (2-3 line) excerpt taken verbatim from
   the approved page copy, with the URL "Read more" sends the
   visitor to. Add an LLM backend later by swapping SG_search()
   for a call to that API — the UI around it does not change.
   ============================================================ */
window.SG_CONTENT = (function () {
  var R = ''; // WordPress pages already live at clean root-relative URLs (e.g. /ai/), so no prefix is needed.

  var pages = (window.SG_KB || []).concat([
    {
      title: 'Home — Outcomes, by design',
      url: R + '/',
      excerpt: "There's no shortage of AI. The hard part is knowing what to do first, making it last, and proving it paid off. We help you do all three with the tools you already have, and get paid when the number moves.",
      keywords: ['outcomes', 'ai strategy', 'where to start', 'roadmap', 'prioritise', 'prioritize', 'what to do next', 'ai automation platform']
    },
    {
      title: 'Home — Billing and revenue leakage',
      url: R + '/resources/',
      excerpt: 'Revenue leakage. Unbilled work, missed claims, unapplied cash, pricing errors. We size the leak first, then run the process to an agreed number.',
      keywords: ['billing', 'leak', 'revenue leakage', 'unbilled', 'missed claims', 'cash']
    },
    {
      title: 'Home — Quotes and cycle time',
      url: R + '/automation/',
      excerpt: 'Speed and revenue. Order-to-cash and quote cycles, lead-to-quote time, win and renewal rate. AI-drafted quotes now come straight from Salesforce.',
      keywords: ['quotes', 'quoting', 'speed up quotes', 'cycle time', 'order to cash']
    },
    {
      title: 'Home — Picking agents for a team',
      url: R + '/agents/',
      excerpt: 'Pick agents from a library of 36. We set them up in the tools you already use, run them, and tune them every month. One flat fee.',
      keywords: ['which agents', 'team of 50', 'fit a team', 'agent library', 'agentbox']
    },
    {
      title: 'Home — Copilot and existing licences',
      url: R + '/ai/',
      excerpt: 'All of it built on the platforms you already pay for. We build on the Claude, Copilot or Agentforce you have, and the logic ports when models improve',
      keywords: ['copilot', 'existing licence', 'bring your own intelligence', 'model agnostic']
    },
    {
      title: 'Home — Outcome contracts',
      url: R + '/automation/',
      excerpt: 'A small retainer up front, the rest tied to one KPI you choose. If the number doesn’t move, the success fee isn’t paid.',
      keywords: ['outcome contract', 'pricing model', 'success fee', 'kpi', 'outcome-as-a-service']
    },
    {
      title: 'Simpliigence AI — Bring Your Own Intelligence',
      url: R + '/ai/',
      excerpt: 'You already license Claude, Copilot or Agentforce. We turn it into agents that run in production, inside your tenant and your region, and we’re paid at each gate they pass.',
      keywords: ['enterprise ai solutions', 'own tenant', 'data residency', 'bring your own intelligence', 'own model and stack']
    },
    {
      title: 'Simpliigence AI — Does our data leave our tenant?',
      url: R + '/ai/#faq',
      excerpt: 'No. Everything runs inside your tenant and region, with your existing permissions.',
      keywords: ['data leave tenant', 'data residency', 'security review', 'does our data leave']
    },
    {
      title: 'Simpliigence AI — How a Health Check works',
      url: R + '/ai/#engagement',
      excerpt: 'AI Health Check · half a day. Two or three processes worth automating, with the reason and the KPI each would move.',
      keywords: ['health check', 'what happens in a health check', 'discovery sprint']
    },
    {
      title: 'Automation — Outcome-as-a-Service',
      url: R + '/automation/',
      excerpt: 'We size the leak before you pay anything, and we get paid when it closes. A small retainer up front, the rest tied to one KPI you choose.',
      keywords: ['outcome pricing', 'how does outcome pricing work', 'workflow automation', 'ai workflow automation']
    },
    {
      title: 'Automation — RPA or an AI agent?',
      url: R + '/automation/#faq',
      excerpt: 'It depends on how much the process changes. Stable, high-volume steps suit RPA; work that shifts or needs judgment suits an agent.',
      keywords: ['rpa or agent', 'rpa vs ai agent', 'which do i need']
    },
    {
      title: 'AI Agents — AgentBox',
      url: R + '/agents/',
      excerpt: 'Pick agents from a library of 36. We set them up in the tools you already use, run them, and tune them every month. One flat fee.',
      keywords: ['ai agents', 'agentbox', 'do i need an it team', 'which three agents', 'small business ai']
    },
    {
      title: 'AI Agents — Tools agents work with',
      url: R + '/agents/#faq',
      excerpt: 'The ones you already use, including Salesforce, QuickBooks, Microsoft 365, Google Workspace, Slack and Teams.',
      keywords: ['what tools', 'integrations', 'salesforce quickbooks']
    },
    {
      title: 'Industries — where the time goes',
      url: R + '/industries/',
      excerpt: 'AI transformation for businesses rarely starts with a big programme. It starts with one process that costs too much: a billing backlog, a quote that takes days, payments nobody has matched.',
      keywords: ['manufacturing', 'real estate', 'field services', 'payments', 'financial services', 'healthcare', 'staffing', 'distribution', 'regulated industries', 'industry']
    },
    {
      title: 'Resources — results and guides',
      url: R + '/resources/',
      excerpt: 'Results from agents in production, and straight answers to the questions we hear most. These are the pages AI search tools quote.',
      keywords: ['case studies', 'results', 'what is an ai automation platform', 'show me a real result', 'guides']
    },
    {
      title: 'Tools — find out where AI would help',
      url: R + '/tools/',
      excerpt: 'Three free tools. No sign-up to see your result. If you\'d like to go further, an architect picks it up from there.',
      keywords: ['readiness check', 'roi calculator', 'time savings', 'agent picker', 'assessment']
    },
    {
      title: 'Company — six years of delivery',
      url: R + '/company/',
      excerpt: 'Simpliigence has spent six years helping more than 125 companies get more from Salesforce, data and automation. Simpliigence AI is our answer.',
      keywords: ['about simpliigence', 'who are you', 'leadership', 'delivery model', 'company']
    },
    {
      title: 'Contact — book a session',
      url: R + '/contact/',
      excerpt: "We'll size it, prototype it on your data and tell you what it's worth before you commit. A Solution Architect replies within one business day.",
      keywords: ['contact', 'book a demo', 'talk to an architect', 'book a call', 'get in touch']
    }
  ]);

  /* ---------- Search: matches related wording, not just exact words ----------
     - light stemming (billing → bill, reconciling → reconcil)
     - business synonyms (invoice ≈ billing, proposal ≈ quote, recruitment ≈ staffing/hiring …)
     - typo tolerance (one wrong letter in longer words)
     - rarer words count more than common ones (IDF), title/keywords count more than body text
     Returns the best match, plus up to two related entries. */
  var STOP = ('a an the and or but is are was were be been being to of in on at by for with about into onto from as what how why where when which who whom whose can could would should will shall may might must do does did done doing you your yours we our ours i me my it its this that these those there here not no yes so if than then have has had get got us all any some just also please tell show give want need like know help am much many more most very really make use using used ai simpliigence').split(' ');
  var STOPWORDS = {}; STOP.forEach(function (w) { STOPWORDS[w] = 1; });
  var SYN = [
    ['invoice', 'invoicing', 'billing', 'bill', 'unbilled', 'receivable', 'collection', 'chasing'],
    ['reconcile', 'reconciliation', 'reconciling', 'matching', 'unapplied'],
    ['quote', 'quoting', 'proposal', 'proposals', 'estimate', 'cpq'],
    ['claim', 'claims', 'warranty', 'insurance'],
    ['recruit', 'recruitment', 'recruiting', 'hiring', 'staffing', 'candidate', 'screening', 'talent'],
    ['onboarding', 'joiner', 'joiners', 'hr', 'employee', 'employees'],
    ['support', 'helpdesk', 'ticket', 'tickets', 'triage', 'enquiry', 'inquiry', 'complaint'],
    ['lead', 'leads', 'crm', 'pipeline', 'prospect', 'prospects'],
    ['marketing', 'campaign', 'campaigns', 'ads', 'advertising'],
    ['procurement', 'tender', 'tenders', 'supplier', 'suppliers', 'purchasing'],
    ['security', 'secure', 'safe', 'compliance', 'governance', 'audit', 'regulated', 'gdpr', 'privacy'],
    ['tenant', 'residency', 'region', 'sovereignty'],
    ['model', 'models', 'llm', 'llms', 'gpt', 'chatgpt', 'gemini', 'neutral'],
    ['rpa', 'bot', 'bots', 'uipath', 'robotic'],
    ['agent', 'agents', 'chatbot', 'chatbots'],
    ['roi', 'return', 'payback', 'measure', 'kpi', 'kpis', 'metric', 'metrics'],
    ['fast', 'quick', 'quickly', 'soon', 'timeline', 'live', 'start', 'begin', 'launch'],
    ['small', 'smb', 'growing', 'startup'],
    ['manual', 'spreadsheet', 'spreadsheets', 'excel', 'paste', 'copy'],
    ['integrate', 'integration', 'integrations', 'connect', 'connector', 'connectors', 'api'],
    ['bank', 'banks', 'banking', 'fintech', 'lender', 'lending'],
    ['based', 'office', 'offices', 'located', 'location', 'locations', 'headquarters', 'hq'],
    ['ceo', 'founder', 'leadership', 'leaders', 'management'],
    ['price', 'pricing', 'cost', 'costs', 'charge', 'fee', 'fees', 'budget']
  ];
  function stem(t) {
    if (t.length > 4) t = t.replace(/(ations|ation|ings|ing|ies|ied|ions|ion|ed|es|s)$/, function (m) { return m === 'ies' || m === 'ied' ? 'y' : ''; });
    if (t.length > 4) t = t.replace(/e$/, '');
    return t;
  }
  var SYNIDX = {};
  SYN.forEach(function (g, i) { g.forEach(function (w) { (SYNIDX[stem(w)] = SYNIDX[stem(w)] || []).push(i); }); });
  function tokenize(s) {
    return (s || '').replace(/\bIT\b/g, ' itdept ').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(function (t) { return t.length >= 2 && !STOPWORDS[t]; }).map(stem).filter(function (t) { return t.length >= 2; });
  }
  function near(a, b) { // one edit apart (typos) for longer words
    if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, e = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++e > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return e + (a.length - i) + (b.length - j) <= 1;
  }
  var index = null, df = {}, N = 1;
  function build() {
    df = {}; N = pages.length || 1;
    index = pages.map(function (it) {
      var f = { t: tokenize(it.title), k: tokenize((it.keywords || []).join(' ')), x: tokenize(it.excerpt), b: tokenize(it.body || '') };
      var all = {}; [f.t, f.k, f.x, f.b].forEach(function (a) { a.forEach(function (w) { all[w] = 1; }); });
      Object.keys(all).forEach(function (w) { df[w] = (df[w] || 0) + 1; });
      var sets = {}; ['t', 'k', 'x', 'b'].forEach(function (k) { sets[k] = {}; f[k].forEach(function (w) { sets[k][w] = 1; }); });
      sets.all = Object.keys(all);
      return sets;
    });
  }
  var W = { t: 3, k: 3, x: 2, b: 0.7 };
  function idf(w) { return Math.log(1 + N / ((df[w] || 0) + 1)); }
  function matchIn(set, words, q) {
    if (set[q]) return 1;
    for (var i = 0; i < words.length; i++) if (near(q, words[i])) return 0.8;
    var g = SYNIDX[q];
    if (g) for (i = 0; i < words.length; i++) { var h = SYNIDX[words[i]]; if (h && h.some(function (x) { return g.indexOf(x) !== -1; })) return 0.4; }
    return 0;
  }
  function scoreItem(qt, i) {
    var s = index[i], total = 0, hits = 0;
    qt.forEach(function (q) {
      var best = 0;
      ['t', 'k', 'x', 'b'].forEach(function (k) { var m = matchIn(s[k], k === 'b' ? s.all : Object.keys(s[k]), q); if (m * W[k] > best) best = m * W[k]; });
      if (best) { hits++; total += best * idf(q); }
    });
    return hits ? total * (0.35 + 0.65 * hits / qt.length) : 0;
  }
  function rank(query) {
    if (!index) build();
    var qt = tokenize(query); if (!qt.length) return [];
    var res = [];
    for (var i = 0; i < pages.length; i++) { var sc = scoreItem(qt, i) * (pages[i].weight || 1); if (sc > 0) res.push({ item: pages[i], score: sc }); }
    res.sort(function (a, b) { return b.score - a.score; });
    return res;
  }
  var MIN = 3.2;
  function known(query) { if (!index) build(); return tokenize(query).some(function (q) { return !!df[q] || !!SYNIDX[q]; }); }
  function search(query) { var r = rank(query); return r.length && r[0].score >= MIN ? r[0].item : null; }
  function related(query) {
    var r = rank(query); if (!r.length || r[0].score < MIN) return [];
    var seen = {}; seen[r[0].item.url.split('#')[0] + r[0].item.title] = 1;
    return r.slice(1).filter(function (x) { var k = x.item.url.split('#')[0] + x.item.title; if (seen[k] || x.score < r[0].score * 0.55 || x.score < MIN) return false; seen[k] = 1; return true; }).slice(0, 2).map(function (x) { return x.item; });
  }

  var api = { pages: pages, search: search, related: related, rank: rank, known: known };
  /* WordPress: the knowledge base lives in the admin (Knowledge Base) and is fetched once, on first use. */
  var loading = null;
  api.ready = function (url) {
    if (!url) return Promise.resolve();
    if (!loading) loading = fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (rows) {
      if (Array.isArray(rows) && rows.length) { pages = rows; api.pages = rows; index = null; }
    }).catch(function () {});
    return loading;
  };
  return api;
})();
