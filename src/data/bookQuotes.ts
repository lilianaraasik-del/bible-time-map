// Iga Piibli raamatu iseloomulik kirjakoht (Eesti Piibel 1968).
// Kasutatakse Raamat.tsx tsitaadi sektsioonis.

export interface BookQuote {
  text: string;
  reference: string;
}

export const bookQuotes: Record<string, BookQuote> = {
  // VT - Seadus
  "1-mooses": {
    text: "Alguses lõi Jumal taevad ja maa.",
    reference: "1. Moosese 1:1",
  },
  "2-mooses": {
    text: "Mina olen Jehoova, sinu Jumal, kes sind tõi välja Egiptusemaalt, orjusekojast.",
    reference: "2. Moosese 20:2",
  },
  "3-mooses": {
    text: "\"Räägi kogu Iisraeli laste kogudusega ja ütle neile: olge pühad, sest mina, Jehoova, teie Jumal olen püha!",
    reference: "3. Moosese 19:2",
  },
  "4-mooses": {
    text: "Jehoova õnnistagu sind ja hoidku sind! Jehoova lasku oma pale paista sinu peale ja olgu sulle armuline!",
    reference: "4. Moosese 6:24-25",
  },
  "5-mooses": {
    text: "Kuule, Iisrael! Jehoova, meie Jumal Jehoova, on ainus!",
    reference: "5. Moosese 6:4",
  },
  // VT - Ajalugu
  "joosua": {
    text: "Eks ole mina sind käskinud: ole vahva ja tugev? Ära kohku ja ära karda, sest Jehoova, su Jumal, on sinuga kõikjal, kuhu sa lähed!\"",
    reference: "Joosua 1:9",
  },
  "kohtumoistjad": {
    text: "Neil päevil ei olnud Iisraelis kuningat: igamees tegi, mis tema enese silmis õige oli!",
    reference: "Kohtumõistjate 21:25",
  },
  "kohtumõistjad": {
    text: "Neil päevil ei olnud Iisraelis kuningat: igamees tegi, mis tema enese silmis õige oli!",
    reference: "Kohtumõistjate 21:25",
  },
  "rutt": {
    text: "Kuid Rutt vastas: \"Ära käi mulle peale, et ma sind maha jätaksin ja pöörduksin tagasi su juurest, sest kuhu sina lähed, sinna lähen ka mina, ja kuhu sina jääd, sinna jään minagi! Sinu rahvas on minu rahvas ja sinu Jumal on minu Jumal!",
    reference: "Rutt 1:16",
  },
  "1-saamuel": {
    text: "Aga Jehoova ütles Saamuelile: \"Ära vaata ta välimusele ja kõrgele kasvule, sest ma olen jätnud tema kõrvale. Sest see pole nii, nagu inimene näeb: inimene näeb, mis silma ees, aga Jehoova näeb, mis südames!\"",
    reference: "1. Saamueli 16:7",
  },
  "2-saamuel": {
    text: "Ja su sugu ning su kuningriik püsivad mu ees igavesti, su aujärg on kinnitatud igaveseks!\"",
    reference: "2. Saamueli 7:16",
  },
  "1-kuningate": {
    text: "Anna seepärast oma sulasele sõnakuulelik süda, et ta võiks su rahvale kohut mõista ning vahet teha hea ja kurja vahel; sest kes suudaks muidu kohut mõista sellele sinu suurele rahvale?\"",
    reference: "1. Kuningate 3:9",
  },
  "2-kuningate": {
    text: "Ja kui nad nõnda ühtejärge läksid ja rääkisid, vaata, siis sündis, et tulised vankrid ja tulised hobused lahutasid neid üksteisest ja Eelija läks tuulepöörises taevasse!",
    reference: "2. Kuningate 2:11",
  },
  "1-ajaraamat": {
    text: "Sinul, Jehoova, on suurus ja vägevus, ilu ja hiilgus ja au, kõik, mis on taevas ja maa peal! Sinul, Jehoova, on kuningriik ja sa oled ennast tõstnud kõigile peaks!",
    reference: "1. Ajaraamat 29:11",
  },
  "2-ajaraamat": {
    text: "ja kui siis minu rahvas, kellele on pandud mu nimi, alandab ennast ja nad palvetavad ja otsivad minu palet ning pöörduvad oma kurjadelt teedelt, siis ma kuulen taevast ja annan andeks nende patu ning säästan nende maa!",
    reference: "2. Ajaraamat 7:14",
  },
  "esra": {
    text: "Ja nad saatsid meile, kuna meie Jumala hea käsi oli meie peal, ühe aruka mehe, Iisraeli poja Leevi poja Mahli poegadest, Serebja, tema pojad ja vennad - kaheksateist meest;",
    reference: "Esra 8:18",
  },
  "nehemja": {
    text: "Ja ta ütles neile: \"Minge sööge rasvaseid roogi ja jooge magusaid jooke, ja läkitage osa neile, kellel midagi ei ole valmistatud. Sest see päev on pühitsetud meie Issandale. Ja ärge kurvastuge, sest rõõm Jehoovast on teile kindlaks linnaks!\"",
    reference: "Nehemja 8:10",
  },
  "ester": {
    text: "Sest kui sa sel ajal tõesti vaikid, tuleb juutidele abi ja pääste mujalt, aga sina ja su isa pere hukkute! Ja kes teab, kas sa mitte ei olegi just selle asja pärast pääsenud kuninglikku seisusesse?\"",
    reference: "Ester 4:14",
  },
  // VT - Luule / Tarkus
  "iiob": {
    text: "Sest ma tean, et mu Lunastaja elab, ja tema jääb viimsena põrmu peale seisma!",
    reference: "Iiob 19:25",
  },
  "psalmid": {
    text: "Jehoova on mu karjane, mul pole millestki puudust!",
    reference: "Psalm 23:1",
  },
  "opetussonad": {
    text: "Jehoova kartus on tarkuse algus ja Kõigepühama tundmine on mõistus!",
    reference: "Õpetussõnad 9:10",
  },
  "õpetussõnad": {
    text: "Jehoova kartus on tarkuse algus ja Kõigepühama tundmine on mõistus!",
    reference: "Õpetussõnad 9:10",
  },
  "koguja": {
    text: "Igale asjale on määratud aeg, ja aeg on igal tegevusel taeva all:",
    reference: "Koguja 3:1",
  },
  "ulemlaul": {
    text: "\"Mina kuulun oma kallimale ja ma ihaldan teda!",
    reference: "Ülemlaul 7:11",
  },
  "ülemlaul": {
    text: "\"Mina kuulun oma kallimale ja ma ihaldan teda!",
    reference: "Ülemlaul 7:11",
  },
  // VT - Prohvetid
  "jesaja": {
    text: "Sest meile sünnib laps, meile antakse poeg, kelle õlgadel on valitsus ja kellele pannakse nimeks: Imeline Nõuandja, Vägev Jumal, Igavene Isa, Rahuvürst!",
    reference: "Jesaja 9:5",
  },
  "jeremija": {
    text: "Sest mina tunnen mõtteid, mis ma teie pärast mõlgutan, ütleb Jehoova: need on rahu, aga mitte õnnetuse mõtted, et anda teile tulevikku ja lootust!",
    reference: "Jeremija 29:11",
  },
  "nutulaul": {
    text: "see on Jehoova suur heldus, et me pole otsa saanud, sest tema halastused pole lõppenud: need on igal hommikul uued - sinu ustavus on suur!",
    reference: "Nutulaulud 3:22-23",
  },
  "hesekiel": {
    text: "Ja ma annan teile uue südame ja panen teie sisse uue vaimu! Ma kõrvaldan teie ihust kivise südame ja annan teile lihase südame!",
    reference: "Hesekiel 36:26",
  },
  "taaniel": {
    text: "Ja temale anti valitsus ja au ning kuningriik, ja kõik rahvad, suguvõsad ja keeled teenisid teda! Tema valitsus on igavene valitsus, mis ei lakka, ja tema kuningriik ei hukku!",
    reference: "Taaniel 7:14",
  },
  "hoosea": {
    text: "Sest mulle meeldib osadus, aga mitte ohver, ja Jumala tundmine rohkem kui põletusohvrid!",
    reference: "Hoosea 6:6",
  },
  "joel": {
    text: "Ja pärast seda sünnib, et ma valan oma Vaimu kõige liha peale! Siis teie pojad ja tütred hakkavad ennustama, teie vanemad uinuvad unenägusid nähes, teie noored mehed näevad nägemusi!",
    reference: "Joel 3:1",
  },
  "aamos": {
    text: "Aga õigus voolaku nagu vesi ja õiglus nagu kuivamatu jõgi!",
    reference: "Aamos 5:24",
  },
  "obadja": {
    text: "Sest Jehoova päev on ligidal kõigi rahvaste jaoks! Nõnda nagu sina talitasid, talitatakse sinuga, su teod tulevad tagasi su oma pea peale!",
    reference: "Obadja 1:15",
  },
  "joona": {
    text: "Ja ta vastas neile: \"Mina olen heebrealane ja ma kardan Jehoovat, taeva Jumalat, kes on teinud mere ja kuiva maa!\"",
    reference: "Joona 1:9",
  },
  "miika": {
    text: "Tema on andnud sulle teada, inimene, mis hea on! Ja mida nõuab Jehoova sinult muud kui et sa teeksid, mis on õige, armastaksid osadust ja käiksid hoolsasti ühes oma Jumalaga?",
    reference: "Miika 6:8",
  },
  "nahum": {
    text: "Jehoova on hea, varjupaik hädaajal, ja ta tunneb neid, kes tema juures pelgupaika otsivad!",
    reference: "Nahum 1:7",
  },
  "habakuk": {
    text: "Vaata, kes on ülbe, selle hing ei jää temasse, aga õige elab oma usust!",
    reference: "Habakuk 2:4",
  },
  "sefanja": {
    text: "Jehoova, sinu Jumal, on su keskel, kangelane, kes aitab! Ta rõõmutseb sinu pärast üpris väga, ta uuendab oma armastust, ta tunneb hõisates sinust rõõmu,",
    reference: "Sefanja 3:17",
  },
  "haggai": {
    text: "Selle koja tulevane toredus peab olema suurem kui oli esimesel, ütleb vägede Jehoova, ja selles paigas ma annan rahu, ütleb vägede Jehoova!\"",
    reference: "Haggai 2:9",
  },
  "sakarja": {
    text: "Siis ta kostis ja ütles mulle nõnda: \"See on Jehoova sõna, mis on öeldud Serubbaabelile: ei väe ega võimu läbi, vaid minu Vaimu läbi, ütleb vägede Jehoova!",
    reference: "Sakarja 4:6",
  },
  "malaki": {
    text: "Aga teile, kes te mu nime kardate, tõuseb õiguse päike ja paranemine tema tiibade all! Te lähete siis välja ja lööte kepsu nagu nuumvasikad!",
    reference: "Malakia 3:20",
  },
  // UT - Evangeeliumid
  "matteus": {
    text: "Tulge minu juurde kõik, kes olete vaevatud ja koormatud ja mina annan teile hingamise!",
    reference: "Matteuse 11:28",
  },
  "markus": {
    text: "Ja ta ütles neile: \"Minge kõike maailma ja kuulutage evangeeliumi kõigele loodule.",
    reference: "Markuse 16:15",
  },
  "luuka": {
    text: "sest Inimese Poeg on tulnud otsima ja päästma, mis on kadunud!\"",
    reference: "Luuka 19:10",
  },
  "johannese-evangeelium": {
    text: "Sest nõnda on Jumal maailma armastanud, et ta oma ainusündinud Poja on andnud, et ükski, kes temasse usub, ei saaks hukka, vaid et temal oleks igavene elu!",
    reference: "Johannese 3:16",
  },
  "apostlite-teod": {
    text: "aga te saate Püha Vaimu väe, kes tuleb teie peale, ja te peate olema minu tunnistajad Jeruusalemmas ja kõigel Juuda- ja Samaariamaal ja maailma otsani!\"",
    reference: "Apostlite teod 1:8",
  },
  // Pauluse kirjad
  "rooma": {
    text: "Ent Jumal osutab oma armastust meie vastu sellega, et Kristus on surnud meie eest, kui me alles patused olime;",
    reference: "Roomlastele 5:8",
  },
  "1-korintlastele": {
    text: "Ent nüüd jääb usk, lootus, armastus, need kolm; aga suurim neist on armastus!",
    reference: "1. Korintlastele 13:13",
  },
  "2-korintlastele": {
    text: "Aga ta ütles mulle: \"Sulle saab küllalt minu armust; sest vägi saab nõtruses täie võimuse!\" Nii ma siis tahan meelsamini kiidelda oma nõtrustest, et Kristuse vägi asuks elama minusse.",
    reference: "2. Korintlastele 12:9",
  },
  "galaatlastele": {
    text: "Aga Vaimu vili on armastus, rõõm, rahu, pikk meel, lahkus, heatahtlikkus, ustavus, tasadus, kasinus; selliste vastu ei ole käsk.",
    reference: "Galaatlastele 5:22-23",
  },
  "efeslastele": {
    text: "Sest teie olete armust õndsaks saanud usu kaudu ja see pole mitte teist enestest; see on Jumala and;",
    reference: "Efeslastele 2:8",
  },
  "filiplastele": {
    text: "Ma suudan kõik temas, kes mind teeb vägevaks.",
    reference: "Filiplastele 4:13",
  },
  "koloslastele": {
    text: "Mida te iganes teete, seda tehke südamest, nõnda nagu Issandale ja mitte nagu inimestele,",
    reference: "Koloslastele 3:23",
  },
  "1-tessalooniklastele": {
    text: "Olge ikka rõõmsad! Palvetage lakkamata! Olge tänulikud kõige eest; sest see on Jumala tahtmine teie suhtes Kristuses Jeesuses.",
    reference: "1. Tessalooniklastele 5:16-18",
  },
  "2-tessalooniklastele": {
    text: "Aga Issand on ustav, kes teid kinnitab ja kurja eest hoiab.",
    reference: "2. Tessalooniklastele 3:3",
  },
  "1-timoteosele": {
    text: "Sest Jumal ei ole meile andnud arguse vaimu, vaid väe ja armastuse ja mõistliku meele vaimu.",
    reference: "2. Timoteosele 1:7",
  },
  "2-timoteosele": {
    text: "Kõik Kiri on Jumala Vaimu poolt sisendatud ja on kasulik õpetuseks, noomimiseks, parandamiseks, juhatamiseks õiguses,",
    reference: "2. Timoteosele 3:16",
  },
  "tiitusele": {
    text: "Sest Jumala õndsakstegev arm on ilmunud kõigile inimestele",
    reference: "Tiitusele 2:11",
  },
  "fileemonile": {
    text: "Kui sa nüüd mind pead oma kaaslaseks, siis võta ta vastu kui mind ennast.",
    reference: "Fileemonile 1:17",
  },
  // Üldkirjad
  "heebrealastele": {
    text: "Aga usk on kindel usaldus selle vastu, mida oodatakse, ja veendumus selles, mida ei nähta.",
    reference: "Heebrealastele 11:1",
  },
  "jaakobus": {
    text: "Aga olge sõna tegijad ja mitte ükspäinis kuuljad, iseendid pettes.",
    reference: "Jaakobuse 1:22",
  },
  "1-peetrus": {
    text: "Heitke kõik oma mure tema peale, sest tema peab hoolt teie eest!",
    reference: "1. Peetruse 5:7",
  },
  "2-peetrus": {
    text: "Aga kasvage meie Issanda ja Õnnistegija Jeesuse Kristuse armus ja tunnetuses. Temale olgu austus nii nüüd kui igaviku päevil!",
    reference: "2. Peetruse 3:18",
  },
  "1-johannese-kiri": {
    text: "Ja me oleme tundma õppinud ja uskunud armastust, mis Jumalal on meie vastu. Jumal on armastus, ja kes jääb armastusse, see jääb Jumalasse ning Jumal jääb temasse.",
    reference: "1. Johannese 4:16",
  },
  "2-johannese-kiri": {
    text: "Ja see on armastus, et me käime tema käskude järgi. See on käsk, et teie, nagu te algusest olete kuulnud, käiksite selles.",
    reference: "2. Johannese 1:6",
  },
  "3-johannese-kiri": {
    text: "Mul ei ole suuremat rõõmu kui see, et ma kuulen oma lapsi tões käivat.",
    reference: "3. Johannese 1:4",
  },
  "juudas": {
    text: "Aga temale, kes teid võib hoida komistamast ja teid veatuina seada oma auhiilguse palge ette hõiskamisega, ainule Jumalale, meie Õnnistegijale, Jeesuse Kristuse, meie Issanda läbi olgu au, auhiilgus, võimus ja valitsus enne kõike maailmaajastut ja nüüd ja kõigi ajastuteni! Aamen.",
    reference: "Juuda 1:24-25",
  },
  "ilmutus": {
    text: "Vaata, ma seisan ukse taga ja koputan: kui keegi mu häält kuuleb ja ukse avab, selle juurde ma lähen sisse ja söön õhtust ühes temaga ja tema minuga!",
    reference: "Ilmutuse 3:20",
  },
};

export function getBookQuote(slug: string): BookQuote {
  return (
    bookQuotes[slug] ?? {
      text: "Jumala iga sõna on selge, tema on kilbiks neile, kes otsivad kaitset temalt!",
      reference: "Õpetussõnad 30:5",
    }
  );
}
