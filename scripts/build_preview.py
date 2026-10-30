"""Render the WXR pages through the theme's header/footer into a static site."""
import html, re, shutil, sys, os
import xml.etree.ElementTree as ET

repo, out, base = sys.argv[1], sys.argv[2], sys.argv[3]
theme = os.path.join(repo, 'simpliigence-ai')
ns = {'content': 'http://purl.org/rss/1.0/modules/content/', 'wp': 'http://wordpress.org/export/1.2/'}
root = ET.parse(os.path.join(repo, 'wordpress/simpliigence-ai-pages.wxr.xml')).getroot()

def php_part(path, start, end=None):
    s = open(path).read()
    s = s[s.index(start):] if start else s
    return s[:s.index(end)] if end else s

header = php_part(os.path.join(theme, 'header.php'), '<div class="ambient"')
footer = php_part(os.path.join(theme, 'footer.php'), '</main>', '<?php wp_footer')

def render_php(s, slug):
    s = re.sub(r"<\?php echo esc_url\( home_url\( '([^']*)' \) \); \?>", lambda m: base + m.group(1), s)
    s = re.sub(r"<\?php echo esc_url\( get_template_directory_uri\(\) \. '([^']*)' \); \?>", lambda m: base + '/theme' + m.group(1), s)
    s = s.replace("<?php echo is_front_page() ? 'active' : ''; ?>", 'active' if slug == 'home' else '')
    s = re.sub(r"<\?php echo is_page\( '([^']*)' \) \? 'active' : ''; \?>", lambda m: 'active' if m.group(1) == slug else '', s)
    s = s.replace("<?php echo esc_html( date( 'Y' ) ); ?>", '2026')
    assert '<?php' not in s, s[s.index('<?php'):][:200]
    return s

def fix_links(s):
    return re.sub(r'(href|action)="/(?!/)', lambda m: f'{m.group(1)}="{base}/', s)

shutil.rmtree(out, ignore_errors=True)
shutil.copytree(theme, os.path.join(out, 'theme'), ignore=shutil.ignore_patterns('*.php', 'inc'))
cj = os.path.join(out, 'theme/js/sg-content.js')
src = open(cj).read()
open(cj, 'w').write(src.replace("var R = '';", f"var R = '{base}';", 1))

for item in root.iter('item'):
    slug = item.find('wp:post_name', ns).text
    body = item.find('content:encoded', ns).text
    meta = {m.find('wp:meta_key', ns).text: (m.find('wp:meta_value', ns).text or '') for m in item.findall('wp:postmeta', ns)}
    title = meta.get('_yoast_wpseo_title') or item.find('title').text
    desc = meta.get('_yoast_wpseo_metadesc', '')
    page = f'''<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="noindex">
<link rel="icon" href="{base}/theme/images/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css">
<link rel="stylesheet" href="{base}/theme/style.css">
<script>window.SGAI={{ajaxUrl:"{base}/__preview-no-backend__",nonce:"",contactUrl:"{base}/contact/",privacyUrl:"{base}/contact/",root:"{base}"}};</script>
<script defer src="{base}/theme/js/sg-content.js"></script>
<script defer src="{base}/theme/js/sg-main.js"></script>
<script defer src="{base}/theme/js/sg-assistant.js"></script>
<script defer src="{base}/theme/js/sg-tools.js"></script>
</head>
<body class="page page-{slug}" data-sg-page="{slug}">
{render_php(header, slug)}{fix_links(body)}
{render_php(footer, slug)}
</body>
</html>
'''
    d = out if slug == 'home' else os.path.join(out, slug)
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(page)
    print('built', slug)
open(os.path.join(out, '.nojekyll'), 'w').close()
