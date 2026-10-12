// Tekstisivu (skillin sivupohja F): tietosuoja ja evästeet. Sisältö content/<kieli>.json -> pages.
import { esc, header, footer, cookieBanner, mobileBar, head } from './parts.mjs';

export default function legal(c, v, page) {
  return `${head(c, v, { title: `${page.title} | Tradesite`, description: page.intro, canonical: `${v.SITE_URL}/${page.slug}.html` })}
<body>
${header(c, v, { home: false })}
<main id="main">
<section class="section section--lead legal" data-theme="birch" aria-labelledby="page-title">
  <div class="container">
    <header class="section-header section-header--left"><div class="section-header__text"><a class="link small" href="./">${esc(c.pages.back)}</a><h1 class="display" id="page-title" data-fit>${esc(page.title)}</h1><p class="lead section-header__sub">${esc(page.intro)}</p></div></header>
    <div class="prose">
      ${page.sections.map(s => `<h2 class="heading heading--s">${esc(s.h)}</h2><p class="body">${esc(s.p)}</p>`).join('')}
    </div>
  </div>
</section>
</main>
${footer(c, v, { home: false })}
${mobileBar(c, v, { home: false })}
${cookieBanner(c)}
<script>window.TRADESITE={}</script>
<script src="js/site.js?v=${v.BUILD_ID}" defer></script>
</body>
</html>`;
}
