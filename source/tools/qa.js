const { chromium } = require('playwright');
const pages = ['', 'ai/', 'automation/', 'agents/', 'industries/', 'resources/', 'tools/', 'company/', 'contact/'];
const OUT = process.argv[2], ROOT = process.argv[3], only = process.argv[4];
(async () => {
  const b = await chromium.launch();
  for (const pg of pages) {
    const name = pg.replace('/', '') || 'home';
    if (only && only !== name) continue;
    for (const [w, tag] of [[1440, 'd'], [390, 'm']]) {
      const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/CORS|ERR_FAILED/.test(m.text())) errs.push(m.text()) });
      await p.goto('file://' + ROOT + '/preview/' + pg + 'index.html'); await p.waitForTimeout(500);
      await p.addStyleTag({ content: '*{transition:none!important;animation-play-state:paused!important}.rv{opacity:1!important;transform:none!important}.gauge .v{stroke-dasharray:var(--v) 100!important}.hdr{position:relative!important}' });
      await p.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
      await p.waitForTimeout(1800);
      const ov = await p.evaluate(() => { const W = document.documentElement.clientWidth; const r = []; document.querySelectorAll('body *').forEach(e => { const bb = e.getBoundingClientRect(); if (bb.width && bb.right > W + 2 && !e.closest('.swipe,.plat,.hw-tabs,.drawer,.sheet')) r.push(e.tagName + '.' + (e.className.baseVal ?? e.className)) }); return [document.documentElement.scrollWidth, r.slice(0, 5)] });
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      console.log(name, tag, 'h=' + h, 'scrollW=' + ov[0], ov[1].join(' | '), errs.length ? 'ERR ' + errs.join(';') : '');
      await p.screenshot({ path: `${OUT}/${name}_${tag}.png`, fullPage: true });
      await p.close();
    }
  }
  await b.close();
})();
