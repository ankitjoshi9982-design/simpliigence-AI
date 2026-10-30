"""Bundle one preview page into a single self-contained HTML file."""
import base64, re, sys
src, out = sys.argv[1], sys.argv[2]
P = 'preview/'
h = open(src).read()
css = open(P + 'assets/css/sgai.css').read()
for f in ['inter-var-latin', 'source-sans-3-latin-400-normal', 'source-sans-3-latin-600-normal']:
    b = base64.b64encode(open(P + f'assets/fonts/{f}.woff2', 'rb').read()).decode()
    css = css.replace(f'../fonts/{f}.woff2', f'data:font/woff2;base64,{b}')
logo = 'data:image/png;base64,' + base64.b64encode(open(P + 'assets/img/logo-white.png', 'rb').read()).decode()
h = re.sub(r'<link rel="preload"[^>]*>', '', h)
h = re.sub(r'<link rel="stylesheet" href="[^"]*sgai.css">', lambda m: '<style>' + css + '</style>', h)
h = re.sub(r'(\.\./)*\./?assets/img/logo-white.png', lambda m: logo, h)
js = open(P + 'assets/js/sg-content.js').read() + '\n' + open(P + 'assets/js/sgai.js').read() + '\n' + open(P + 'assets/js/sg-tools.js').read()
h = re.sub(r'<script src="[^"]*sg-content.js" defer></script><script src="[^"]*sgai.js" defer></script>', lambda m: '<script>' + js + '</script>', h)
open(out, 'w').write(h)
print(len(h) // 1024, 'KB')
