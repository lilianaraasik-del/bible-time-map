## Taust

18. juunil eemaldasime sellest projektist kogu e-raamatute, autentimise, Stripe maksete ja rahakoti koodi (vt vestluse sõnumeid #744 ja #746). Eesmärk oli sel ajal piibel.ee tasuta hoida ja e-raamatud eraldi projektis remixida — aga remix ei õnnestunud (omanikuõiguse probleem), Transfer to workspace ei tööta ja nüüd ka Remix annab vea „Remixing projects with payments enabled is not supported".

Ainus järelejäänud variant on **GitHub**: ühendame selle projekti GitHubi külge ja loome uues workspace'is uue projekti samast repost. Kuid enne, kui me seda teeme, peame **e-raamatute koodi tagasi panema** — muidu saab uus workspace tühja projekti.

## Plaan

### Samm 1: Taasta kood History kaudu (soovitan)

Kõige puhtam viis on kasutada Lovable'i sisseehitatud History't, sest see toob tagasi täpselt selle koodi, mis eemaldati — ilma vigade ja puuduvate sõltuvusteta.

1. Ava History tab (üleval chati kõrval)
2. Vali versioon **enne 18. juuni 18:35** (sõnum #743 või varasem) — see on viimane seis, kus e-raamatud, auth, Stripe ja rahakott olid täielikult olemas
3. Kliki „Restore" sellel versioonil

```xml
<presentation-actions>
  <presentation-open-history>Ava History</presentation-open-history>
</presentation-actions>
```

**Hoiatus:** restore toob tagasi *kogu* selle hetke seisu. Kui peale 18. juunit on tehtud muid muudatusi, mida sa tahad alles hoida, siis need lähevad kaduma. Vestluse põhjal me peale 18. juunit koodimuudatusi ei teinud (ainult arutelu support'iga), nii et see peaks olema turvaline — aga palun kinnita enne kliki tegemist.

### Samm 2: Ühenda GitHubiga

Pärast restore't:
1. Chat composer → **+ menüü** → **GitHub** → **Connect project**
2. Autoriseeri Lovable GitHub App
3. Vali konto/organisatsioon ja kliki „Create Repository"

### Samm 3: Loo uus projekt teises workspace'is

1. Lülita teise workspace'i
2. Loo uus projekt sealt GitHubist (kui Lovable lubab repost importi — hetkel on otsene import piiratud, vajadusel kasuta `Code → Download ZIP` + manuaalset kopeerimist uue tühja projekti koodi sisse)

### Samm 4: Backend uues projektis

⚠️ **Tähtis:** GitHub kannab ainult koodi. Lovable Cloud backend (Supabase tabelid, Stripe võtmed, edge funktsioonid, seansid) ei kandu kaasa.

Uues projektis tuleb:
- Lubada Lovable Cloud → migratsioonid loovad tabelid (`piibel_sessions`, `commentaries`) automaatselt
- Lisada uuesti saladused: `STRIPE_SANDBOX_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`
- Seadistada Google auth uuesti
- Olemasolevad kasutajaandmed/tellimused uude Supabase'i ei kandu — kui need on vajalikud, teeme eraldi CSV ekspordi/impordi

### Samm 5: Eemalda e-raamatud sellest projektist uuesti

Kui uus projekt töötab teises workspace'is, kordame 18. juuni puhastust siin: eemaldame e-raamatud, auth, Stripe ja rahakoti, et piibel.ee jääks puhas tasuta projekt. Navigatsioonis lülitub link uue projekti URL-ile.

## Alternatiiv: manuaalne taastamine

Kui History ei sobi (nt sa tahad peale 18. juunit tehtud muudatusi alles hoida), võin samm-sammult uuesti luua kõik eemaldatud failid:

- `src/pages/Eraamatud.tsx`, `Login.tsx`, `Profiil.tsx`, `Paketid.tsx`
- `src/components/EpubReader.tsx`, `PdfReader.tsx`, `StripeEmbeddedCheckout.tsx`
- `src/contexts/AuthContext.tsx`
- `src/lib/piibelApi.ts`, `stripe.ts`, `eraamatud.ts`
- Edge functions: `create-checkout`, `payments-webhook`, `_shared`, `book-proxy`, `google-verify`, `sync-piibel-session`
- Lisada tagasi npm: `@stripe/react-stripe-js`, `@stripe/stripe-js`, `epubjs`, `react-pdf`
- Taastada `App.tsx` ja `Navigation.tsx` muudatused

See on aeganõudvam ja vigadele aldis, sest peame iga faili nullist kirjutama eelmise mälu järgi. **Soovitan History varianti.**

## Küsimus sulle

Kumb variant: **History restore** (kiire, puhas) või **manuaalne taastamine** (säilitab peale 18. juunit tehtud muudatused)?
