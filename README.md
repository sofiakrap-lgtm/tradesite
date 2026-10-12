# Tradesite.fi

Yksisivuinen myyntisivu: nettisivut rakennusalan pienyrityksille. Staattinen HTML/CSS/JS, ei riippuvuuksia. Julkaisu Cloudflare Pagesiin.

UI-pohja: skill `ui-bahnexpress-fi` (Archivo wdth 125 + Figtree, osioteemat, motion). Väripaletti: Tradesite.

## Komennot
| Komento | Mitä tekee |
|---|---|
| `npm run build` | Rakentaa sivun `dist/`-kansioon |
| `npm run dev` | Build + paikallinen palvelin portissa 4321 |
| `npm run images` | Optimoi kuvat (WebP, pienet koot, mitat). Vaatii Python + Pillow |
| `npm run placeholders` | Luo puuttuvat placeholder-kuvat (Playwright) |
| `npm run shots` | Kuvakaappaukset jokaisesta osiosta mobiili + desktop -> `screenshots/` |

Cloudflare Pages: build command `npm run build`, output directory `dist`.

## Missä mikäkin on
| Asia | Paikka |
|---|---|
| Kaikki tekstit | `content/fi.json` (sv.json ja en.json lisätään samaan kansioon, build tekee `/sv/` ja `/en/`) |
| Puhelin, sähköposti, hinnat, lomake-endpoint, [TARKISTA]-arvot | `config.mjs` |
| HTML-rakenne | `src/templates/` |
| Värit ja tokenit | `src/styles/01-tokens.css` |
| Ennen ja jälkeen -slideri (uudelleenkäytettävä) | `src/components/before-after/` |
| Kuvat | `assets/` (lista ja koot: `docs/KUVAPROMPTI.md`) |
| Logot | `assets/logo/` |
| Mitä pitää vielä täyttää | `docs/TARKISTA.md` |

## Seuranta
Napeissa on valmiina `data-event`-merkinnät (`cta-soita`, `cta-demo`, `form-submit` ...). Ne lähettävät `tradesite:event`-tapahtuman, johon analytiikka kytketään myöhemmin.
