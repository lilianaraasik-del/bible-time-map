# Plaan: E-raamatud kui eraldi sektsioon

Kaks projekti, kaks muudatust. Sisuline loogika ei muutu — ainult navigatsioon ja nähtavus.

---

## 1. Ajajoon (see projekt) — peida e-raamatud ja auth navist

**Fail: `src/components/Navigation.tsx`**

Eemalda navi-ribast järgmised elemendid (route'id App.tsx-is jäävad alles, et otselink töötaks):

- `E-raamatud` link (juba eelmises sammus muudetud välislingiks — see eemaldatakse täielikult, sest Bible Reader projekti link tuleb sinna)
- Login nupp (kui `session` puudub)
- Profiil + wallet münt nupp (kui `session` olemas)

Sama mobiilses menüüs (kui on duplikaadid).

**Mis JÄÄB navi:** Ajajoon, Paigad/Sündmused dropdown, Tabernaakel, Jeesuse sugupuu, keelevahetus, teema.

**Mis JÄÄB alles aga peidetult:** `/login`, `/profiil`, `/paketid` route'id ja failid — kasutatavad ainult otse-URL-iga (admin/debug otstarbel).

**E-raamatute väljalink:** kuna kogu e-raamatud läheb teise projekti alla, ei lisa siin enam `eraamat.piibel.ee` linki navi-ribasse. Kui hiljem soovid footri linki, saab eraldi lisada.

---

## 2. Bible Reader (eraldi projekt) — /eraamatud ja alamlehtedel minimaalne nav

Seda muudatust ei tee siin agent — sina lähed Bible Reader projekti ja annad sealsele agendile alljärgneva juhise.

**Sõnum Bible Reader agendile:**

> Tahan, et `/eraamatud` lehel ja kõigil selle alamlehtedel (raamatu avamine, lugeja vaade) oleks navigatsioon minimaalne — see toimib nagu eraldi sektsioon.
>
> **Mis JÄÄB nähtavale (kõikidel /eraamatud* lehtedel):**
> - Logo / saidi pealkiri (klikitav, viib `/eraamatud` peale)
> - Login / Profiil / Wallet münt (sama loogika nagu praegu)
> - Keelevahetus (ET/EN/RU)
> - Teema (tume/hele)
>
> **Mis PEIDETAKSE /eraamatud* lehtedel:**
> - Kõik teised nav lingid (Ajajoon, Piibli raamatud, Paigad, Sündmused, Tabernaakel, Jeesuse sugupuu, jne)
>
> **Implementatsioon:** `Navigation.tsx` komponendis kontrolli `useLocation().pathname.startsWith("/eraamatud")` ja renderda tingimuslikult kahte erinevat nav-paigutust (või sama, aga peida sisemised lingid). Footris samuti — kui footris on sektsiooni-lingid, peida need samuti.

---

## Tehnilised detailid

**Ajajoonis (`src/components/Navigation.tsx`):**

Eemalda read:
- E-raamatud `<a>` blokk (read ~44-55 praeguses failis)
- `session ? <Link to="/profiil">...</Link> : <Link to="/login">...</Link>` blokk (read ~101-127)

Sellega kaob ka vajadus `Library`, `Coins`, `LogIn` ikoonide impordi järele — eemalda need `lucide-react` impordist (lint puhtuse mõttes).

`AuthProvider` ja `useAuth` jäävad App.tsx-i alles, et `/profiil` jms otse-URL-iga töötaks.

**App.tsx:** muudatusi ei vaja — route'id `/login`, `/profiil`, `/paketid` jäävad alles.

---

## Mida see EI tee

- Ei kustuta `Eraamatud.tsx`, `piibelApi.ts`, `eraamatud.ts`, `EpubReader.tsx` ega edge function'eid (`book-proxy`, `sync-piibel-session`). Need jäävad surnud koodina kuni kinnitad eemaldamise.
- Ei muuda `piibel_sessions` tabelit ega selle RLS poliitikaid.
- Ei tee Bible Reader projektis ühtegi muudatust — see on käsitsi sammu sinu kätes.

Pärast plaani kinnitamist saan kõik need (kasutamata failid + edge function'id + tabel) eraldi käsklusega ära koristada, kui Bible Reader pool töötab.
