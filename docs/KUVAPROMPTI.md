# Kuvaprompti: Tradesite.fi-kuvat

Sivulla on nyt placeholder-kuvat, jotka on generoitu automaattisesti (`tools/placeholders/`). Korvaa ne omilla demoillasi. Tiedostonimi ratkaisee, mihin kuva menee. Kun kuva on vaihdettu: `npm run images` ja `npm run build`.

## Pikasäännöt

- **Muoto:** JPG tai PNG. Skripti tekee WebP-versiot ja pienemmät koot itse.
- **Tiedostonimi:** täsmälleen alla olevan listan mukaan. Vanha placeholder (`.jpg` + `.webp`) poistetaan ensin.
- **Kaksi kokoa riittää kaikkeen:**
  - **Desktop-kuvakaappaus: 1600 x 1000 px** (16:10). Selaimen ikkuna 1440 x 900, zoom 100 %, ota kuva ilman selaimen palkkeja. Tai Chromen DevTools: laitekoko 1600 x 1000.
  - **Puhelinkuvakaappaus: 780 x 1688 px** (iPhone 390 x 844, kuvattuna 2x). Chromen DevTools: "iPhone 12 Pro", "Capture screenshot".
- **Ei laitekehyksiä kuviin.** Sivu piirtää läppärin, puhelimen ja selainikkunan itse.
- **Yläreuna näkyy aina.** Kuva rajataan ylhäältä. Tärkein sisältö ylös.
- **Älä käytä muiden töitä omina töinä.** Demot ovat demoja, referenssit vain luvallisia (Myrak: lupa on).

## Lista

### 1. Demot toimialoittain (12 kuvaa)
Käytetään: "Tältä se näyttää" (läppäri + puhelin), "Valitse alasi" -kortit ja avattu kortti.

| Tiedosto | Koko | Sisältö |
|---|---|---|
| `assets/demo/saneeraus.jpg` | 1600 x 1000 | Saneerausdemon etusivu, ylin näkymä |
| `assets/demo/saneeraus-puhelin.jpg` | 780 x 1688 | Sama sivu puhelimella, ylin näkymä + "Soita"-palkki alhaalla |
| `assets/demo/sahko.jpg` | 1600 x 1000 | Sähkö |
| `assets/demo/sahko-puhelin.jpg` | 780 x 1688 | Sähkö, puhelin |
| `assets/demo/putki-lvi.jpg` | 1600 x 1000 | Putki ja LVI |
| `assets/demo/putki-lvi-puhelin.jpg` | 780 x 1688 | Putki ja LVI, puhelin |
| `assets/demo/remontti.jpg` | 1600 x 1000 | Remontti |
| `assets/demo/remontti-puhelin.jpg` | 780 x 1688 | Remontti, puhelin |
| `assets/demo/katot.jpg` | 1600 x 1000 | Katot |
| `assets/demo/katot-puhelin.jpg` | 780 x 1688 | Katot, puhelin |
| `assets/demo/maalaus.jpg` | 1600 x 1000 | Maalaus |
| `assets/demo/maalaus-puhelin.jpg` | 780 x 1688 | Maalaus, puhelin |

### 2. "Tätä sivuillesi tulee" (6 kuvaa)
Yksi ominaisuus per kuva. Vieritä sivu niin, että ominaisuus on kuvan yläosassa.

| Tiedosto | Koko | Sisältö |
|---|---|---|
| `assets/features/soita-nyt.jpg` | 780 x 1688 | Puhelinnäkymä, jossa "Soita nyt" -nappi selvästi näkyvissä (kiinteä alapalkki) |
| `assets/features/lomake.jpg` | 1600 x 1000 | Yhteydenottolomake ja yhteystiedot |
| `assets/features/galleria.jpg` | 1600 x 1000 | Ennen ja jälkeen -galleria |
| `assets/features/arviot.jpg` | 780 x 1688 | Asiakasarviot puhelimella (oikeat arviot tai selvästi merkitty esimerkki) |
| `assets/features/kartta.jpg` | 1600 x 1000 | Kartta ja palvelualue |
| `assets/features/kotitalousvahennys.jpg` | 780 x 1688 | Kotitalousvähennys-osio puhelimella |

### 3. "Toimii puhelimessa" -karuselli (5 kuvaa)
Eri demoista, jotta karusellissa on vaihtelua.

| Tiedosto | Koko | Sisältö |
|---|---|---|
| `assets/mobile/etusivu.jpg` | 780 x 1688 | Etusivun ylin näkymä |
| `assets/mobile/palvelut.jpg` | 780 x 1688 | Palvelukortit |
| `assets/mobile/galleria.jpg` | 780 x 1688 | Galleria |
| `assets/mobile/arviot.jpg` | 780 x 1688 | Asiakasarviot |
| `assets/mobile/yhteys.jpg` | 780 x 1688 | Yhteystiedot: soittonappi, lomake, kartta |

Lisää kuvia karuselliin: lisää kuva `assets/mobile/`-kansioon ja rivi `content/fi.json` -> `mobile.slides`.

### 4. Referenssit (4 kuvaa)

| Tiedosto | Koko | Sisältö |
|---|---|---|
| `assets/ref/myrak-ennen.jpg` | 1600 x 1000 | Myrakin vanha sivu (esim. web.archive.org). Sama ikkunakoko kuin jälkeen-kuvassa |
| `assets/ref/myrak-jalkeen.jpg` | 1600 x 1000 | myrak.fi nyt, sama kohta sivua |
| `assets/ref/svkatto.jpg` | 1600 x 1000 | SVkatto Oy:n sivu |
| `assets/ref/holske.jpg` | 1600 x 1000 | Holske Oy:n sivu |

Ennen ja jälkeen -slideri toimii parhaiten, kun molemmat kuvat on otettu samasta kohdasta samalla ikkunakoolla.

### 5. Hero ja jako (2 kuvaa + video)

| Tiedosto | Koko | Sisältö |
|---|---|---|
| `assets/hero-poster.jpg` | 1920 x 1080 | Videon ensimmäinen ruutu (näkyy heti ja reduced motionilla) |
| `assets/hero-poster-mobile.jpg` | 900 x 1400 | Pystyrajaus puhelimelle. Pääkohde keskelle |
| `assets/og/og-image.png` | 1200 x 630 | Jakokuva (WhatsApp, Facebook, LinkedIn). Valmis, tuli logopaketissa |
| `assets/hero.mp4` | 1920 x 1080, H.264, 8-15 s, alle 4 MB, ei ääntä | Taustavideo, saumaton luuppi |
| `assets/hero.webm` | sama, VP9 | Sama video WebM:nä |

Videon tunnelma: hidas ja rauhallinen. Esim. käsi selaa valmista nettisivua puhelimella työmaan reunalla, tai julkisivun maalaus etenee ja vaihtuu puhelimen ruudulla näkyvään sivuun. Ei stock-hymyjä. Vaalea, lämmin valo (sivu peittää kuvan vaalealla usvalla, jotta teksti erottuu). Kun video on lisätty: `config.mjs` -> `HERO_VIDEO: true`.

### 6. Logot
Valmiina. Logot `assets/logo/`, faviconit `assets/favicon/`, jakokuva `assets/og/`.

---

## Prompti demosivujen tekoon

Kopioi tämä, kun teet demon (Claude, Lovable, Framer tms.):

```
Tee yksisivuinen demonettisivu suomalaiselle rakennusalan pienyritykselle.
Ala: [Saneeraus / Sähkö / Putki ja LVI / Remontti / Katot / Maalaus]
Yrityksen nimi: [Ala] / Yrityksesi Oy (demo, ei oikea yritys)

Osiot järjestyksessä:
1. Header: logo vasemmalla, valikko (Palvelut, Työt, Kotitalousvähennys, Yhteystiedot), puhelinnumero-nappi oikealla.
2. Hero: iso kuva alan työstä, otsikko 3-5 sanaa, yksi lause, napit "Soita nyt" ja "Pyydä tarjous".
3. Luottamusrivi: 3 lyhyttä lupausta ikoneilla (esim. kiinteä tarjous, vastaamme samana päivänä, vastuuvakuutus).
4. Palvelut: 3 korttia, ikoni + otsikko + lyhyt kuvaus + kuva.
5. Ennen ja jälkeen -galleria: 2 vertailukuvaa liukusäätimellä.
6. Asiakasarviot: 3 korttia. Merkitse selvästi esimerkiksi, älä keksi nimiä.
7. Kotitalousvähennys: lyhyt selitys + esimerkkilaskelma ilman lukuja ([summa] €).
8. Palvelualue: kartta + "Toimimme kotipaikkakunnalla ja lähikunnissa".
9. Yhteystiedot: puhelin, sähköposti, lomake (nimi, puhelin, sähköposti, viesti).
10. Footer.
Mobiilissa: kiinteä alapalkki "Soita" + "Tarjous".

Tyyli: moderni, selkeä, paljon tilaa, yksi korostusväri, isot otsikot. Ei varjoja.
Kieli: suomi, sinä-muoto, lyhyet lauseet. Ei ajatusviivoja.
```

Ota jokaisesta demosta 2 kuvaa (1600 x 1000 ja 780 x 1688) ja lisäksi tarvittaessa ominaisuuskuvat (kohta 2) ja karusellikuvat (kohta 3).
