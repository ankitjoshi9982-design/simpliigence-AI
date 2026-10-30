# Simpliigence AI — website (v2)

Dark AI-assistant website for [simpliigence.ai](https://simpliigence.ai), built from the approved copy
(*Simpliigence_AI_Website_Copy_GTM_rewrite_2*). WordPress theme with nine designed pages, an AI assistant
backed by a Knowledge Base, chat history, lead capture, FAQ schema and `llms.txt`.

**Preview:** https://ankitjoshi9982-design.github.io/simpliigence-AI/ (static; saving leads and chats needs WordPress)

| Path | What it is |
| --- | --- |
| `wordpress/simpliigence-ai-theme-v2.0.0.zip` | Upload in WordPress → Appearance → Themes → Add New → Upload. Activating it creates the 9 pages. |
| `simpliigence-ai/` | The same theme, unzipped (PHP, assets, data) |
| `INSTALL.md` | Install steps and where everything lives in wp-admin |
| `wordpress/llms.txt`, `llms-full.txt` | Copies of the AI-search files the theme serves live |
| `source/` | Build sources: page content (`content/`), CSS/JS/fonts (`assets/`), theme PHP (`theme-src/`), build scripts (`tools/`) |

## In wp-admin after install
- **Appearance → Simpliigence AI** — install/update pages (edited pages are never overwritten unless you tick the box)
- **Knowledge Base** — every section and FAQ from the approved copy; the assistant answers from these
- **Chat History** — every assistant conversation, plus **Unanswered questions**
- **Agent Library** — add the 36 agents; the AI Agents page and the assistant use them
- **Case Studies** — linked from the Resources results table
- **Leads** — contact form, assistant and tool sign-ups (emailed to hello@simpliigence.ai once SMTP is set)

## Rebuild after editing `source/`
```bash
cd source
python3 tools/build.py     # static preview in source/preview/ + SEO data, llms.txt, knowledge base
python3 tools/package.py   # theme zip in source/dist/
```
Requires Python 3 and Node (for packaging the knowledge base).
