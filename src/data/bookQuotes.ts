// Iga Piibli raamatu iseloomulik kirjakoht (originaaltekst sellest raamatust).
// Kasutatakse Raamat.tsx tsitaadi sektsioonis.

export interface BookQuote {
  text: string;
  reference: string;
}

export const bookQuotes: Record<string, BookQuote> = {
  // VT - Seadus
  "1-mooses": {
    text: "Alguses lõi Jumal taeva ja maa.",
    reference: "1. Moosese 1:1",
  },
  "2-mooses": {
    text: "Mina olen Issand, su Jumal, kes tõi sind välja Egiptusemaalt, orjusekojast.",
    reference: "2. Moosese 20:2",
  },
  "3-mooses": {
    text: "Olge pühad, sest mina, Issand, teie Jumal, olen püha!",
    reference: "3. Moosese 19:2",
  },
  "4-mooses": {
    text: "Issand õnnistagu sind ja hoidku sind! Issand lasku oma pale paista sinu peale ja olgu sulle armuline!",
    reference: "4. Moosese 6:24-25",
  },
  "5-mooses": {
    text: "Kuule, Iisrael! Issand, meie Jumal Issand, on ainus.",
    reference: "5. Moosese 6:4",
  },
  // VT - Ajalugu
  "joosua": {
    text: "Ole vahva ja tugev, ära karda ega kohku, sest Issand, su Jumal, on sinuga kõikjal, kuhu sa lähed!",
    reference: "Joosua 1:9",
  },
  "kohtumoistjad": {
    text: "Neil päevil ei olnud Iisraelis kuningat; igaüks tegi, mis tema enese silmis õige oli.",
    reference: "Kohtumõistjate 21:25",
  },
  "kohtumõistjad": {
    text: "Neil päevil ei olnud Iisraelis kuningat; igaüks tegi, mis tema enese silmis õige oli.",
    reference: "Kohtumõistjate 21:25",
  },
  "rutt": {
    text: "Kuhu sina lähed, sinna lähen ka mina, ja kuhu sina jääd, sinna jään ka mina! Sinu rahvas on minu rahvas ja sinu Jumal on minu Jumal.",
    reference: "Rutt 1:16",
  },
  "1-saamuel": {
    text: "Inimene näeb, mis silma ees, aga Issand näeb, mis südames on.",
    reference: "1. Saamueli 16:7",
  },
  "2-saamuel": {
    text: "Sinu sugu ja sinu kuningriik püsivad sinu ees igavesti, sinu aujärg on kindel igaveseks ajaks.",
    reference: "2. Saamueli 7:16",
  },
  "1-kuningate": {
    text: "Anna siis oma sulasele sõnakuulelik süda oma rahvale õigust mõistma, et osata vahet teha hea ja kurja vahel!",
    reference: "1. Kuningate 3:9",
  },
  "2-kuningate": {
    text: "Ja Eelija läks tuulispeas taeva.",
    reference: "2. Kuningate 2:11",
  },
  "1-ajaraamat": {
    text: "Sinu päralt, Issand, on suurus ja vägevus, ilu, hiilgus ja austus, sest kõik taevas ja maa peal on sinu oma.",
    reference: "1. Ajaraamat 29:11",
  },
  "2-ajaraamat": {
    text: "Kui mu rahvas, kelle üle on hüütud minu nime, alandab ennast ja palub, otsib minu palet ja pöördub oma kurjadelt teedelt, siis ma kuulen taevast.",
    reference: "2. Ajaraamat 7:14",
  },
  "esra": {
    text: "Meie Jumala käsi oli heatahtlikult meie üle.",
    reference: "Esra 8:18",
  },
  "nehemja": {
    text: "Issanda rõõm on teie ramm!",
    reference: "Nehemja 8:10",
  },
  "ester": {
    text: "Kes teab, kas sa mitte just selle aja jaoks ei olegi saanud kuninglikku seisust?",
    reference: "Ester 4:14",
  },
  // VT - Luule / Tarkus
  "iiob": {
    text: "Mina tean, et mu Lunastaja elab, ja viimsena tõuseb ta põrmu peale.",
    reference: "Iiob 19:25",
  },
  "psalmid": {
    text: "Issand on mu karjane, mul pole millestki puudus.",
    reference: "Psalm 23:1",
  },
  "opetussonad": {
    text: "Issanda kartus on tarkuse algus.",
    reference: "Õpetussõnad 9:10",
  },
  "õpetussõnad": {
    text: "Issanda kartus on tarkuse algus.",
    reference: "Õpetussõnad 9:10",
  },
  "koguja": {
    text: "Igaühel on oma aeg, ja iga asi taeva all sünnib omal ajal.",
    reference: "Koguja 3:1",
  },
  "ulemlaul": {
    text: "Mina kuulun oma sõbrale ja tema igatseb mind.",
    reference: "Ülemlaul 7:11",
  },
  "ülemlaul": {
    text: "Mina kuulun oma sõbrale ja tema igatseb mind.",
    reference: "Ülemlaul 7:11",
  },
  // VT - Prohvetid
  "jesaja": {
    text: "Sest meile sünnib laps, meile antakse poeg, kelle õlgadel on valitsus ja kellele pannakse nimeks Imeline Nõuandja, Vägev Jumal, Igavene Isa, Rahuvürst.",
    reference: "Jesaja 9:5",
  },
  "jeremija": {
    text: "Sest mina tunnen mõtteid, mis ma teie kohta mõlgutan, ütleb Issand: need on rahu, aga mitte õnnetuse mõtted, et anda teile tulevikku ja lootust.",
    reference: "Jeremija 29:11",
  },
  "nutulaul": {
    text: "Issanda heldus ei ole lõppenud, tema halastused ei ole otsa saanud; need on igal hommikul uued — sinu ustavus on suur!",
    reference: "Nutulaulud 3:22-23",
  },
  "hesekiel": {
    text: "Ma annan teile uue südame ja panen teie sisse uue vaimu.",
    reference: "Hesekiel 36:26",
  },
  "taaniel": {
    text: "Tema valitsus on igavene valitsus, mis ei lakka, ja tema kuningriik ei hukku iialgi.",
    reference: "Taaniel 7:14",
  },
  "hoosea": {
    text: "Sest ma armastan vagadust, mitte ohvrit, ja Jumala tundmist enam kui põletusohvreid.",
    reference: "Hoosea 6:6",
  },
  "joel": {
    text: "Pärast seda sünnib, et ma valan oma Vaimu kõige liha peale.",
    reference: "Joel 3:1",
  },
  "aamos": {
    text: "Aga õigus voolaku nagu vesi ja õiglus nagu kuivamatu jõgi!",
    reference: "Aamos 5:24",
  },
  "obadja": {
    text: "Sest Issanda päev on ligidal kõigile rahvaile.",
    reference: "Obadja 1:15",
  },
  "joona": {
    text: "Mina olen Heebrea mees ja kardan Issandat, taeva Jumalat, kes on teinud mere ja kuiva maa.",
    reference: "Joona 1:9",
  },
  "miika": {
    text: "Sulle, inimene, on öeldud, mis on hea ja mida Issand sinult nõuab: ainult õigust teha, headust armastada ja oma Jumala ees alandlikult käia.",
    reference: "Miika 6:8",
  },
  "nahum": {
    text: "Issand on hea, ta on kindel varjupaik ahastuse päeval ning tunneb neid, kes otsivad varju tema juures.",
    reference: "Nahum 1:7",
  },
  "habakuk": {
    text: "Aga õige elab oma usust.",
    reference: "Habakuk 2:4",
  },
  "sefanja": {
    text: "Issand, su Jumal, on su keskel, vägev, kes päästab; ta rõõmustab sinu pärast ülirõõmsasti.",
    reference: "Sefanja 3:17",
  },
  "haggai": {
    text: "Selle koja tulevane hiilgus saab suuremaks kui esimese oma.",
    reference: "Haggai 2:9",
  },
  "sakarja": {
    text: "Mitte väe ega võimu läbi, vaid minu Vaimu läbi, ütleb vägede Issand.",
    reference: "Sakarja 4:6",
  },
  "malaki": {
    text: "Aga teile, kes te kardate mu nime, tõuseb õiguse päike, ja paranemine on tema tiibade all.",
    reference: "Malakia 3:20",
  },
  // UT - Evangeeliumid
  "matteus": {
    text: "Tulge minu juurde kõik, kes olete vaevatud ja koormatud, ja mina annan teile hingamise!",
    reference: "Matteuse 11:28",
  },
  "markus": {
    text: "Ja ta ütles neile: „Minge kõike maailma ja kuulutage evangeeliumi kogu loodule!“",
    reference: "Markuse 16:15",
  },
  "luuka": {
    text: "Sest Inimese Poeg on tulnud otsima ja päästma kadunut.",
    reference: "Luuka 19:10",
  },
  "johannese-evangeelium": {
    text: "Sest nõnda on Jumal maailma armastanud, et ta oma ainusündinud Poja on andnud, et ükski, kes temasse usub, ei hukkuks, vaid et tal oleks igavene elu.",
    reference: "Johannese 3:16",
  },
  "apostlite-teod": {
    text: "Vaid te saate väe Pühalt Vaimult, kes tuleb teie üle, ja te peate olema minu tunnistajad.",
    reference: "Apostlite teod 1:8",
  },
  // Pauluse kirjad
  "rooma": {
    text: "Aga Jumal teeb nähtavaks oma armastuse meie vastu sellega, et Kristus suri meie eest, kui me alles patused olime.",
    reference: "Roomlastele 5:8",
  },
  "1-korintlastele": {
    text: "Aga nüüd jääb usk, lootus, armastus, need kolm, aga suurim neist on armastus.",
    reference: "1. Korintlastele 13:13",
  },
  "2-korintlastele": {
    text: "Sulle piisab minu armust, sest nõtruses saab vägi täielikuks.",
    reference: "2. Korintlastele 12:9",
  },
  "galaatlastele": {
    text: "Aga Vaimu vili on armastus, rõõm, rahu, pikk meel, lahkus, headus, ustavus, tasadus, enesevalitsus.",
    reference: "Galaatlastele 5:22-23",
  },
  "efeslastele": {
    text: "Sest teie olete armu läbi päästetud usu kaudu — ja see ei ole teist enestest, vaid see on Jumala and.",
    reference: "Efeslastele 2:8",
  },
  "filiplastele": {
    text: "Ma suudan kõik tema läbi, kes mind teeb vägevaks.",
    reference: "Filiplastele 4:13",
  },
  "koloslastele": {
    text: "Mida te iial teete, seda tehke kogu südamest, nõnda nagu Issandale ja mitte nagu inimestele.",
    reference: "Koloslastele 3:23",
  },
  "1-tessalooniklastele": {
    text: "Rõõmustage alati, palvetage lakkamatult, tänage kõige eest!",
    reference: "1. Tessalooniklastele 5:16-18",
  },
  "2-tessalooniklastele": {
    text: "Issand aga on ustav; tema kinnitab teid ja hoiab teid kurja eest.",
    reference: "2. Tessalooniklastele 3:3",
  },
  "1-timoteosele": {
    text: "Sest Jumal ei ole meile andnud arguse vaimu, vaid väe ja armastuse ja mõistlikkuse vaimu.",
    reference: "2. Timoteosele 1:7",
  },
  "2-timoteosele": {
    text: "Kogu Pühakiri on Jumala sisendatud ja kasulik õpetamiseks, noomimiseks, parandamiseks, kasvatamiseks õiguses.",
    reference: "2. Timoteosele 3:16",
  },
  "tiitusele": {
    text: "Sest Jumala arm on ilmunud päästvana kõigile inimestele.",
    reference: "Tiitusele 2:11",
  },
  "fileemonile": {
    text: "Võta ta vastu nõnda nagu mind ennast.",
    reference: "Fileemonile 1:17",
  },
  // Üldkirjad
  "heebrealastele": {
    text: "Aga usk on loodetava tõelisus, nähtamatute asjade tõendus.",
    reference: "Heebrealastele 11:1",
  },
  "jaakobus": {
    text: "Olge aga sõna tegijad ja mitte üksnes kuuljad, pettes iseendid.",
    reference: "Jaakobuse 1:22",
  },
  "1-peetrus": {
    text: "Heitke kõik oma mure tema peale, sest tema peab hoolt teie eest.",
    reference: "1. Peetruse 5:7",
  },
  "2-peetrus": {
    text: "Kasvage meie Issanda ja Päästja Jeesuse Kristuse armus ja tundmises.",
    reference: "2. Peetruse 3:18",
  },
  "1-johannese-kiri": {
    text: "Jumal on armastus ja kes püsib armastuses, püsib Jumalas ja Jumal püsib temas.",
    reference: "1. Johannese 4:16",
  },
  "2-johannese-kiri": {
    text: "Ja see ongi armastus, et me elame tema käskude järgi.",
    reference: "2. Johannese 1:6",
  },
  "3-johannese-kiri": {
    text: "Mul ei ole suuremat rõõmu kui see, kui ma kuulen, et mu lapsed tões käivad.",
    reference: "3. Johannese 1:4",
  },
  "juudas": {
    text: "Aga sellele, kes võib teid hoida komistamast ja seada teid laitmatuna oma kirkuse palge ette hõiskamisega, ainsale Jumalale, meie Päästjale, olgu auhiilgus.",
    reference: "Juuda 1:24-25",
  },
  "ilmutus": {
    text: "Vaata, mina seisan ukse taga ja koputan. Kui keegi kuuleb mu häält ja avab ukse, siis ma tulen tema juurde sisse.",
    reference: "Ilmutuse 3:20",
  },
};

export function getBookQuote(slug: string): BookQuote {
  return (
    bookQuotes[slug] ?? {
      text: "Iga Jumala sõna on puhas; tema on kilbiks neile, kes usaldavad teda.",
      reference: "Õpetussõnad 30:5",
    }
  );
}
