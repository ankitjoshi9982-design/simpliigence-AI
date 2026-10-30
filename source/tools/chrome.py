from icons import sprite, ico

NAV = [
 ("Home", "/", None),
 ("Platform", None, [
   ("Simpliigence AI", "/ai/", "layers", "Bring Your Own Intelligence · If you're an enterprise"),
   ("Automation", "/automation/", "flow", "Outcome-as-a-Service · If you're a mid-market team"),
   ("AI Agents", "/agents/", "bot", "AgentBox · If you're a growing business"),
 ]),
 ("Industries", "/industries/", None),
 ("Resources", "/resources/", None),
 ("Tools", "/tools/", None),
 ("Company", None, [
   ("About", "/company/", "building", "Who we are, how we deliver and the team behind every build."),
   ("Contact", "/contact/", "mail", "hello@simpliigence.ai"),
 ]),
]

def header(page, base):
    def u(p): return base + p.lstrip("/") if base else p
    items = []
    for label, href, sub in NAV:
        if sub:
            dd = "".join(
              f'<a href="{u(h)}"><span class="di">{ico(ic)}</span><span><strong>{l}</strong><span>{d}</span></span></a>'
              for l, h, ic, d in sub)
            items.append(f'<li><a href="{u(sub[0][1])}" aria-haspopup="true">{label}{ico("chev","ico chev")}</a><div class="dd">{dd}</div></li>')
        else:
            cur = ' aria-current="page"' if href == page else ""
            items.append(f'<li><a href="{u(href)}"{cur}>{label}</a></li>')
    sheet_links = []
    for label, href, sub in NAV:
        if sub:
            for l, h, ic, d in sub:
                sheet_links.append(f'<a href="{u(h)}"><span>{l}<small>{d}</small></span>{ico("arrow")}</a>')
        else:
            sheet_links.append(f'<a href="{u(href)}"><span>{label}</span>{ico("arrow")}</a>')
    hc = u("/contact/?type=Book+an+AI+Health+Check")
    ta = u("/contact/?type=Talk+to+an+Architect")
    return f'''{sprite()}<a class="skip" href="#main">Skip to content</a><div class="ambient" aria-hidden="true"></div>
<header class="hdr" id="hdr"><div class="wrap hdr-in">
<a class="brand" href="{u('/')}" aria-label="Simpliigence AI home"><img src="{base}assets/img/logo-white.png" alt="Simpliigence" width="160" height="30"><span class="ai">AI</span></a>
<nav aria-label="Main"><ul class="nav">{''.join(items)}</ul></nav>
<div class="hdr-cta"><a class="btn btn-sm" href="{ta}">Talk to an Architect</a><a class="btn btn-primary btn-sm" href="{hc}">Book an AI Health Check</a>
<button class="burger" id="burger" aria-label="Open menu" aria-expanded="false">{ico("menu")}</button></div>
</div></header>
<div class="sheet" id="sheet" aria-hidden="true"><div class="sheet-top"><a class="brand" href="{u('/')}"><img src="{base}assets/img/logo-white.png" alt="Simpliigence" width="160" height="30"><span class="ai">AI</span></a><button class="burger" style="display:grid" id="sheetX" aria-label="Close menu">{ico("x")}</button></div>
<nav aria-label="Mobile">{''.join(sheet_links)}</nav>
<div class="btn-row"><a class="btn btn-primary" href="{hc}">Book an AI Health Check{ico("arrow")}</a><a class="btn" href="{ta}">Talk to an Architect</a></div></div>
<main id="main">'''

def footer(base):
    def u(p): return base + p.lstrip("/") if base else p
    return f'''</main>
<footer class="ftr"><div class="wrap">
<div class="ftr-grid">
<div class="ftr-brand"><a class="brand" href="{u('/')}"><img src="{base}assets/img/logo-white.png" alt="Simpliigence" width="160" height="30"><span class="ai">AI</span></a>
<p>Outcomes, by design.</p>
<a class="ftr-mail" href="mailto:hello@simpliigence.ai">{ico("mail")}hello@simpliigence.ai</a>
<p class="muted" style="margin-top:10px;font-size:15px">New Jersey · Toronto · London · Netherlands · Bangalore</p></div>
<div><h4>Ways in</h4><ul><li><a href="{u('/ai/')}">Simpliigence AI</a></li><li><a href="{u('/automation/')}">Simpliigence Automation</a></li><li><a href="{u('/agents/')}">AI Agents</a></li></ul></div>
<div><h4>Explore</h4><ul><li><a href="{u('/industries/')}">Industries</a></li><li><a href="{u('/resources/')}">Resources</a></li><li><a href="{u('/tools/')}">Tools</a></li></ul></div>
<div><h4>Company</h4><ul><li><a href="{u('/company/')}">About</a></li><li><a href="{u('/contact/')}">Contact</a></li><li><a href="{u('/contact/?type=Book+an+AI+Health+Check')}">Book an AI Health Check</a></li></ul></div>
</div>
<div class="ftr-bot"><span>&copy; 2026 Simpliigence AI &middot; simpliigence.ai &middot; All rights reserved.</span></div>
</div></footer>
<button class="fab" id="fab" aria-controls="ai" aria-expanded="false"><span class="o"></span><span class="fab-t">Ask our assistant</span></button>
<div class="aix" id="ai" role="dialog" aria-modal="true" aria-label="Simpliigence AI assistant" hidden>
<aside class="ai-rail">
<a class="brand" href="{u('/')}"><img src="{base}assets/img/logo-white.png" alt="Simpliigence" width="160" height="30"><span class="ai">AI</span></a>
<button class="ai-new" type="button" data-new>{ico("spark")}New chat</button>
<div class="ai-rail-chips" data-chips></div>
<div class="ai-rail-foot"><a class="btn btn-primary btn-sm" href="{u('/contact/?type=Book+an+AI+Health+Check')}">Book an AI Health Check</a><a class="btn btn-sm" href="{u('/contact/?type=Talk+to+an+Architect')}">Talk to an Architect</a>
</div>
</aside>
<section class="ai-main">
<header class="ai-top"><span class="ai-av" aria-hidden="true"></span><div><b>Simpliigence AI assistant</b><span>Answers from our own content. A person is one click away.</span></div>
<button class="ai-icon ai-new-m" type="button" data-new aria-label="New chat">{ico("refresh")}</button><button class="ai-icon" type="button" data-close aria-label="Close assistant">{ico("x")}</button></header>
<div class="ai-scroll" data-scroll><div class="ai-thread" data-log aria-live="polite">
<div class="ai-hello" data-hello><div class="ai-orb" aria-hidden="true"></div><p class="ai-hello-t">Hi, I can tell you how we’d approach a process, which agents might fit, and what results we’ve seen. <b>What’s taking up your team’s time?</b></p><div class="ai-starters" data-starters></div></div>
</div></div>
<form class="ai-composer" data-form><textarea name="q" rows="1" placeholder="Ask about a process you'd like to fix" aria-label="Ask about a process you'd like to fix"></textarea><button class="ai-send" aria-label="Send">{ico("send")}</button></form>
<p class="asst-priv ai-priv">Chats are stored to improve our answers. See our <a href="{u('/privacy/')}">privacy notice</a>.</p>
</section>
</div>'''
