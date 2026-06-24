## Eesmärk

Kolida e-raamatud (EPUB/PDF) `api.piibel.ee`-st Lovable Cloud privaatsesse storage bucketisse, lisada veebipõhine kuu/aasta tellimuse plaan, ja jätta piibel.ee API alles autentimiseks ning ülejäänud sisule (kommentaarid, audio, video jne).

## 1) Raamatute majutus — privaatne bucket

- Loon privaatse bucketi `eraamatud` (Storage tools).
- Loon `public.books` tabeli raamatute metaandmetega (asendab `api.piibel.ee/routes/books.php` _ainult raamatute osas_):
  - `id`, `slug`, `title`, `description`, `author`, `language`, `cover_path` (storage path), `file_path` (storage path), `format` (`epub`|`pdf`), `is_free` (bool), `sort_order`, `published_at`, `created_at`.
  - RLS: `SELECT` lubatud kõigile (`anon`+`authenticated`) — nimekiri on avalik; failid eraldi gateitud.
  - GRANT + RLS + service_role haldus.
- Loon admin-vaate `/admin/eraamatud` (ainult `admin` rolliga kasutajatele — eraldi `user_roles` tabel `app_role` enum'iga `admin`/`user`):
  - Upload form: pealkiri, kirjeldus, kaas (pilt), fail (epub/pdf), tasuta/tasuline lipp.
  - Failid laaditakse `eraamatud` bucketisse läbi `supabase.storage.from('eraamatud').upload(...)`.
- Migreerimine: laadid esialgsed raamatud üles admin UI kaudu (ma ei tõmba neid automaatselt vanast API-st, sest see eeldaks admin tokenit).

## 2) Raamatufaili allalaadimine — uus edge function

`book-proxy` asendub `book-download` edge functioniga:
- Sisendid: `bookId`.
- Verifitseerib JWT → leiab `auth_user_id`.
- Kontrollib `public.books.is_free` — kui ei ole tasuta, kontrollib aktiivset tellimust (`public.subscriptions` rida `status in ('active','trialing')` ja `current_period_end > now()`).
- Genereerib `supabase.storage.from('eraamatud').createSignedUrl(file_path, 300)` ja tagastab `{ url }`.
- Klient (`EpubReader`, `offlineBooks`, `Eraamatud`) kasutab seda URL-i otse — `proxiedFetch`-i enam vaja ei ole raamatute jaoks.

Vana `book-proxy` edge function ja `bookFileUrl`/`proxiedFetch` raamatu-spetsiifiline loogika eemaldatakse.

## 3) Tellimuse plaan (kuu + aasta)

Lovable sisseehitatud Stripe makseintegratsioon (managed payments, ~80 riigi tax handling sees).

- Tooted (`payments--create_product` + `payments--create_price`):
  - Toode: `eraamatud_subscription` ("Materjalide tellimus")
  - Hinnad:
    - `eraamatud_monthly` — nt 4.99 €/kuus
    - `eraamatud_yearly` — nt 49 €/aasta
  - Täpsed hinnad kinnitad sa enne kui ma loon.
- `subscriptions` tabel (vt `stripe-subscriptions` mall): `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `price_id`, `status`, `current_period_end`, `cancel_at_period_end`, `environment`, `created_at`.
- Edge functions:
  - `create-checkout` — embed checkout `managed_payments: { enabled: true }`, JWT verifitseeritud (jätkab juba eksisteerivat fixed funktsiooni, kohandame eraamatud toote jaoks).
  - `create-portal-session` — Stripe Billing Portal.
  - `stripe-webhook` — sünkroniseerib `subscriptions` tabeli.
- UI:
  - Uus leht `/tellimus` plaani valikuga (kuu vs aasta), embedded checkout overlay.
  - `useSubscription` hook + `<SubscribeGate>` komponent.
  - "Halda tellimust" nupp (avab Stripe portal uues tabis).

## 4) Ligipääsu loogika `/eraamatud`

- Tasuta raamat → kõigile (ka sisselogimata) — signed URL ilma kontrollita.
- Tasuline raamat → vajalik:
  1. Sisselogimine (praegune piibel.ee API auth jääb alles, sünkroniseeritakse `piibel_sessions` → `auth.users` nagu praegu).
  2. Aktiivne `subscriptions` rida.
- Kui kasutaja on sisse logitud aga tellimust ei ole → näita CTA "Telli alates 4.99 €/kuus" mis viib `/tellimus`-e.

Vana piibel.ee `is_paid_novel` + `unique_token` loogika eemaldatakse raamatute teelt (jääb alles ülejäänud sisu jaoks API-s, kuid mitte raamatutes).

## 5) Mida API-st EI puudutata

- Login/sessioonid (`piibel_sessions` tabel jääb).
- Kommentaarid, audio, video, muud `books.php` mitte-raamat sisu (kui content_type=1 audio või 3 video — need jätkavad senise API kaudu, kui sa just ei taha ka neid kolida; vaikimisi EI puuduta).
- `eraamatud` lehe audio/video tabid jätkavad senise API kaudu, eraldame ainult `content_type=2` raamatud uude allikasse.

## 6) Failide kustutamine ja puhastamine

- Kustutada: `supabase/functions/book-proxy/`, `src/lib/proxiedFetch.ts` raamatu-spetsiifika.
- Uuendada: `Eraamatud.tsx` — raamatute tab tõmbab `public.books` tabelist; audio/video jätkavad senise API kaudu.

## Tehniline kokkuvõte (kiirvaade)

```text
Privaatne bucket: eraamatud/
  ├─ covers/<slug>.jpg
  └─ files/<slug>.epub | .pdf

DB tabelid (uued):
  - books (avalik SELECT, admin INSERT/UPDATE/DELETE)
  - user_roles + app_role enum + has_role()
  - subscriptions (Stripe sync)

Edge functions:
  - book-download   (uus, asendab book-proxy)
  - create-checkout (uuendatud eraamatud toote jaoks)
  - create-portal-session (uus)
  - stripe-webhook  (uus)
  - book-proxy      (kustutatud)

Lehed:
  - /eraamatud      (loeb public.books, signed URL läbi book-download)
  - /tellimus       (uus — kuu/aasta plaan, embedded checkout)
  - /admin/eraamatud (uus — admin upload)
```

## Mida vajan sinult enne ehitamist

1. **Hinnad**: kinnita `4.99 €/kuus` ja `49 €/aasta` — või paku enda omad.
2. **Tasuta ribi**: kas mõni raamat jääb tasuta (sissejuhatuseks), või kõik tasulised tellimuse taga?
3. **Admin kasutaja**: kelle email muutub esimeseks adminiks (sinu oma?)?
4. **Maksete eelduseks**: pean enne ehitust kutsuma sind sisse lülitama sisseehitatud Stripe makseid (üks klikk Lovable UI-s) — kas oled selleks valmis?

Niipea kui need kinnitad, alustan ehitamist alates DB-skeemist ja bucketist, siis admin upload, siis tellimuse plaan, siis lehed.