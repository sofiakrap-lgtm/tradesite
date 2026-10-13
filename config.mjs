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
  VAT_NOTE: '[TARKISTA] alv-käsittely',

  // Säästövertailu: mainostoimiston arvot. Älä keksi omia lukuja.
  AGENCY_PRICE_RANGE: '[TARKISTA] 2 000-6 000 €',
  AGENCY_DELIVERY: '[TARKISTA] 1-3 kk',
  AGENCY_TEXTS: '[TARKISTA] usein asiakas kirjoittaa itse',
  AGENCY_DEMO: '[TARKISTA] harvoin ennen tilausta',
  AGENCY_MAINTENANCE: '[TARKISTA] erikseen sovittava',
  AGENCY_FIRST_YEAR: '[TARKISTA] 2 000-6 000 € + ylläpito',

  // Referenssit
  MYRAK_URL: 'https://myrak.fi/',
  SVKATTO_URL: '#',
  HOLSKE_URL: '#',

  // Demo-sivujen osoitteet. {slug} = saneeraus, sahko, putki-lvi, remontti, katot, maalaus.
  DEMO_URL: '#demo-{slug}',           // [TARKISTA] esim. 'https://demo.tradesite.fi/{slug}/'

  // Hero-video: vaihda true, kun assets/hero.mp4 ja assets/hero.webm on lisätty.
  HERO_VIDEO: true,
};
