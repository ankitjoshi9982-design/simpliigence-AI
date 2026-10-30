const { chromium } = require('playwright');
(async () => {
  const [file, out, w] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: 900 }, deviceScaleFactor: +w < 600 ? 2 : 1 });
  await p.goto('file://' + file); await p.waitForTimeout(600);
  await p.addStyleTag({ content: '*{transition:none!important;animation-play-state:paused!important}.gauge .v{stroke-dasharray:var(--v) 100!important}.viz-kpi .ln{stroke-dashoffset:0!important}.rv{opacity:1!important;transform:none!important}.mstat .bar i{width:var(--v)!important}.hdr{position:relative!important}.tabbar{position:absolute!important}' });
  await p.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
  await p.waitForTimeout(1600);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
