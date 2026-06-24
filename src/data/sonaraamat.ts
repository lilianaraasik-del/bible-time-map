// Piibli nimede ja mõistete sõnaraamat
// Eesti keeles, lühikirjeldused + viited

export type DictType = "isik" | "paik" | "moiste" | "raamat";

export interface DictEntry {
  name: string;
  type: DictType;
  meaning?: string; // nime tähendus heebrea/kreeka keeles
  desc: string;
  ref?: string; // piibliviide
}

export const dictionary: DictEntry[] = [
  // A
  { name: "Aaron", type: "isik", meaning: "valgustatud", desc: "Moosese vanem vend, Iisraeli esimene ülempreester.", ref: "2Ms 28" },
  { name: "Abdeel", type: "isik", meaning: "Jumala sulane", desc: "Selemja isa, kuningas Joojakimi ajal.", ref: "Jr 36:26" },
  { name: "Abel", type: "isik", meaning: "tuulehoog, tühisus", desc: "Aadama ja Eeva teine poeg, karjane, kelle Kain tappis.", ref: "1Ms 4" },
  { name: "Aabraham", type: "isik", meaning: "paljude rahvaste isa", desc: "Iisraeli rahva esiisa, Jumala lepingu kandja.", ref: "1Ms 12–25" },
  { name: "Adbeel", type: "isik", meaning: "Jumala distsipliin", desc: "Iismaeli kolmas poeg, ühe Põhja-Araabia hõimu esiisa.", ref: "1Ms 25:13" },
  { name: "Aadam", type: "isik", meaning: "inimene, muld", desc: "Esimene inimene, kelle Jumal lõi.", ref: "1Ms 1–3" },
  { name: "Ahab", type: "isik", meaning: "isa vend", desc: "Iisraeli kuningas, Iisebeli abikaasa, kummardas Baali.", ref: "1Kn 16–22" },
  { name: "Ahasja", type: "isik", desc: "Iisraeli ja hiljem Juuda kuningas (kaks erinevat isikut).", ref: "1Kn 22; 2Kn 8" },
  { name: "Aamos", type: "isik", desc: "Karjase taustaga prohvet, hoiatas Iisraeli sotsiaalse ülekohtu eest.", ref: "Am" },
  { name: "Antiookia", type: "paik", desc: "Linn Süürias, kus jüngreid esmakordselt kristlasteks kutsuti.", ref: "Ap 11:26" },
  { name: "Areopaag", type: "paik", desc: "Ateena kõnnumägi, kus Paulus pidas kuulsa kõne.", ref: "Ap 17" },

  // B
  { name: "Baal", type: "moiste", desc: "Kaananlaste viljakusjumal, kelle kummardamine tõi Iisraelile sageli kohtu.", ref: "Km 2:13" },
  { name: "Baabel", type: "paik", desc: "Mesopotaamia linn ja impeerium; vangipõlve ja maise võimu sümbol.", ref: "1Ms 11; Jr 25" },
  { name: "Beetlemm", type: "paik", meaning: "leivakoda", desc: "Taaveti sünnilinn ja Jeesuse sünnipaik.", ref: "Lk 2" },
  { name: "Belsassar", type: "isik", desc: "Babüloonia viimane kuningas; nägi seinakirja.", ref: "Tn 5" },
  { name: "Boas", type: "isik", desc: "Jõukas Beetlemma mees, kes võttis Ruti naiseks; Taaveti vanaisa.", ref: "Rt 2–4" },

  // D
  { name: "Taanel", type: "isik", meaning: "Jumal on minu kohtunik", desc: "Prohvet Baabüloonia vangipõlves, lõvide auku visatud.", ref: "Tn" },
  { name: "Taavet", type: "isik", desc: "Iisraeli teine kuningas, paljude psalmide autor, Jeesuse esiisa.", ref: "1Sm 16 – 1Kn 2" },
  { name: "Deebora", type: "isik", desc: "Naisprohvet ja kohtunik, kes juhtis Iisraeli võitu Siisera üle.", ref: "Km 4–5" },

  // E
  { name: "Eedeni aed", type: "paik", desc: "Paradiisaed, kus elasid Aadam ja Eeva.", ref: "1Ms 2" },
  { name: "Eeva", type: "isik", meaning: "elu", desc: "Esimene naine, Aadama abikaasa.", ref: "1Ms 2–4" },
  { name: "Eelija", type: "isik", desc: "Põhja-Iisraeli prohvet, kes võitles Baali preestrite vastu Karmeli mäel.", ref: "1Kn 17–19" },
  { name: "Eliisa", type: "isik", desc: "Eelija järglane prohvetina; tegi palju imetegusid.", ref: "2Kn 2–9" },
  { name: "Elimelek", type: "isik", meaning: "minu Jumal on kuningas", desc: "Noomi abikaasa, Ruti äi; suri Moabis nälja ajal.", ref: "Rt 1" },
  { name: "Eefesos", type: "paik", desc: "Suur linn Väike-Aasias, kus oli üks tähtsamaid algkristlikke kogudusi.", ref: "Ef; Ap 19" },
  { name: "Hesekiel", type: "isik", desc: "Prohvet Baabüloonia vangipõlves; nägi kuiva luude oru nägemust.", ref: "Hs 37" },
  { name: "Eesav", type: "isik", desc: "Iisaki vanem poeg, müüs esmasünniõiguse Jaakobile.", ref: "1Ms 25–33" },

  // G
  { name: "Gileadi", type: "paik", desc: "Mägine piirkond Jordani idakaldal.", ref: "1Ms 31; Km 11" },
  { name: "Goljat", type: "isik", desc: "Vilistite hiiglane, kelle Taavet lingukiviga tappis.", ref: "1Sm 17" },
  { name: "Genezareti järv", type: "paik", desc: "Mageveejärv Galileas; Jeesuse teenistuse keskpunkt.", ref: "Lk 5" },
  { name: "Getsemani", type: "paik", meaning: "õlipress", desc: "Aed Õlimäel, kus Jeesus palvetas enne reetmist.", ref: "Mt 26" },

  // H
  { name: "Habakuk", type: "isik", desc: "Prohvet, kelle raamat käsitleb usu ja kannatuse pinget.", ref: "Hab" },
  { name: "Hagai", type: "isik", desc: "Vangipõlvest naasmise järgne prohvet; julgustas templit taas üles ehitama.", ref: "Hg" },
  { name: "Hesekia", type: "isik", desc: "Vaga Juuda kuningas; usaldas Jumalat Assüüria piiramisel.", ref: "2Kn 18–20" },
  { name: "Hoosea", type: "isik", desc: "Põhja-Iisraeli prohvet; abielu kujund Jumala armastusest oma rahva vastu.", ref: "Ho" },

  // I
  { name: "Iisak", type: "isik", meaning: "naer", desc: "Aabrahami ja Saara poeg; Jaakobi ja Eesavi isa.", ref: "1Ms 21–28" },
  { name: "Iisai", type: "isik", desc: "Taaveti isa; Jeesuse esiisa.", ref: "1Sm 16" },
  { name: "Iisebel", type: "isik", desc: "Foiniikia printsess, Ahabi naine; Baali kummardamise propageerija.", ref: "1Kn 16–21" },
  { name: "Iiob", type: "isik", desc: "Õiglane mees, kelle kannatuste lugu uurib Jumala õigluse küsimust.", ref: "Ii" },
  { name: "Iisrael", type: "moiste", meaning: "Jumalaga maadleja", desc: "Jaakobi uus nimi; ka rahva ja maa nimi.", ref: "1Ms 32" },

  // J
  { name: "Jaakob", type: "isik", desc: "Iisaki poeg, hiljem nimega Iisrael; 12 suguharu isa.", ref: "1Ms 25–50" },
  { name: "Jeremija", type: "isik", desc: "“Nuttev prohvet”, kes hoiatas Juudat enne Baabüloonia vangipõlve.", ref: "Jr" },
  { name: "Jeesus Kristus", type: "isik", meaning: "Päästja, Võitu", desc: "Jumala Poeg, Messias; suri ja tõusis üles inimeste päästmiseks.", ref: "Mt; Mk; Lk; Jh" },
  { name: "Johannes Ristija", type: "isik", desc: "Jeesuse eelkäija, ristis Jordanis.", ref: "Mt 3" },
  { name: "Johannes (apostel)", type: "isik", desc: "Jeesuse jünger; Johannese evangeeliumi ja Ilmutusraamatu autor.", ref: "Jh; Ilm" },
  { name: "Joona", type: "isik", desc: "Prohvet, keda suur kala kolm päeva neelas; jutlustas Niineves.", ref: "Jn" },
  { name: "Joosua", type: "isik", desc: "Moosese järglane; juhtis Iisraeli tõotatud maale.", ref: "Jos" },
  { name: "Joosep (Jaakobi poeg)", type: "isik", desc: "Müüdi orjaks Egiptusesse; sai sealse riigi teiseks meheks.", ref: "1Ms 37–50" },
  { name: "Joosep (Maarja mees)", type: "isik", desc: "Naatsareti puusepp, Jeesuse kasuisa.", ref: "Mt 1" },
  { name: "Jeruusalemm", type: "paik", desc: "Iisraeli pealinn; templi ja Jeesuse ristilöömise paik.", ref: "2Sm 5; Lk 23" },
  { name: "Juudas Iskariot", type: "isik", desc: "Jeesuse jünger, kes Ta 30 hõbeseekli eest reetis.", ref: "Mt 26" },

  // K
  { name: "Kain", type: "isik", desc: "Aadama ja Eeva esimene poeg; tappis venna Aabeli.", ref: "1Ms 4" },
  { name: "Kaifas", type: "isik", desc: "Ülempreester, kes mõistis Jeesuse kohtuotsuse.", ref: "Mt 26" },
  { name: "Kapernaum", type: "paik", desc: "Galilea linn Genezareti järve ääres; Jeesuse teenistuse baas.", ref: "Mt 4" },
  { name: "Kaanan", type: "paik", desc: "Tõotatud maa, hilisem Iisrael.", ref: "1Ms 12" },
  { name: "Kerubid", type: "moiste", desc: "Inglilaadsed olendid, kes valvavad Jumala juuresolekut.", ref: "1Ms 3:24; Hs 1" },
  { name: "Kuningate raamat", type: "raamat", desc: "Iisraeli ja Juuda kuningate ajalugu Saalomonist vangipõlveni.", ref: "1–2Kn" },

  // L
  { name: "Laatsarus", type: "isik", desc: "Maarja ja Marta vend, kelle Jeesus surnuist üles äratas.", ref: "Jh 11" },
  { name: "Lea", type: "isik", desc: "Jaakobi esimene naine, kuue suguharu ema.", ref: "1Ms 29" },
  { name: "Leevitid", type: "moiste", desc: "Leevi suguharu liikmed, kes teenisid templis.", ref: "4Ms 3" },
  { name: "Loti", type: "isik", desc: "Aabrahami vennapoeg; pääses Soodoma hävingust.", ref: "1Ms 19" },

  // M
  { name: "Maarja (Jeesuse ema)", type: "isik", desc: "Naatsareti neitsi, kes sünnitas Püha Vaimu läbi Jeesuse.", ref: "Lk 1–2" },
  { name: "Maarja Magdaleena", type: "isik", desc: "Jeesuse jünger, esimene ülestõusnud Issanda tunnistaja.", ref: "Jh 20" },
  { name: "Malaki", type: "isik", desc: "Vana Testamendi viimane prohvet.", ref: "Ml" },
  { name: "Manna", type: "moiste", desc: "Taevane leib, mida Jumal andis Iisraelile kõrbes.", ref: "2Ms 16" },
  { name: "Melkisedek", type: "isik", meaning: "õigluse kuningas", desc: "Saalemi kuningas ja preester, kes õnnistas Aabrahami.", ref: "1Ms 14; Hb 7" },
  { name: "Messias", type: "moiste", meaning: "võitu", desc: "Tõotatud Päästja; täideti Jeesuses Kristuses.", ref: "Js 53; Jh 4:25" },
  { name: "Miika", type: "isik", desc: "Prohvet, kes kuulutas ette Messia sündi Beetlemmas.", ref: "Mi 5:1" },
  { name: "Mooses", type: "isik", desc: "Iisraeli juht, kes viis rahva Egiptusest välja ja sai Toora.", ref: "2Ms – 5Ms" },

  // N
  { name: "Naatan", type: "isik", desc: "Prohvet Taaveti õukonnas; mõistis Taaveti üle kohut Patseba pärast.", ref: "2Sm 12" },
  { name: "Nebukadnetsar", type: "isik", desc: "Baabüloonia kuningas, hävitas Jeruusalemma templi.", ref: "Tn 2; 2Kn 25" },
  { name: "Noa", type: "isik", desc: "Õiglane mees, ehitas laeva ja päästis perekonna veeuputusest.", ref: "1Ms 6–9" },
  { name: "Noomi", type: "isik", desc: "Ruti ämm, Elimeleki lesk.", ref: "Rt 1" },
  { name: "Niineve", type: "paik", desc: "Assüüria pealinn, kuhu Joonale saadeti.", ref: "Jn 3" },

  // P
  { name: "Paulus", type: "isik", desc: "Endine taga­kiusaja, hilisem suur misjonär; kirjutas paljud Uue Testamendi kirjad.", ref: "Ap 9; Rm; 1–2Ko" },
  { name: "Peetrus", type: "isik", desc: "Jüngrite eestvedaja; nuhtles Jeesust kolm korda enne kukke laulu.", ref: "Mt 16; Jh 21" },
  { name: "Pilaatus", type: "isik", desc: "Rooma asevalitseja Juudamaal; andis loa Jeesuse ristilöömiseks.", ref: "Mt 27" },
  { name: "Patseba", type: "isik", desc: "Uurija naine, hiljem Taaveti abikaasa, Saalomoni ema.", ref: "2Sm 11" },

  // R
  { name: "Raahel", type: "isik", desc: "Jaakobi armastatud naine, Joosepi ja Benjamini ema.", ref: "1Ms 29–35" },
  { name: "Rahab", type: "isik", desc: "Jeeriko prostituut, kes peitis Iisraeli salakuulajad.", ref: "Jos 2" },
  { name: "Rooma", type: "paik", desc: "Impeeriumi pealinn; Pauluse kirja sihtkoht ja tema märtrisurma paik.", ref: "Rm; Ap 28" },
  { name: "Rebeka", type: "isik", desc: "Iisaki naine, Jaakobi ja Eesavi ema.", ref: "1Ms 24" },
  { name: "Ruut", type: "isik", desc: "Moabi naine, kes liitus Iisraeli rahvaga; Taaveti vana­vanaema.", ref: "Rt" },

  // S
  { name: "Saara", type: "isik", desc: "Aabrahami abikaasa, Iisaki ema.", ref: "1Ms 17–23" },
  { name: "Saalomon", type: "isik", desc: "Taaveti poeg, Iisraeli kuningas; ehitas templi; tarkuse sümbol.", ref: "1Kn 1–11" },
  { name: "Saamuel", type: "isik", desc: "Viimane kohtunik ja esimene suur prohvet; võidis Sauli ja Taaveti kuningateks.", ref: "1Sm" },
  { name: "Saatan", type: "moiste", meaning: "vastane", desc: "Langenud ingel, Jumala ja inimese vaenlane.", ref: "Ii 1; Ilm 12" },
  { name: "Saul", type: "isik", desc: "Iisraeli esimene kuningas.", ref: "1Sm 9–31" },
  { name: "Seetan", type: "moiste", desc: "Vaata Saatan.", ref: "" },
  { name: "Siion", type: "paik", desc: "Jeruusalemma mägi, sümboolselt Jumala linn.", ref: "Ps 48" },
  { name: "Siinai", type: "paik", desc: "Mägi, kus Mooses sai Jumalalt seaduse.", ref: "2Ms 19" },
  { name: "Sefanja", type: "isik", desc: "Prohvet, kes hoiatas Issanda päeva eest.", ref: "Sf" },
  { name: "Saaria", type: "isik", desc: "Vaata Sakarja." },
  { name: "Sakarja", type: "isik", desc: "Prohvet, kes kuulutas messianlikku kuningat eesli seljas tulemas.", ref: "Sk 9:9" },
  { name: "Simson", type: "isik", desc: "Naasiir-kohtunik, kuulus oma jõu poolest; Delila reetis ta.", ref: "Km 13–16" },
  { name: "Soodom", type: "paik", desc: "Patuse linn, mille Jumal hävitas tule ja väävliga.", ref: "1Ms 19" },
  { name: "Stefanos", type: "isik", desc: "Esimene kristlik märter, kividega surnuks visatud.", ref: "Ap 7" },

  // T
  { name: "Tabernaakel", type: "moiste", desc: "Liikuv telk-pühamu Iisraeli kõrberändamise ajal.", ref: "2Ms 26" },
  { name: "Toomas", type: "isik", desc: "Jünger, kes kahtles ülestõusnud Jeesuses, kuni nägi haavu.", ref: "Jh 20" },
  { name: "Tarsos", type: "paik", desc: "Pauluse sünnilinn Kiliikias.", ref: "Ap 9:11" },

  // U
  { name: "Uurija", type: "isik", desc: "Hett, Patseba abikaasa, kelle Taavet lahingusse hukkuma saatis.", ref: "2Sm 11" },

  // Õ/V/Ü
  { name: "Vaarao", type: "moiste", desc: "Egiptuse kuninga tiitel; sageli Iisraeli vastane.", ref: "2Ms 5" },
  { name: "Õlimägi", type: "paik", desc: "Mägi Jeruusalemma ida pool; Jeesuse palvepaik ja taevassemineku paik.", ref: "Ap 1:12" },
];
