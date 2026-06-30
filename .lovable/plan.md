
# Raamatute desktopi-piirang ja mobiilieelvaate plaan

Eesmärk: vähendada piraatlust desktopis, kus on lihtne kasutada DevTools, Print-to-PDF ja ekraanisalvestust. Täisversioon on lubatud ainult mobiilis/tabletis (sh PWA ja Android-äpp).

## Käitumine seadme järgi

**Tuvastame seadme** kombinatsioonist: `navigator.userAgent` (mobile/tablet märksõnad) + `window.innerWidth < 1024` + touch toe kontroll. Salvestame tulemuse `useIsMobileOrTablet()` hookis.

| Seade | PDF | EPUB |
| --- | --- | --- |
| Mobiil / tablet / PWA / Android-äpp | Terve raamat | Terve raamat |
| Desktop (külaline või sisse logitud, ka tellija) | Esimesed **3 lehte** | **Tasuta sissejuhatuse peatükk** kui olemas, muidu blokeeritud |

Pärast eelvaadet näidatakse overlay-d sõnumiga:

> 📱 **Terve raamatu lugemiseks ava mobiilis või tahvelarvutis**
> [Lae Android-äpp] · [Lisa avaekraanile (PWA juhend)]

Piirang kehtib **kõigile** — ka aktiivse tellimuse omanikele — muidu kaitse mõte kaob.

## Muudatused

### 1. Uus hook `src/hooks/useIsMobileOrTablet.ts`
- Tuvastab mobile/tablet user-agendi järgi (`/Android|iPhone|iPad|iPod|Mobile|Tablet/i`)
- Lisaks vaatab `window.matchMedia('(pointer: coarse)')` ja viewport laiust
- Kui käivitub PWA standalone režiimis (`display-mode: standalone`), loeme alati mobiiliks

### 2. `src/components/PdfReader.tsx`
- Prop `previewOnly?: boolean`
- Kui desktop → renderdame ainult 3 esimest lehte, keelame edasiliikumise
- Kuvame `<DesktopBlockedOverlay />` viimasel lehel
- Peidame allalaadimise/printimise toolbar nupud (juba osaliselt tehtud)

### 3. `src/components/EpubReader.tsx`
- Prop `previewOnly?: boolean`
- Kui desktop ja raamatul on `intro_url` / esimene peatükk on tasuta → laadime ainult selle
- Kui pole tasuta sissejuhatust → kuvame kohe `<DesktopBlockedOverlay />` ilma sisuta
- Vajadusel laiendame `books` tabeli `has_free_intro` / `intro_chapter_id` veerguga (vt allpool — proovime kõigepealt EPUB spine'i esimese peatükki ilma DB muudatuseta)

### 4. Uus komponent `src/components/DesktopBlockedOverlay.tsx`
- Pooltäiusliku tausta peal kaart sõnumiga
- Nupud: Android Play Store link + "Lisa avaekraanile" juhend (taaskasutame olemasolevat PWA install loogikat)

### 5. `src/pages/Eraamatud.tsx`
- Raamatu avamisel edastame `previewOnly={isDesktop}` propi PDF/EPUB readerile
- Sissejuhatust ei käsitleta enam eraldi — Reader teeb otsuse

## Tehnilised detailid

**PDF eelvaate piirang:** `react-pdf`-is renderdame ainult `Math.min(3, numPages)` lehte ja eemaldame "next page" nupu pärast lk 3. Lk 3 lõpus sticky overlay.

**EPUB tasuta sissejuhatus:** epub.js `book.spine.items[0]` on tavaliselt sissekanne/sissejuhatus. Desktopis piirame `rendition.display()`-i ainult esimesele spine item-ile ja blokeerime `rendition.next()` kutsed. Kui esimene spine item on tühi/cover, libiseme edasi kuni esimese sisukohani (max item index 2).

**Seadme tuvastus on kliendipoolne** — teadlik kasutaja võib UA-d võltsida. See on aktsepteeritav, sest peamine eesmärk on takistada tavakasutaja juhuslikku kopeerimist ja muuta piraatlus tülikaks, mitte saavutada krüptograafilist kaitset. Tõsisem kaitse nõuaks serveripoolset rendert (suur töö, eraldi otsus).

**Tellimuste serveripoolne kontroll** jääb puutumatuks — `book-download` edge function genereerib endiselt signed URL-i, kui kasutajal on õigus raamatut näha. Desktopi piirang on puhtalt UI tasemel readeris.

## Mis EI muutu
- Maksed, tellimused, andmebaas, edge functions
- Raamatute nimekiri, ost, audio/video peatükid
- Mobiilikogemus (jääb täpselt samaks)
