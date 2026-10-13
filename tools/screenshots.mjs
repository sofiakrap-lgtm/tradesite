// QA-kuvakaappaukset: jokainen osio mobiili- (390) ja desktop-leveydellä (1440) -> screenshots/
// Ajo: npm run build && npm run shots
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'screenshots');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIST, p);
  if (!file.startsWith(DIST) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(0);
const port = server.address().port;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const widths = [{ name: 'mobiili', width: 390, height: 844, scale: 2 }, { name: 'desktop', width: 1440, height: 900, scale: 1 }];
const errors = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w.width, height: w.height }, deviceScaleFactor: w.scale, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { localStorage.setItem('ts-cookie-ok', '1'); } catch {} });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`${w.name}: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`${w.name}: ${e.message}`));
  page.on('requestfailed', r => errors.push(`${w.name}: ${r.url()} ${r.failure()?.errorText}`));
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // lataa laiskat kuvat ja laukaise näkyvyysanimaatiot
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 0) errors.push(`${w.name}: vaakavieritys ${overflow}px`);
  const hide = await page.addStyleTag({ content: '.site-header,.mobile-bar{visibility:hidden}' });
  console.log(w.name, await page.evaluate(() => [...document.querySelectorAll('.hero-title__line')].map(e => getComputedStyle(e).fontSize).join(' ')));
  const sections = await page.$$('main > section, footer');
  let i = 0;
  for (const s of sections) {
    i++;
    const id = await s.evaluate(el => el.id || el.getAttribute('aria-labelledby') || el.className.split(' ').pop());
    await s.screenshot({ path: path.join(OUT, `${w.name}-${String(i).padStart(2, '0')}-${id}.png`) });
  }
  if (w.name === 'desktop') {
    // avattu demokortti + header-valikko
    await page.click('#demo-sahko .demo-card__open');
    await page.waitForTimeout(600);
    await (await page.$('#demo-sahko')).screenshot({ path: path.join(OUT, `desktop-demo-avattu.png`) });
    await hide.evaluate(e => e.remove());
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(OUT, `desktop-00-ensimmainen-ruutu.png`) });
  } else {
    await hide.evaluate(e => e.remove());
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(OUT, `mobiili-00-ensimmainen-ruutu.png`) });
    await page.click('[data-menu-toggle]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `mobiili-valikko.png`) });
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(errors.length ? 'VIRHEET:\n' + errors.join('\n') : 'Ei konsolivirheitä.');
console.log('Kuvat: screenshots/');
