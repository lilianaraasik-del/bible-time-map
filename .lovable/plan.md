## Eesmärk

Asendada KERK e-raamatud projektis senine **admin_books + KERK rahakott** süsteem **selle projekti `eraamat.piibel.ee` API + peatükipõhise rahakoti süsteemiga**, kohandatud TanStack Start raamistikule. Backend jääb `eraamat.piibel.ee` peale — KERK Lovable Cloud lisatakse vaid auth sillaks (sama mall mis siin).

## Tähtsad tagajärjed

- KERK olemasolev `admin_books` tabel ja seotud kood (`lib/eraamatud.ts` `fetchAdminBooks`, `adminBookToEraamat`, `adminBooks.functions.ts`) jäävad puutumata, kuid e-raamatukogu lehel neid enam ei kasutata.
- KERK senine `wallet.functions.ts` rahakoti voog (`purchaseBook`, `getMyWallet`) e-raamatukogu lehel asendatakse piibel.ee `wallet_coin` süsteemiga. Kui `wallet.functions` kasutab veel muid lehti (nt /tellimus), need jäävad alles.
- KERK `useAuth` saab paralleelse `usePiibelSession` hooki — Supabase auth (Lovable Cloud) jääb identiteediks, aga taustal sünkroonitakse piibel.ee kasutaja sama mustriga nagu siin projektis (`piibel_sessions` tabel + `sync-piibel-session` edge function).

## Sammud KERK projektis

### 1. Backend (Supabase / Lovable Cloud)

- **Migration**: lisa `piibel_sessions` tabel (sama skeem mis siin: `auth_user_id`, `piibel_user_id`, `piibel_unique_token`, `email`, `full_name`, timestamps; RLS — kasutaja näeb/muudab ainult oma rida).
- **Edge function `sync-piibel-session`**: võtab praeguse Supabase kasutaja, kutsub piibel.ee `login` (type=2 Google) tema emailiga, salvestab tulemuse `piibel_sessions`-i, tagastab `PiibelSession`.
- **Edge function `book-proxy`**: võtab `?url=` parameetri, lae EPUB/PDF piibel.ee'st, lisab CORS päised, tagastab streamina (sama nagu siin).
- Mõlemad funktsioonid `verify_jwt = true` `sync-piibel-session` jaoks, `false` `book-proxy` jaoks. Mõlemad lisatud `supabase/config.toml`-i.

### 2. Lib failid (`src/lib/`)

- **`eraamatud.ts`** — kirjuta üle selle projekti versiooniga (lisa `proxyUrl`, `bookFileUrl(book, auth)`, säilita `EraamatApi`, `MediaKind`, `BookFormat`, `getMediaKind`, `bookFormat`, `youtubeEmbed`, `videoEmbedUrl`, `audioUrl`, `fetchEraamatud`). Eemalda KERK `fetchAdminBooks` / `adminBookToEraamat` / `fetchAllBooks` (või jäta alles, kui kasutusel mujal — viitega kommentaaris).
- **`piibelApi.ts`** — uus fail, kopeerin siit 1:1.

### 3. Auth (`src/hooks/usePiibelSession.tsx`)

- Uus hook, mis kasutab olemasolevat `useAuth`'i Supabase kasutaja jaoks ja lisab piibel sessiooni laadimise:
  - Vaatab `piibel_sessions` tabelist rea `auth_user_id` järgi.
  - Kui puudub, kutsub `sync-piibel-session` edge function'i.
  - Pärib `piibelGetProfile` `wallet_coin` värskendamiseks.
- Tagastab `{ session: PiibelSession | null, loading, refreshProfile }`.

### 4. Eraamatud route (`src/routes/eraamatud.tsx`)

- Asendan praeguse route'i sisu selle projekti `pages/Eraamatud.tsx` loogikaga:
  - Episood-põhine avamine (`piibelGetEpisodeBookByContent`).
  - Müntidega ostmine (`piibelBuyContentEpisode`) + ostuajaloo (`piibelGetWalletTransactions`) põhine lukustuse kontroll.
  - Hindade ülevaade peatükkide haaval (paralleelne 4-worker fetch).
  - Peatükkide loendi dialog mitme peatükiga raamatutele.
  - `proxyUrl` EPUB/PDF jaoks.
- Asendused TanStack Start mustri jaoks:
  - `export const Route = createFileRoute("/eraamatud")({ head, component })`.
  - `useNavigate` → `@tanstack/react-router` ja `navigate({ to: "/auth" })`.
  - `toast` `@/hooks/use-toast` asemel → `sonner` (mida KERK juba kasutab).
  - `Navigation` komponent asendatud KERK headeri mustriga (Link KERK + AuthHeaderButton).
  - `useAuth` → uus `usePiibelSession`.

### 5. EpubReader / PdfReader

- Võrdle KERK versioone selle projekti omaga; kui käitumine erineb (mark/lehed, kohtade salvestamine), kirjuta üle selle projekti versiooniga. Kui sisuliselt sama, jäta alles.

### 6. Login (`src/routes/auth.tsx` või `login.tsx`)

- Pärast edukat Supabase sisselogimist (Google), tagumiselt kutsutakse `sync-piibel-session` (uus `usePiibelSession` hook teeb seda automaatselt järgmisel laadimisel). Login lehte ennast ei pea muutma — kui Google on juba olemas.

### 7. Eemaldatav / vananenud kood

- `lib/wallet.functions.ts` kasutus `eraamatud.tsx`-is asendatakse; fail jääb, kui mujal vaja.
- `Coins` import + KERK `Coins`-ikoonidega UI elemendid asendatakse selle projekti hinnasildi/lukustuse mustriga.

## Mida ma EI tee selle pordi raames

- Ei muuda KERK `/tellimus`, `_authenticated/*` lehti.
- Ei migreeri admin_books andmeid kuhugi — need jäävad andmebaasi alles, lihtsalt e-raamatukogu leht neid ei kasuta.
- Ei lisa Piibli raamatute kirjelduste süsteemi (Raamat.tsx + data failid + i18n) — kui soovid, see on järgmine eraldi etapp.

## Tehnilised märkused

- KERK kasutab React 19 + TanStack Router 1.168 + `sonner` + Tailwind 4. Kõik kasutatavad shadcn komponendid (`Card`, `Dialog`, `Tabs`, `Skeleton`, `Button`) on juba olemas.
- `react-pdf` (10.4) ja `jszip` (3.10) olemas — EPUB/PDF lugejad töötavad otse.
- piibel.ee endpointid (`api.piibel.ee`, `eraamat.piibel.ee/admin/public/api`) töötavad kõikjalt, CORS pole probleem JSON päringute jaoks. Probleem on ainult EPUB/PDF failide laadimisel — selle lahendab `book-proxy` edge function.

## Pärast portimist

KERK e-raamatukogu kuvab piibel.ee `api.piibel.ee/routes/books.php` allikast tulevaid raamatuid, mängib audio/videot, lubab tasulisi peatükke müntidega ostmist. Müntide rahakott on piibel.ee oma — KERK kasutaja peab piibel.ee kontot omama (Google sisselogimine teeb selle automaatselt).
