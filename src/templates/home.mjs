// Etusivu. Kaikki tekstit tulevat content/<kieli>.json:sta (c), muuttujat config.mjs:stä (v).
import { esc, rich, fill, icon, pic, browser, laptop, phone, section, sectionHeader, header, footer, cookieBanner, mobileBar, head } from './parts.mjs';

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
    makesOffer: {
      '@type': 'Offer',
      name: 'Nettisivut rakennusalan yritykselle',
      price: String(v.PRICE),
      priceCurrency: 'EUR',
    },
  })}</script>`;

  return `${head(c, v, { title: c.meta.title, description: c.meta.description, canonical: v.SITE_URL + '/', schema })}
<body>
${header(c, v)}
<main id="main">
${hero(c, v)}
${problem(c)}
${showcase(c)}
${beforeAfter(c, v)}
${features(c)}
${processSection(c)}
${pkg(c)}
${compare(c)}
${demos(c, v)}
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

/* 1. Hero: birch + video */
function hero(c, v) {
  const h = c.hero;
  const video = v.HERO_VIDEO
    ? `<video class="hero__video" muted loop playsinline preload="metadata" poster="assets/hero-poster.jpg" data-hero-video aria-hidden="true"><source src="assets/hero.webm" type="video/webm"><source src="assets/hero.mp4" type="video/mp4"></video>`
    : '';
  const pause = v.HERO_VIDEO
    ? `<button class="btn btn--tertiary btn--sm btn--icon hero__pause" type="button" data-video-toggle aria-label="${esc(h.videoPause)}" data-label-pause="${esc(h.videoPause)}" data-label-play="${esc(h.videoPlay)}">${icon('pause')}</button>`
    : '';
  const field = (name, label, ic, type, auto) =>
    `<label class="field field--float"><span class="field__media">${icon(ic)}</span><span class="field__body"><span class="field__label">${esc(label)}</span><span class="field__value"><input class="input" name="${name}" type="${type}" autocomplete="${auto}" placeholder=" " required></span></span></label>`;
  return `<section class="section section--lead hero" data-theme="birch" id="top" aria-labelledby="hero-title">
  <div class="hero__backdrop" aria-hidden="true">
    ${pic('hero-poster', '', { eager: true, cls: 'hero__poster' })}
    ${video}
    <div class="hero__wash"></div><div class="hero__fade"></div>
  </div>
  <div class="container hero__inner">
    <!-- H1-vaihtoehdot (valittu: 1)
      1. NETTISIVUT / REMPPAREILLE / valmiina 1-3 viikossa
      2. NÄKYVYYS / KUULUU KAIKILLE / brändätyt nettisivut rakennusalalle
      3. SIVUT / KUNTOON / 500 €, ja jos et tykkää, et maksa -->
    <h1 class="hero-title" id="hero-title">
      <span class="hero-title__line l-xwide" data-fit>${esc(h.lines[0])}</span>
      <span class="hero-title__line l-wide" data-fit>${esc(h.lines[1])}</span>
      <span class="hero-title__line l-head">${esc(h.lines[2])}</span>
    </h1>
    <p class="lead hero__sub">${esc(h.sub)}</p>
    <form class="quote-bar" data-form="hero" novalidate>
      <input type="hidden" name="form" value="hero-demo">
      <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <div class="quote-bar__group">
        ${field('company', h.form.company, 'building-2', 'text', 'organization')}
        <svg class="notch notch--row" viewBox="0 0 16 32" width="16" height="32" aria-hidden="true"><path d="M0 0C0 4.4 3.6 8 8 8s8-3.6 8-8v32c0-4.4-3.6-8-8-8s-8 3.6-8 8z"/></svg><svg class="notch notch--col" viewBox="0 0 32 16" width="32" height="16" aria-hidden="true"><path d="M32 0c-4.4 0-8 3.6-8 8s3.6 8 8 8H0c4.4 0 8-3.6 8-8S4.4 0 0 0z"/></svg>
        ${field('phone', h.form.phone, 'phone', 'tel', 'tel')}
      </div>
      <button class="btn btn--primary" type="submit" data-event="form-submit" data-form-name="hero">${esc(h.form.submit)}${icon('arrow-right')}</button>
    </form>
    <p class="hero__note small">${icon('shield-check', 'icon--20')}${esc(h.form.note)}</p>
    <div class="hero-strip" data-theme="asphalt">
      ${h.strip.map(s => `<div class="hero-item"><p class="hero-item__cap">${icon(s.icon, 'icon--24')}<span class="caption">${esc(s.caption)}</span></p><p class="heading">${esc(s.title)}</p><p class="body small muted">${esc(s.body)}</p></div>`).join('')}
    </div>
  </div>
  ${pause}
</section>`;
}

/* 3. Ongelma */
function problem(c) {
  const p = c.problem;
  return section({ theme: 'light-grey', cls: 'problem', label: 'problem-title', body: `<div class="container">
    ${sectionHeader({ id: 'problem-title', caption: p.caption, title: p.title, sub: p.sub })}
    <ul class="problem__cards" role="list">
      ${p.cards.map((k, i) => `<li class="card card--m problem-card"><div class="card__content"><div class="problem-card__top"><span class="tile tile--lg">${icon(k.icon)}</span><span class="problem-card__n num">0${i + 1}</span></div><h3 class="heading heading--s">${esc(k.title)}</h3><p class="body muted">${esc(k.body)}</p></div></li>`).join('')}
    </ul>
  </div>` });
}

/* 4. Showcase: läppäri + puhelin, välilehdet toimialoittain */
function showcase(c) {
  const s = c.showcase;
  const items = c.demos.items;
  const tabs = items.map((d, i) => `<button class="segmented__label" role="tab" type="button" id="sc-tab-${d.slug}" aria-controls="sc-panel-${d.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${icon(d.icon, 'icon--20')}${esc(d.name)}</button>`).join('');
  const panels = items.map((d, i) => `<div class="showcase__panel" role="tabpanel" id="sc-panel-${d.slug}" aria-labelledby="sc-tab-${d.slug}"${i === 0 ? '' : ' hidden'}>
      <div class="showcase__laptop">${laptop(pic(`demo/${d.slug}`, fill(s.laptopAlt, { name: d.name }), { sizes: '(min-width: 1025px) 900px, 90vw' }))}</div>
      <div class="showcase__phone">${phone(pic(`demo/${d.slug}-puhelin`, fill(s.phoneAlt, { name: d.name }), { sizes: '(min-width: 1025px) 260px, 34vw' }))}</div>
    </div>`).join('');
  return section({ id: 'tyot', theme: 'asphalt', cls: 'showcase', label: 'showcase-title', body: `<div class="container">
    ${sectionHeader({ id: 'showcase-title', caption: s.caption, title: s.title, sub: s.sub })}
    <div class="showcase__tabs-wrap"><div class="segmented showcase__tabs" role="tablist" aria-label="${esc(s.tablistLabel)}" data-segmented data-tabs>${tabs}</div></div>
    <div class="showcase__stage">${panels}</div>
    <p class="section-note">${icon('eye', 'icon--20')}${esc(s.note)}</p>
  </div>` });
}

/* 5. Ennen ja jälkeen */
function beforeAfter(c, v) {
  const b = c.beforeAfter;
  const refs = b.refs.map(r => `<li class="ref-card"><a class="ref-card__link" href="${esc(r.href)}"${r.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>
      <div class="ref-card__media">${browser(pic(r.img, r.name, { sizes: '240px' }), r.name.toLowerCase().replace(/\s+oy$/, '') + '.fi')}</div>
      <div class="ref-card__text"><p class="heading heading--xs">${esc(r.name)}</p><p class="small muted">${icon(r.icon, 'icon--20')}${esc(r.field)}</p></div>
      <span class="ref-card__arrow">${icon('arrow-right')}</span></a></li>`).join('');
  return section({ id: 'referenssit', theme: 'birch', cls: 'ba-section', label: 'ba-title', body: `<div class="container">
    ${sectionHeader({ id: 'ba-title', caption: b.caption, title: b.title, sub: b.sub })}
    <div class="ba-layout">
      <figure class="ba-main">
        <before-after start="50" nudge label="${esc(b.sliderLabel)}">
          <div class="ba__layer ba__after">${pic('ref/myrak-jalkeen', b.afterAlt, { sizes: '(min-width: 1025px) 860px, 100vw' })}</div>
          <div class="ba__layer ba__before">${pic('ref/myrak-ennen', b.beforeAlt, { sizes: '(min-width: 1025px) 860px, 100vw' })}</div>
          <span class="ba__pill ba__pill--before">${esc(b.before)}</span><span class="ba__pill ba__pill--after">${esc(b.after)}</span>
          <div class="ba__stat"><strong>${esc(b.stat)}</strong><span>${esc(b.statLabel)}</span></div>
        </before-after>
        <figcaption class="ba-main__cap"><span>${icon('map-pin', 'icon--20')}${esc(b.figcaption)}</span><a class="link" href="${esc(v.MYRAK_URL)}" target="_blank" rel="noopener">${esc(b.visit)}<span class="sr-only"> (${esc(c.a11y.external)})</span></a></figcaption>
        <ul class="pill-list" role="list">${b.pills.map(p => `<li class="pill"><span class="pill__icon">${icon(p.icon)}</span>${esc(p.label)}</li>`).join('')}</ul>
      </figure>
      <aside class="ba-side">
        <figure class="quote-card">
          <span class="quote-card__mark">${icon('quote', 'icon--32')}</span>
          <blockquote>${rich(b.quote)}</blockquote>
          <figcaption class="quote-card__by"><span class="tile">${icon('building-2')}</span><span><strong>${esc(b.quoteAuthor)}</strong><br><span class="muted small">${esc(b.quoteRole)}</span></span></figcaption>
        </figure>
        <div class="ba-side__more"><p class="caption">${esc(b.moreTitle)}</p><ul class="ref-cards" role="list">${refs}</ul></div>
      </aside>
    </div>
  </div>` });
}

/* 6. Mitä sivuille tulee: bento-ruudukko ruutukaappauksilla */
function features(c) {
  const f = c.features;
  const tiles = f.items.map(t => {
    const media = t.frame === 'phone'
      ? phone(pic(t.img, t.title, { sizes: '260px' }))
      : browser(pic(t.img, t.title, { sizes: '(min-width: 1025px) 860px, 90vw' }));
    return `<li class="feature-tile feature-tile--${t.frame}"><div class="feature-tile__text"><span class="tile">${icon(t.icon)}</span><div><h3 class="heading heading--xs">${esc(t.title)}</h3><p class="small muted">${esc(t.body)}</p></div></div><div class="feature-tile__media">${media}</div></li>`;
  }).join('');
  return section({ id: 'sisalto', theme: 'light-grey', cls: 'features', label: 'features-title', body: `<div class="container">
    ${sectionHeader({ id: 'features-title', caption: f.caption, title: f.title, sub: f.sub })}
    <ul class="bento" role="list">${tiles}</ul>
    <ul class="pill-list pill-list--center" role="list">${f.more.map(p => `<li class="pill"><span class="pill__icon">${icon(p.icon)}</span>${esc(p.label)}</li>`).join('')}</ul>
  </div>` });
}

/* 7. Näin se toimii: aikajana */
function processSection(c) {
  const p = c.process;
  return section({ id: 'prosessi', theme: 'asphalt', cls: 'process', label: 'process-title', body: `<div class="container">
    ${sectionHeader({ id: 'process-title', caption: p.caption, title: p.title, sub: p.sub })}
    <ol class="timeline" data-draw="idle">
      ${p.steps.map((s, i) => `<li class="tl-step"><div class="tl-step__marker"><span class="tl-step__bullet">${i + 1}</span><span class="tl-step__rule"></span></div><div class="tl-step__content"><div class="tl-step__head"><span class="tile">${icon(s.icon)}</span><h3 class="heading heading--xs">${esc(s.title)}</h3></div><p class="body small muted">${esc(s.body)}</p></div></li>`).join('')}
    </ol>
  </div>` });
}

/* 8. Paketti ja hinta: kaksi paneelia notch joinilla */
function pkg(c) {
  const p = c.package;
  const list = (arr, cls = '') => `<ul class="icon-list ${cls}" role="list">${arr.map(i => `<li><span class="tile tile--sm">${icon(i.icon)}</span><span>${esc(i.label)}${i.note ? `<small>${esc(i.note)}</small>` : ''}</span></li>`).join('')}</ul>`;
  return section({ id: 'hinta', theme: 'teal', cls: 'package', label: 'package-title', body: `<div class="container">
    ${sectionHeader({ id: 'package-title', caption: p.caption, title: p.title, sub: p.sub })}
    <div class="panels">
      <div class="panel on-light">
        <h3 class="panel__title"><span class="tile tile--signal tile--sm">${icon('check')}</span>${esc(p.includedTitle)}</h3>
        ${list(p.included, 'icon-list--2col')}
      </div>
      <svg class="notch notch--row panels__notch" viewBox="0 0 24 48" width="24" height="48" aria-hidden="true"><path d="M0 0C0 6.6 5.4 12 12 12S24 6.6 24 0v48c0-6.6-5.4-12-12-12S0 41.4 0 48z"/></svg>
      <svg class="notch notch--col panels__notch" viewBox="0 0 48 24" width="48" height="24" aria-hidden="true"><path d="M48 0c-6.6 0-12 5.4-12 12s5.4 12 12 12H0c6.6 0 12-5.4 12-12S6.6 0 0 0z"/></svg>
      <div class="panel panel--price on-light">
        <p class="caption">${esc(p.priceCaption)}</p>
        <div class="price"><p class="price__main"><span class="stat">${esc(p.price)}</span><span class="price__label">${esc(p.priceLabel)}</span></p><p class="price__vat small muted">${esc(p.vat)}</p></div>
        <div class="price__monthly"><p class="title price__monthly-num num">${esc(p.monthly)}</p><p class="small muted">${esc(p.monthlyLabel)}</p></div>
        <ul class="pill-list" role="list">${p.specs.map(s => `<li class="pill pill--quiet"><span class="pill__icon">${icon(s.icon)}</span>${esc(s.label)}</li>`).join('')}</ul>
        <a class="btn btn--primary btn--lg btn--block" href="#yhteys-demo" data-event="cta-demo">${esc(p.cta)}${icon('arrow-right')}</a>
        <p class="price__promise">${icon('shield-check', 'icon--20')}${esc(p.promise)}</p>
        <div class="price__extra">
          <div><p class="price__h">${esc(p.extrasTitle)}</p><p class="small muted">${esc(p.extrasNote)}</p>${list(p.extras, 'icon-list--quiet')}</div>
          <div><p class="price__h">${esc(p.excludedTitle)}</p>${list(p.excluded, 'icon-list--quiet icon-list--x')}</div>
        </div>
      </div>
    </div>
  </div>` });
}

/* 9. Säästövertailu */
function compare(c) {
  const k = c.compare;
  const rows = k.rows.map(r => `<tr><th scope="row"><span class="tile tile--sm">${icon(r.icon)}</span>${esc(r.label)}</th><td class="is-us">${icon('check', 'icon--20 compare__check')}${esc(r.us)}</td><td>${esc(r.agency)}</td></tr>`).join('');
  return section({ id: 'vertailu', theme: 'light-grey', cls: 'compare', label: 'compare-title', body: `<div class="container">
    ${sectionHeader({ id: 'compare-title', caption: k.caption, title: k.title, sub: k.sub })}
    <div class="compare__wrap">
      <table class="compare__table">
        <caption class="sr-only">${esc(k.title)}</caption>
        <thead><tr><th scope="col"><span class="sr-only">${esc(k.colLabel)}</span></th><th scope="col" class="is-us"><span class="compare__brand">Tradesite</span></th><th scope="col">${esc(k.colAgency)}</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th scope="row"><span class="tile tile--sm tile--signal">${icon('calculator')}</span>${esc(k.totalLabel)}</th><td class="is-us"><span class="stat compare__total num">${esc(k.totalUs)}</span><small class="muted">${esc(k.totalUsNote)}</small></td><td><span class="compare__total-agency">${esc(k.totalAgency)}</span></td></tr></tfoot>
      </table>
    </div>
    <div class="btn-row"><a class="btn btn--primary btn--md" href="#yhteys-demo" data-event="cta-demo">${esc(k.cta)}${icon('arrow-right')}</a></div>
  </div>` });
}

/* 10. Demot: kuusi korttia, avautuvat (morph) */
function demos(c, v) {
  const d = c.demos;
  const cards = d.items.map(it => `<li class="demo-card" id="demo-${it.slug}" data-demo="${it.slug}">
      <div class="demo-card__closed">
        <div class="demo-card__media">${browser(pic(`demo/${it.slug}`, `${it.name}: ${d.lead}`, { sizes: '(min-width: 1025px) 440px, 90vw' }), `${it.slug.replace('-', '')}.tradesite.fi`)}</div>
        <div class="demo-card__body">
          <div class="demo-card__label"><span class="tile">${icon(it.icon)}</span><h3 class="heading heading--s">${esc(it.name)}</h3></div>
          <p class="small muted">${esc(d.lead)}</p>
        </div>
        <button class="demo-card__open" type="button" aria-expanded="false" aria-controls="demo-more-${it.slug}"><span class="sr-only">${esc(d.open)}: ${esc(it.name)}</span><span class="demo-card__plus" aria-hidden="true">${icon('plus')}</span></button>
      </div>
      <div class="demo-card__more" id="demo-more-${it.slug}" hidden>
        <div class="demo-card__devices">
          <div class="demo-card__laptop">${laptop(pic(`demo/${it.slug}`, `${it.name}: ${d.lead}`, { sizes: '(min-width: 1025px) 760px, 90vw' }))}</div>
          <div class="demo-card__phone">${phone(pic(`demo/${it.slug}-puhelin`, `${it.name}: ${d.lead}`, { sizes: '220px' }))}</div>
        </div>
        <div class="demo-card__info">
          <p class="caption">${esc(d.lead)}</p>
          <h3 class="display demo-card__title">${esc(it.name)}</h3>
          <p class="body">${esc(it.body)}</p>
          <ul class="pill-list" role="list">${it.tags.map(t => `<li class="tag">${icon('check', 'icon--20')}${esc(t)}</li>`).join('')}</ul>
          <div class="btn-row demo-card__actions">
            <a class="btn btn--primary btn--md" href="${esc(fill(v.DEMO_URL, { slug: it.slug }))}" data-demo-link="${it.slug}" data-event="cta-katso-demo">${esc(d.cta)}${icon('arrow-right')}</a>
            <a class="btn btn--tertiary btn--md" href="#yhteys-demo" data-industry="${esc(it.name)}" data-event="cta-demo">${esc(d.order)}</a>
          </div>
        </div>
        <button class="btn btn--tertiary btn--sm btn--icon demo-card__close" type="button" aria-label="${esc(d.close)}">${icon('x')}</button>
      </div>
    </li>`).join('');
  return section({ id: 'demot', theme: 'birch', cls: 'demos', label: 'demos-title', body: `<div class="container">
    ${sectionHeader({ id: 'demos-title', caption: d.caption, title: d.title, sub: d.sub })}
    <ul class="demo-grid" role="list" data-demos>${cards}</ul>
    <p class="section-note demos__note">${icon('circle-help', 'icon--20')}<span>${esc(d.note)} <a class="link" href="#yhteys-demo" data-event="cta-demo">Tee minulle demo</a></span></p>
  </div>` });
}

/* 12. Miksi me */
function why(c) {
  const w = c.why;
  return section({ theme: 'asphalt', cls: 'why', label: 'why-title', body: `<div class="container">
    ${sectionHeader({ id: 'why-title', caption: w.caption, title: w.title, sub: w.sub })}
    <ul class="features-grid" role="list">
      ${w.items.map(i => `<li class="feature"><span class="tile tile--xl">${icon(i.icon)}</span><h3 class="heading heading--s">${esc(i.title)}</h3><p class="body small muted">${esc(i.body)}</p></li>`).join('')}
    </ul>
    <p class="coming"><span class="badge">${icon('sparkles')}${esc(w.coming)}</span></p>
  </div>` });
}

/* 13. UKK */
function faq(c) {
  const f = c.faq;
  return section({ id: 'ukk', theme: 'green', cls: 'faq-section', label: 'faq-title', body: `<div class="container faq">
    ${sectionHeader({ id: 'faq-title', caption: f.caption, title: f.title, sub: f.sub, left: true, extra: `<div class="btn-row"><a class="btn btn--primary btn--md" href="#yhteys" data-event="cta-ota-yhteytta">${esc(f.cta)}${icon('arrow-right')}</a></div>` })}
    <div class="accordion">
      ${f.items.map((q, i) => `<details class="acc"${i === 0 ? ' open' : ''}><summary class="acc__summary"><span class="acc__q">${esc(q.q)}</span><span class="acc__ind">${icon('chevron-down')}</span></summary><div class="acc__a"><p>${esc(q.a)}</p></div></details>`).join('')}
    </div>
  </div>` });
}

/* 14. Ota yhteyttä */
function contact(c, v) {
  const k = c.contact;
  const fld = ({ name, label, ic, type = 'text', auto = 'off', required = true, extra = '', list = '' }) =>
    `<label class="field field--float"><span class="field__media">${icon(ic)}</span><span class="field__body"><span class="field__label">${esc(label)}${required ? '' : ` <em>(${esc(k.optional)})</em>`}</span><span class="field__value"><input class="input" name="${name}" type="${type}" autocomplete="${auto}" placeholder=" "${required ? ' required' : ''}${list ? ` list="${list}"` : ''}${extra}></span></span></label>`;
  const sel = ({ name, label, ic, options, placeholder }) =>
    `<label class="field"><span class="field__media">${icon(ic)}</span><span class="field__body"><span class="field__label">${esc(label)}</span><span class="field__value"><select class="input" name="${name}" required>${placeholder ? `<option value="" disabled selected>${esc(placeholder)}</option>` : ''}${options.map(o => `<option>${esc(o)}</option>`).join('')}</select></span></span><span class="field__chevron">${icon('chevron-down', 'icon--20')}</span></label>`;
  const status = `<p class="form-status" role="status" aria-live="polite"></p>`;
  const cb = k.callback, dm = k.demo;
  return section({ id: 'yhteys', theme: 'birch', cls: 'contact', label: 'contact-title', body: `<div class="container">
    ${sectionHeader({ id: 'contact-title', caption: k.caption, title: k.title, sub: k.sub })}
    <div class="contact__direct">
      <a class="contact__phone" href="tel:${v.PHONE_TEL}" data-event="cta-soita"><span class="tile tile--lg tile--signal">${icon('phone-call')}</span><span><span class="caption">${esc(k.phoneCaption)}</span><span class="contact__number num">${esc(v.PHONE)}</span></span></a>
      <a class="contact__email link" href="mailto:${esc(v.EMAIL)}">${icon('mail', 'icon--20')}${esc(v.EMAIL)}</a>
    </div>
    <div class="contact__cards">
      <form class="contact-card card on-light" id="yhteys-soitto" data-form="callback" novalidate>
        <input type="hidden" name="form" value="soittopyynto">
        <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <div class="contact-card__head"><span class="tile tile--lg">${icon('calendar-check')}</span><div><h3 class="heading heading--s">${esc(cb.title)}</h3><p class="small muted">${esc(cb.desc)}</p></div></div>
        <div class="field-group">
          ${fld({ name: 'name', label: cb.name, ic: 'user', auto: 'name' })}
          ${fld({ name: 'phone', label: cb.phone, ic: 'phone', type: 'tel', auto: 'tel' })}
          ${sel({ name: 'time', label: cb.time, ic: 'clock', options: cb.times })}
        </div>
        <button class="btn btn--primary btn--md btn--block" type="submit" data-event="form-submit" data-form-name="callback">${esc(cb.submit)}${icon('arrow-right')}</button>
        ${status}
      </form>
      <form class="contact-card contact-card--featured card" data-theme="asphalt" id="yhteys-demo" data-form="demo" novalidate>
        <input type="hidden" name="form" value="demo">
        <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <span class="badge contact-card__badge">${icon('star')}${esc(dm.badge)}</span>
        <div class="contact-card__head"><span class="tile tile--lg tile--signal">${icon('sparkles')}</span><div><h3 class="heading heading--s">${esc(dm.title)}</h3><p class="small muted">${esc(dm.desc)}</p></div></div>
        <div class="field-group">
          ${fld({ name: 'company', label: dm.company, ic: 'building-2', auto: 'organization' })}
          ${sel({ name: 'industry', label: dm.industry, ic: 'hard-hat', options: dm.industries, placeholder: dm.industryPlaceholder })}
          ${fld({ name: 'city', label: dm.city, ic: 'map-pin', auto: 'address-level2', list: 'cities' })}
          ${fld({ name: 'site', label: dm.site, ic: 'link', type: 'text', auto: 'url', required: false, extra: ' inputmode="url"' })}
          ${fld({ name: 'phone', label: dm.phone, ic: 'phone', type: 'tel', auto: 'tel' })}
          ${fld({ name: 'email', label: dm.email, ic: 'mail', type: 'email', auto: 'email', required: false })}
        </div>
        <datalist id="cities">${dm.cities.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
        <button class="btn btn--primary btn--md btn--block" type="submit" data-event="form-submit" data-form-name="demo">${esc(dm.submit)}${icon('arrow-right')}</button>
        ${status}
      </form>
    </div>
  </div>` });
}

/* 15. CTA */
function cta(c, v) {
  const k = c.cta;
  return section({ theme: 'asphalt', cls: 'cta-band', label: 'cta-title', body: `<div class="container">
    <header class="section-header"><div class="section-header__text"><h2 class="display" id="cta-title" data-fit>${esc(k.title)}</h2><p class="lead section-header__sub">${esc(k.sub)}</p></div>
    <div class="btn-row"><a class="btn btn--primary btn--lg" href="tel:${v.PHONE_TEL}" data-event="cta-soita">${icon('phone')}${esc(k.primary)}</a><a class="btn btn--tertiary btn--lg" href="#yhteys-demo" data-event="cta-demo">${esc(k.secondary)}${icon('arrow-right')}</a></div></header>
  </div>` });
}
