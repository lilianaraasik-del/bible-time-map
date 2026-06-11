import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Mountain, Waves, Building2, Church, Milestone, ArrowUp, BookOpen, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { BiblePlacesMap } from "@/components/BiblePlacesMap";

interface BiblicalPlace {
  id: string;
  name: string;
  hebrewName?: string;
  location: string;
  coordinates: {lat: number;lng: number;};
  significance: string;
  description: string;
  biblicalEvents: Array<{
    event: string;
    scripture: string;
    url: string;
  }>;
  category: "linn" | "mägi" | "jõgi" | "tempel" | "meri" | "muu";
  icon: any;
}

const biblicalPlaces: BiblicalPlace[] = [
{
  id: "jeruusalemm",
  name: "Jeruusalemm",
  hebrewName: "ירושלים",
  location: "Iisrael, Juuda mäestik",
  coordinates: { lat: 31.7683, lng: 35.2137 },
  significance: "Püha linn, Taaveti pealinn, Saalomoni templi asukoht",
  description: "Jeruusalemm on Piibli üks kesksemaid kohti. See on Iisraeli pealinn, kus asus Saalomoni tempel ja kus Jeesus risti löödi ning üles tõusis. Linn on olnud juudi rahva vaimse elu keskus läbi sajandite.",
  biblicalEvents: [
  { event: "Taavet võttis linna jebuuslastelt", scripture: "2. Saamuel 5:6-10", url: "https://piibel.ee/?book=2.+Saamueli&chapter=5&verse=6" },
  { event: "Saalomon ehitas templi", scripture: "1. Kuningate 6-8", url: "https://piibel.ee/?book=1.+Kuningate&chapter=6" },
  { event: "Jeesuse ristilöömine ja ülestõusmine", scripture: "Luuka 23-24", url: "https://piibel.ee/?book=Luuka&chapter=23" },
  { event: "Püha Vaimu väljavalamine Nelipühal", scripture: "Apostlite teod 2:1-4", url: "https://piibel.ee/?book=Apostlite+tegude&chapter=2&verse=1" },
  { event: "Babüloonia hävitas linna ja templi", scripture: "2. Kuningate 25:8-10", url: "https://piibel.ee/?book=2.+Kuningate&chapter=25&verse=8" }],

  category: "linn",
  icon: Building2
},
{
  id: "petlemm",
  name: "Petlemm",
  hebrewName: "בית לחם",
  location: "Iisrael, 8 km Jeruusalemmast lõunas",
  coordinates: { lat: 31.7054, lng: 35.2024 },
  significance: "Taaveti sünnilinn, Jeesuse sünnipaik",
  description: "Petlemm, mille nimi tähendab 'leivamaja', on üks Piibli tähtsaimaid kohti. Kuningas Taavet sündis siin ja ligi tuhat aastat hiljem sündis siin ka Jeesus Kristus, täites prohvetikuulutuse.",
  biblicalEvents: [
  { event: "Taaveti sünd ja lapsepõlv", scripture: "1. Saamuel 16:1-13", url: "https://piibel.ee/?book=1.+Saamueli&chapter=16&verse=1" },
  { event: "Ruti ja Boose lugu", scripture: "Ruti 1-4", url: "https://piibel.ee/?book=Ruti&chapter=1" },
  { event: "Jeesuse sünd laudas", scripture: "Luuka 2:1-7", url: "https://piibel.ee/?book=Luuka&chapter=2&verse=1" },
  { event: "Tarkade külaskäik", scripture: "Matteus 2:1-12", url: "https://piibel.ee/?book=Matteuse&chapter=2&verse=1" },
  { event: "Laste mõrvamine (Heroodese käsul)", scripture: "Matteus 2:16-18", url: "https://piibel.ee/?book=Matteuse&chapter=2&verse=16" }],

  category: "linn",
  icon: Building2
},
{
  id: "naatsaret",
  name: "Naatsaret",
  hebrewName: "נצרת",
  location: "Iisrael, Galilea",
  coordinates: { lat: 32.7055, lng: 35.2983 },
  significance: "Jeesuse lapsepõlve kodu",
  description: "Naatsaret oli väike Galilea küla, kus Jeesus üles kasvas. Kuigi väike ja tähtsusetu paik, sai sellest koht, kus Jumala Poeg veetis oma inimliku elu suurema osa.",
  biblicalEvents: [
  { event: "Ingel Gabriel ilmub Maarjale", scripture: "Luuka 1:26-38", url: "https://piibel.ee/?book=Luuka&chapter=1&verse=26" },
  { event: "Jeesus kasvas üles Naatsaretis", scripture: "Luuka 2:39-40, 51-52", url: "https://piibel.ee/?book=Luuka&chapter=2&verse=39" },
  { event: "Jeesus õpetab sünagoogi", scripture: "Luuka 4:16-30", url: "https://piibel.ee/?book=Luuka&chapter=4&verse=16" },
  { event: "Rahvas püüdis ta järsakust alla paisata", scripture: "Luuka 4:28-30", url: "https://piibel.ee/?book=Luuka&chapter=4&verse=28" }],

  category: "linn",
  icon: Building2
},
{
  id: "siinai",
  name: "Siinai mägi",
  hebrewName: "הר סיני",
  location: "Siinai poolsaar, Egiptus",
  coordinates: { lat: 28.5393, lng: 33.9746 },
  significance: "Kus Jumal andis Moosesele Kümne Käsku",
  description: "Siinai mägi on püha mägi, kus Jumal ilmutas end Moosesele põlevas põõsas ja kus Ta andis iisraellastele Seaduse, sealhulgas Kümne Käsku. See oli kohtumispot Jumala ja Tema rahva vahel.",
  biblicalEvents: [
  { event: "Mooses näeb põlevat põõsast", scripture: "2. Mooses 3:1-6", url: "https://piibel.ee/?book=2.+Moosese&chapter=3&verse=1" },
  { event: "Jumal annab Kümne Käsku", scripture: "2. Mooses 20:1-17", url: "https://piibel.ee/?book=2.+Moosese&chapter=20&verse=1" },
  { event: "Mooses saab kivitahvlid", scripture: "2. Mooses 31:18", url: "https://piibel.ee/?book=2.+Moosese&chapter=31&verse=18" },
  { event: "Kuldvasikas ja tahvlite purustamine", scripture: "2. Mooses 32:1-20", url: "https://piibel.ee/?book=2.+Moosese&chapter=32&verse=1" },
  { event: "Eelija põgeneb siia Iiseebeli eest", scripture: "1. Kuningate 19:1-18", url: "https://piibel.ee/?book=1.+Kuningate&chapter=19&verse=1" }],

  category: "mägi",
  icon: Mountain
},
{
  id: "jordani-jogi",
  name: "Jordani jõgi",
  hebrewName: "נהר הירדן",
  location: "Iisrael, piir Jordaaniaga",
  coordinates: { lat: 31.8606, lng: 35.5547 },
  significance: "Iisraeli sisseminek Tõotatud Maale, Jeesuse ristimine",
  description: "Jordani jõgi on Iisraeli tähtis jõgi, mis voolab läbi Gennesareti järve ja lõpeb Surnumeresse. See oli piir, mille iisraellased ületasid sisenedes Tõotatud Maale, ja koht, kus Jeesus ristiti.",
  biblicalEvents: [
  { event: "Iisrael läbib Jordani kuivjalu", scripture: "Joosua 3:14-17", url: "https://piibel.ee/?book=Joosua&chapter=3&verse=14" },
  { event: "Naeeman pestakse katakusest puhtaks", scripture: "2. Kuningate 5:10-14", url: "https://piibel.ee/?book=2.+Kuningate&chapter=5&verse=10" },
  { event: "Eelija lõi vett kuivaks mantliga", scripture: "2. Kuningate 2:8", url: "https://piibel.ee/?book=2.+Kuningate&chapter=2&verse=8" },
  { event: "Johannes Ristija ristib Jordanis", scripture: "Matteus 3:5-6", url: "https://piibel.ee/?book=Matteuse&chapter=3&verse=5" },
  { event: "Jeesuse ristimine", scripture: "Matteus 3:13-17", url: "https://piibel.ee/?book=Matteuse&chapter=3&verse=13" }],

  category: "jõgi",
  icon: Waves
},
{
  id: "gennesareti-jarv",
  name: "Gennesareti järv",
  hebrewName: "ים כנרת",
  location: "Iisrael, Galilea",
  coordinates: { lat: 32.8156, lng: 35.5947 },
  significance: "Jeesuse maapealse teenistuse keskus, ime paik",
  description: "Gennesareti järv (tuntud ka kui Galilea meri või Tibeeria järv) oli Jeesuse maapealse teenistuse keskus. Paljud tema jüngrid olid kalurid sellelt järvelle ja siin toimus palju imetegusid.",
  biblicalEvents: [
  { event: "Jeesus kutsub jüngreid kalurite hulgast", scripture: "Matteus 4:18-22", url: "https://piibel.ee/?book=Matteuse&chapter=4&verse=18" },
  { event: "Jeesus vaigistab tormi", scripture: "Markus 4:35-41", url: "https://piibel.ee/?book=Markuse&chapter=4&verse=35" },
  { event: "Jeesus kõnnib vee peal", scripture: "Matteus 14:22-33", url: "https://piibel.ee/?book=Matteuse&chapter=14&verse=22" },
  { event: "Ime kalapüük", scripture: "Luuka 5:4-11", url: "https://piibel.ee/?book=Luuka&chapter=5&verse=4" },
  { event: "Suur kalapüük pärast ülestõusmist", scripture: "Johannes 21:1-14", url: "https://piibel.ee/?book=Johannese&chapter=21&verse=1" }],

  category: "jõgi",
  icon: Waves
},
{
  id: "saalomoni-tempel",
  name: "Saalomoni tempel",
  hebrewName: "בית המקדש",
  location: "Jeruusalemm, Templi mägi",
  coordinates: { lat: 31.7780, lng: 35.2354 },
  significance: "Jumala elupaik Iisraelis, ohverdamise koht",
  description: "Esimene tempel Jeruusaleemas, mille ehitas kuningas Saalomon. See oli Jumala elupaik Iisraeli keskel ja koht, kus rahvas tuli ohverdama ja Jumalat kummardama.",
  biblicalEvents: [
  { event: "Saalomon alustas templi ehitamist", scripture: "1. Kuningate 6:1", url: "https://piibel.ee/?book=1.+Kuningate&chapter=6&verse=1" },
  { event: "Templi pühitsemine", scripture: "1. Kuningate 8:1-66", url: "https://piibel.ee/?book=1.+Kuningate&chapter=8&verse=1" },
  { event: "Jumala hiilgus täitis templi", scripture: "1. Kuningate 8:10-11", url: "https://piibel.ee/?book=1.+Kuningate&chapter=8&verse=10" },
  { event: "Jesaja nägi Jumalat templis", scripture: "Jesaja 6:1-8", url: "https://piibel.ee/?book=Jesaja&chapter=6&verse=1" },
  { event: "Jeesus puhastab templi", scripture: "Johannes 2:13-17", url: "https://piibel.ee/?book=Johannese&chapter=2&verse=13" }],

  category: "tempel",
  icon: Church
},
{
  id: "karmel-magi",
  name: "Karmel mägi",
  hebrewName: "הר הכרמל",
  location: "Iisrael, rannikuäärne mägi",
  coordinates: { lat: 32.7320, lng: 35.0583 },
  significance: "Eelija võitlus Baali prohvetitega",
  description: "Karmel mägi on tuntud kohana, kus prohvet Eelija väljakutse esitas Baali prohvetitele, tõestamaks et Issand on ainus tõeline Jumal. See oli võimas näitamine Jumala väest.",
  biblicalEvents: [
  { event: "Eelija väljakutse Baali prohvetitele", scripture: "1. Kuningate 18:19-24", url: "https://piibel.ee/?book=1.+Kuningate&chapter=18&verse=19" },
  { event: "Tuli tuleb taevast Issanda ohvrile", scripture: "1. Kuningate 18:36-38", url: "https://piibel.ee/?book=1.+Kuningate&chapter=18&verse=36" },
  { event: "Baali prohvetid tapetakse", scripture: "1. Kuningate 18:40", url: "https://piibel.ee/?book=1.+Kuningate&chapter=18&verse=40" },
  { event: "Eelija palvetab vihma pärast", scripture: "1. Kuningate 18:41-46", url: "https://piibel.ee/?book=1.+Kuningate&chapter=18&verse=41" }],

  category: "mägi",
  icon: Mountain
},
{
  id: "ooli-magi",
  name: "Õli mägi",
  hebrewName: "הר הזיתים",
  location: "Jeruusalemm, Kidron oru idaküljel",
  coordinates: { lat: 31.7789, lng: 35.2413 },
  significance: "Jeesuse palve paik, taevassemineku koht",
  description: "Õli mägi asub Jeruusalemma idaküljel üle Kidroni oru. Jeesus käis seal sageli palvetamas ja just sealt ta taevasse läks pärast ülestõusmist.",
  biblicalEvents: [
  { event: "Jeesus palvetas seal sageli", scripture: "Luuka 22:39", url: "https://piibel.ee/?book=Luuka&chapter=22&verse=39" },
  { event: "Ketsemani aias palve", scripture: "Matteus 26:36-46", url: "https://piibel.ee/?book=Matteuse&chapter=26&verse=36" },
  { event: "Jeesuse kinnivõtmine", scripture: "Matteus 26:47-56", url: "https://piibel.ee/?book=Matteuse&chapter=26&verse=47" },
  { event: "Jeesuse taevasseminek", scripture: "Apostlite teod 1:9-12", url: "https://piibel.ee/?book=Apostlite+tegude&chapter=1&verse=9" },
  { event: "Prohvetikuulutus Jeesuse tagasitulekust", scripture: "Sakarja 14:4", url: "https://piibel.ee/?book=Sakarja&chapter=14&verse=4" }],

  category: "mägi",
  icon: Mountain
},
{
  id: "babuulon",
  name: "Babülon",
  hebrewName: "בבל",
  location: "Iraak, Mesopotaamia",
  coordinates: { lat: 32.5355, lng: 44.4275 },
  significance: "Suur impeerium, Iisraeli pagenduse koht",
  description: "Babülon oli üks vana maailma võimsamaid linnu ja riike. Iisraeli rahvas viidi siia 70 aastaks pagendusesse pärast Jeruusalemma hävitamist.",
  biblicalEvents: [
  { event: "Paabeli torn ehitatakse", scripture: "1. Mooses 11:1-9", url: "https://piibel.ee/?book=1.+Moosese&chapter=11&verse=1" },
  { event: "Nebukadnessar hävitab Jeruusalemma", scripture: "2. Kuningate 25:1-21", url: "https://piibel.ee/?book=2.+Kuningate&chapter=25&verse=1" },
  { event: "Taaniel lõvide koopas", scripture: "Taaniel 6:1-28", url: "https://piibel.ee/?book=Taanieli&chapter=6&verse=1" },
  { event: "Kolm meest tuletunglas", scripture: "Taaniel 3:1-30", url: "https://piibel.ee/?book=Taanieli&chapter=3&verse=1" },
  { event: "Küüros laseb juutidel koju naasta", scripture: "Esra 1:1-4", url: "https://piibel.ee/?book=Esra&chapter=1&verse=1" }],

  category: "linn",
  icon: Building2
},
{
  id: "banias",
  name: "Banias (Filippuse Kaisarea)",
  hebrewName: "קיסריה פיליפи",
  location: "Goolani kõrgustik, Iisrael",
  coordinates: { lat: 33.2486, lng: 35.6944 },
  significance: "Peetruse usutunnistus, Jeesuse muutmise lähedal",
  description: "Banias, tuntud ka kui Filippuse Kaisarea, oli linn Hermoni mäe jalamil. Siin tunnistas Peetrus Jeesust Kristuseks, Elava Jumala Pojaks. See oli paganlike jumaluste kummardamise koht, kus oli Paani jumala tempel.",
  biblicalEvents: [
  { event: "Peetrus tunnistab Jeesust Kristuseks", scripture: "Matteus 16:13-20", url: "https://piibel.ee/?book=Matteuse&chapter=16&verse=13" },
  { event: "Jeesus kuulutab oma kiriku ehitamisest", scripture: "Matteus 16:18", url: "https://piibel.ee/?book=Matteuse&chapter=16&verse=18" },
  { event: "Jeesus annab Peetrusele taevariigi võtmed", scripture: "Matteus 16:19", url: "https://piibel.ee/?book=Matteuse&chapter=16&verse=19" },
  { event: "Jeesus kuulutab oma surma ja ülestõusmist", scripture: "Matteus 16:21-23", url: "https://piibel.ee/?book=Matteuse&chapter=16&verse=21" }],

  category: "linn",
  icon: Building2
},
{
  id: "beer-seba",
  name: "Beer-Seba",
  hebrewName: "באר שבע",
  location: "Negev, Lõuna-Iisrael",
  coordinates: { lat: 31.2444, lng: 34.8419 },
  significance: "Patriarhide koht, 'Daanist kuni Beer-Sebani' lõunapiir",
  description: "Beer-Seba, mille nimi tähendab 'vande kaev', oli tähtis patriarhide linn Negevis. Aabram ja Iisak sõlmisid siin lepinguid. Beer-Seba oli Iisraeli maa lõunapiir, seega ütlus 'Daanist kuni Beer-Sebani' tähendas kogu Iisraeli maad.",
  biblicalEvents: [
  { event: "Aabram ja Abimelek sõlmivad lepingu", scripture: "1. Mooses 21:22-32", url: "https://piibel.ee/?book=1.+Moosese&chapter=21&verse=22" },
  { event: "Iisak ehitas altari ja kutsus Issanda nime", scripture: "1. Mooses 26:23-25", url: "https://piibel.ee/?book=1.+Moosese&chapter=26&verse=23" },
  { event: "Jaakobil oli nägemus Peetlist", scripture: "1. Mooses 46:1-4", url: "https://piibel.ee/?book=1.+Moosese&chapter=46&verse=1" },
  { event: "Eelija põgenes siit Iiseebeli eest", scripture: "1. Kuningate 19:3", url: "https://piibel.ee/?book=1.+Kuningate&chapter=19&verse=3" },
  { event: "Samueli pojad kohut mõistsid siin", scripture: "1. Saamuel 8:2", url: "https://piibel.ee/?book=1.+Saamueli&chapter=8&verse=2" }],

  category: "linn",
  icon: Building2
},
{
  id: "beet-hooron",
  name: "Beet-Hooron",
  hebrewName: "בית חורון",
  location: "Efraimi mäestik, Iisrael",
  coordinates: { lat: 31.8833, lng: 35.1167 },
  significance: "Strateegiline kindluslinn, Joosua võit",
  description: "Beet-Hooron oli kaks linnu - Ülemine ja Alumine Beet-Hooron - strateegiliselt tähtsal kohal mägedes. Siin põgenesid viis kaanani kuningat Joosua eest ja Issand saatis suurt rahet.",
  biblicalEvents: [
  { event: "Viis kuningat põgenesid Joosua eest", scripture: "Joosua 10:10-11", url: "https://piibel.ee/?book=Joosua&chapter=10&verse=10" },
  { event: "Suur rahe taevast tapeti vaenlased", scripture: "Joosua 10:11", url: "https://piibel.ee/?book=Joosua&chapter=10&verse=11" },
  { event: "Saalomon kindlustas linnad", scripture: "2. Ajaraamat 8:5", url: "https://piibel.ee/?book=2.+Ajaraamat&chapter=8&verse=5" },
  { event: "Fillistlased laastasid linna", scripture: "1. Saamuel 13:18", url: "https://piibel.ee/?book=1.+Saamueli&chapter=13&verse=18" }],

  category: "linn",
  icon: Building2
},
{
  id: "beet-kerem",
  name: "Beet-Kerem",
  hebrewName: "בית הכרם",
  location: "Juuda, lähel Jeruusalemmale",
  coordinates: { lat: 31.7167, lng: 35.1833 },
  significance: "Signaalitule paik, viinamäe küla",
  description: "Beet-Kerem, 'viinamäe maja', oli küla Juudas, mis on tuntud kui signaalitule koht. Prohvetid kasutasid seda kohta hoiatuste edastamiseks.",
  biblicalEvents: [
  { event: "Signaalituli Babüloonia sissetungi eest hoiatamiseks", scripture: "Jeremija 6:1", url: "https://piibel.ee/?book=Jeremija&chapter=6&verse=1" },
  { event: "Malkija, Beet-Keremi ülemate üks, ehitas Prügimäe väravat", scripture: "Nehemja 3:14", url: "https://piibel.ee/?book=Nehemja&chapter=3&verse=14" },
  { event: "Viinamarjaistanduste piirkond", scripture: "Nehemja 3:14", url: "https://piibel.ee/?book=Nehemja&chapter=3&verse=14" }],

  category: "linn",
  icon: Building2
},
{
  id: "beet-sean",
  name: "Beet-Sean",
  hebrewName: "בית שאן",
  location: "Jordani org, Iisrael",
  coordinates: { lat: 32.5008, lng: 35.4983 },
  significance: "Sauli surm, fillistlaste linn",
  description: "Beet-Sean oli võimas kaananlaste ja hiljem fillistlaste linn strateegilises kohas Jordani ja Jisreeli oru ristumispaigas. Siin riputasid fillistlased Sauli ja tema poegade kehad müürile pärast Gilboa lahingut.",
  biblicalEvents: [
  { event: "Sauli ja tema poegade kehad riputati müürile", scripture: "1. Saamuel 31:10-12", url: "https://piibel.ee/?book=1.+Saamueli&chapter=31&verse=10" },
  { event: "Jaabese mehed päästsid kehad", scripture: "1. Saamuel 31:11-13", url: "https://piibel.ee/?book=1.+Saamueli&chapter=31&verse=11" },
  { event: "Manasse ei suutnud linna vallutada", scripture: "Kohtumõistjad 1:27", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=1&verse=27" },
  { event: "Saalomoni valitsusalas", scripture: "1. Kuningate 4:12", url: "https://piibel.ee/?book=1.+Kuningate&chapter=4&verse=12" }],

  category: "linn",
  icon: Building2
},
{
  id: "beet-semes",
  name: "Beet-Semes",
  hebrewName: "בית שמש",
  location: "Sefeela, Iisrael",
  coordinates: { lat: 31.7500, lng: 34.9833 },
  significance: "Lepingulaeka tagasisaatmine, Usias võit",
  description: "Beet-Semes, 'päikese allikas', oli leeviitide linn Juudas. Siia tõid fillistlased Lepingulaeka tagasi pärast 7 kuud, ja inimesed karistati, kui vaatasid laeka sisse.",
  biblicalEvents: [
  { event: "Fillistlased tõid Lepingulaeka siia tagasi", scripture: "1. Saamuel 6:12-15", url: "https://piibel.ee/?book=1.+Saamueli&chapter=6&verse=12" },
  { event: "Inimesi tapeti laeka sisse vaatamise eest", scripture: "1. Saamuel 6:19", url: "https://piibel.ee/?book=1.+Saamueli&chapter=6&verse=19" },
  { event: "Usias võitis siin fillistlased", scripture: "2. Ajaraamat 28:18", url: "https://piibel.ee/?book=2.+Ajaraamat&chapter=28&verse=18" },
  { event: "Leeviitide linn Juudas", scripture: "Joosua 21:16", url: "https://piibel.ee/?book=Joosua&chapter=21&verse=16" }],

  category: "linn",
  icon: Building2
},
{
  id: "besek",
  name: "Besek",
  hebrewName: "בזק",
  location: "Keskne Iisrael",
  coordinates: { lat: 32.4333, lng: 35.4667 },
  significance: "Sauli esimene võit kuningana",
  description: "Besek oli koht, kus Saul kogus Iisraeli sõjaväe enne Jaabese päästmist ammonlaste käest. See oli Sauli esimene suur võit kuningana ja kinnitas tema positsiooni Iisraeli juhina.",
  biblicalEvents: [
  { event: "Saul kogus väe Besekis", scripture: "1. Saamuel 11:8", url: "https://piibel.ee/?book=1.+Saamueli&chapter=11&verse=8" },
  { event: "330,000 meest kogunes", scripture: "1. Saamuel 11:8", url: "https://piibel.ee/?book=1.+Saamueli&chapter=11&verse=8" },
  { event: "Saul võitis ammonlased", scripture: "1. Saamuel 11:11", url: "https://piibel.ee/?book=1.+Saamueli&chapter=11&verse=11" },
  { event: "Sauli kuningriik kinnitati", scripture: "1. Saamuel 11:14-15", url: "https://piibel.ee/?book=1.+Saamueli&chapter=11&verse=14" }],

  category: "linn",
  icon: Building2
},
{
  id: "betaania",
  name: "Betaania",
  hebrewName: "בית עניה",
  location: "3 km Jeruusalemmast idas, Iisrael",
  coordinates: { lat: 31.7700, lng: 35.2594 },
  significance: "Laatsaruse ülesäratamine, Jeesuse sõprade kodu",
  description: "Betaania oli väike küla Ööli mäe idaküljel, kus elasid Jeesuse sõbrad Maarta, Maarja ja Laatsarus. Siin äratas Jeesus Laatsaruse surnuist üles ja siin võeti teda viimast korda vastu enne ristilöömist.",
  biblicalEvents: [
  { event: "Jeesus äratas Laatsaruse surnuist", scripture: "Johannes 11:1-44", url: "https://piibel.ee/?book=Johannese&chapter=11&verse=1" },
  { event: "Maarja võidis Jeesuse jalgu väärtusliku salviga", scripture: "Johannes 12:1-8", url: "https://piibel.ee/?book=Johannese&chapter=12&verse=1" },
  { event: "Siimoni katkuse kodus pidu", scripture: "Matteus 26:6-13", url: "https://piibel.ee/?book=Matteuse&chapter=26&verse=6" },
  { event: "Jeesus õnnistas jüngreid ja läks taevasse", scripture: "Luuka 24:50-51", url: "https://piibel.ee/?book=Luuka&chapter=24&verse=50" }],

  category: "linn",
  icon: Building2
},
{
  id: "betfage",
  name: "Betfage",
  hebrewName: "בית פגי",
  location: "Ööli mägi, Betaania ja Jeruusalemma vahel",
  coordinates: { lat: 31.7744, lng: 35.2478 },
  significance: "Jeesuse võidukas sissesõit Jeruusalemma",
  description: "Betfage oli väike küla Ööli mäe idaküljel Betaania ja Jeruusalemma vahel. Siit saatis Jeesus jüngrid tooma aasla, millal ta sõitis võidukalt Jeruusalemma - täites Sakarja prohvetikuulutuse.",
  biblicalEvents: [
  { event: "Jeesus saadab jüngrid aasla tooma", scripture: "Matteus 21:1-2", url: "https://piibel.ee/?book=Matteuse&chapter=21&verse=1" },
  { event: "Võidukas sissesõit Jeruusalemma", scripture: "Matteus 21:6-11", url: "https://piibel.ee/?book=Matteuse&chapter=21&verse=6" },
  { event: "Rahvas hüüdis 'Hoosanna!'", scripture: "Matteus 21:9", url: "https://piibel.ee/?book=Matteuse&chapter=21&verse=9" },
  { event: "Prohvetikuulutuse täitumine", scripture: "Sakarja 9:9", url: "https://piibel.ee/?book=Sakarja&chapter=9&verse=9" }],

  category: "linn",
  icon: Building2
},
{
  id: "betsaida",
  name: "Betsaida",
  hebrewName: "בית צידה",
  location: "Gennesareti järve põhjakallas, Iisrael",
  coordinates: { lat: 32.9072, lng: 35.6339 },
  significance: "Peetruse, Andrease ja Filippuse kodukoht, imede paik",
  description: "Betsaida, 'kalamaja', oli kaluriteküla Gennesareti järve põhjakalda. Siin oli kolme jüngri - Peetruse, Andrease ja Filippuse - kodu. Jeesus tegi siin palju imetegusid, kuigi see oli peamiselt paganate ala.",
  biblicalEvents: [
  { event: "Peetruse, Andrease ja Filippuse kodukoht", scripture: "Johannes 1:44", url: "https://piibel.ee/?book=Johannese&chapter=1&verse=44" },
  { event: "Pimeda mehe tervendamine", scripture: "Markus 8:22-26", url: "https://piibel.ee/?book=Markuse&chapter=8&verse=22" },
  { event: "5000 mehe toitmine toimus lähedal", scripture: "Luuka 9:10-17", url: "https://piibel.ee/?book=Luuka&chapter=9&verse=10" },
  { event: "Jeesus nuhtles Betsaidat uskmatuse pärast", scripture: "Matteus 11:21", url: "https://piibel.ee/?book=Matteuse&chapter=11&verse=21" }],

  category: "linn",
  icon: Building2
},
{
  id: "daan",
  name: "Daan",
  hebrewName: "דן",
  location: "Põhja-Iisrael, Hermoni mäe jalamil",
  coordinates: { lat: 33.2486, lng: 35.6522 },
  significance: "Iisraeli põhjapiir, kuldvasika kummardamise koht",
  description: "Daan oli Iisraeli kõige põhjapoolsem linn Hermoni mäe jalamil. Ütlus 'Daanist kuni Beer-Sebani' tähendas kogu Iisraeli maad. Jerobeam püstitas siia kuldvasika, põhjustades Iisraeli patustamise.",
  biblicalEvents: [
  { event: "Daani suguharu vallutas linna", scripture: "Kohtumõistjad 18:27-29", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=18&verse=27" },
  { event: "Miika pühapaik ja leeviit", scripture: "Kohtumõistjad 18:30-31", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=18&verse=30" },
  { event: "Jerobeam püstitas kuldvasika Daani", scripture: "1. Kuningate 12:28-30", url: "https://piibel.ee/?book=1.+Kuningate&chapter=12&verse=28" },
  { event: "Iisraeli põhjapiir", scripture: "2. Saamuel 24:2, 1. Kuningate 4:25", url: "https://piibel.ee/?book=2.+Saamueli&chapter=24&verse=2" },
  { event: "Jehu ei eemaldanud kuldvasikaid", scripture: "2. Kuningate 10:29", url: "https://piibel.ee/?book=2.+Kuningate&chapter=10&verse=29" }],

  category: "linn",
  icon: Building2
},
{
  id: "debir",
  name: "Debir",
  hebrewName: "דביר",
  location: "Juuda mäestik, Lõuna-Iisrael",
  coordinates: { lat: 31.4333, lng: 35.0500 },
  significance: "Vana õpetlaste linn, Kaaleb vallutas",
  description: "Debir, varem Kirjat-Seefer ('raamatute linn'), oli oluline kaananlaste õpetlaste keskus. Kaaleb vallutas linna ja andis oma tütre Otniielile, kes linna võitis.",
  biblicalEvents: [
  { event: "Joosua vallutas Debiri esimest korda", scripture: "Joosua 10:38-39", url: "https://piibel.ee/?book=Joosua&chapter=10&verse=38" },
  { event: "Kaaleb pakkus tütart Aksa võitjale", scripture: "Joosua 15:15-17", url: "https://piibel.ee/?book=Joosua&chapter=15&verse=15" },
  { event: "Otniel võitis linna ja abiellus Aksaga", scripture: "Kohtumõistjad 1:11-13", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=1&verse=11" },
  { event: "Anti leeviitidele elupaigaks", scripture: "Joosua 21:15", url: "https://piibel.ee/?book=Joosua&chapter=21&verse=15" },
  { event: "Tuntud kui 'raamatute linn'", scripture: "Joosua 15:15", url: "https://piibel.ee/?book=Joosua&chapter=15&verse=15" }],

  category: "linn",
  icon: Building2
},
{
  id: "dekor",
  name: "Dekor",
  hebrewName: "דימונה",
  location: "Jordani idakallas, tänapäeva Jordaania",
  coordinates: { lat: 32.6500, lng: 35.8500 },
  significance: "Kümne kreeka linna ühendus, Jeesuse teenistuse ala",
  description: "Dekor ('kümte linna') oli kreeka kultuuriga linnade piirkond Jordani idakaldal. Jeesus külastas seda piirkonda ja tegi seal imetegusid, kuigi see oli peamiselt paganate ala.",
  biblicalEvents: [
  { event: "Jeesus tervendas kurttumma", scripture: "Markus 7:31-37", url: "https://piibel.ee/?book=Markuse&chapter=7&verse=31" },
  { event: "Suur rahvahulk järgnes Jeesusele Dekorist", scripture: "Matteus 4:25", url: "https://piibel.ee/?book=Matteuse&chapter=4&verse=25" },
  { event: "Deemonlik mees vabastati ja kuulutas Dekorile", scripture: "Markus 5:20", url: "https://piibel.ee/?book=Markuse&chapter=5&verse=20" },
  { event: "Jeesus õpetas ja tervendas seal", scripture: "Markus 7:31", url: "https://piibel.ee/?book=Markuse&chapter=7&verse=31" }],

  category: "linn",
  icon: Building2
},
{
  id: "diimona",
  name: "Diimona",
  hebrewName: "דימונה",
  location: "Negev, Lõuna-Iisrael",
  coordinates: { lat: 31.0686, lng: 35.0336 },
  significance: "Juuda lõunapiiri linn",
  description: "Diimona oli linn Juuda kõige lõunapoolsemas osas, Negevis. See oli üks linnadest, mis määrati Juuda suguharule ja kuulus lõunapiiri kaitsesüsteemi.",
  biblicalEvents: [
  { event: "Määratud Juuda suguharule", scripture: "Joosua 15:22", url: "https://piibel.ee/?book=Joosua&chapter=15&verse=22" },
  { event: "Juuda lõunapiiri linn", scripture: "Joosua 15:21-22", url: "https://piibel.ee/?book=Joosua&chapter=15&verse=21" },
  { event: "Negevi asunduste seas", scripture: "Joosua 15:21", url: "https://piibel.ee/?book=Joosua&chapter=15&verse=21" }],

  category: "linn",
  icon: Building2
},
{
  id: "door",
  name: "Door",
  hebrewName: "דאר",
  location: "Vahemere rannik, Iisrael",
  coordinates: { lat: 32.6167, lng: 34.9167 },
  significance: "Kaanani kuningate linn, Joosua võit",
  description: "Door oli võimas kaananlaste rannaäärne linn-riik. Kuigi Joosua võitis Doori kuninga, ei suutnud Iisrael linna täielikult vallutada kuni Taavetini.",
  biblicalEvents: [
  { event: "Joosua võitis Doori kuninga", scripture: "Joosua 11:1-2; 12:23", url: "https://piibel.ee/?book=Joosua&chapter=11&verse=1" },
  { event: "Manasse ei suutnud Doori vallutada", scripture: "Kohtumõistjad 1:27", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=1&verse=27" },
  { event: "Kaananlased jätkasid seal elamist", scripture: "Kohtumõistjad 1:27-28", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=1&verse=27" },
  { event: "Saalomoni valitsusalas", scripture: "1. Kuningate 4:11", url: "https://piibel.ee/?book=1.+Kuningate&chapter=4&verse=11" }],

  category: "linn",
  icon: Building2
},
{
  id: "dotan",
  name: "Dotan",
  hebrewName: "דתן",
  location: "Põhja-Samaria, Iisrael",
  coordinates: { lat: 32.4000, lng: 35.2667 },
  significance: "Joosep müüdi orjaks, Eelisa päästmine",
  description: "Dotan oli linn karjamaa piirkonnas, kus Joosepi vennad karjatasid. Siin müüsid nad Joosepi orjaks ja valetasid isa eest. Sajandeid hiljem pääses prohvet Eelisa siin Aramlaste käest.",
  biblicalEvents: [
  { event: "Joosep müüakse Egiptusesse", scripture: "1. Mooses 37:17-28", url: "https://piibel.ee/?book=1.+Moosese&chapter=37&verse=17" },
  { event: "Vennad valetasid Jaakobile Joosepi surma kohta", scripture: "1. Mooses 37:31-35", url: "https://piibel.ee/?book=1.+Moosese&chapter=37&verse=31" },
  { event: "Eelisa oli Dotanis", scripture: "2. Kuningate 6:13", url: "https://piibel.ee/?book=2.+Kuningate&chapter=6&verse=13" },
  { event: "Taevane vägi kaitses Eelisa", scripture: "2. Kuningate 6:14-17", url: "https://piibel.ee/?book=2.+Kuningate&chapter=6&verse=14" },
  { event: "Aramlased löödi pimedaks", scripture: "2. Kuningate 6:18-23", url: "https://piibel.ee/?book=2.+Kuningate&chapter=6&verse=18" }],

  category: "linn",
  icon: Building2
},
{
  id: "egiptus",
  name: "Egiptus",
  hebrewName: "מצרים",
  location: "Põhja-Aafrika",
  coordinates: { lat: 26.8206, lng: 30.8025 },
  significance: "Iisraeli orjapõlve koht, kust Jumal nad vabastab",
  description: "Egiptus on kohta, kus Iisraeli rahvas oli orjuses üle 400 aasta. Jumal vabastase nad läbi Moosese juhtimise 10 nuhtluse ja Punase mere läbimise kaudu.",
  biblicalEvents: [
  { event: "Joosep müüakse Egiptusesse", scripture: "1. Mooses 37:28", url: "https://piibel.ee/?book=1.+Moosese&chapter=37&verse=28" },
  { event: "Jaakobi perekond tuleb Egiptusesse", scripture: "1. Mooses 46:1-7", url: "https://piibel.ee/?book=1.+Moosese&chapter=46&verse=1" },
  { event: "Iisrael on Egiptuses orjuses", scripture: "2. Mooses 1:8-14", url: "https://piibel.ee/?book=2.+Moosese&chapter=1&verse=8" },
  { event: "10 nuhtlust ja väljatulek", scripture: "2. Mooses 7-12", url: "https://piibel.ee/?book=2.+Moosese&chapter=7" },
  { event: "Jeesuse perekond põgeneb Egiptusesse", scripture: "Matteus 2:13-15", url: "https://piibel.ee/?book=Matteuse&chapter=2&verse=13" }],

  category: "muu",
  icon: MapPin
},
{
  id: "efesus",
  name: "Efesus",
  hebrewName: "",
  location: "Türgi läänerannik (tänapäeval)",
  coordinates: { lat: 37.9495, lng: 27.3689 },
  significance: "Üks 7 kogudust Ilmutuse raamatus",
  description: "Efesus oli tähtis kaubalin Aasias ja üks võimsamaid varakristlike koguduste keskusi. Paulus veetis seal üle kahe aasta, õpetades Jumala riiki.",
  biblicalEvents: [
  { event: "Paulus õpetas seal üle 2 aasta", scripture: "Apostlite teod 19:1-10", url: "https://piibel.ee/?book=Apostlite+tegude&chapter=19&verse=1" },
  { event: "Diana templi mäss", scripture: "Apostlite teod 19:23-41", url: "https://piibel.ee/?book=Apostlite+tegude&chapter=19&verse=23" },
  { event: "Paulus kohtus vanemate", scripture: "Apostlite teod 20:17-38", url: "https://piibel.ee/?book=Apostlite+tegude&chapter=20&verse=17" },
  { event: "Kiri efeslastele", scripture: "Efeslastele 1-6", url: "https://piibel.ee/?book=Efeslastele&chapter=1" },
  { event: "Jeesuse kiri kogudusele", scripture: "Ilmutus 2:1-7", url: "https://piibel.ee/?book=Ilmutuse&chapter=2&verse=1" }],

  category: "linn",
  icon: Building2
},
{
  id: "eelot",
  name: "Eelot",
  hebrewName: "אילות",
  location: "Punase mere rannik, Iisrael",
  coordinates: { lat: 29.5577, lng: 34.9519 },
  significance: "Kõrberännaku peatuspaik, sadamalinn",
  description: "Eelot oli tähtis sadamalinn Punase mere ääres, lähedal Esjon-Geberile. Iisraellased peatusid siin oma kõrberännakul Egiptusest Kaananisse.",
  biblicalEvents: [
  { event: "Iisraellased peatusid siin kõrberännakul", scripture: "4. Mooses 33:35", url: "https://piibel.ee/?book=4.+Moosese&chapter=33&verse=35" },
  { event: "Saalomon ehitas laevad Eelotis ja Esjon-Geberis", scripture: "1. Kuningate 9:26", url: "https://piibel.ee/?book=1.+Kuningate&chapter=9&verse=26" },
  { event: "Usias taasehitas Eeloti", scripture: "2. Kuningate 14:22", url: "https://piibel.ee/?book=2.+Kuningate&chapter=14&verse=22" }],

  category: "linn",
  icon: Building2
},
{
  id: "een-gedi",
  name: "Een-Gedi",
  hebrewName: "עין גדי",
  location: "Surnumere läänekalda, Iisrael",
  coordinates: { lat: 31.4619, lng: 35.3897 },
  significance: "Taavet peitus siin Sauli eest",
  description: "Een-Gedi, 'kitse allikas', on ooasilinn Surnumere kaldal. Taavet peitus siin koopas Sauli eest ja lõikas salaja Sauli kuue serva. Koht on tuntud oma ilusate veekogude ja kõrbe kontrastiga.",
  biblicalEvents: [
  { event: "Taavet peitus Een-Gedi koopas", scripture: "1. Saamuel 23:29", url: "https://piibel.ee/?book=1.+Saamueli&chapter=23&verse=29" },
  { event: "Taavet lõikas Sauli kuue serva", scripture: "1. Saamuel 24:1-7", url: "https://piibel.ee/?book=1.+Saamueli&chapter=24&verse=1" },
  { event: "Taavet säästis Sauli elu", scripture: "1. Saamuel 24:8-22", url: "https://piibel.ee/?book=1.+Saamueli&chapter=24&verse=8" },
  { event: "Joosafat võitis siin liitu", scripture: "2. Ajaraamat 20:2", url: "https://piibel.ee/?book=2.+Ajaraamat&chapter=20&verse=2" }],

  category: "linn",
  icon: Building2
},
{
  id: "een-semes",
  name: "Een-Semes",
  hebrewName: "עין שמש",
  location: "Jeruusalemma lähedal, Iisrael",
  coordinates: { lat: 31.7667, lng: 35.2667 },
  significance: "Piirikoht Juuda ja Benjamini vahel",
  description: "Een-Semes, 'päikese allikas', oli tähtis veeallikas ja piirikoht Juuda ja Benjamini suguharu territooriumide vahel.",
  biblicalEvents: [
  { event: "Piir Juuda ja Benjamini vahel", scripture: "Joosua 15:7", url: "https://piibel.ee/?book=Joosua&chapter=15&verse=7" },
  { event: "Benjamini põhjaterritoorium", scripture: "Joosua 18:17", url: "https://piibel.ee/?book=Joosua&chapter=18&verse=17" }],

  category: "muu",
  icon: MapPin
},
{
  id: "efraim",
  name: "Efraim",
  hebrewName: "אפרים",
  location: "Keskne Iisrael",
  coordinates: { lat: 31.9167, lng: 35.3000 },
  significance: "Jeesus peitus siin enne ristilöömist",
  description: "Efraim oli linn Jeruusalemmast põhjas, kus Jeesus peitus oma jüngritega pärast Laatsaruse ülesäratamist, enne viimast minemist Jeruusalemma.",
  biblicalEvents: [
  { event: "Jeesus peitus siia pärast Laatsaruse ülesäratamist", scripture: "Johannes 11:54", url: "https://piibel.ee/?book=Johannese&chapter=11&verse=54" },
  { event: "Abimeleki võitles siin Seeba vastu", scripture: "2. Saamuel 13:23", url: "https://piibel.ee/?book=2.+Saamueli&chapter=13&verse=23" }],

  category: "linn",
  icon: Building2
},
{
  id: "efrata",
  name: "Efrata",
  hebrewName: "אפרתה",
  location: "Petlemma piirkond, Iisrael",
  coordinates: { lat: 31.7054, lng: 35.2024 },
  significance: "Raahel suri siin, Petlemma vanem nimi",
  description: "Efrata oli Petlemma vanem nimi. Siin suri Raahel, Jaakobi armastatud naine, sünnitades Benjamini. Miika prohvetas, et Efratast tuleb Iisraeli valitseja.",
  biblicalEvents: [
  { event: "Raahel suri siin Benjamini sünnitades", scripture: "1. Mooses 35:16-20", url: "https://piibel.ee/?book=1.+Moosese&chapter=35&verse=16" },
  { event: "Raaheli haud Efrata teel", scripture: "1. Mooses 48:7", url: "https://piibel.ee/?book=1.+Moosese&chapter=48&verse=7" },
  { event: "Miika prohvetikuulutus Messia kohta", scripture: "Miika 5:2", url: "https://piibel.ee/?book=Miika&chapter=5&verse=2" },
  { event: "Boose oli Efrataist", scripture: "Ruti 1:2", url: "https://piibel.ee/?book=Ruti&chapter=1&verse=2" }],

  category: "linn",
  icon: Building2
},
{
  id: "ekron",
  name: "Ekron",
  hebrewName: "עקרון",
  location: "Sefeela, Iisrael",
  coordinates: { lat: 31.7708, lng: 34.8511 },
  significance: "Üks viiest peamisest fillistlaste linnast",
  description: "Ekron oli kõige põhjapoolsem viiest fillistlaste pealinnast. Lepingulaeka saadeti siia Asdodi ja Gati järel, kuid Jumal saatis sinna ka katku. Baalsebubi templi asukoht.",
  biblicalEvents: [
  { event: "Lepingulaeka saadeti Ekroni", scripture: "1. Saamuel 5:10", url: "https://piibel.ee/?book=1.+Saamueli&chapter=5&verse=10" },
  { event: "Katk Ekronis", scripture: "1. Saamuel 5:11-12", url: "https://piibel.ee/?book=1.+Saamueli&chapter=5&verse=11" },
  { event: "Fillistlased põgenesid Ekroni poole", scripture: "1. Saamuel 17:52", url: "https://piibel.ee/?book=1.+Saamueli&chapter=17&verse=52" },
  { event: "Ahasjah küsis Baalsebubi Ekronis", scripture: "2. Kuningate 1:2", url: "https://piibel.ee/?book=2.+Kuningate&chapter=1&verse=2" }],

  category: "linn",
  icon: Building2
},
{
  id: "hammat",
  name: "Hammat",
  hebrewName: "חמת",
  location: "Gennesareti järve lõunakallas, Iisrael",
  coordinates: { lat: 32.7833, lng: 35.5500 },
  significance: "Kindluslinn Naftali territooriumil",
  description: "Hammat oli kindluslinn Naftali suguharu territooriumil, tuntud oma soojate allikate poolest.",
  biblicalEvents: [
  { event: "Kindluslinn Naftali territooriumil", scripture: "Joosua 19:35", url: "https://piibel.ee/?book=Joosua&chapter=19&verse=35" }],

  category: "linn",
  icon: Building2
},
{
  id: "hammat-tiberia",
  name: "Hammat-Tiberia",
  hebrewName: "חמת טבריה",
  location: "Tibeeria lähedal, Gennesareti järv",
  coordinates: { lat: 32.7750, lng: 35.5400 },
  significance: "Siisera väejuhi kodukoht",
  description: "Hammat-Tiberia oli tuntud oma kuumaveeallikate poolest Gennesareti järve kaldal.",
  biblicalEvents: [
  { event: "Leeviitide linn", scripture: "Joosua 21:32", url: "https://piibel.ee/?book=Joosua&chapter=21&verse=32" }],

  category: "linn",
  icon: Building2
},
{
  id: "haserott",
  name: "Haserott",
  hebrewName: "חצרות",
  location: "Siinai kõrb",
  coordinates: { lat: 29.5000, lng: 34.9000 },
  significance: "Kõrberännaku peatuspaik, Mirjami karistus",
  description: "Haserott oli üks peatuspaiku iisraellaste kõrberännakul. Siin karistati Mirjami katakuga.",
  biblicalEvents: [
  { event: "Iisraellased peatusid Haserottis", scripture: "4. Mooses 11:35", url: "https://piibel.ee/?book=4.+Moosese&chapter=11&verse=35" },
  { event: "Mirjam karistus", scripture: "Kohtumõistjad 10:17-20", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=10&verse=17" }],

  category: "muu",
  icon: MapPin
},
{
  id: "haua-aed",
  name: "Haua aed",
  hebrewName: "גן הקבורה",
  location: "Jeruusalemm, Golgata lähedal",
  coordinates: { lat: 31.7785, lng: 35.2295 },
  significance: "Jeesuse matmise ja ülestõusmise koht",
  description: "Haua aed asus Golgatale lähedal, uus haud, kuhu Jeesus maeti.",
  biblicalEvents: [
  { event: "Jeesus maeti Joosepi hauda", scripture: "Johannes 19:38-42", url: "https://piibel.ee/?book=Johannese&chapter=19&verse=38" },
  { event: "Naised leidsid tühja haua", scripture: "Luuka 24:1-3", url: "https://piibel.ee/?book=Luuka&chapter=24&verse=1" },
  { event: "Jeesus matmise", scripture: "Johannes 19:30", url: "https://piibel.ee/?book=Johannese&chapter=19&verse=30" },
  { event: "Jeesus ülestõusmine", scripture: "Johannes 20:1-9", url: "https://piibel.ee/?book=Johannese&chapter=20&verse=1" }],

  category: "muu",
  icon: Milestone
},
{
  id: "hebron",
  name: "Hebron",
  hebrewName: "חברון",
  location: "Juuda mäestik, Iisrael",
  coordinates: { lat: 31.5326, lng: 35.0998 },
  significance: "Patriarhide matmispaik, Taaveti esimene pealinn",
  description: "Hebron on vanimaid linnu. Siin on Makpela koobas ja Taavet valitses siit 7 aastat.",
  biblicalEvents: [
  { event: "Aabraham ostis Makpela koopa", scripture: "1. Mooses 23:1-20", url: "https://piibel.ee/?book=1.+Moosese&chapter=23&verse=1" },
  { event: "Taavet valitses Hebronist 7 aastat", scripture: "2. Saamuel 5:5", url: "https://piibel.ee/?book=2.+Saamueli&chapter=5&verse=5" },
  { event: "Mirjam karistus", scripture: "Kohtumõistjad 10:17-20", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=10&verse=17" }],

  category: "linn",
  icon: Building2
},
{
  id: "hermon",
  name: "Hermon",
  hebrewName: "חרמון",
  location: "Iisraeli, Liibanoni ja Süüria piir",
  coordinates: { lat: 33.4162, lng: 35.8572 },
  significance: "Püha mägi",
  description: "Hermon on kõrge mäeahelik. Mõned usuvad, et seal toimus Jeesuse muutmine.",
  biblicalEvents: [
  { event: "Hermon kui Iisraeli põhjapiir", scripture: "Joosua 11:17", url: "https://piibel.ee/?book=Joosua&chapter=11&verse=17" }],

  category: "mägi",
  icon: Mountain
},
{
  id: "hermoni-magi",
  name: "Hermoni mägi",
  hebrewName: "הר חרמון",
  location: "Iisraeli, Liibanoni ja Süüria piir",
  coordinates: { lat: 33.4162, lng: 35.8572 },
  significance: "Püha mägi",
  description: "Hermoni mägi on Iisraeli kõrgeim punkt (2814 m).",
  biblicalEvents: [
  { event: "Iisraeli põhjapiiri maamärk", scripture: "5. Mooses 3:8-9", url: "https://piibel.ee/?book=5.+Moosese&chapter=3&verse=8" }],

  category: "mägi",
  icon: Mountain
},
{
  id: "horma",
  name: "Horma",
  hebrewName: "דימונה",
  location: "Negev, Lõuna-Iisrael",
  coordinates: { lat: 31.0686, lng: 35.0336 },
  significance: "Juuda lõunapiiri linn",
  description: "Horma oli kaanani linn Negevis. Iisraellased said siin esimest korda lüüa.",
  biblicalEvents: [
  { event: "Iisrael kaotati Hormale", scripture: "4. Mooses 14:45", url: "https://piibel.ee/?book=4.+Moosese&chapter=14&verse=45" },
  { event: "Juuda ja Simeon vallutasid Horma", scripture: "Kohtumõistjad 1:17", url: "https://piibel.ee/?book=Kohtumõistjad&chapter=1&verse=17" }],

  category: "linn",
  icon: Building2
}];


export default function Paigad() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset selected place when letter changes
  useEffect(() => {
    setSelectedPlace("");
  }, [selectedLetter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "linn":return "bg-primary/10 text-primary border-primary/20";
      case "mägi":return "bg-accent/10 text-accent-foreground border-accent/20";
      case "jõgi":return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "meri":return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
      case "tempel":return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      default:return "bg-muted text-muted-foreground border-border";
    }
  };

  // Get unique letters that have places
  const availableLetters = Array.from(new Set(biblicalPlaces.map((p) => p.name[0]))).sort();

  // Filter places by selected letter
  const placesForLetter = selectedLetter ?
  biblicalPlaces.filter((p) => p.name[0] === selectedLetter).sort((a, b) => a.name.localeCompare(b.name)) :
  [];

  const place = biblicalPlaces.find((p) => p.id === selectedPlace);

  return (
    <>
      <div className="min-h-screen bg-background" style={{ backgroundColor: "#00000000", backgroundImage: "none" }}>
        <Navigation />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">
              Piibli Paigad
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Vali koht ja uuri, kus sellest Piiblis juttu on ning mis seal toimus.
            </p>

            {/* Two-step dropdown selector */}
            <div className="max-w-md mx-auto space-y-4">
              {/* Step 1: Select letter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  1. Vali täht
                </label>
                <Select value={selectedLetter} onValueChange={setSelectedLetter}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Vali täht..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLetters.map((letter) =>
                    <SelectItem key={letter} value={letter} className="text-base py-3">
                        {letter}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2: Select place (only shown when letter is selected) */}
              {selectedLetter &&
              <div className="animate-in fade-in slide-in-from-top duration-300">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    2. Vali koht
                  </label>
                  <Select value={selectedPlace} onValueChange={setSelectedPlace}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Vali koht..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {placesForLetter.map((place) =>
                    <SelectItem key={place.id} value={place.id} className="text-base py-3">
                          {place.name}
                        </SelectItem>
                    )}
                    </SelectContent>
                  </Select>
                </div>
              }
            </div>
          </header>

          {/* Place Details */}
          {place && (
            <div className="space-y-8">
              {/* Place Info Card */}
              <Card className="p-6 md:p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <place.icon className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-bold text-foreground font-serif">
                          {place.name}
                        </h2>
                      </div>
                      {place.hebrewName && (
                        <p className="text-xl text-muted-foreground mb-2 font-serif" dir="rtl">
                          {place.hebrewName}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {place.location}
                      </p>
                    </div>
                    <Badge className={`${getCategoryColor(place.category)} border`}>
                      {place.category}
                    </Badge>
                  </div>

                  {/* Significance */}
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                      Tähtsus
                    </h3>
                    <p className="text-foreground font-medium">{place.significance}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Kirjeldus
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {place.description}
                    </p>
                  </div>

                  {/* Biblical Events with Scripture */}
                  <div className="bg-muted/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-accent" />
                      Olulised sündmused ja kirjakohad
                    </h3>
                    <div className="space-y-4">
                      {place.biblicalEvents.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-3 group">
                          <span className="text-primary mt-1 font-bold">{idx + 1}.</span>
                          <div className="flex-1">
                            <p className="text-foreground mb-1">
                              {event.event}
                            </p>
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center gap-1 underline-offset-2 hover:underline"
                            >
                              → {event.scripture}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="text-sm text-muted-foreground border-t pt-4">
                    <p className="font-mono">
                      GPS: {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Map - now below the info card */}
              <div className="w-full">
                <BiblePlacesMap lat={place.coordinates.lat} lng={place.coordinates.lng} placeName={place.name} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!place &&
          <div className="text-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">
                Vali täht ja koht, et näha detaile ja kaarti
              </p>
            </div>
          }
        </main>


        
      </div>
    </>);

}