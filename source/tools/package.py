"""Package the WordPress theme: dist/simpliigence-ai.zip"""
import os, sys, shutil, json, subprocess, zipfile
sys.path.insert(0, os.path.dirname(__file__))
from chrome import header, footer
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist"); T = os.path.join(DIST, "simpliigence-ai")
if os.path.exists(T): shutil.rmtree(T)
shutil.copytree(os.path.join(ROOT, "theme-src"), T)
shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(T, "assets"), ignore=shutil.ignore_patterns("sg-kb.js"))
D = os.path.join(T, "data"); os.makedirs(os.path.join(D, "content"))
for f in ("seo.json", "llms.txt", "llms-full.txt"): shutil.copy(os.path.join(ROOT, "data", f), D)
for f in os.listdir(os.path.join(ROOT, "data", "content")): shutil.copy(os.path.join(ROOT, "data", "content", f), os.path.join(D, "content"))
open(os.path.join(D, "header.html"), "w").write(header(None, ""))
open(os.path.join(D, "footer.html"), "w").write(footer(""))
kb = subprocess.check_output(["node", "-e", "global.window={};require('./assets/js/sg-kb.js');require('./assets/js/sg-content.js');process.stdout.write(JSON.stringify(window.SG_CONTENT.pages))"], cwd=ROOT)
rows = json.loads(kb); json.dump(rows, open(os.path.join(D, "kb.json"), "w"), ensure_ascii=False)
for f in ("screenshot.png",):
    if os.path.exists(os.path.join(ROOT, "tools", f)): shutil.copy(os.path.join(ROOT, "tools", f), T)
open(os.path.join(T, "style.css"), "w").write("""/*
Theme Name: Simpliigence AI
Theme URI: https://simpliigence.ai
Author: Simpliigence
Description: Dark AI-assistant website for Simpliigence AI. Nine designed pages from the approved copy, AI assistant backed by a Knowledge Base, lead capture, FAQ schema, llms.txt. Activate, then see Appearance → Simpliigence AI.
Version: 2.0.0
Requires at least: 6.2
Requires PHP: 7.4
License: Proprietary
Text Domain: simpliigence-ai
*/
""")
z = os.path.join(DIST, "simpliigence-ai-theme-v2.0.0.zip")
if os.path.exists(z): os.remove(z)
with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
    for base, _, files in os.walk(T):
        for f in files:
            p = os.path.join(base, f); zf.write(p, os.path.relpath(p, DIST))
print(z, os.path.getsize(z) // 1024, "KB;", len(rows), "knowledge entries")
