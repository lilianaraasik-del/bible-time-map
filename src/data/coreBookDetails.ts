// Põhiraamatud (algne andmestik). Hoiame eestikeelse lähteteksti siin; UI loeb i18n-st.
import type { BookDetail } from "./additionalBookDetails";

export const coreBookDetails: Record<string, BookDetail> = {
  "1-mooses": {
    name: "1. Mooses",
    author: "Mooses",
    period: "u 1445-1405 eKr",
    category: "Seadus",
    overview: "1. Moosese raamat on alguse raamat - see räägib maailma loomisest, inimkonna pattulangemisest ja Jumala plaanist päästa inimsugu. See näitab, kuidas Jumal valis Aabrahami ja tema järglased, et luua rahvas, kelle kaudu tuleb Päästja. Raamat õpetab meile Jumala võimsust, headust ja ustavust.",
    authorFacts: [
      "Juhtis iisraellasi Egiptusest välja",
      "Sai Siinai mäel Jumalalt 10 käsku",
      "Kirjutas viis esimest Piibli raamatut (Pentateuhi)",
      "Elas 120 aastat"
    ],
    additionalFacts: [
      "Mooses oli kolmest õest-vennast noorim",
      "Tema õde Mirjam oli piisavalt vana, et jälgida, mis tema vennakesega juhtuma hakkab",
      "Tema vend Aaron oli kolm aastat vanem",
      "Kasvas üles vaarao õukonnas, kuid valis oma rahva"
    ],
    breakdowns: [
      { title: "Loomislugu (ptk 1-2)", description: "Jumal loob taeva, maa ja inimese kuue päevaga" },
      { title: "Pattulangemine (ptk 3)", description: "Aadam ja Eeva langevad kiusatusse ja kaotavad Eedeni" },
      { title: "Noa laev (ptk 6-9)", description: "Jumal päästab Noa ja tema pere veeuputusest" },
      { title: "Aabrahami kutsumine (ptk 12)", description: "Jumal kutsub Aabrahami ja tõotab talle suure rahva" },
      { title: "Joosepi lugu (ptk 37-50)", description: "Joosep müüakse orjaks, kuid saab Egiptuse valitsejaks" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "2-mooses": {
    name: "2. Mooses",
    author: "Mooses",
    period: "u 1445-1405 eKr",
    category: "Seadus",
    overview: "2. Moosese raamat räägib vaprusest, usust ja vapustavatest imedest. See näitab meile, kuidas Jumal vabastab oma rahva orjusest ja juhib neid läbi kõrbe tõotatud maale. Raamat õpetab, et Jumal kuuleb meie hüüdeid ja tuleb appi ka siis, kui olukord tundub lootusetuna. 10 käsku annavad meile moraalsed juhised elamiseks ja näitavad Jumala armastust meie vastu.",
    authorFacts: [
      "Juhtis iisraellasi Egiptusest välja",
      "Sai Siinai mäel Jumalalt 10 käsku",
      "Kirjutas viis esimest Piibli raamatut",
      "Nägi Jumala imetegusid ja ime"
    ],
    additionalFacts: [
      "Põlev põõsas oli esimene koht, kus Jumal ilmutas end Moosesele",
      "10 nuhtlust Egiptlastele tõestasid Jumala võimsust",
      "Punase mere jagunemine on üks tuntuimaid Piibli imetest",
      "Kogudusetelk (tabernaakkel) oli Jumala elamispaik rahva keskel"
    ],
    breakdowns: [
      { title: "Iisraeli orjapõli (ptk 1-2)", description: "Iisrael on Egiptuses orjuses, Mooses sünnib" },
      { title: "Põlev põõsas (ptk 3)", description: "Jumal ilmub Moosesele ja kutsub teda rahvast vabastama" },
      { title: "Kümme nuhtlust (ptk 7-12)", description: "Jumal saadab Egiptusele nuhtlusi, et vaarao laseks rahva lahti" },
      { title: "Punane meri pooldub (ptk 14)", description: "Jumal lahutab Punase mere veed, iisraellased pääsevad" },
      { title: "10 käsku (ptk 20)", description: "Jumal annab Moosesele Siinai mäel 10 käsku" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "3-mooses": {
    name: "3. Mooses",
    author: "Mooses",
    period: "u 1445-1405 eKr",
    category: "Seadus",
    overview: "3. Moosese raamat on praktilne juhend pühale elule. See õpetab, kuidas läheneda pühale Jumalale läbi ohvrite ja pühitsemise. Raamat näitab, et Jumal soovib elada oma rahva keskel, kuid patt eraldab meid Temast. Ohvrisüsteem osutab tulevase Päästja peale, kes toob lõpliku lepituse.",
    authorFacts: [
      "Kirjutas raamatu Siinai mäe jalamil",
      "Sai kõik juhised otse Jumalalt",
      "Õpetas iisraellastele pühadust ja puhastust",
      "Seadis sisse preestrite ja ohvrite süsteemi"
    ],
    additionalFacts: [
      "Raamat sisaldab peamiselt Jumala otseseid juhiseid",
      "Aaron ja tema pojad määrati preestreiks",
      "Lepituspäev oli kõige püham päev aastas",
      "Paljud seadused puudutasid tervist ja hügieeni"
    ],
    breakdowns: [
      { title: "Ohvrid (ptk 1-7)", description: "Viis erinevat ohvri liiki ja nende tähendused" },
      { title: "Preestrite pühitsemine (ptk 8-10)", description: "Aaron ja ta pojad määratakse preestreiks" },
      { title: "Puhtad ja roojased loomad (ptk 11)", description: "Juhised toidu ja puhastuse kohta" },
      { title: "Lepituspäev (ptk 16)", description: "Kõige püham päev aastas, rahva pattude lepitamine" },
      { title: "Püha elu (ptk 19-20)", description: "Olge pühad, sest mina, Issand, olen püha" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "4-mooses": {
    name: "4. Mooses",
    author: "Mooses",
    period: "u 1445-1405 eKr",
    category: "Seadus",
    overview: "4. Moosese raamat jutustab iisraellaste 40-aastasest rännakust kõrbes. See on lugu usust ja uskmatusest, sõnakuulmatusest ja Jumala ustavusest. Vaatamata rahva mässamisele ja kaebamisele, jäi Jumal neile truuks ja viis nad lõpuks tõotatud maa piirile.",
    authorFacts: [
      "Dokumenteeris 40-aastast kõrberännakut",
      "Kirjeldas rahva loendusi ja organiseerimist",
      "Kirjutas üles rahva mässamised ja Jumala karistused",
      "Elas kogu selle perioodi iisraellaste keskel"
    ],
    additionalFacts: [
      "Raamat sisaldab kaks rahvaloendust - alguses ja lõpus",
      "12 maakuulajat lähetati Kaanani maad uurima",
      "Ainult Joosua ja Kaaleb usaldasid Jumalat",
      "Mooses lõi kaljust vett, kuid ei täitnud Jumala käsku täpselt"
    ],
    breakdowns: [
      { title: "Rahvaloendus (ptk 1-4)", description: "Iisrael korraldatakse sõjaväeliselt" },
      { title: "12 maakuulajat (ptk 13-14)", description: "Rahvas keeldub minema tõotatud maale" },
      { title: "Korahi mäss (ptk 16)", description: "Korahi juhitud mäss Moosese vastu ebaõnnestub" },
      { title: "Vaskmadu (ptk 21)", description: "Kes vaatab mao poole, jääb ellu" },
      { title: "Bileam (ptk 22-24)", description: "Prohvet, kes ei suutnud needa Iisraeli" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "5-mooses": {
    name: "5. Mooses",
    author: "Mooses",
    period: "u 1445-1405 eKr",
    category: "Seadus",
    overview: "5. Moosese raamat on Moosese hüvastijätukõne uuele põlvkonnale enne tõotatud maale sisenemist. Ta meenutab Jumala ustavust, kordab seadusi ja julgustab rahvast armastama Jumalat kogu südamest. See on kutse valida elu ja õnnistus, mitte surm ja needus.",
    authorFacts: [
      "Viimane raamat, mille Mooses kirjutas",
      "Pidas kolm suurt kõnet rahvale",
      "Kordas ja selgitas seadusi uuele põlvkonnale",
      "Suri enne tõotatud maale sisenemist"
    ],
    additionalFacts: [
      "Mooses nägi tõotatud maad Nebo mäelt",
      "Jumal mattis ta ise, keegi ei tea, kus ta haud asub",
      "Joosua määrati tema järglaseks",
      "Raamat lõpeb värsiga: 'Ei ole enam Iisraelis tõusnud prohvetit nagu Mooses'"
    ],
    breakdowns: [
      { title: "Ajaloo meenutamine (ptk 1-4)", description: "Mooses meenutab Jumala tegusid kõrbes" },
      { title: "10 käsku korratakse (ptk 5)", description: "Seaduse südamik antakse uuesti" },
      { title: "Shema (ptk 6)", description: "Armasta Issandat, oma Jumalat, kogu südamega" },
      { title: "Õnnistused ja needused (ptk 28)", description: "Sõnakuulmise tasu ja sõnakuulmatuse tagajärjed" },
      { title: "Moosese surm (ptk 34)", description: "Mooses sureb Nebo mäel, olles 120-aastane" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "joosua": {
    name: "Joosua",
    author: "Joosua",
    period: "u 1400-1370 eKr",
    category: "Ajalugu",
    overview: "Joosua on julguse ja usu sümbol. Pärast Moosese surma võttis ta vastutuse juhtida iisraellasi tõotatud maale. Tema lugu õpetab meile, et Jumal annab jõudu ja julgust, kui me usaldame Teda. Joosua ei kartanud väljakutseid ega vastaseid, sest ta teadis, et Jumal on temaga. Ta on eeskuju neile, kes seisavad silmitsi hirmutavate ülesannetega - usu ja julgusega on võimalik saavutada võimatu.",
    authorFacts: [
      "Joosua (hbr Jehošua – 'Issand on pääste') oli Nuuni poeg Efraimi suguharust ning Moosese lähim abiline ja teener juba kõrbeteekonna algusest peale (2Ms 24:13; 33:11)",
      "Tema algne nimi oli Hoosea, kuid Mooses andis talle uue nime Joosua, mis viitab tema rollile rahva päästmisel (4Ms 13:16)",
      "Mooses pühitses ta avalikult oma järeltulijaks, pannes käed tema peale ja andes talle Vaimu täiuse (4Ms 27:18–23; 5Ms 34:9)",
      "Joosuat peetakse traditsiooniliselt raamatu peamiseks autoriks – ta ise pani kirja vähemalt liidu uuendamise sõnad Sekemis (Jos 24:26); lõpu osad (nt tema surm) lisasid hiljem teised, tõenäoliselt preestrid Eleasar ja Piinehas",
      "Raamat on kirjutatud pealtnägija perspektiivist – 'meie' ja 'tänase päevani' vormid (nt Jos 5:1; 6:25) viitavad sellele, et autor elas kirjeldatud sündmuste ajal"
    ],
    additionalFacts: [
      "Joosua oli üks 12 maakuulajast, kes uurisid Kaanani maad – ainult tema ja Kaaleb usaldasid Jumalat ning said tasuks Tõotatud maale jõuda (4Ms 14:6–9, 30)",
      "Ta juhtis iisraellaste esimest võitu Amaleki vastu Refidimis, samal ajal kui Mooses palvetas mäe otsas (2Ms 17:8–13)",
      "Joosua oli sõjaväejuht, prohvet ja vaimulik liider ühes isikus – tema juhtimisel jagati maa liisu teel kaheteistkümne suguharu vahel",
      "Ta elas 110-aastaseks ja maeti oma pärisossa Timnat-Serahisse Efraimi mäestikus (Jos 24:29–30)",
      "Tema kuulus tunnistus 'Mina ja minu pere, meie teenime Issandat' (Jos 24:15) on saanud üheks tuntuimaks usutunnistuseks Vanas Testamendis",
      "Uues Testamendis võrreldakse Joosuat\u00a0 Jeesusega – mõlema nimi tähendab 'Issand päästab' ning mõlemad juhivad rahva pärandi sisse (Hb 4:8)"
    ],
    breakdowns: [
      { title: "Jordani ületamine (ptk 3-4)", description: "Jumal peatab Jordani jõe vee, rahvas läheb üle" },
      { title: "Jeeriko vallutamine (ptk 6)", description: "Müürid langevad, kui rahvas marssis linna ümber" },
      { title: "Ai vallutamine (ptk 7-8)", description: "Pärast Aakani pattu vallutab Iisrael Ai linna" },
      { title: "Päike peatub (ptk 10)", description: "Jumal peatab päikese Joosua palve peale lahingus" },
      { title: "Maa jagamine (ptk 13-21)", description: "Tõotatud maa jaotatakse 12 suguharu vahel" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "kohtumõistjad": {
    name: "Kohtumõistjad",
    author: "Tundmatu (võib-olla Saamuel)",
    period: "u 1043-1004 eKr",
    category: "Ajalugu",
    overview: "Kohtumõistjate raamat kirjeldab Iisraeli ajalugu pärast Joosua surma kuni kuningate ajastuni. See on tsükliline lugu patust, orjusest, meeleparandusest ja päästest. Jumal tõstis üles juhte (kohtumõistjaid), kes vabastasid rahva rõhujate käest, kuid rahvas langes ikka ja jälle tagasi pattu.",
    authorFacts: [
      "Autor on tundmatu, traditsioon omistab Saamuelile",
      "Kirjutas kuningate ajastul, vaadates tagasi",
      "Dokumenteeris 12 peamist kohtumõistjat",
      "Näitas Iisraeli vajadust kuninga järele"
    ],
    additionalFacts: [
      "Raamat hõlmab umbes 350-aastast perioodi",
      "Debora oli ainus naiskohtumõistja",
      "Giideon võitis 300 mehega tohutu armeed",
      "Simson oli kuulsaim kohtumõistja oma jõu poolest"
    ],
    breakdowns: [
      { title: "Iisraeli patt (ptk 1-3)", description: "Rahvas ei hävita kaananlasi ja teenib nende jumalaid" },
      { title: "Debora ja Barak (ptk 4-5)", description: "Naiskohtumõistja ja väejuht võidavad Siisera" },
      { title: "Giideon (ptk 6-8)", description: "300 meest võidavad tohutu midjanlaste armee" },
      { title: "Simson (ptk 13-16)", description: "Võimas mees võitleb filiistrite vastu" },
      { title: "Moraalne langus (ptk 17-21)", description: "Igaüks tegi, mis talle õige tundus" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "rutt": {
    name: "Ruti raamat",
    author: "Tundmatu (võib-olla Saamuel)",
    period: "u 1000 eKr",
    category: "Ajalugu",
    overview: "Ruti raamat on ilus armastuse ja truuduse lugu kohtumõistjate tumedal ajastul. Moabi naine Rutt jääb truuks oma ämmale Noomile ja leiab uue elu Iisraelis. Ta abiellub Boasega ja saab kuningas Taaveti vanavanaemaks. See näitab, et Jumala arm ulatub kõigile rahvastele.",
    authorFacts: [
      "Autor on tundmatu",
      "Kirjutati peale Taaveti kuningaks saamist",
      "Rõhutas Jumala providentssi",
      "Näitas, et moablased võivad kuuluda Jumala rahvasse"
    ],
    additionalFacts: [
      "Rutt oli üks kahest Piibli raamatust, mis on nimetatud naise järgi",
      "Rutt on mainitud Jeesuse sugupuus",
      "Lugu leiab aset kohtumõistjate ajastul",
      "Boas oli Raahabi poeg (Mt 1:5)"
    ],
    breakdowns: [
      { title: "Noomi tragöödia (ptk 1)", description: "Noomi kaotab mehe ja pojad, naaseb Petlemmasse" },
      { title: "Rutt kohtub Boasega (ptk 2)", description: "Rutt korjab viljapäid Boase põllult" },
      { title: "Rutt palub lunastust (ptk 3)", description: "Noomi juhendab Rutti otsima lunastajat" },
      { title: "Abielu ja lunastus (ptk 4)", description: "Boase lunastab Rutti ja abiellub temaga" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "1-saamuel": {
    name: "1. Saamueli raamat",
    author: "Saamuel ja teised prohvetid",
    period: "u 931-722 eKr",
    category: "Ajalugu",
    overview: "1. Saamueli raamat räägib üleminekust kohtumõistjatest kuningatele. Saamuel, viimane suur kohtumõistja ja esimene prohvet, võidis kuningaks Sauli ja seejärel Taaveti. Lugu näitab, et Jumal otsib inimesi, kelle süda on Tema järgi, mitte välimust.",
    authorFacts: [
      "Saamuel kirjutas osa raamatust",
      "Teised prohvetid täiendasid pärast tema surma",
      "Dokumenteeris Iisraeli esimesi kuningaid",
      "Oli nii prohvet, preester kui kohtumõistja"
    ],
    additionalFacts: [
      "Saamuel sündis vastuseks ema Hanna palvele",
      "Ta võidis kaks kuningat: Sauli ja Taaveti",
      "Saul kaotas kuningriigi sõnakuulmatuse tõttu",
      "Taavet lõi Koljati"
    ],
    breakdowns: [
      { title: "Saamueli sünd (ptk 1-3)", description: "Hanna palve ja Saamueli kutstumine" },
      { title: "Sauli kuningaks võidmine (ptk 8-10)", description: "Rahvas tahab kuningat" },
      { title: "Sauli sõnakuulmatus (ptk 13-15)", description: "Saul kaotab kuningriigi" },
      { title: "Taaveti võidmine (ptk 16)", description: "Jumal valib Taaveti" },
      { title: "Taavet ja Koljat (ptk 17)", description: "Poiss võidab hiiglase" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "2-saamuel": {
    name: "2. Saamueli raamat",
    author: "Tundmatu (võib-olla prohvet Natan)",
    period: "u 931-722 eKr",
    category: "Ajalugu",
    overview: "2. Saamueli raamat keskendub kuningas Taaveti valitsusele. See näitab nii Taaveti suuri võite kui ka sügavaid pattulangemisi. Vaatamata tema pattudele, nimetas Jumal teda 'meheks oma südame järgi' ja lubas, et tema soost tuleb igavene kuningas.",
    authorFacts: [
      "Autor on tundmatu, võib-olla prohvet Naatan",
      "Kirjutas objektiivselt Taaveti võitudest ja pattudest",
      "Dokumenteeris Taaveti lepingut Jumalaga",
      "Näitas Jumala armu ja õiglust"
    ],
    additionalFacts: [
      "Taavet tõi lepingulaeka Jeruusalemma",
      "Ta soovis ehitada templi, aga Jumal ei lubanud",
      "Tema suurim patt oli Batseba ja Uurija lugu",
      "Absalom, tema poeg, mässas tema vastu"
    ],
    breakdowns: [
      { title: "Taavet Juuda kuningas (ptk 1-4)", description: "Taavet saab kuningaks Juudas, seejärel kogu Iisraelis" },
      { title: "Lepingulaeka toomine Jeruusalemma (ptk 5-7)", description: "Taavet toob laeka ja saab lepingu Jumalalt" },
      { title: "Taaveti võidud (ptk 8-10)", description: "Taavet laiendab kuningriiki" },
      { title: "Batseba ja Uurija (ptk 11-12)", description: "Taaveti suurim patt ja karistus" },
      { title: "Absalomi mäss (ptk 13-19)", description: "Taaveti poeg mässab ja sureb" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "1-kuningate": {
    name: "1. Kuningate raamat",
    author: "Tundmatu (võib-olla Jeremija)",
    period: "u 560 eKr",
    category: "Ajalugu",
    overview: "1. Kuningate raamat jutustab Saalomoni valitsusest ja kuningriigi jagunemisest. Saalomon, kõigi aegade targim mees, ehitas templi, kuid langes hiljem ebajumalakummardamisse. Pärast tema surma jagunes kuningriik kaheks - Iisraeliks põhjas ja Juudaks lõunas.",
    authorFacts: [
      "Autor on tundmatu, traditsioon omistab Jeremijale",
      "Kirjutas Babüloonia vangipõlves",
      "Dokumenteeris kuningate võrdlust Jumala seadusega",
      "Rõhutas sõnakuulmise tähtsust"
    ],
    additionalFacts: [
      "Saalomon palus tarkust, mitte rikkust või võimu",
      "Ta ehitas kuulsa templi Jeruusalemma",
      "Tal oli 700 naist ja 300 liignaist",
      "Eelija oli võimas prohvet Aahabi ajal"
    ],
    breakdowns: [
      { title: "Saalomoni tarkus (ptk 1-4)", description: "Saalomon saab kuningaks ja palub tarkust" },
      { title: "Templi ehitamine (ptk 5-8)", description: "Saalomon ehitab kuulsa templi" },
      { title: "Kuningriigi jagunemine (ptk 12)", description: "10 suguharu eralduvad Juudast" },
      { title: "Eelija ja Baali preestrid (ptk 17-18)", description: "Eelija näitab Baali preestritele Jumala võimsust" },
      { title: "Eelija taevasse minek (ptk 19-2.Kn 2)", description: "Eelija võetakse tulise vankriga taevasse" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "2-kuningate": {
    name: "2. Kuningate raamat",
    author: "Tundmatu (võib-olla Jeremija)",
    period: "u 560 eKr",
    category: "Ajalugu",
    overview: "2. Kuningate raamat jätkab Iisraeli ja Juuda kuningate lugu kuni vangipõlveni. Enamik kuningaid oli kurjad ja viisid rahva ebajumalakummardamiseni. Jumal saatis prohveteid hoiatama, kuid rahvas ei kuulanud. Lõpuks viis Jumal mõlemad kuningriigid vangipõlve.",
    authorFacts: [
      "Autor on tundmatu, võib-olla Jeremija",
      "Kirjutas vangipõlve ajal või vahetult pärast seda",
      "Dokumenteeris mõlema kuningriigi langust",
      "Näitas patu tagajärgi"
    ],
    additionalFacts: [
      "Eliisa tegi kahekordse osa imetegusid võrreldes Eelijaga",
      "Iisraeli (põhja) kuningriik langes 722 eKr Assüüriale",
      "Juuda (lõuna) kuningriik langes 586 eKr Babülooniale",
      "Jeruusalemma tempel hävitati"
    ],
    breakdowns: [
      { title: "Eelija taevasse minek (ptk 1-2)", description: "Eliisa saab kahekordse osa vaimust" },
      { title: "Eelisa imed (ptk 3-8)", description: "Eelisa teeb palju imetegusid" },
      { title: "Iisraeli langemine (ptk 17)", description: "Assüüria võtab põhja kuningriigi vangi" },
      { title: "Hiskija reform (ptk 18-20)", description: "Hea kuningas reformib Juudat" },
      { title: "Jeruusalemma langemine (ptk 25)", description: "Babüloonia hävitab linna ja templi" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "1-ajaraamat": {
    name: "1. Ajaraamat",
    author: "Esra",
    period: "u 450-425 eKr",
    category: "Ajalugu",
    overview: "1. Ajaraamat on Iisraeli ajaloo ülevaade Aadamast Taaveti kuningriigini. Raamat rõhutab Juuda suguharu ja Jeruusalemma templi tähtsust. See kirjutati pärast vangipõlvest naasmist, et näidata Jumala ustavust oma rahvale läbi ajaloo.",
    authorFacts: [
      "Autor on tõenäoliselt Esra",
      "Kirjutas pärast Babüloonia vangipõlvest naasmist",
      "Rõhutas Juuda suguharu ja templi tähtsust",
      "Kasutas genealoogiaid sidumaks mineviku ja oleviku"
    ],
    additionalFacts: [
      "Esimesed 9 peatükki on peamiselt sugupuud",
      "Raamat katab samu sündmusi kui Saamueli ja Kuningate raamatud",
      "Fookus on templi teenistusel ja leevilastel",
      "Taavet valmistas templi ehitamiseks"
    ],
    breakdowns: [
      { title: "Genealoogiad (ptk 1-9)", description: "Sugupuud Aadamast vangipõlveni" },
      { title: "Taaveti valitsus (ptk 10-20)", description: "Taavet saab kuningaks ja võidab vaenlased" },
      { title: "Lepingulaeka toomine (ptk 13-16)", description: "Taavet toob laeega Jeruusalemma" },
      { title: "Taaveti leping (ptk 17)", description: "Jumal lubab igavese kuningriigi" },
      { title: "Templi ettevalmistused (ptk 21-29)", description: "Taavet valmistab templi ehitamiseks" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "2-ajaraamat": {
    name: "2. Ajaraamat",
    author: "Esra",
    period: "u 450-425 eKr",
    category: "Ajalugu",
    overview: "2. Ajaraamat keskendub Juuda kuningate ajaloole Saalominist vangipõlveni. Erinevalt Kuningate raamatust, mis dokumenteerib nii Iisraeli kui Juuda kuningaid, keskendub see ainult Juuda kuningatele ja templile. Raamat lõpeb lootusega - Küürose dekreediga, mis lubas juutidel naasta koju.",
    authorFacts: [
      "Autor on tõenäoliselt Esra",
      "Kirjutas vangipõlvest naasnud juutidele",
      "Keskendus templile ja Jeruusalemmale",
      "Näitas Jumala õnnistust truudusele"
    ],
    additionalFacts: [
      "Saalomon ehitas templi 7 aastaga",
      "Hiskija ja Joosija olid kaks parimat kuningat",
      "Raamat lõpeb Küürose dekreediga (539 eKr)",
      "Templi taastamine oli keskne teema"
    ],
    breakdowns: [
      { title: "Saalomoni tempel (ptk 1-9)", description: "Saalomon ehitab ja pühitseb templi" },
      { title: "Kuningriigi jagunemine (ptk 10-12)", description: "10 suguharu eralduvad Juudast" },
      { title: "Juuda kuningad (ptk 13-35)", description: "Mõned head, enamik halbu kuningaid" },
      { title: "Jeruusalemma langemine (ptk 36)", description: "Babüloonia hävitab linna" },
      { title: "Küürose dekreet (ptk 36)", description: "Luba naasta ja ehitada tempel uuesti" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "esra": {
    name: "Esra raamat",
    author: "Esra",
    period: "u 440 eKr",
    category: "Ajalugu",
    overview: "Esra raamat jutustab, kuidas juudid naasid Babüloonia vangipõlvest ja ehitasid templi uuesti. Küürose dekreet võimaldas neil naasta, kuid teekond oli raske. Esra, preester ja seaduseõpetaja, viis läbi vaimuliku ärkamise ja õpetas rahvale Jumala seadust.",
    authorFacts: [
      "Esra oli preester ja seaduseõpetaja",
      "Juhtis teist naasmisgrupp Jeruusalemma (458 eKr)",
      "Õpetas rahvale Moosese seadust",
      "Viis läbi vaimuliku reformi"
    ],
    additionalFacts: [
      "Esimene naasmisgrupp tuli Serubbaabeli juhtimisel (538 eKr)",
      "Templi ehitamine kestis 23 aastat (536-515 eKr)",
      "Vastased püüdsid takistada ehitust",
      "Esra võitles segaabiellumise vastu"
    ],
    breakdowns: [
      { title: "Esimene naasmism (ptk 1-2)", description: "Serubbaabel viib esimese grupi koju" },
      { title: "Templi aluse panemine (ptk 3)", description: "Töö algab, kuid vastased takistavad" },
      { title: "Templi valmistamine (ptk 4-6)", description: "Pärast peatust valmib tempel" },
      { title: "Esra teine naasmisgrupp (ptk 7-8)", description: "Esra toob veel ühe grupi" },
      { title: "Segaabiellumise probleem (ptk 9-10)", description: "Esra nõuab parandust" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "nehemja": {
    name: "Nehemja raamat",
    author: "Nehemja",
    period: "u 430 eKr",
    category: "Ajalugu",
    overview: "Nehemja raamat jutustab, kuidas Jeruusalemma müürid ehitati uuesti 52 päevaga. Nehemja, Pärsia kuninga joogimees, sai loa minna Jeruusalemma ja juhtida müüride taastamist. Vaatamata vastaste rünnakutele ja sisemistele probleemidele, viis ta töö edukal lõpuni.",
    authorFacts: [
      "Nehemja oli Pärsia kuninga joogimees",
      "Sai loa minna Jeruusalemma 445 eKr",
      "Juhtis müüride ehitamist 52 päevaga",
      "Viis läbi sotsiaalseid ja vaimulikke reforme"
    ],
    additionalFacts: [
      "Nehemja kuulis Jeruusalemma olukorrast ja nuttis",
      "Ta palvetas 4 kuud enne kuninga juurde minekut",
      "Vastased naersid ja ähvardasid, kuid ei suutnud takistada",
      "Esra ja Nehemja töötasid koos vaimuliku ärkamise nimel"
    ],
    breakdowns: [
      { title: "Nehemja palve (ptk 1-2)", description: "Nehemja kuuleb Jeruusalemma olukorrast" },
      { title: "Müüride ehitamine (ptk 3-7)", description: "52 päevaga valmisvad müürid" },
      { title: "Seaduse lugemine (ptk 8)", description: "Esra loeb seadust rahvale" },
      { title: "Meeleparandus (ptk 9-10)", description: "Rahvas tunnistab patte ja teeb lepingu" },
      { title: "Reformid (ptk 11-13)", description: "Nehemja viib läbi reforme" }
    ],
    piibeeUrl: "https://piibel.ee"
  },
  "ester": {
    name: "Esteri raamat",
    author: "Tundmatu (võib-olla Mordokai)",
    period: "u 465 eKr",
    category: "Ajalugu",
    overview: "Esteri raamat on dramaatiline lugu sellest, kuidas Jumal päästis juudi rahva hävingust Pärsias. Ester, juudi neiu, sai kuningannaks ja riskis oma eluga, et päästa oma rahvast. Kuigi Jumala nime ei mainita, on Tema providentssi selgelt näha kogu loos.",
    authorFacts: [
      "Autor on tundmatu, võib-olla Mordokai",
      "Kirjutas Pärsia perioodil",
      "Ei maini Jumala nime üldse",
      "Näitas Jumala providentssi"
    ],
    additionalFacts: [
      "Ester oli Mordokai õetütar",
      "Ta varjas algul oma juudi päritolu",
      "Haman ehitas poomispuu Mordokai jaoks",
      "Lõpuks poodi Haman ise sellel puul üles"
    ],
    breakdowns: [
      { title: "Ester kuningannaks (ptk 1-2)", description: "Vasti kukutatakse, Ester saab kuningannaks" },
      { title: "Hamani plaan (ptk 3)", description: "Haman plaanib hävitada kõik juudid" },
      { title: "Mordokai abi (ptk 4)", description: "Mordokai palub Esterit sekkuda" },
      { title: "Esteri julgus (ptk 5-7)", description: "Ester paljastab Hamani plaani" },
      { title: "Juutide päästmine (ptk 8-10)", description: "Juudid päästetakse, Purim tähistamine" }
    ],
    piibeeUrl: "https://piibel.ee"
  }
};
