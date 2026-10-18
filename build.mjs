// Tradesite build: content/<kieli>.json + config.mjs + src/ -> dist/
// Ei riippuvuuksia. Ajo: node build.mjs  (Cloudflare Pages: build command "npm run build", output "dist")
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import config from './config.mjs';
import home from './src/templates/home.mjs';
import legal from './src/templates/legal.mjs';
import { fill } from './src/templates/parts.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const DEFAULT_LANG = 'fi';

const vars = {
  ...config,
  FIRST_YEAR: config.PRICE + 12 * config.MONTHLY,
  YEAR: new Date().getFullYear(),
  PHONE_TEL: config.PHONE.replace(/[^\d+]/g, ''),
  BUILD_ID: Date.now().toString(36),
};

// Interpoloi {MUUTTUJA} kaikkiin sisällön merkkijonoihin. Pienet {avain}-paikkamerkit jäävät templaateille.
const upperVars = Object.fromEntries(Object.entries(vars).filter(([k]) => /^[A-Z_]+$/.test(k)));
const deep = o => typeof o === 'string' ? fill(o, upperVars)
  : Array.isArray(o) ? o.map(deep)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, x]) => [k, deep(x)]))
  : o;

// Tarkistus: ei ajatusviivoja sisällössä
const DASH = /[–—]/;

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'css'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'js'), { recursive: true });

// CSS: yksi tiedosto
const styleDir = path.join(ROOT, 'src/styles');
const css = [
  ...fs.readdirSync(styleDir).filter(f => f.endsWith('.css')).sort().map(f => fs.readFileSync(path.join(styleDir, f), 'utf8')),
  fs.readFileSync(path.join(ROOT, 'src/components/before-after/before-after.css'), 'utf8'),
].join('\n');
fs.writeFileSync(path.join(DIST, 'css/site.css'), minifyCss(css));
vars.INLINE_CSS = minifyCss(css); // inline: ei render-blocking-pyyntöä

// JS
fs.copyFileSync(path.join(ROOT, 'src/scripts/site.js'), path.join(DIST, 'js/site.js'));
fs.copyFileSync(path.join(ROOT, 'src/components/before-after/before-after.js'), path.join(DIST, 'js/before-after.js'));

// Assetit ja public/
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), f => !/\.(md|json)$/.test(f) && !f.endsWith('.gitkeep'));
copyDir(path.join(ROOT, 'public'), DIST);

// Sivut kielittäin. Oletuskieli juureen, muut alikansioon (/sv/, /en/), kun content/sv.json tms. on olemassa.
const langs = fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
const urls = [];
for (const lang of langs) {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `${lang}.json`), 'utf8'));
  const text = JSON.stringify(raw);
  if (DASH.test(text)) console.warn(`[varoitus] content/${lang}.json sisältää ajatusviivan (– tai —).`);
  const c = deep(raw);
  const outDir = lang === DEFAULT_LANG ? DIST : path.join(DIST, lang);
  const prefix = lang === DEFAULT_LANG ? '' : `${lang}/`;
  fs.mkdirSync(outDir, { recursive: true });
  const write = (file, html) => {
    if (lang !== DEFAULT_LANG) html = html.replace(/(href|src|srcset)="(?!https?:|#|tel:|mailto:|\/)/g, '$1="../');
    // Lukuvälit (1-3, 540-1 600) eivät katkea rivin vaihdossa väliviivan kohdalta
    html = html.replace(/(<(script|style|title)[\s\S]*?<\/\2>)|>([^<]+)(?=<)/g, (m, skip, _t, txt) =>
      skip ? m : '>' + txt.replace(/\d[\d ]*-\d[\d ]*(?:[^\s<]*)/g, r => `<span class="nw">${r}</span>`));
    // Versiotunniste kuviin: uusi kuva samalla nimellä ohittaa selaimen välimuistin
    html = html.replace(/assets\/[\w\/@.-]+\.(?:jpg|jpeg|png|webp|svg|mp4|webm|ico)(?![\w?])/g, ref => {
      const f = path.join(ROOT, ref);
      return fs.existsSync(f) ? `${ref}?v=${crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8)}` : ref;
    });
    fs.writeFileSync(path.join(outDir, file), html);
  };
  write('index.html', home(c, vars));
  urls.push(`${vars.SITE_URL}/${prefix}`);
  for (const page of [c.pages.privacy, c.pages.cookies]) {
    write(`${page.slug}.html`, legal(c, vars, page));
    urls.push(`${vars.SITE_URL}/${prefix}${page.slug}.html`);
  }
}

// SEO-tiedostot
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${vars.SITE_URL}/sitemap.xml\n`);

console.log(`Valmis: dist/ (${langs.join(', ')}), ${urls.length} sivua.`);

function copyDir(from, to, filter = () => true) {
  if (!fs.existsSync(from)) return;
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b, filter);
    else if (filter(e.name)) { fs.mkdirSync(to, { recursive: true }); fs.copyFileSync(a, b); }
  }
}

function minifyCss(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}
