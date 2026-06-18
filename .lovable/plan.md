# Plaan: E-raamatud eraldi projekti

## Ülevaade
Praegune projekt (piibel.ee) jääb tasuta Piibli ajajoone/raamatute lehena. E-raamatute funktsionaalsus liigub uude remixitud projekti, kus toimub müük ja lugemine. piibel.ee-le jääb ainult link uuele projektile.

## Samm 1: Remix (käsitsi, sinu poolt)
Lovable UI-s:
- Vasakul sidebar → praegune projekt → kolm täppi (⋯) → **Remix**
- Nimeta uus projekt nt `piibel-eraamatud`
- Anna mulle teada, kui remix on tehtud (või ava uus projekt ja jätka seal tööd)

## Samm 2: Uues projektis (eraldi vestlus)
Seal palud:
- Eemaldada kõik **välja arvatud** e-raamatute osa:
  - Säilita: `src/pages/Eraamatud.tsx`, `src/components/EpubReader.tsx`, `src/components/PdfReader.tsx`, `src/data/eraamatud.ts`, Stripe checkout, `book-proxy` ja `payments-webhook` edge functions, auth
  - Eemalda: Ajajoon, Raamat, Kaart, Sündmused jne
- Tee `/` (avaleht) e-raamatute lehe vaikimisi marsruudiks
- Backend: **uus Lovable Cloud backend** (vt allpool selgitust)

## Samm 3: Praeguses projektis (piibel.ee) — see plaan katab seda
Eemalda e-raamatute kood ja asenda navigatsiooni link uue projekti URL-iga.

### Eemaldatavad failid
- `src/pages/Eraamatud.tsx`
- `src/components/EpubReader.tsx`
- `src/components/PdfReader.tsx`
- `src/data/eraamatud.ts`
- `supabase/functions/book-proxy/`
- `supabase/functions/payments-webhook/` (kui kasutusel ainult e-raamatute jaoks)
- Stripe-seotud kood (kui ei kasutata mujal)

### Muudetavad failid
- `src/App.tsx` — eemalda `/eraamatud` route ja import
- `src/components/Navigation.tsx` — asenda sisemine `/eraamatud` link välise `<a href="https://...lovable.app" target="_blank">` lingiga (URL paneme paika, kui uus projekt on olemas)
- Eemalda kasutamata sõltuvused (epubjs, react-pdf vms) `package.json`-ist

## Backend-valikute selgitus

### Variant A: Uus Lovable Cloud backend uues projektis (SOOVITAN)
- Uus, eraldi Supabase + Stripe konfiguratsioon
- piibel.ee saab oma backend'i täielikult puhastada e-raamatute koodist
- Stripe võtmed ja Google auth tuleb uues projektis uuesti seadistada (~10 min)
- **Plussid:** puhas eraldatus, sõltumatu skaleerimine, lihtne hallata
- **Miinused:** tellimuste/kasutajate ajalugu (kui on) jääb vanasse — vajab migreerimist, kui oluline

### Variant B: Jagatud backend (uus projekt kasutab piibel.ee Supabase'i)
- Uus projekt teeb päringuid praeguse projekti edge functions'idele
- piibel.ee peab säilitama `book-proxy`, `payments-webhook`, auth jne — kood jääb alles, ainult frontend eemaldatakse
- Vaja seadistada CORS kahele domeenile
- **Plussid:** olemasolevad kasutajad/tellimused töötavad edasi
- **Miinused:** sidumine, keerukam, piibel.ee ei ole tegelikult "puhas"

**Soovitus:** Variant A, kui sul pole veel makseid/kasutajaid; Variant B, kui on olemasolevaid maksvaid kliente.

## Järjekord
1. Sa vastad: kas on olemas makseid/kasutajaid (Variant A vs B)?
2. Sa teed remixi UI-s
3. Sa avad uue projekti ja palud seal e-raamatute setup'i
4. Saad uue projekti URL-i
5. Tuled tagasi siia → ma kustutan e-raamatute koodi ja panen lingi navigatsiooni

## Küsimus enne implementatsiooni
- Kas sul on praegu **päris kliente / tellimusi** Stripe'is e-raamatute eest? (mõjutab Variant A vs B valikut)
- Kas alustame kohe sammuga 3 (piibel.ee puhastamine), eeldades et URL tuleb hiljem ja paneme esialgu placeholder'i (`#`)?
