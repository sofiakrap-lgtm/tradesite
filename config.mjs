// Tradesite: sivuston muuttujat.
// Kaikki [TARKISTA]-arvot pitää täyttää ennen julkaisua. Lista: docs/TARKISTA.md
// Tekstit ovat content/<kieli>.json -tiedostoissa. Niissä {MUUTTUJA} korvataan näillä arvoilla.

export default {
  SITE_URL: 'https://tradesite.fi',
  SITE_NAME: 'Tradesite',

  // Yhteystiedot
  PHONE: '+358 40 000 0000',          // [TARKISTA] placeholder
  EMAIL: 'info@tradesite.fi',          // [TARKISTA] placeholder
  Y_TUNNUS: '[TARKISTA] 0000000-0',    // Holske Oy:n Y-tunnus
  COMPANY: 'Holske Oy',

  // Lomakkeet: Formspree, Cloudflare Worker tms. Tyhjä = lähetys simuloidaan (kehitystila).
  FORM_ENDPOINT: '',

  // Hinnat (ainoat luvut, joita sivulla saa käyttää)
  PRICE: 500,
  MONTHLY: 36,
  COMMITMENT_MONTHS: 12,
  VAT_NOTE: 'alv 0 %',

  // Säästövertailu: mainostoimiston arvot. Älä keksi omia lukuja.
  AGENCY_PRICE_RANGE: '540-1 600 € (alv 0 %)',
  AGENCY_DELIVERY: '2-4 viikkoa, täysi palvelu 4-8 viikkoa',
  AGENCY_TEXTS: 'Edullisissa paketeissa asiakas itse',
  AGENCY_DEMO: 'Useimmilla vasta tilauksen jälkeen',

  // Referenssit
  MYRAK_URL: 'https://myrak.fi/',
  HOLSKE_URL: 'https://holske-uusi.sofia-krap.workers.dev/',

  // Demo-sivujen osoitteet. {slug} = saneeraus, sahko, putki-lvi, remontti, katot, maalaus.
  DEMO_URL: '#demo-{slug}',           // [TARKISTA] esim. 'https://demo.tradesite.fi/{slug}/'

  // Hero-video: vaihda true, kun assets/hero.mp4 ja assets/hero.webm on lisätty.
  HERO_VIDEO: true,
};
