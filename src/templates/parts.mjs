// Yhteiset osat: escape, ikonit, kuvat, laitekehykset, logo, header, footer.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const ICON_DIR = path.join(ROOT, 'src/icons');
const ASSETS = path.join(ROOT, 'assets');

let manifest = {};
try { manifest = JSON.parse(fs.readFileSync(path.join(ASSETS, 'images.json'), 'utf8')); } catch { manifest = {}; }

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Teksti: escape + **lihavointi**
export const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
export const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

const iconCache = new Map();
export function icon(name, cls = '') {
  if (!iconCache.has(name)) {
    const file = path.join(ICON_DIR, `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Ikonia ei löydy: ${name}`);
    const svg = fs.readFileSync(file, 'utf8');
    const inner = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s*\n\s*/g, '');
    iconCache.set(name, inner);
  }
  return `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconCache.get(name)}</svg>`;
}

// Kuvat: assets/<base>.jpg|png (+ .webp, @800.webp, -mobile.*). Mitat assets/images.json:sta (npm run images).
const exists = rel => fs.existsSync(path.join(ASSETS, rel));
function findSource(base) {
  for (const ext of ['jpg', 'jpeg', 'png']) if (exists(`${base}.${ext}`)) return `${base}.${ext}`;
  return null;
}
export function pic(base, alt, { eager = false, sizes = '100vw', cls = '', mobileMedia = '(max-width: 767px)' } = {}) {
  const src = findSource(base);
  if (!src) {
    return `<div class="ph ${cls}" role="img" aria-label="${esc(alt)}"><span>assets/${esc(base)}.jpg</span></div>`;
  }
  const info = manifest[src] || {};
  const srcset = (b, inf) => {
    const parts = [];
    if (exists(`${b}@800.webp`)) parts.push(`assets/${b}@800.webp 800w`);
    if (exists(`${b}.webp`)) parts.push(`assets/${b}.webp${inf?.width ? ` ${inf.width}w` : ''}`);
    return parts.join(', ');
  };
  let sources = '';
  const mob = findSource(`${base}-mobile`);
  if (mob) {
    const mi = manifest[mob] || {};
    const ms = srcset(`${base}-mobile`, mi);
    if (ms) sources += `<source media="${mobileMedia}" type="image/webp" srcset="${ms}" sizes="${sizes}">`;
    sources += `<source media="${mobileMedia}" srcset="assets/${mob}">`;
  }
  const ws = srcset(base, info);
  if (ws) sources += `<source type="image/webp" srcset="${ws}" sizes="${sizes}">`;
  const dims = info.width ? ` width="${info.width}" height="${info.height}"` : '';
  const load = eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"';
  return `<picture class="${cls}">${sources}<img src="assets/${src}" alt="${esc(alt)}"${dims}${load}></picture>`;
}

// Laitekehykset
export const browser = (inner, url = 'yrityksesi.fi') =>
  `<figure class="device device-browser"><div class="device-browser__bar" aria-hidden="true"><i></i><i></i><i></i><span class="device-browser__url">${esc(url)}</span></div><div class="device-browser__screen">${inner}</div></figure>`;
export const laptop = inner =>
  `<figure class="device device-laptop"><div class="device-laptop__lid"><div class="device-laptop__screen">${inner}</div></div><div class="device-laptop__base" aria-hidden="true"></div></figure>`;
export const phone = inner =>
  `<figure class="device device-phone"><div class="device-phone__screen">${inner}</div></figure>`;

// Logo: väliaikainen tekstilogo. Kun assets/logo/logo.svg on olemassa, se korvaa tekstin automaattisesti.
export function logo(c, href = './') {
  const file = path.join(ASSETS, 'logo/logo.svg');
  const inner = fs.existsSync(file)
    ? `<img src="assets/logo/logo.svg" alt="Tradesite" width="160" height="28">`
    : `<span class="logo__text">Tradesite</span>`;
  return `<a class="logo" href="${href}" aria-label="${esc(c.a11y.home)}">${inner}</a>`;
}

export const section = ({ id, theme, cls = '', label, body }) =>
  `<section class="section ${cls}" data-theme="${theme}"${id ? ` id="${id}"` : ''}${label ? ` aria-labelledby="${label}"` : ''}>${body}</section>`;

export function sectionHeader({ id, caption, title, sub, fit = true, left = false, extra = '' }) {
  return `<header class="section-header${left ? ' section-header--left' : ''}"><div class="section-header__text">${caption ? `<p class="caption">${esc(caption)}</p>` : ''}<h2 class="display" id="${id}"${fit ? ' data-fit' : ''}>${esc(title)}</h2>${sub ? `<p class="lead section-header__sub">${rich(sub)}</p>` : ''}</div>${extra}</header>`;
}

export function header(c, v, { home = true } = {}) {
  const base = home ? '' : './';
  const navItems = c.nav.items.map(i => `<a class="segmented__label" href="${base}${i.href}" data-spy="${i.href.slice(1)}">${esc(i.label)}</a>`).join('');
  const contactItems = c.nav.contactMenu.map(i => {
    const href = i.id === 'call' ? `tel:${v.PHONE_TEL}` : i.id === 'callback' ? `${base}#yhteys-soitto` : `${base}#yhteys-demo`;
    return `<li><a class="dropdown__item" href="${href}" data-event="${i.event}"><span class="tile">${icon(i.icon)}</span><span class="dropdown__text">${esc(i.label)}<small>${esc(i.desc)}</small></span></a></li>`;
  }).join('');
  const groups = c.nav.menuGroups.map(g => `<div class="nav-mobile__group"><p class="nav-mobile__label">${esc(g.label)}</p><ul class="nav-mobile__links">${g.links.map(l => `<li><a href="${base}${l.href}">${esc(l.label)}</a></li>`).join('')}</ul></div>`).join('');
  return `<a class="skip" href="#main">${esc(c.meta.skip)}</a>
<header class="site-header" data-theme="birch">
  <div class="site-header__inner">
    ${logo(c, home ? '#top' : './')}
    <nav class="nav" aria-label="${esc(c.a11y.mainNav)}"><div class="segmented" data-segmented>${navItems}</div></nav>
    <div class="site-header__accessories">
      <div class="lang" hidden aria-label="${esc(c.a11y.language)}"><a href="./" aria-current="true" lang="fi">FI</a><a href="sv/" lang="sv">SV</a><a href="en/" lang="en">EN</a></div>
      <div class="dropdown contact-menu">
        <button class="btn btn--primary btn--sm" type="button" data-dropdown aria-expanded="false" aria-controls="contact-menu" data-event="cta-ota-yhteytta">${esc(c.nav.contact)}<span class="contact-menu__chevron">${icon('chevron-down', 'icon--20')}</span></button>
        <ul class="dropdown__sheet" id="contact-menu" role="list" hidden>${contactItems}</ul>
      </div>
      <button class="btn btn--ghost btn--sm btn--icon menu-toggle" type="button" aria-label="${esc(c.a11y.menu)}" aria-expanded="false" aria-controls="menu" data-menu-toggle data-label-open="${esc(c.a11y.menu)}" data-label-close="${esc(c.a11y.close)}">${icon('menu')}</button>
    </div>
  </div>
  <div class="nav-mobile" id="menu" hidden>${groups}</div>
</header>`;
}

export function footer(c, v, { home = true } = {}) {
  const base = home ? '' : './';
  return `<footer class="footer section" data-theme="birch">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">${logo(c, home ? '#top' : './')}<p class="heading heading--s">${esc(c.footer.tagline)}</p><p class="small muted">${esc(c.footer.body)}</p></div>
      <nav class="footer__col" aria-label="${esc(c.footer.colService)}"><p class="footer__h">${esc(c.footer.colService)}</p><ul role="list">${c.footer.links.map(l => `<li><a href="${base}${l.href}">${esc(l.label)}</a></li>`).join('')}</ul></nav>
      <div class="footer__col"><p class="footer__h">${esc(c.footer.colContact)}</p><ul role="list">
        <li><a href="tel:${v.PHONE_TEL}" data-event="cta-soita">${icon('phone', 'icon--20')}${esc(v.PHONE)}</a></li>
        <li><a href="mailto:${esc(v.EMAIL)}">${icon('mail', 'icon--20')}${esc(v.EMAIL)}</a></li>
      </ul></div>
    </div>
    <div class="footer__bottom">
      <p class="small">${esc(c.footer.operator)} · ${esc(c.footer.businessId)} · ${esc(c.footer.copyright)}</p>
      <ul class="footer__meta" role="list">
        <li><a href="${c.pages.privacy.slug}.html">${esc(c.footer.privacy)}</a></li>
        <li><a href="${c.pages.cookies.slug}.html">${esc(c.footer.cookies)}</a></li>
        <li><button type="button" class="footer__linkbtn" data-cookie-settings>${esc(c.footer.cookieSettings)}</button></li>
      </ul>
    </div>
  </div>
</footer>`;
}

export function cookieBanner(c) {
  return `<div class="cookie" data-cookie hidden role="region" aria-label="${esc(c.footer.cookies)}"><p>${esc(c.cookie.text)}</p><div class="btn-row"><button type="button" class="btn btn--primary btn--xs" data-cookie-accept>${esc(c.cookie.accept)}</button><a class="btn btn--ghost btn--xs" href="${c.pages.cookies.slug}.html">${esc(c.cookie.more)}</a></div></div>`;
}

export function mobileBar(c, v, { home = true } = {}) {
  return `<div class="mobile-bar" data-theme="birch"><a class="btn btn--tertiary" href="tel:${v.PHONE_TEL}" data-event="cta-soita">${icon('phone')}${esc(c.mobileBar.call)}</a><a class="btn btn--primary" href="${home ? '' : './'}#yhteys-demo" data-event="cta-demo">${icon('sparkles')}${esc(c.mobileBar.demo)}</a></div>`;
}

const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&family=Figtree:wght@300..700&display=swap';
export function head(c, v, { title, description, canonical, schema = '' }) {
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#ebe5dc">
<meta property="og:type" content="website">
<meta property="og:locale" content="${c.locale}">
<meta property="og:site_name" content="Tradesite">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${v.SITE_URL}/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.meta.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/logo/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<style>${v.INLINE_CSS}</style>
${schema}
</head>`;
}
