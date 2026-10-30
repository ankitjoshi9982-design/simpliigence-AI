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
<button class="fab" id="fab" aria-controls="drawer" aria-expanded="false"><span class="o"></span><span class="fab-t">Ask our assistant</span></button>
<div class="drawer" id="drawer" role="dialog" aria-label="Simpliigence AI assistant"><div class="asst" data-asst>
<button class="x" id="drawerX" aria-label="Close assistant">{ico("x")}</button>
<div class="asst-hd"><b>Simpliigence AI assistant</b></div>
<p class="asst-sub">Answers from our own content. A person is one click away.</p>
<div class="asst-log" data-log></div><div class="chips" data-chips></div>
<form class="asst-in" data-form><input name="q" placeholder="Ask about a process you'd like to fix" aria-label="Ask the assistant" autocomplete="off"><button aria-label="Send">{ico("send")}</button></form>
<p class="asst-priv">Chats are stored to improve our answers. See our <a href="{u('/privacy/')}">privacy notice</a>.</p>
</div></div>'''
