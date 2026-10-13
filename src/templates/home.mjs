// Etusivu. Kaikki tekstit tulevat content/<kieli>.json:sta (c), muuttujat config.mjs:stä (v).
// Rakenne ja osioiden muoto Holske-sivuston mallin mukaan: vähän ikoneita, ei otsikon yläpuolisia selitteitä.
import { esc, rich, fill, icon, pic, browser, laptop, phone, section, header, footer, cookieBanner, mobileBar, head } from './parts.mjs';

export default function home(c, v) {
  const schema = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Tradesite',
    url: v.SITE_URL,
    description: c.meta.description,
    telephone: v.PHONE,
    email: v.EMAIL,
    image: `${v.SITE_URL}/assets/og/og-image.png`,
    logo: `${v.SITE_URL}/assets/favicon/icon-512.png`,
    areaServed: { '@type': 'Country', name: 'Suomi' },
    parentOrganization: { '@type': 'Organization', name: v.COMPANY },
    makesOffer: { '@type': 'Offer', name: 'Nettisivut yritykselle', price: String(v.PRICE), priceCurrency: 'EUR' },
  })}</script>`;

  return `${head(c, v, { title: c.meta.title, description: c.meta.description, canonical: v.SITE_URL + '/', schema })}
<body>
${header(c, v)}
<main id="main">
${hero(c, v)}
${problem(c)}
${showcase(c)}
${cases(c, v)}
${features(c)}
${processSection(c)}
${pkg(c)}
${compare(c)}
${demos(c, v)}
${mobile(c)}
${why(c)}
${faq(c)}
${contact(c, v)}
${cta(c, v)}
</main>
${footer(c, v)}
${mobileBar(c, v)}
${cookieBanner(c)}
<script>window.TRADESITE=${JSON.stringify({ formEndpoint: v.FORM_ENDPOINT, success: c.contact.success, error: c.contact.error, sending: c.contact.sending, invalid: c.contact.invalid })}</script>
<script src="js/before-after.js?v=${v.BUILD_ID}" defer></script>
<script src="js/site.js?v=${v.BUILD_ID}" defer></script>
</body>
</html>`;
}

// Osion otsikko: H2 + valinnainen alateksti. Ei selitettä otsikon yläpuolella.
const title = ({ id, text, sub, align = 'center', extra = '' }) =>
  `<header class="osio-otsake osio-otsake--${align}"><h2 class="display" id="${id}" data-fit>${esc(text)}</h2>${sub ? `<p class="osio-otsake__ala">${rich(sub)}</p>` : ''}${extra}</header>`;

const field = (name, label, type, auto, required = true, extra = '') =>
  `<label class="field field--float"><span class="field__body"><span class="field__label">${esc(label)}</span><span class="field__value"><input class="input" name="${name}" type="${type}" autocomplete="${auto}" placeholder=" "${required ? ' required' : ''}${extra}></span></span></label>`;

/* 1. Hero */
function hero(c, v) {
  const h = c.hero;
  const video = v.HERO_VIDEO
    ? `<video class="hero__video" muted playsinline preload="metadata" poster="assets/hero-poster.jpg" data-hero-video aria-hidden="true"><source src="assets/hero.webm" type="video/webm"><source src="assets/hero.mp4" type="video/mp4"></video>`
    : '';
  const pause = v.HERO_VIDEO
    ? `<button class="btn btn--tertiary btn--sm btn--icon hero__pause" type="button" data-video-toggle aria-label="${esc(h.videoPause)}" data-label-pause="${esc(h.videoPause)}" data-label-play="${esc(h.videoPlay)}">${icon('pause')}</button>`
    : '';
  return `<section class="section section--lead hero hero--media" data-theme="birch" id="top" aria-labelledby="hero-title">
  <div class="hero__backdrop" aria-hidden="true">
    ${pic('hero-poster', '', { eager: true, cls: 'hero__poster' })}
    ${video}
    <div class="hero__wash"></div><div class="hero__fade"></div>
  </div>
  <div class="container hero__inner">
    <h1 class="hero-title" id="hero-title">
      <span class="hero-title__line l-xwide" data-fit>${esc(h.lines[0])}</span>
      <span class="hero-title__line l-wide" data-fit>${esc(h.lines[1])}</span>
      <span class="hero-title__line l-head">${esc(h.lines[2])}</span>
    </h1>
    <p class="hero__sub">${esc(h.sub)}</p>
    <form class="quote-bar" data-form="hero" novalidate>
      <input type="hidden" name="form" value="hero-demo">
      <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <div class="quote-bar__group">
        ${field('company', h.form.company, 'text', 'organization')}
        <svg class="notch notch--row" viewBox="0 0 16 32" width="16" height="32" aria-hidden="true"><path d="M0 0C0 4.4 3.6 8 8 8s8-3.6 8-8v32c0-4.4-3.6-8-8-8s-8 3.6-8 8z"/></svg><svg class="notch notch--col" viewBox="0 0 32 16" width="32" height="16" aria-hidden="true"><path d="M32 0c-4.4 0-8 3.6-8 8s3.6 8 8 8H0c4.4 0 8-3.6 8-8S4.4 0 0 0z"/></svg>
        ${field('phone', h.form.phone, 'tel', 'tel')}
      </div>
      <button class="btn btn--primary" type="submit" data-event="form-submit" data-form-name="hero">${esc(h.form.submit)}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <p class="hero__note">${esc(h.form.note)}</p>
    <ul class="facts" role="list">
      ${h.facts.map(f => `<li><span class="facts__value" data-roll="${esc(f.value)}">${esc(f.value)}</span><span class="facts__label">${esc(f.label)}</span></li>`).join('')}
    </ul>
  </div>
  ${pause}
</section>`;
}

/* 2. Ongelma: kolme saraketta ohuilla viivoilla */
function problem(c) {
  const p = c.problem;
  return section({ theme: 'light-grey', cls: 'problem', label: 'problem-title', body: `<div class="container">
    ${title({ id: 'problem-title', text: p.title })}
    <ul class="columns" role="list">
      ${p.cards.map(k => `<li><h3 class="heading heading--s">${esc(k.title)}</h3><p class="muted">${esc(k.body)}</p></li>`).join('')}
    </ul>
  </div>` });
}

/* 3. Tältä se näyttää: läppäri + puhelin */
function showcase(c) {
  const s = c.showcase;
  const items = c.demos.items;
  const tabs = items.map((d, i) => `<button class="segmented__label" role="tab" type="button" id="sc-tab-${d.slug}" aria-controls="sc-panel-${d.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(d.name)}</button>`).join('');
  const panels = items.map((d, i) => `<div class="showcase__panel" role="tabpanel" id="sc-panel-${d.slug}" aria-labelledby="sc-tab-${d.slug}"${i === 0 ? '' : ' hidden'}>
      <div class="showcase__laptop">${laptop(pic(`demo/${d.slug}`, fill(s.laptopAlt, { name: d.name }), { sizes: '(min-width: 1025px) 900px, 90vw' }))}</div>
      <div class="showcase__phone">${phone(pic(`demo/${d.slug}-puhelin`, fill(s.phoneAlt, { name: d.name }), { sizes: '(min-width: 1025px) 260px, 34vw' }))}</div>
    </div>`).join('');
  return section({ id: 'tyot', theme: 'asphalt', cls: 'showcase', label: 'showcase-title', body: `<div class="container">
    ${title({ id: 'showcase-title', text: s.title, sub: s.sub })}
    <div class="showcase__tabs-wrap"><div class="segmented showcase__tabs" role="tablist" aria-label="${esc(s.tablistLabel)}" data-segmented data-tabs>${tabs}</div></div>
    <div class="showcase__stage">${panels}</div>
  </div>` });
}

/* 4. Ennen ja jälkeen: asiakastapaukset ristiin (slideri vuorotellen vasemmalla ja oikealla) */
function cases(c, v) {
  const k = c.cases;
  const rows = k.items.map((it, i) => `<article class="case${i % 2 ? ' case--flip' : ''}">
      <div class="case__media">
        <before-after start="50" nudge label="${esc(k.sliderLabel)}: ${esc(it.name)}">
          <div class="ba__layer ba__after">${pic(`${it.img}-jalkeen`, `${it.name}: uusi sivu`, { sizes: '(min-width: 1025px) 820px, 100vw' })}</div>
          <div class="ba__layer ba__before">${pic(`${it.img}-ennen`, `${it.name}: vanha sivu`, { sizes: '(min-width: 1025px) 820px, 100vw' })}</div>
          <span class="ba__pill ba__pill--before">${esc(k.before)}</span><span class="ba__pill ba__pill--after">${esc(k.after)}</span>
        </before-after>
      </div>
      <div class="case__text">
        <h3 class="case__name">${esc(it.name)}</h3>
        <p class="case__field">${esc(it.field)}</p>
        <p class="case__body">${esc(it.body)}</p>
        ${it.quote ? `<figure class="case__quote"><blockquote>${rich(it.quote)}</blockquote><figcaption>${esc(it.quoteBy)}</figcaption></figure>` : ''}
        <a class="btn btn--secondary btn--md" href="${esc(it.url)}"${it.url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(k.visit)}<span class="sr-only"> ${esc(it.name)}${it.url.startsWith('http') ? ` (${esc(c.a11y.external)})` : ''}</span></a>
      </div>
    </article>`).join('');
  return section({ id: 'referenssit', theme: 'birch', cls: 'cases', label: 'cases-title', body: `<div class="container">
    ${title({ id: 'cases-title', text: k.title })}
    <div class="cases__list">${rows}</div>
  </div>` });
}

/* 5. Tätä sivuillesi tulee: Holsken palvelukaruselli */
function features(c) {
  const f = c.features;
  const cards = f.items.map(t => `<li class="fcard on-light">
      <span class="fcard__img">${pic(t.img, t.title, { sizes: '(min-width: 1025px) 448px, 85vw', fallback: t.fallback })}</span>
      <span class="fcard__body">
        <span class="fcard__title">${esc(t.title)}</span>
        <span class="fcard__text">${esc(t.body)}</span>
        <span class="fcard__points">${t.points.map(p => `<span>${icon('check', 'icon--20')}${esc(p)}</span>`).join('')}</span>
      </span>
    </li>`).join('');
  return section({ id: 'sisalto', theme: 'light-grey', cls: 'features', label: 'features-title', body: `<div class="container">
    ${title({ id: 'features-title', text: f.title, sub: f.sub })}
  </div>
  <div class="frail" data-rail>
    <ul class="frail__track" role="list" data-rail-track>${cards}</ul>
    <div class="container frail__nav">
      <button type="button" class="round" data-rail-prev aria-label="${esc(f.prev)}">${icon('arrow-right', 'flip')}</button>
      <button type="button" class="round" data-rail-next aria-label="${esc(f.next)}">${icon('arrow-right')}</button>
    </div>
  </div>` });
}

/* 6. Näin se toimii: Holsken vaihekortit, keskitetty teksti */
function processSection(c) {
  const p = c.process;
  const n = p.steps.length;
  return section({ id: 'prosessi', theme: 'birch', cls: 'process', label: 'process-title', body: `<div class="container">
    ${title({ id: 'process-title', text: p.title })}
    <ol class="steps" role="list">
      ${p.steps.map((s, i) => `<li class="on-light"><span class="steps__n">${i + 1}/${n}</span><h3 class="heading heading--xs">${esc(s.title)}</h3><p>${esc(s.body)}</p>${i < n - 1 ? `<span class="steps__arrow" aria-hidden="true">${icon('arrow-right', 'icon--20')}</span>` : ''}</li>`).join('')}
    </ol>
  </div>` });
}

/* 7. Paketti ja hinta */
function pkg(c) {
  const p = c.package;
  return section({ id: 'hinta', theme: 'teal', cls: 'package', label: 'package-title', body: `<div class="container">
    ${title({ id: 'package-title', text: p.title })}
    <div class="panels">
      <div class="panel panel--price on-light">
        <p class="price__main"><span class="stat">${esc(p.price)}</span><span class="price__label">${esc(p.priceLabel)}</span></p>
        <p class="price__vat small muted">${esc(p.vat)}</p>
        <p class="price__monthly"><strong>${esc(p.monthly)}</strong> <span class="muted">${esc(p.monthlyLabel)}</span></p>
        <p class="price__specs">${esc(p.specs)}</p>
        <a class="btn btn--primary btn--lg btn--block" href="#yhteys-demo" data-event="cta-demo">${esc(p.cta)}</a>
        <p class="price__promise">${esc(p.promise)}</p>
      </div>
      <svg class="notch notch--row panels__notch" viewBox="0 0 24 48" width="24" height="48" aria-hidden="true"><path d="M0 0C0 6.6 5.4 12 12 12S24 6.6 24 0v48c0-6.6-5.4-12-12-12S0 41.4 0 48z"/></svg>
      <svg class="notch notch--col panels__notch" viewBox="0 0 48 24" width="48" height="24" aria-hidden="true"><path d="M48 0c-6.6 0-12 5.4-12 12s5.4 12 12 12H0c6.6 0 12-5.4 12-12S6.6 0 0 0z"/></svg>
      <div class="panel panel--list on-light">
        <div class="groups">
          ${p.groups.map(g => `<div class="group"><h3 class="group__title">${esc(g.title)}</h3><ul role="list">${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}
        </div>
        <p class="panel__fine">${esc(p.extras)}</p>
        <p class="panel__fine">${esc(p.excluded)}</p>
      </div>
    </div>
  </div>` });
}

/* 8. Säästövertailu */
function compare(c) {
  const k = c.compare;
  const rows = k.rows.map(r => `<tr><th scope="row">${esc(r.label)}</th><td class="is-us">${icon('check', 'icon--20 compare__check')}${esc(r.us)}</td><td>${esc(r.agency)}</td></tr>`).join('');
  return section({ id: 'vertailu', theme: 'light-grey', cls: 'compare', label: 'compare-title', body: `<div class="container">
    ${title({ id: 'compare-title', text: k.title })}
    <div class="compare__wrap">
      <table class="compare__table">
        <caption class="sr-only">${esc(k.title)}</caption>
        <thead><tr><th scope="col"><span class="sr-only">${esc(k.colLabel)}</span></th><th scope="col" class="is-us"><span class="compare__brand">Tradesite</span></th><th scope="col">${esc(k.colAgency)}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="btn-row"><a class="btn btn--primary btn--md" href="#yhteys-demo" data-event="cta-demo">${esc(k.cta)}</a></div>
  </div>` });
}

/* 9. Demot: kortit avautuvat (morph) + "Muu ala?" -kortti */
function demos(c, v) {
  const d = c.demos;
  const cards = d.items.map(it => `<li class="demo-card" id="demo-${it.slug}" data-demo="${it.slug}">
      <div class="demo-card__closed">
        <div class="demo-card__media">${browser(pic(`demo/${it.slug}`, it.name, { sizes: '(min-width: 1025px) 440px, 90vw' }), `${it.slug.replace('-', '')}.tradesite.fi`)}</div>
        <div class="demo-card__body"><h3 class="heading heading--s">${esc(it.name)}</h3></div>
        <button class="demo-card__open" type="button" aria-expanded="false" aria-controls="demo-more-${it.slug}"><span class="sr-only">${esc(d.open)}: ${esc(it.name)}</span><span class="demo-card__plus" aria-hidden="true">${icon('plus')}</span></button>
      </div>
      <div class="demo-card__more" id="demo-more-${it.slug}" hidden>
        <div class="demo-card__devices">
          <div class="demo-card__laptop">${laptop(pic(`demo/${it.slug}`, it.name, { sizes: '(min-width: 1025px) 760px, 90vw' }))}</div>
          <div class="demo-card__phone">${phone(pic(`demo/${it.slug}-puhelin`, it.name, { sizes: '220px' }))}</div>
        </div>
        <div class="demo-card__info">
          <h3 class="display demo-card__title">${esc(it.name)}</h3>
          <p class="body">${esc(it.body)}</p>
          <ul class="pill-list" role="list">${it.tags.map(t => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
          <div class="btn-row demo-card__actions">
            <a class="btn btn--primary btn--md" href="${esc(fill(v.DEMO_URL, { slug: it.slug }))}" data-demo-link="${it.slug}" data-event="cta-katso-demo">${esc(d.cta)}</a>
            <a class="btn btn--tertiary btn--md" href="#yhteys-demo" data-industry="${esc(it.name)}" data-event="cta-demo">${esc(d.order)}</a>
          </div>
        </div>
        <button class="btn btn--tertiary btn--sm btn--icon demo-card__close" type="button" aria-label="${esc(d.close)}">${icon('x')}</button>
      </div>
    </li>`).join('');
  const other = `<li class="demo-other" data-theme="asphalt"><h3 class="heading heading--s">${esc(d.other.title)}</h3><p class="muted">${esc(d.other.body)}</p><a class="btn btn--primary btn--md" href="#yhteys-demo" data-industry="Muu ala" data-event="cta-demo">${esc(d.other.cta)}</a></li>`;
  return section({ id: 'demot', theme: 'birch', cls: 'demos', label: 'demos-title', body: `<div class="container">
    ${title({ id: 'demos-title', text: d.title })}
    <ul class="demo-grid" role="list" data-demos>${cards}${other}</ul>
  </div>` });
}

/* 10. Toimii puhelimessa: itsestään kiertävä nauha, pysähtyy kun käyttäjä tarttuu */
function mobile(c) {
  const m = c.mobile;
  const slide = (s, hidden) => `<li class="loop__item"${hidden ? ' aria-hidden="true"' : ''}>${phone(pic(s.img, hidden ? '' : s.title, { sizes: '260px' }))}<p class="loop__title">${esc(s.title)}</p></li>`;
  const items = m.slides.map(s => slide(s, false)).join('') + m.slides.map(s => slide(s, true)).join('');
  return section({ id: 'mobiili', theme: 'light-grey', cls: 'mobile', label: 'mobile-title', body: `<div class="container">
    ${title({ id: 'mobile-title', text: m.title })}
  </div>
  <div class="loop" data-loop tabindex="0" aria-label="${esc(m.title)}"><ul class="loop__track" role="list" data-loop-track>${items}</ul></div>` });
}

/* 11. Miksi Tradesite: Holsken Bento, kuva keskellä */
function why(c) {
  const w = c.why;
  const half = Math.ceil(w.cells.length / 2);
  const cells = w.cells.map((cell, i) => {
    const side = i < half ? 'l' : 'r';
    const row = (i < half ? i : i - half) + 1;
    const cls = `bento__cell bento__cell--${side}${i % 2 ? ' bento__cell--sand' : ''}${cell.href ? ' bento__cell--link' : ''}`;
    const inner = `<h3>${esc(cell.title)}</h3>${cell.body ? `<p>${esc(cell.body)}</p>` : ''}`;
    return cell.href
      ? `<a class="${cls}" style="--row:${row}" href="${cell.href}" data-event="cta-demo"><span class="bento__arrow">${icon('arrow-right')}</span>${inner}</a>`
      : `<div class="${cls}" style="--row:${row}">${inner}</div>`;
  }).join('');
  return section({ theme: 'birch', cls: 'why', label: 'why-title', body: `<div class="container">
    ${title({ id: 'why-title', text: w.title })}
    <div class="bento" style="--rows:${half}">
      <div class="bento__img">${pic(w.img, '', { sizes: '(min-width: 1025px) 560px, 100vw', fallback: 'hero-poster' })}</div>
      ${cells}
    </div>
  </div>` });
}

/* 12. UKK: Holsken asettelu */
function faq(c) {
  const f = c.faq;
  return section({ id: 'ukk', theme: 'green', cls: 'faq-section', label: 'faq-title', body: `<div class="container faq">
    <div class="faq__head">
      <h2 class="display" id="faq-title" data-fit>${esc(f.title)}</h2>
      <p class="faq__sub">${esc(f.sub)}</p>
      <a class="btn btn--primary btn--md" href="#yhteys" data-event="cta-ota-yhteytta">${esc(f.cta)}</a>
    </div>
    <div class="accordion">
      ${f.items.map(q => `<details class="acc" name="ukk"><summary class="acc__summary"><span class="acc__q">${esc(q.q)}</span><span class="acc__ind">${icon('chevron-down')}</span></summary><div class="acc__a"><p>${esc(q.a)}</p></div></details>`).join('')}
    </div>
  </div>` });
}

/* 13. Ota yhteyttä */
function contact(c, v) {
  const k = c.contact;
  const fld = ({ name, label, type = 'text', auto = 'off', required = true, extra = '', list = '' }) =>
    field(name, required ? label : `${label} (${k.optional})`, type, auto, required, `${list ? ` list="${list}"` : ''}${extra}`);
  const sel = ({ name, label, options, placeholder }) =>
    `<label class="field"><span class="field__body"><span class="field__label">${esc(label)}</span><span class="field__value"><select class="input" name="${name}" required>${placeholder ? `<option value="" disabled selected>${esc(placeholder)}</option>` : ''}${options.map(o => `<option>${esc(o)}</option>`).join('')}</select></span></span><span class="field__chevron">${icon('chevron-down', 'icon--20')}</span></label>`;
  const status = `<p class="form-status" role="status" aria-live="polite"></p>`;
  const cb = k.callback, dm = k.demo;
  return section({ id: 'yhteys', theme: 'birch', cls: 'contact', label: 'contact-title', body: `<div class="container">
    ${title({ id: 'contact-title', text: k.title, extra: `<p class="contact__direct"><a class="contact__number" href="tel:${v.PHONE_TEL}" data-event="cta-soita">${esc(v.PHONE)}</a><a class="link" href="mailto:${esc(v.EMAIL)}">${esc(v.EMAIL)}</a></p>` })}
    <div class="contact__cards">
      <form class="contact-card card" data-theme="asphalt" id="yhteys-demo" data-form="demo" novalidate>
        <input type="hidden" name="form" value="demo">
        <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <div class="contact-card__head"><h3 class="heading heading--s">${esc(dm.title)}</h3><p class="small muted">${esc(dm.desc)}</p></div>
        <div class="field-group">
          ${fld({ name: 'company', label: dm.company, auto: 'organization' })}
          ${sel({ name: 'industry', label: dm.industry, options: dm.industries, placeholder: dm.industryPlaceholder })}
          ${fld({ name: 'city', label: dm.city, auto: 'address-level2', list: 'cities' })}
          ${fld({ name: 'site', label: dm.site, auto: 'url', required: false, extra: ' inputmode="url"' })}
          ${fld({ name: 'phone', label: dm.phone, type: 'tel', auto: 'tel' })}
          ${fld({ name: 'email', label: dm.email, type: 'email', auto: 'email', required: false })}
        </div>
        <datalist id="cities">${dm.cities.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
        <button class="btn btn--primary btn--md btn--block" type="submit" data-event="form-submit" data-form-name="demo">${esc(dm.submit)}</button>
        ${status}
      </form>
      <form class="contact-card card on-light" id="yhteys-soitto" data-form="callback" novalidate>
        <input type="hidden" name="form" value="soittopyynto">
        <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <div class="contact-card__head"><h3 class="heading heading--s">${esc(cb.title)}</h3><p class="small muted">${esc(cb.desc)}</p></div>
        <div class="field-group">
          ${fld({ name: 'name', label: cb.name, auto: 'name' })}
          ${fld({ name: 'phone', label: cb.phone, type: 'tel', auto: 'tel' })}
          ${sel({ name: 'time', label: cb.time, options: cb.times })}
        </div>
        <button class="btn btn--primary btn--md btn--block" type="submit" data-event="form-submit" data-form-name="callback">${esc(cb.submit)}</button>
        ${status}
      </form>
    </div>
  </div>` });
}

/* 14. CTA: pelkkä kysymys ja napit */
function cta(c, v) {
  const k = c.cta;
  return section({ theme: 'asphalt', cls: 'cta-band', label: 'cta-title', body: `<div class="container">
    <header class="osio-otsake"><h2 class="display" id="cta-title" data-fit>${esc(k.title)}</h2>
    <div class="btn-row"><a class="btn btn--primary btn--lg" href="tel:${v.PHONE_TEL}" data-event="cta-soita">${esc(k.primary)}</a><a class="btn btn--tertiary btn--lg" href="#yhteys-demo" data-event="cta-demo">${esc(k.secondary)}</a></div></header>
  </div>` });
}
