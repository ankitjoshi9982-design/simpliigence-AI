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
  var R = '/simpliigence-AI'; // WordPress pages already live at clean root-relative URLs (e.g. /ai/), so no prefix is needed.

  var pages = [
    {
      title: 'Home — Outcomes, by design',
      url: R + '/',
      excerpt: "There's no shortage of AI. The hard part is knowing what to do first, making it last, and proving it paid off. We help you do all three with the tools you already have, and get paid when the number moves.",
      keywords: ['outcomes', 'ai strategy', 'where to start', 'roadmap', 'prioritise', 'prioritize', 'what to do next', 'ai automation platform']
    },
    {
      title: 'Home — Billing and revenue leakage',
      url: R + '/resources/',
      excerpt: 'Revenue leakage: unbilled work, missed claims, unapplied cash, pricing errors. We size the leak first, then run the process to an agreed number.',
      keywords: ['billing', 'leak', 'revenue leakage', 'unbilled', 'missed claims', 'cash']
    },
    {
      title: 'Home — Quotes and cycle time',
      url: R + '/automation/',
      excerpt: 'Speed and revenue: order-to-cash and quote cycles, lead-to-quote time, win and renewal rate. AI-drafted quotes now come straight from Salesforce.',
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
      excerpt: 'All of it built on the platforms you already pay for. We build on the Claude, Copilot or Agentforce you have, and the logic ports when models improve.',
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
      excerpt: 'AI Health Check, half a day: two or three processes worth automating, with the reason and the KPI each would move.',
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
      url: R + '/automation/#tool-fit',
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
      excerpt: 'Three free tools. No sign-up to see your result: an AI Readiness Check, a Time Savings Estimate and an Agent Picker.',
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
  ];

  // Function words carry no topical signal, but are long enough (3+ letters)
  // to survive a plain length filter and short enough to prefix-match all
  // kinds of unrelated words ("today" starts with "to", "what" literally
  // appears inside the keyword phrase "what to do next"). Left in, they let
  // a completely off-topic question match a result just by sharing a "the"
  // or a "what" — filtering them out of every token stream (query, excerpt
  // text and keyword phrases alike) is what makes the match mean something.
  var STOPWORDS = {
    a: 1, an: 1, the: 1, and: 1, or: 1, but: 1, is: 1, are: 1, was: 1, were: 1, be: 1, been: 1, being: 1,
    to: 1, of: 1, in: 1, on: 1, at: 1, by: 1, for: 1, with: 1, about: 1, into: 1, onto: 1, from: 1, as: 1,
    what: 1, how: 1, why: 1, where: 1, when: 1, which: 1, who: 1, whom: 1, whose: 1,
    can: 1, could: 1, would: 1, should: 1, will: 1, shall: 1, may: 1, might: 1, must: 1,
    do: 1, does: 1, did: 1, done: 1, doing: 1,
    you: 1, your: 1, yours: 1, we: 1, our: 1, ours: 1, i: 1, me: 1, my: 1, it: 1, its: 1, this: 1, that: 1,
    these: 1, those: 1, there: 1, here: 1, not: 1, no: 1, yes: 1, so: 1, if: 1, than: 1, then: 1,
    have: 1, has: 1, had: 1, get: 1, got: 1, us: 1, all: 1, any: 1, some: 1, just: 1, also: 1, please: 1
  };

  function tokenize(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(function (t) {
      return t.length >= 3 && !STOPWORDS[t];
    });
  }

  function score(query, item) {
    var qTokens = tokenize(query);
    if (!qTokens.length) return 0;
    var hay = tokenize(item.title + ' ' + item.excerpt + ' ' + item.keywords.join(' '));
    var hitCount = 0;
    qTokens.forEach(function (qt) {
      hay.forEach(function (h) {
        if (h === qt) hitCount++;
        else if (qt.length >= 4 && h.length >= 4 && (h.indexOf(qt) === 0 || qt.indexOf(h) === 0)) hitCount += 0.5;
      });
      item.keywords.forEach(function (k) {
        if (tokenize(k).indexOf(qt) !== -1) hitCount += 2; // keyword word match weighs more
      });
    });
    return hitCount;
  }

  /** Returns the best-matching content item, or null if nothing clears the bar. */
  function search(query) {
    var best = null, bestScore = 0;
    pages.forEach(function (item) {
      var s = score(query, item);
      if (s > bestScore) { bestScore = s; best = item; }
    });
    // Require some real signal, so a vague or off-topic question falls through
    // to the "talk to an architect" standard line instead of a weak guess.
    if (bestScore < 2) return null;
    return best;
  }

  return { pages: pages, search: search };
})();
