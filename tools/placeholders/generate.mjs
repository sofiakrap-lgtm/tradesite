// Luo placeholder-kuvat assets/-kansioon kuvakaappaamalla tools/placeholders/mock.html.
// Ajo: npm run placeholders   (vaatii Playwrightin + Chromiumin)
// Oikeat kuvat korvaavat nämä: katso docs/KUVAPROMPTI.md. Älä aja tätä, kun oikeat kuvat on lisätty (ylikirjoittaa).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const A = p => path.join(ROOT, 'assets', p);
const MOCK = pathToFileURL(path.join(ROOT, 'tools/placeholders/mock.html')).href;
const only = process.argv.slice(2).find(a => !a.startsWith('--')); // valinnainen suodatin, esim. "demo/"
const force = process.argv.includes('--force');

const IND = ['saneeraus', 'sahko', 'putki-lvi', 'remontti', 'katot', 'maalaus'];
const DESK = { width: 1440, height: 900, scale: 1600 / 1440 };   // -> 1600 x 1000
const PHONE = { width: 390, height: 844, scale: 2 };              // -> 780 x 1688

const jobs = [];
for (const ind of IND) {
  jobs.push({ out: `demo/${ind}.png`, q: { ind }, vp: DESK });
  jobs.push({ out: `demo/${ind}-puhelin.png`, q: { ind }, vp: PHONE });
}
jobs.push({ out: 'features/lomake.png', q: { ind: 'remontti' }, vp: DESK, go: 'contact' });
jobs.push({ out: 'features/galleria.png', q: { ind: 'saneeraus' }, vp: DESK, go: 'gallery' });
jobs.push({ out: 'features/kartta.png', q: { ind: 'putki-lvi' }, vp: DESK, go: 'map' });
jobs.push({ out: 'features/soita-nyt.png', q: { ind: 'sahko', focus: 'call' }, vp: PHONE });
jobs.push({ out: 'features/arviot.png', q: { ind: 'katot' }, vp: PHONE, go: 'reviews' });
jobs.push({ out: 'features/kotitalousvahennys.png', q: { ind: 'maalaus' }, vp: PHONE, go: 'deduction' });
jobs.push({ out: 'mobile/etusivu.png', q: { ind: 'maalaus' }, vp: PHONE });
jobs.push({ out: 'mobile/palvelut.png', q: { ind: 'putki-lvi' }, vp: PHONE, go: 'services' });
jobs.push({ out: 'mobile/galleria.png', q: { ind: 'saneeraus' }, vp: PHONE, go: 'gallery' });
jobs.push({ out: 'mobile/arviot.png', q: { ind: 'remontti' }, vp: PHONE, go: 'reviews' });
jobs.push({ out: 'mobile/yhteys.png', q: { ind: 'katot' }, vp: PHONE, go: 'contact' });
jobs.push({ out: 'ref/myrak-ennen.png', q: { view: 'old', label: 'Placeholder: Myrak ennen' }, vp: DESK });
jobs.push({ out: 'ref/myrak-jalkeen.png', q: { ind: 'myrak-uusi', label: 'Placeholder: Myrak jälkeen' }, vp: DESK });
jobs.push({ out: 'ref/svkatto.png', q: { ind: 'katot', view: 'wire', name: 'SVkatto Oy' }, vp: DESK });
jobs.push({ out: 'ref/holske.png', q: { ind: 'saneeraus', view: 'wire', name: 'Holske Oy' }, vp: DESK });

const browser = await chromium.launch();
const exists = rel => ['jpg', 'jpeg', 'png'].some(e => fs.existsSync(A(rel.replace(/\.png$/, '.' + e))));

for (const j of jobs) {
  if (only && !j.out.startsWith(only)) continue;
  if (!force && exists(j.out)) { console.log('ohitetaan (on jo):', j.out); continue; }
  const ctx = await browser.newContext({ viewport: { width: j.vp.width, height: j.vp.height }, deviceScaleFactor: j.vp.scale });
  const page = await ctx.newPage();
  await page.goto(`${MOCK}?${new URLSearchParams(j.q)}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (j.go) await page.evaluate(id => window.goTo(id), j.go);
  fs.mkdirSync(path.dirname(A(j.out)), { recursive: true });
  await page.screenshot({ path: A(j.out) });
  console.log('ok', j.out);
  await ctx.close();
}

// Hero-poster ja OG-kuva: koostetaan demokuvista
const compose = async (out, w, h, html) => {
  if (only && !out.startsWith(only)) return;
  if (!force && exists(out)) { console.log('ohitetaan (on jo):', out); return; }
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const tmp = path.join(ROOT, 'tools/placeholders/.compose.html');
  fs.writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  fs.unlinkSync(tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: A(out) });
  console.log('ok', out);
  await ctx.close();
};
const img = rel => { const jpg = rel.replace(/\.png$/, '.jpg'); return pathToFileURL(A(fs.existsSync(A(rel)) ? rel : jpg)).href; };
const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Figtree:wght@300..700&display=swap">';
const posterScene = (w, h, mobile) => `<!doctype html><html><head>${fonts}<style>
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#d9d1c4}
.bg{position:absolute;inset:0;background:radial-gradient(70% 60% at 70% 40%,#efe8dd,#cfc5b5 70%,#b8ad9b)}
.laptop{position:absolute;${mobile ? 'left:-30%;top:12%;width:110%' : 'left:4%;top:16%;width:58%'};transform:rotate(-4deg);filter:blur(${mobile ? 3 : 2}px)}
.laptop .lid{background:#24221e;border-radius:22px;padding:16px}
.laptop img{display:block;width:100%;border-radius:8px}
.phone{position:absolute;${mobile ? 'right:6%;top:30%;width:56%' : 'right:12%;top:12%;width:22%'};transform:rotate(7deg);background:#24221e;border-radius:44px;padding:12px}
.phone img{display:block;width:100%;border-radius:34px}
.shade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(235,229,220,.2),rgba(36,34,30,.15))}
</style></head><body><div class="bg"></div><div class="laptop"><div class="lid"><img src="${img('demo/saneeraus.png')}"></div></div><div class="phone"><img src="${img('demo/maalaus-puhelin.png')}"></div><div class="shade"></div></body></html>`;
await compose('hero-poster.png', 1920, 1080, posterScene(1920, 1080, false));
await compose('hero-poster-mobile.png', 900, 1400, posterScene(900, 1400, true));
await compose('og-image.png', 1200, 630, `<!doctype html><html><head>${fonts}<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#ebe5dc;font-family:Figtree}
.t{position:absolute;left:64px;top:72px;display:flex;flex-direction:column;gap:14px;width:600px}
.logo{font:900 30px/1 Archivo;font-stretch:125%;text-transform:uppercase;color:#24221e}
.h{font:900 64px/64px Archivo;font-stretch:125%;text-transform:uppercase;color:#24221e;margin-top:40px}
.s{font:500 30px/38px Archivo;font-stretch:125%;color:#24221e}
.p{display:flex;gap:10px;margin-top:24px}.p span{background:#24221e;color:#ebe5dc;border-radius:999px;padding:12px 20px;font:600 22px/1 Figtree}
.p span.l{background:#868365;color:#11100d}
.ph{position:absolute;right:70px;top:60px;width:230px;background:#24221e;border-radius:40px;padding:11px;transform:rotate(5deg)}
.ph img{display:block;width:100%;border-radius:30px}
.ph2{position:absolute;right:250px;top:150px;width:200px;background:#24221e;border-radius:36px;padding:10px;transform:rotate(-6deg)}
.ph2 img{display:block;width:100%;border-radius:27px}
</style></head><body><div class="t"><div class="logo">Tradesite</div><div class="h">Nettisivut<br>remppareille</div><div class="s">valmiina 1-3 viikossa</div><div class="p"><span>500 €</span><span class="l">Jos et tykkää, et maksa</span></div></div><div class="ph2"><img src="${img('demo/sahko-puhelin.png')}"></div><div class="ph"><img src="${img('demo/katot-puhelin.png')}"></div></body></html>`);

await browser.close();
console.log('Valmis. Aja seuraavaksi: npm run images');
