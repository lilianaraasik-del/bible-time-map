# Mitmekeelne tugi: Eesti / Inglise / Vene

## Eesmärk
Kogu rakendus (UI + sisu) töötab kolmes keeles: **ET (vaikimisi)**, **EN**, **RU**. Keelevalija on navigatsiooniribal paremal (theme toggle kõrval). Valitud keel salvestub `localStorage`-i.

## Tehniline lahendus

**Pakettid:** `i18next`, `react-i18next`, `i18next-browser-languagedetector` (kasutame ainult localStorage detektorit, mitte brauserit — vaikimisi jääb eesti)

**Struktuur:**
```
src/i18n/
  index.ts              // i18n init
  locales/
    et/
      common.json       // nav, nupud, jalus, üldine UI
      pages.json        // pealkirjad ja tekstid igal lehel
      books.json        // raamatute nimed, kirjeldused, tsitaadid
      events.json       // UT sündmused
      places.json       // Piibli paigad
    en/ (sama struktuur)
    ru/ (sama struktuur)
```

**Komponendid:**
- `src/components/LanguageSwitcher.tsx` — kompaktne ET/EN/RU dropdown lipukestega (või lihtsalt koodidega), lisatakse `Navigation.tsx`-i `ThemeToggle` kõrvale
- Olemasolevad andmefailid (`bookQuotes.ts`, `utEvents.ts`, `additionalBookDetails.ts`) — võtmed jäävad samaks, tekstid kolitakse `books.json` / `events.json`-i, ning komponendid loevad `t(\`books.${slug}.quote\`)` jms kaudu

## Sammud

1. **Install** `i18next react-i18next i18next-browser-languagedetector`
2. **Loo `src/i18n/index.ts`** — init, fallback `et`, detector ainult `localStorage`-st, vaikimisi `et`
3. **Impordi `./i18n` failis `src/main.tsx`** (enne `App`)
4. **Eralda kogu UI tekst** kõikidest lehtedest võtmeteks (`common.json`, `pages.json`)
5. **Konverdi sisuandmed:**
   - `bookQuotes.ts` → tsitaadid `books.json`-i (`books.<slug>.quote` + `books.<slug>.reference`)
   - `utEvents.ts` → sündmuste pealkirjad/kirjeldused `events.json`-i
   - `additionalBookDetails.ts` → raamatute kirjeldused `books.json`-i
   - Originaalfailid jätame võtmestruktuuriks, tekstid loetakse `t()`-ga
6. **Tõlgi kõik kolmes keeles** (ET = praegune tekst, EN ja RU professionaalse kvaliteediga tõlge)
7. **`LanguageSwitcher`** komponent + integreeri `Navigation.tsx`-i
8. **Asenda kõik kõvakoodis tekstid** `useTranslation()` + `t('võti')` väljakutsetega kõikides lehtedes/komponentides:
   - `Navigation`, `Index`, `BibleTimeline`, `Raamat`, `Paigad`, `Sundmused`, `Eraamatud`, `Login`, `Profiil`, `Paketid`, `Tabernacle`, `NotFound`, jalus, lugejad
9. **`<html lang>`** uuendamine vastavalt valitud keelele (`useEffect` `i18n.language` peal)
10. **SEO:** `index.html` `<title>` ja meta jäävad eesti vaikimisi; lisame dünaamilise `document.title` igale lehele valitud keele järgi

## Ulatus / hoiatus

See on **mahukas muudatus** — ~15 lehte/komponenti ja sadu stringe. Tegelen sellega ühe sammuga, aga tulemus tuleb kontrollida lehthaaval. Kui soovid, võin esimesel etapil teha **ainult raamistiku + navi + avalehe + ajajoone** tööle, ja ülejäänud lehed lisada järgmistes voorudes — nii saad varakult kvaliteeti hinnata.

## Küsimus enne alustamist
Kas soovid:
- **A)** Kõik korraga (üks suur muudatus, pikem ootamine, kõik lehed valmis)
- **B)** Etapiviisi: 1) raamistik + Navi + Avaleht + Ajajoon → 2) Raamatu leht + sisu → 3) Paigad/Sündmused/E-raamatud → 4) Auth/profiil/paketid/tabernaakel

Soovitan **B** — saad iga etapi järel kvaliteeti hinnata ja vajadusel tõlkeid korrigeerida enne edasi liikumist.
