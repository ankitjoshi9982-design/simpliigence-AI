# Simpliigence AI — WordPress install steps

What's in this folder:
- `simpliigence-ai-theme.zip` — the theme (Elementor-compatible, no page-builder bloat in the rendered HTML)
- `simpliigence-ai-pages.wxr.xml` — the 9 pages, pre-filled with the approved copy and Yoast SEO title/description
- `llms.txt` — static fallback (the theme also serves this live automatically once active)
- `sitemap-fallback.xml` — static fallback only, until Yoast's own sitemap takes over

I don't have access to your WordPress server, so these are files for you (or your host/dev) to upload — I can't do this last step myself.

## 1. Install WordPress on GoDaddy
If it isn't already: GoDaddy's one-click WordPress installer, or a manual install on your hosting plan. Point your domain at it.

## 2. Install plugins
In **Plugins → Add New**, install and activate:
- **Yoast SEO**
- **WordPress Importer** (under Tools → Import, WordPress will prompt you to install this if it's missing)
- **Elementor** (free version is enough — the theme supports it; pages are built as regular WordPress content, so Elementor can open and edit them)

## 3. Install the theme
**Appearance → Themes → Add New → Upload Theme** → choose `simpliigence-ai-theme.zip` → Install → Activate.

## 4. Import the 9 pages
**Tools → Import → WordPress** → upload `simpliigence-ai-pages.wxr.xml` → when asked to assign an author, map everything to your own admin user → **do not** import attachments (there are none) → run the import.

This creates all 9 pages (Home, ai, automation, agents, industries, resources, tools, company, contact) with the approved copy already in place, and with the Yoast title/meta description pre-filled, matching the keyword map in the document.

## 5. Set the homepage
**Settings → Reading** → Static page → set **Homepage** to the "Home" page you just imported.

## 6. Check permalinks
**Settings → Permalinks** → choose **Post name** → Save (this is what makes the URLs come out as `/ai/`, `/automation/`, etc., matching the approved URL list).

## 7. Yoast setup
- **Yoast SEO → General** → run the first-time configuration wizard (site type: Organization; add your logo).
- **Yoast SEO → Search Appearance** → confirm Organization schema details (name, logo, social profiles).
- Yoast will generate `/sitemap_index.xml` automatically — once that's live, you can delete `sitemap-fallback.xml`; don't need to upload it unless you want interim coverage before Yoast is configured.

## 8. FAQ schema
Already handled — the theme adds FAQPage structured data in the page `<head>` automatically on every page that has an FAQ (ai, automation, agents, industries, resources, tools, and the Home page), built from the same FAQ text that's visible on the page, so they can never drift apart.

## 9. llms.txt
Already handled — once the theme is active, `yourdomain.com/llms.txt` is served automatically. The `llms.txt` file in this folder is only a backup copy in case your host prefers an uploaded file; if you do upload it, edit the domain inside it first (it currently says `simpliigence.ai`).

## 10. Leads
Contact-form and assistant leads are saved in **wp-admin → Leads** (a simple private list) and also emailed to **hello@simpliigence.ai** via `wp_mail()`. On most hosts, outgoing `wp_mail()` is unreliable without SMTP, so also install a free SMTP plugin (e.g. **WP Mail SMTP**) and connect it to a real mailbox — until then, leads are still saved and visible in wp-admin even if the email doesn't arrive.

## 11. Speed (target: 90+ on PageSpeed, mobile and desktop)
The theme itself is light — no page-builder markup bloat, deferred JS, no emoji scripts, preconnected fonts. To get to 90+ you'll also need, on the hosting side:
- A caching plugin (e.g. **WP Super Cache** or whatever GoDaddy's managed WordPress plan includes built in)
- Image compression (e.g. **ShortPixel** or **Imagify**) — matters most once you add real photography; the current logo/placeholder assets are already small
- GoDaddy's own CDN/caching layer, if your plan includes one, turned on

## 12. Open items (same list as the approved document, pending your manager's sign-off)
These were left exactly as the approved document specified — I did not guess or fill these in on my own:
- Agent count: copy says 36 (per the document); your current agent-library content isn't part of this import and still needs the agents themselves built out to match.
- Industries: copy uses the document's 9 (drops the content file's 10th — which one to keep is still open).
- Live engagement count: copy uses 7 (per the document).
- Arjun Ahlawat's and Vivin Deshpande's bios: as written in the document — background not yet confirmed.
- "Anthropic partner" wording and platform logos: not shown on the site pending approval.
- Raghu's bio still names Disney, GE, Stryker, Carrier, Emerson and American Express — this sits oddly next to the document's own "no client names" rule; flagged for your manager, not changed on my own.

## What I deliberately did NOT change
Every word of body copy, every heading and every FAQ answer is verbatim from the approved document. Internal notes ("Note for team", "Web team" instructions, "Background to confirm" brackets) are not shown anywhere on the site. Client names, pricing, the Lyzr partnership, delivery-partner names and Raghu's direct phone/email are not published anywhere — contact routes only to hello@simpliigence.ai, as specified.
