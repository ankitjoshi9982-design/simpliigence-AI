"""Build the static preview site (preview/) and the SEO data shared with the WordPress theme."""
import re, os, sys, json, html as H, shutil
sys.path.insert(0, os.path.dirname(__file__))
from chrome import header, footer
from icons import ico
from sitecfg import PAGES, DOMAIN, ORG

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "preview")
ORG["description"] = ("Next-generation AI platform and modern automation platform for the future of business automation. "
                      + PAGES["home"][4])

def render_icons(s):
    return re.sub(r"\{\{i:([a-z]+)\}\}", lambda m: ico(m.group(1)), s)

def text(s):
    s = re.sub(r"\{\{i:\w+\}\}", "", s)
    s = re.sub(r"<span class=\"pm\"></span>", "", s)
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", H.unescape(s)).strip()

def faqs(content):
    """FAQ / guide Q&A pairs exactly as rendered on the page."""
    out = []
    for q, a in re.findall(r"<details[^>]*><summary>(.*?)</summary><div class=\"a\">(.*?)</div></details>", content, re.S):
        out.append({"q": text(q), "a": text(a)})
    # Resources: the first guide is rendered as the section heading + lead
    m = re.search(r'<h2 class="h2">(What is an AI automation platform\?)</h2><p class="lead">(.*?)</p>', content)
    if m: out.insert(0, {"q": text(m.group(1)), "a": text(m.group(2))})
    return out

def h1(content):
    return text(re.search(r"<h1[^>]*>(.*?)</h1>", content, re.S).group(1))

def seo(slug):
    url, key, label, title, meta, kw = PAGES[slug]
    content = open(os.path.join(ROOT, "content", slug + ".html")).read()
    full = DOMAIN + url
    graph = [
      {"@type": "Organization", "@id": DOMAIN + "/#org", "name": ORG["name"], "url": DOMAIN + "/",
       "logo": DOMAIN + "/wp-content/themes/simpliigence-ai/assets/img/logo-white.png",
       "email": ORG["email"], "slogan": ORG["slogan"], "description": ORG["description"],
       "parentOrganization": {"@type": "Organization", "name": ORG["parent"]},
       "contactPoint": {"@type": "ContactPoint", "email": ORG["email"], "contactType": "sales"},
       "address": {"@type": "PostalAddress", "addressRegion": "NJ", "addressCountry": "US"},
       "areaServed": ["US", "CA", "GB", "NL", "IN"]},
      {"@type": "WebSite", "@id": DOMAIN + "/#website", "url": DOMAIN + "/", "name": ORG["name"], "publisher": {"@id": DOMAIN + "/#org"}, "inLanguage": "en"},
      {"@type": "WebPage", "@id": full + "#webpage", "url": full, "name": title, "description": meta,
       "isPartOf": {"@id": DOMAIN + "/#website"}, "about": {"@id": DOMAIN + "/#org"}, "inLanguage": "en", "keywords": kw},
    ]
    if slug != "home":
        graph.append({"@type": "BreadcrumbList", "@id": full + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"},
            {"@type": "ListItem", "position": 2, "name": label, "item": full}]})
    if slug in ("ai", "automation", "agents"):
        graph.append({"@type": "Service", "name": text(re.search(r'<span class="pill"><span class="dot"></span>(.*?)</span>', content).group(1)),
                      "description": meta, "provider": {"@id": DOMAIN + "/#org"}, "url": full})
    f = faqs(content)
    if f:
        graph.append({"@type": "FAQPage", "@id": full + "#faq", "mainEntity": [
            {"@type": "Question", "name": x["q"], "acceptedAnswer": {"@type": "Answer", "text": x["a"]}} for x in f]})
    return {"slug": slug, "url": url, "label": label, "title": title, "meta": meta, "keyword": kw,
            "h1": h1(content), "faq": f, "graph": graph}

def head_tags(s, base):
    full = DOMAIN + s["url"]
    t, m = H.escape(s["title"]), H.escape(s["meta"])
    return (f'<title>{t}</title><meta name="description" content="{m}"><link rel="canonical" href="{full}">'
            f'<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">'
            f'<meta property="og:type" content="website"><meta property="og:site_name" content="Simpliigence AI"><meta property="og:title" content="{t}">'
            f'<meta property="og:description" content="{m}"><meta property="og:url" content="{full}"><meta property="og:image" content="{DOMAIN}/wp-content/themes/simpliigence-ai/assets/img/og.png"><meta property="og:image:alt" content="Simpliigence AI, a next-generation AI platform and modern automation platform for the future of business automation">'
            f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{t}"><meta name="twitter:description" content="{m}">'
            f'<link rel="icon" href="{base}assets/img/favicon.ico" sizes="any"><link rel="icon" href="{base}assets/img/favicon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="{base}assets/img/apple-touch-icon.png">'
            f'<script type="application/ld+json">{json.dumps({"@context": "https://schema.org", "@graph": s["graph"]}, ensure_ascii=False)}</script>')

SYN = {  # extra search words people use for a section (search only, never shown)
    "leadership": ["ceo", "founder", "leadership", "leaders", "management", "raghu", "arjun", "vivin"],
    "where-we-are": ["offices", "office", "locations", "located", "headquarters", "based", "where are you"],
    "outcomes-we-measure-with-you": ["roi", "measure", "return", "kpis", "metrics"],
    "sound-familiar": ["manual", "spreadsheets", "copy paste"],
    "how-we-deliver": ["time zones", "delivery model", "follow the sun", "cover"],
    "plans": ["plans", "starter", "growth", "scale", "how many agents"],
    "the-bench-behind-every-build": ["certifications", "team size", "how many people", "awards"],
    "results": ["case studies", "case study", "results", "proof", "real result", "show me a real result"],
    "how-it-works": ["process", "steps"],
    "engagement": ["engagement", "health check", "discovery sprint", "pilot", "concierge"],
}

def slugify(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")[:48]

def sections(slug):
    """Processed page content: icons rendered, every section given a stable id. Returns (html, [section dicts])."""
    src = open(os.path.join(ROOT, "content", slug + ".html")).read()
    used, secs = set(), []
    def tag(m):
        open_tag, inner = m.group(1), m.group(2)
        idm = re.search(r'id="([^"]+)"', open_tag)
        h = re.search(r"<h[12][^>]*>(.*?)</h[12]>", inner, re.S)
        e = re.search(r'<span class="eyebrow">(.*?)</span>', inner, re.S)
        title = text(h.group(1)) if h else (text(e.group(1)) if e else "")
        sid = idm.group(1) if idm else slugify(text(e.group(1)) if e else title or "section")
        while sid in used: sid += "-2"
        used.add(sid)
        if not idm: open_tag = open_tag[:-1] + f' id="{sid}">'
        body = re.sub(r"<details.*?</details>", " ", inner, flags=re.S)       # FAQs are their own entries
        body = re.sub(r"<(button|nav|svg|canvas)[^>]*>.*?</\1>", " ", body, flags=re.S)
        body = re.sub(r'<[^>]*aria-hidden="true"[^>]*>.*?</(div|span)>', " ", body, flags=re.S)
        if 'class="cta' in inner or 'data-cform' in inner: return open_tag + inner + "</section>"
        secs.append({"id": sid, "title": title, "eyebrow": text(e.group(1)) if e else "", "body": text(re.sub(r"\{\{i:\w+\}\}", "", re.sub(r"<", " <", body)))})
        return open_tag + inner + "</section>"
    out = re.sub(r"(<section[^>]*>)(.*?)</section>", tag, src, flags=re.S)
    return out, secs

def build(slug, S):
    url, key = PAGES[slug][0], PAGES[slug][1]
    depth = 0 if url == "/" else url.strip("/").count("/") + 1
    base = "../" * depth if depth else "./"
    body = render_icons(sections(slug)[0])
    def fix(m):
        p = m.group(2); q = frag = ""
        if "#" in p: p, frag = p.split("#", 1); frag = "#" + frag
        if "?" in p: p, q = p.split("?", 1); q = "?" + q
        rel = base + (p.strip("/") + "/index.html" if p.strip("/") else "index.html")
        return f'{m.group(1)}="{rel}{q}{frag}"'
    page = f'''<!doctype html><html lang="en" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
{head_tags(S, base)}<meta name="theme-color" content="#010204">
<link rel="preload" href="{base}assets/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{base}assets/css/sgai.css"></head><body data-sg-page="{key}">
{header(url, "")}{body}{footer("")}
<script>window.SGAI={{staticBase:"{base}",contactUrl:"{base}contact/index.html"}};</script><script src="{base}assets/js/sg-kb.js" defer></script><script src="{base}assets/js/sg-content.js" defer></script><script src="{base}assets/js/sgai.js" defer></script><script src="{base}assets/js/sg-tools.js" defer></script></body></html>'''
    page = re.sub(r'(href)="(/[^"]*)"', fix, page)
    page = page.replace('src="assets/', f'src="{base}assets/')
    d = OUT if depth == 0 else os.path.join(OUT, url.strip("/"))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(page)

def llms(seos):
    home = seos["home"]
    lines = ["# Simpliigence AI", "", "> " + home["meta"], "",
             "Simpliigence AI helps teams prioritise, scale, reach value sooner and keep AI tied to business outcomes, using the platforms they already have. "
             "Three ways in: AI Agents (AgentBox) for growing businesses, Automation (Outcome-as-a-Service) for mid-market teams, and Simpliigence AI (Bring Your Own Intelligence) for enterprises.",
             "", "## Pages"]
    for s in seos.values():
        lines.append(f"- [{s['label']}]({DOMAIN}{s['url']}): {s['meta']}")
    lines += ["", "## Notes for AI assistants and search tools",
              "- Client names are not published; results are described by industry and country.",
              "- Pricing is not published; pricing questions go to a Solution Architect via the Contact page.",
              f"- Contact: {ORG['email']} · " + " · ".join(ORG["locations"]),
              f"- Full question-and-answer text: {DOMAIN}/llms-full.txt"]
    full = ["# Simpliigence AI — full reference", "", "> " + home["meta"], ""]
    for s in seos.values():
        full += [f"## {s['label']} ({DOMAIN}{s['url']})", "", s["meta"], "", f"Headline: {s['h1']}", ""]
        for x in s["faq"]:
            full += [f"### {x['q']}", x["a"], ""]
    return "\n".join(lines) + "\n", "\n".join(full) + "\n"

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    if os.path.exists(os.path.join(OUT, "assets")): shutil.rmtree(os.path.join(OUT, "assets"))
    shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(OUT, "assets"))
    seos = {s: seo(s) for s in PAGES}
    for s in (sys.argv[1:] or PAGES): build(s, seos[s])
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    json.dump(seos, open(os.path.join(ROOT, "data", "seo.json"), "w"), ensure_ascii=False, indent=1)
    a, b = llms(seos)
    open(os.path.join(OUT, "llms.txt"), "w").write(a); open(os.path.join(OUT, "llms-full.txt"), "w").write(b)
    open(os.path.join(ROOT, "data", "llms.txt"), "w").write(a); open(os.path.join(ROOT, "data", "llms-full.txt"), "w").write(b)
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += [f"<url><loc>{DOMAIN}{s['url']}</loc><changefreq>monthly</changefreq><priority>{'1.0' if s['url']=='/' else '0.8'}</priority></url>" for s in seos.values()]
    open(os.path.join(OUT, "sitemap.xml"), "w").write("\n".join(sm + ["</urlset>"]) + "\n")
    open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n")
    kb = []
    ind = open(os.path.join(ROOT, "content", "industries.html")).read()
    for art in re.findall(r'<article class="card ind.*?</article>', ind, re.S):
        name = text(re.search(r"<h3>(.*?)</h3>", art).group(1))
        dd = [text(x) for x in re.findall(r"<dd[^>]*>(.*?)</dd>", art, re.S)]
        case = re.search(r'<p class="strip-case">(.*?)</p>', art, re.S)
        ex = f"{name}. Challenges we solve: {dd[0]}. How we solve it: {dd[1]}. Recommended agent: {dd[2]}." + (f" {text(case.group(1))}." if case else "")
        kb.append({"title": "Industries — " + name, "url": "/industries/", "excerpt": ex, "keywords": [name.lower(), name.lower() + " industry", "automate first in " + name.lower()]})
    for slug, rx, kws in (("agents", r'<article class="card lib[^"]*"><span class="ci">.*?</span><h3>(.*?)</h3><p>(.*?)</p>', "agents"),):
        for t, d in re.findall(rx, open(os.path.join(ROOT, "content", slug + ".html")).read(), re.S):
            kb.append({"title": "AI Agents — " + text(t), "url": "/agents/#library", "excerpt": text(t) + " " + text(d), "keywords": [text(t).rstrip(".").lower() + " agents", text(t).rstrip(".").lower()]})
    au = open(os.path.join(ROOT, "content", "automation.html")).read()
    mv = " ".join(text(t) + " " + text(d) for t, d in re.findall(r'<article class="card move[^"]*"><span class="ci">.*?</span><h3>(.*?)</h3><p>(.*?)</p>', au, re.S))
    kb.append({"title": "Automation — What we move", "url": "/automation/", "excerpt": mv, "keywords": ["kpis can you move", "kpi", "kpis", "what we move", "metrics"]})
    kb.append({"title": "Simpliigence AI — Copilot", "url": "/ai/", "excerpt": "You already license Claude, Copilot or Agentforce. We turn it into agents that run in production, inside your tenant and your region, and we're paid at each gate they pass.", "keywords": ["put copilot to real work", "copilot", "copilot licence", "copilot license", "licence"]})
    EXTRA = {  # extra search words for specific entries (never shown)
        "Industries — Staffing": ["recruitment", "recruiting", "hiring", "candidates"],
        "Industries — Payments": ["bank", "banks", "banking", "fintech"],
        "Industries — Financial services": ["bank", "banks", "banking", "insurance", "lending"],
        "AI Agents — Customer support.": ["customer service", "emails", "email", "helpdesk"],
        "AI Agents — Finance.": ["invoicing", "invoices", "accounts receivable", "reconciliation"],
        "AI Agents — HR.": ["human resources", "new hires", "employees"],
        "AI Agents — Which tools do the agents work with?": ["integrate", "integration", "integrations", "connect", "connectors", "work with"],
        "Home — How fast can we go live?": ["how quickly can we start", "start", "timeline", "how long"],
    }
    os.makedirs(os.path.join(ROOT, "data", "content"), exist_ok=True)
    for slug, x in seos.items():
        html_, secs = sections(slug)
        open(os.path.join(ROOT, "data", "content", slug + ".html"), "w").write(render_icons(html_))
        for sc in secs:
            if not sc["body"] or len(sc["body"]) < 40 or not (sc["title"] or sc["eyebrow"]): continue
            b = sc["body"]
            for lead in (sc["eyebrow"], sc["title"]):
                if lead and b.startswith(lead): b = b[len(lead):].strip()
            sents = re.split(r"(?<=[.?!])\s+", b)
            ex = ""
            for t in sents:
                if len(ex) + len(t) > 320 and ex: break
                ex = (ex + " " + t).strip()
            kb.append({"title": x["label"] + " — " + (sc["title"] or sc["eyebrow"]), "url": x["url"] + "#" + sc["id"], "excerpt": ex,
                       "body": sc["body"], "keywords": ([sc["eyebrow"].lower()] if sc["eyebrow"] else []) + SYN.get(sc["id"], []), "section": sc["title"] or sc["eyebrow"], "page": slug, "weight": 0.75 if sc is secs[0] else 1})
    for x in seos.values():
        for f in x["faq"]:
            kb.append({"title": x["label"] + " — " + f["q"], "url": x["url"] + ("#guides" if x["slug"] == "resources" else "#faq"), "excerpt": f["a"], "keywords": [f["q"].rstrip("?").lower(), x["keyword"].lower()]})
    for e in kb: e["keywords"] = e.get("keywords", []) + EXTRA.get(e["title"], [])
    open(os.path.join(ROOT, "assets", "js", "sg-kb.js"), "w").write("window.SG_KB=" + json.dumps(kb, ensure_ascii=False) + ";\n")
    shutil.copy(os.path.join(ROOT, "assets", "js", "sg-kb.js"), os.path.join(OUT, "assets", "js", "sg-kb.js"))
    print("built", len(PAGES), "pages;", sum(len(s["faq"]) for s in seos.values()), "FAQ entries")
