# Simpliigence AI website: install guide (theme v2.0.0)

## Install
1. WordPress admin → Appearance → Themes → Add New → Upload Theme → choose `simpliigence-ai-theme-v2.0.0.zip` → Install → Activate.
2. On activation the theme creates the 9 pages (Home, Simpliigence AI, Automation, AI Agents, Industries, Resources, Tools, Company, Contact), sets Home as the front page, switches permalinks to /page-name/ if needed, and fills the assistant's Knowledge Base.
3. Settings → Privacy → choose or create your Privacy Policy page and publish it. Every "privacy notice" link on the site then points to it.
4. SMTP (WP Mail SMTP or your host's mail) so leads are emailed to hello@simpliigence.ai. Leads are always saved in wp-admin → Leads, even before SMTP is set up.
5. Optional: Yoast SEO or Rank Math. The approved title, meta description and focus keyword are already written into both plugins' fields for every page.

## Where things are
- **Appearance → Simpliigence AI**: install or update pages and check status. Pages edited in WordPress are never overwritten unless you tick the box.
- **Knowledge Base**: every section and FAQ from the approved copy (118 entries). The assistant searches these, including questions worded differently (related words, small typos), and shows up to two related links under its answer. Edit an entry, or add a new one; it is live within seconds. Edited entries are never overwritten by theme updates.
- **Leads**: everything from the contact form, the assistant and the tools. Leads from the chat link to their conversation.
- **Chat History**: every assistant conversation, saved in the site's database (the chat's privacy line says chats are stored). Open one to read it in full. **Unanswered questions** lists what visitors asked that the Knowledge Base couldn't answer; click "Add answer" to create the entry. Chats older than 12 months are deleted automatically (change it at the bottom of Chat History).
- **Agent Library**: add each agent (name, team, one line, tools). As soon as one is published, the AI Agents page shows the real library with team filters and "Ask about this agent" buttons, and the assistant can answer about it. Until then the page shows the six approved team cards.
- **Case Studies**: add a case study (problem, what we built, result, approved quote) and pick its results-table row; that row on Resources becomes a link to it. No client names.
- **/llms.txt** and **/llms-full.txt**: AI-search summaries, served automatically.
- Schema: Organization, WebSite, WebPage, BreadcrumbList, Service (offering pages) and FAQPage on every page with an FAQ.

## Editing pages
The pages are custom-designed HTML. Change wording in the page editor's Code view, or ask for an update. Pages you build yourself with Elementor or the block editor get the same header, footer and assistant automatically.

## Do not
- Change DNS or MX records.
- Tick "Also replace pages that were edited" unless you want to discard your team's page edits.
