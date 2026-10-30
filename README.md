# Simpliigence AI — website

WordPress theme and content for [simpliigence.ai](https://simpliigence.ai).

| Path | What it is |
| --- | --- |
| `simpliigence-ai/` | Theme source (PHP templates, `style.css`, JS, schema, leads, `llms.txt` route) |
| `wordpress/simpliigence-ai-theme.zip` | Ready-to-upload theme package (Appearance → Themes → Upload) |
| `wordpress/simpliigence-ai-pages.wxr.xml` | The 9 pages with approved copy and Yoast SEO meta (Tools → Import → WordPress) |
| `wordpress/llms.txt` | Static fallback; the theme serves `/llms.txt` live once active |
| `wordpress/sitemap-fallback.xml` | Stopgap sitemap until Yoast's `/sitemap_index.xml` is live |
| `INSTALL.md` | Step-by-step install on GoDaddy WordPress, plus open items |

To rebuild the theme zip after editing the source:

```bash
zip -r wordpress/simpliigence-ai-theme.zip simpliigence-ai
```

## Preview

A static preview of the 9 pages is hosted on GitHub Pages at
https://ankitjoshi9982-design.github.io/simpliigence-AI/ (built from the `gh-pages` branch).
Forms and the assistant can't save leads there, since that needs WordPress. To rebuild it:

```bash
python3 scripts/build_preview.py . _site /simpliigence-AI
```
