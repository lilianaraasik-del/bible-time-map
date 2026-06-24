# Offline-raamatud (ainult ostetud PDF/EPUB)

Eesmärk: kasutaja saab ostetud e-raamatu telefoni/arvutisse alla laadida ja hiljem ilma internetita avada. Heli ja video offline-toetust **ei lisa** (kasutaja valik).

## Kuidas see kasutaja jaoks töötab

Igal ostetud raamatul "Sinu raamatud" sektsioonis ilmub uus nupp **"Lae alla offline"** (allanool ikooniga). Kui kasutaja vajutab:

1. Raamatu fail (PDF või EPUB) tõmmatakse alla ja salvestatakse brauseri lokaalsesse andmebaasi (IndexedDB).
2. Nupp muutub roheliseks linnukeseks ("Saadaval offline") + väike "X" eemaldamiseks.
3. Kui kasutaja avab raamatu järgmine kord — internetiga või ilma — laetakse see kohe IndexedDB-st, mitte serverist.

Kui kasutaja on offline ja raamat pole alla laetud, näeb ta selget teadet "Raamat pole offline saadaval — ühenda internetti või lae raamat enne alla."

Sektsiooni "Sinu raamatud" päisesse tuleb väike olekuriba ("3 raamatut salvestatud offline · 24 MB") + nupp "Halda offline-raamatuid", mis avab dialoogi kõigi salvestatud raamatute nimekirjaga ja võimaluseks neid kustutada.

## Piirangud, mida kasutajale selgitada

- Töötab ainult **selles brauseris ja selles seadmes**, kuhu raamat alla laeti. Teises brauseris/seadmes peab uuesti alla laadima.
- Brauseri andmete kustutamine ("Clear site data") kustutab ka offline-raamatud.
- Heli ja video offline’i veel ei tee — need vajavad internetti.
- Failid jäävad krüpteerimata IndexedDB-sse — sama põhimõte nagu praegu avatud raamatuga, aga kui telefoni keegi teine kasutab, on tal samade andmetega ligipääs.

## Tehniline ülevaade

### Uus moodul `src/lib/offlineBooks.ts`

IndexedDB wrapper (~150 rida, ilma uue npm-paketita — kasutame natiivset `indexedDB` API-d):

- `db: "piibel-offline-books"`, store `"books"` keyed by `bookId`.
- Iga kirje: `{ bookId, title, format: "pdf"|"epub", blob: Blob, size: number, savedAt: number }`.
- API:
  - `saveBook(book, blob, format)`
  - `getBook(bookId): Promise<{blob, format} | null>`
  - `deleteBook(bookId)`
  - `listBooks(): Promise<Array<{bookId, title, format, size, savedAt}>>`
  - `getTotalSize()`
  - `hasBook(bookId): Promise<boolean>`
- React hook `useOfflineBooks()`, mis hoiab Set-i salvestatud `bookId`-dest ja kogusummat. Jagatud `Eraamatud.tsx` ja uue haldusdialoogi vahel.

### Muudatused `src/pages/Eraamatud.tsx`

1. **Allalaadimisnupp "Sinu raamatud" kaartidel** (ainult kui `bookFormat(book)` on `pdf` või `epub`):
   - Olek "ei ole salvestatud" → nupp `Download` ikooniga.
   - Allalaadimise ajal → spinner + progress (kasutame `fetch` + `response.body` `ReadableStream`, et näidata `XX%`).
   - Salvestatud → `CheckCircle` ikoon roheliselt + väike `X` eemaldamiseks.
   - Allalaadimine kasutab sama URL-i loogikat mis avamine: `bookFileUrl(book, auth)` läbi `proxyUrl()` (et CORS töötaks). Toast õnnestumisel/veal.

2. **Raamatu avamine — eelista offline koopiat**:
   - Praegune `openBook` (umbes rida 400) muutub: enne `fetch`/HEAD-i kontrolli, kas `getBook(book.id)` annab Blob-i. Kui jah, loome `URL.createObjectURL(blob)` ja anname selle `EpubReader`-le või `PdfReader`-le `url` propina.
   - Object URL-i tuleb `URL.revokeObjectURL` kutsuda kui `player` state nullib.
   - Kui offline’s puudub ja `navigator.onLine === false`, näita toast "Raamat pole offline saadaval".

3. **Olekuriba + halduse dialoog**:
   - "Sinu raamatud" päise alla väike rida "N raamatut · X MB salvestatud — Halda".
   - "Halda" avab `Dialog` komponendi, kus iga rea juures pealkiri, formaat, suurus, salvestamise kp ja "Kustuta" nupp.
   - Dialoog elab sama `Eraamatud.tsx`-i sees (väike komponent, ei tee eraldi faili).

4. **Online/offline indikaator**: kasutame `navigator.onLine` + `window.addEventListener("online"/"offline")` ainult selle jaoks, et muuta avamisveateate sõnastust ja blokeerida ostmist offline’s (osta saab ainult online).

### Muutmata jäävad failid

- `EpubReader.tsx`, `PdfReader.tsx` — võtavad juba `url` propi, töötavad blob: URL-iga ilma muudatusteta.
- `vite.config.ts`, `index.html` — **ei lisa service worker'it ega PWA-d** (kasutaja küsis ainult ostetud raamatuid offline'i, mitte tervet rakendust). IndexedDB üksi ei vaja SW-d.
- `src/lib/eraamatud.ts` — muudatusi pole vaja.
- Backend / Supabase — muudatusi pole vaja.

## Mida ma EI tee

- Ei lisa `vite-plugin-pwa`-d ega service worker'it (kogu rakendus offline polnud soovitud).
- Ei tee heli/video offline-allalaadimist.
- Ei lisa krüpteerimist offline-blobile (kui hiljem soovitakse, saab teha eraldi sammuna).
- Ei muuda kopeerimiskaitse loogikat — see jääb täpselt samaks.
