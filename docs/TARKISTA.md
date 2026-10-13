# Tarkistettavat ennen julkaisua

## 1. [TARKISTA]-kohdat ja placeholderit

### config.mjs
| Muuttuja | Nyt | Mitä tarvitaan |
|---|---|---|
| `PHONE` | `+358 40 000 0000` | Oikea numero |
| `EMAIL` | `info@tradesite.fi` | Varmista, että osoite toimii |
| `Y_TUNNUS` | `[TARKISTA] 0000000-0` | Holske Oy:n Y-tunnus |
| `FORM_ENDPOINT` | tyhjä (lähetys simuloidaan) | Formspree tai Cloudflare Worker -osoite |
| `VAT_NOTE` | `[TARKISTA] alv-käsittely` | Esim. "alv 0 %" tai "sis. alv 25,5 %" |
| `AGENCY_PRICE_RANGE` | `[TARKISTA] 2 000-6 000 €` | Tarkistettu toimistohinta |
| `AGENCY_DELIVERY` | `[TARKISTA] 1-3 kk` | Tarkistettu toimitusaika |
| `AGENCY_TEXTS` | `[TARKISTA] usein asiakas kirjoittaa itse` | Lisätty: vertailun rivi "Tekstien kirjoitus" |
| `AGENCY_DEMO` | `[TARKISTA] harvoin ennen tilausta` | Lisätty: rivi "Demo ennen ostoa" |
| `HOLSKE_URL` | `#` | Oikeat osoitteet |
| `DEMO_URL` | `#demo-{slug}` (avaa kortin) | Demosivujen osoitteet, esim. `https://demo.tradesite.fi/{slug}/` |

### content/fi.json
- `pages.privacy`: tietosuojaseloste on pohja. Kaikki `[TARKISTA]`-kappaleet täytettävä.
- `pages.cookies`: evästesivu on pohja. Google Fonts mainittu kolmantena osapuolena.

### Kuvat ja logo
- Hero-kuva, hero-video, featuret ja why-kuva: oikeat.
- Puuttuu: Myrak ennen ja jälkeen (`assets/ref/myrak-ennen.jpg`, `myrak-jalkeen.jpg`) ja Holske ennen (`assets/ref/holske-ennen.jpg`). Kuvissa lukee nyt "Placeholder".
- Lista ja koot: `docs/KUVAPROMPTI.md`.

## 2. Kontrastit, jotka korjattiin (WCAG AA)
| Pari | Ennen | Korjaus | Nyt |
|---|---|---|---|
| Raisin Black -teksti Shadow-taustalla (UKK-osio) | 4,12:1 | Teksti tummennettu `#11100D` | 4,94:1 |
| Muted-teksti Shadow-taustalla | alle 4,5 | `#1A1916` | 4,56:1 |
| Muted-teksti Morning Blue -taustalla (Paketti) | vaalea harmaa ei käy | `#33312B` | 4,61:1 |
| Muted-teksti vaaleilla (skillin grey-500) | 3,8:1 | `#5F584C` | 5,07 ... 6,35:1 |
| Muted-teksti tummissa kentissä (demolomake) | 4,49:1 | `#B0A89A` | 5,25:1 |
| Focus-rengas vaaleilla | 2,96:1 | `#5F584C` | 5,62:1 |
| Vaalea teksti Morning Blue / Shadow -taustalla | 2,25 / 3,08 | Ei käytetä. Keskisävyillä aina tumma teksti | |

Shadow (`#868365`) on signaaliväri vain pinnoissa (slider-kahva, ikonilaatat, merkit), ei tekstinä. Tekstinä vaaleilla käytetään `#5C5A43` (5,6:1).

## 3. H1
Nyt: **Nettisivut / alansa ammattilaisille / valmiina 1-3 viikossa.** Vaihto: `content/fi.json` -> `hero.lines`.

## 4. Lighthouse (mobiili, paikallisesti, placeholder-kuvilla)
Performance 95-100 · Accessibility 100 · Best practices 100 · SEO 100.
Aja uudelleen, kun oikeat kuvat ja video on lisätty.
