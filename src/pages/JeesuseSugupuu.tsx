import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CommentaryView } from "@/components/CommentaryView";
import {
  Search,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Users,
} from "lucide-react";

const slugifyEt = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/õ/g, "o")
    .replace(/ü/g, "u")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

type Category = "patriarch" | "king" | "prophet" | "priest" | "judge" | "other" | "jesus";

interface Branch {
  name: string;
  relation: string; // "vend", "abikaasa", "poeg" jne
  desc: string;
  ref?: { slug?: string; label: string };
  category?: Category;
}

interface Person {
  name: string;
  year?: string; // umbkaudne aeg
  category: Category;
  desc: string;
  ref?: { slug?: string; label: string };
  branches?: Branch[];
}

interface Period {
  id: string;
  title: string;
  span: string;
  color: string; // tailwind hex
  intro: string;
  people: Person[];
}

const PERIODS: Period[] = [
  {
    id: "eelpotopne",
    title: "Eelpotopne aeg",
    span: "u 4000 – 2400 eKr",
    color: "#7F77DD",
    intro: "Aadamast Noani – kümme põlvkonda enne suurt veeuputust (1Ms 5).",
    people: [
      {
        name: "Aadam",
        year: "u 4000 eKr",
        category: "patriarch",
        desc: "Esimene inimene, loodud Jumala näo järgi. Elas 930 aastat.",
        ref: { slug: "1-mooses", label: "1Ms 1:26 – 5:5" },
        branches: [
          { name: "Eeva", relation: "abikaasa", desc: "Esimene naine, „kõikide elavate ema“ (1Ms 3:20).", ref: { label: "1Ms 2:18–25" } },
          { name: "Kain", relation: "poeg", desc: "Põllumees, tappis venna Aabeli. Tema soost tuli Kaini liin.", ref: { slug: "1-mooses", label: "1Ms 4:1–17" } },
          { name: "Aabel", relation: "poeg", desc: "Karjus, tema ohver oli Jumalale meelepärane. Kaini poolt tapetud.", ref: { label: "1Ms 4:2–8" } },
        ],
      },
      {
        name: "Set",
        year: "u 3870 eKr",
        category: "patriarch",
        desc: "Aadama kolmas poeg, sündis Aabeli asemele. Elas 912 aastat.",
        ref: { slug: "1-mooses", label: "1Ms 4:25; 5:3–8" },
      },
      { name: "Enos", category: "other", desc: "Seti poeg. Tema ajal hakati hüüdma Issanda nime.", ref: { label: "1Ms 4:26; 5:6–11" } },
      { name: "Keenan", category: "other", desc: "Enose poeg, elas 910 aastat.", ref: { label: "1Ms 5:9–14" } },
      { name: "Mahalalel", category: "other", desc: "Keenani poeg, elas 895 aastat.", ref: { label: "1Ms 5:12–17" } },
      { name: "Jered", category: "other", desc: "Mahalaleli poeg, elas 962 aastat.", ref: { label: "1Ms 5:15–20" } },
      {
        name: "Eenok",
        category: "prophet",
        desc: "Käis Jumalaga – Jumal võttis ta ära ilma surma nägemata.",
        ref: { label: "1Ms 5:21–24; Hb 11:5" },
      },
      { name: "Metuusala", category: "patriarch", desc: "Vanim inimene Piiblis – elas 969 aastat. Suri veeuputuse aastal.", ref: { label: "1Ms 5:25–27" } },
      { name: "Lemek", category: "other", desc: "Noa isa, elas 777 aastat.", ref: { label: "1Ms 5:28–31" } },
      {
        name: "Noa",
        year: "u 2950 eKr",
        category: "patriarch",
        desc: "Vaga mees omas põlvkonnas. Ehitas laeva ja päästis perekonna veeuputusest.",
        ref: { slug: "1-mooses", label: "1Ms 6 – 9" },
        branches: [
          { name: "Seem", relation: "poeg", desc: "Vanim poeg, Aabrahami esiisa. Tema liinist tulid semiidid.", category: "patriarch", ref: { label: "1Ms 11:10–26" } },
        ],
      },
    ],
  },
  {
    id: "ujutus",
    title: "Veeuputusest Aabrahamini",
    span: "u 2400 – 2100 eKr",
    color: "#D85A30",
    intro: "Seemist Aabrahamini – kümme põlvkonda, mille käigus rahvad jagunesid (1Ms 11).",
    people: [
      { name: "Seem", category: "patriarch", desc: "Noa vanim poeg, elas 600 aastat.", ref: { label: "1Ms 11:10–11" } },
      { name: "Arpaksad", category: "other", desc: "Seemi poeg, sündinud 2 aastat pärast veeuputust.", ref: { label: "1Ms 11:12–13" } },
      { name: "Selah", category: "other", desc: "Arpaksadi poeg.", ref: { label: "1Ms 11:14–15" } },
      { name: "Eeber", category: "other", desc: "Heebrealaste eelisa – nimi „heebrea“ pärineb temalt.", ref: { label: "1Ms 11:16–17" } },
      { name: "Peleg", category: "other", desc: "„Tema päevil jagunes maa.“ Babüloni torni aeg.", ref: { label: "1Ms 10:25; 11:18–19" } },
      { name: "Reu", category: "other", desc: "Pelegi poeg.", ref: { label: "1Ms 11:20–21" } },
      { name: "Serug", category: "other", desc: "Reu poeg.", ref: { label: "1Ms 11:22–23" } },
      { name: "Naahor", category: "other", desc: "Serugi poeg, Terahi isa.", ref: { label: "1Ms 11:24–25" } },
      {
        name: "Terah",
        category: "other",
        desc: "Aabrahami isa. Lahkus Uurist Haarani.",
        ref: { label: "1Ms 11:26–32" },
        branches: [
          { name: "Naahor", relation: "poeg", desc: "Aabrahami vend, Rebeka vanaisa.", ref: { label: "1Ms 22:20–24" } },
          { name: "Haaran", relation: "poeg", desc: "Loti isa, suri varakult Uuris.", ref: { label: "1Ms 11:27–28" } },
        ],
      },
    ],
  },
  {
    id: "patriarhid",
    title: "Patriarhid",
    span: "u 2100 – 1800 eKr",
    color: "#D85A30",
    intro: "Aabraham, Iisak ja Jaakob – tõotuse kandjad. Iisraeli rahva sünd.",
    people: [
      {
        name: "Aabraham",
        year: "u 2000 eKr",
        category: "patriarch",
        desc: "„Paljude rahvaste isa.“ Jumal sõlmis temaga lepingu ja tõotas Kaananimaa.",
        ref: { slug: "1-mooses", label: "1Ms 12 – 25" },
        branches: [
          { name: "Saara", relation: "abikaasa", desc: "Aabrahami naine, sünnitas Iisaki 90-aastaselt.", ref: { label: "1Ms 17:15–21; 21" } },
          { name: "Haagar", relation: "liignaine", desc: "Egiptlanna teenija, Ismaeli ema.", ref: { label: "1Ms 16; 21:8–21" } },
          { name: "Ismael", relation: "poeg", desc: "Haagari poeg, araablaste esiisa.", ref: { label: "1Ms 16; 25:12–18" } },
          { name: "Lott", relation: "vennapoeg", desc: "Aabrahami vennapoeg. Päästetud Soodomast.", ref: { slug: "1-mooses", label: "1Ms 13; 19" } },
        ],
      },
      {
        name: "Iisak",
        year: "u 1900 eKr",
        category: "patriarch",
        desc: "Tõotatud poeg. Aabraham oli valmis teda Moorija mäel ohverdama.",
        ref: { slug: "1-mooses", label: "1Ms 21 – 27" },
        branches: [
          { name: "Rebeka", relation: "abikaasa", desc: "Iisaki naine, Naahori tütretütar.", ref: { label: "1Ms 24" } },
          { name: "Eesav", relation: "poeg", desc: "Iisaki vanem poeg, edomiitide esiisa.", category: "other", ref: { label: "1Ms 25:19 – 36" } },
        ],
      },
      {
        name: "Jaakob",
        year: "u 1850 eKr",
        category: "patriarch",
        desc: "Sai nimeks Iisrael. Kaheteistkümne hõimu isa.",
        ref: { slug: "1-mooses", label: "1Ms 25:26; 32:28" },
        branches: [
          { name: "Lea", relation: "abikaasa", desc: "Esimene naine, sünnitas Ruubeni, Siimeoni, Leevi, Juuda jt.", ref: { label: "1Ms 29 – 30" } },
          { name: "Raahel", relation: "abikaasa", desc: "Armastatud naine, Joosepi ja Benjamini ema.", ref: { label: "1Ms 29 – 35" } },
          { name: "Ruuben", relation: "poeg", desc: "Esmasündinu, kaotas esmasünniõiguse.", ref: { label: "1Ms 29:32; 49:3–4" } },
          { name: "Siimeon", relation: "poeg", desc: "Jaakobi teine poeg.", ref: { label: "1Ms 29:33" } },
          { name: "Leevi", relation: "poeg", desc: "Preestrihõimu esiisa.", ref: { label: "1Ms 29:34" } },
          { name: "Juuda", relation: "poeg", desc: "Kuninglikust hõimust – Taavet ja Jeesus.", category: "patriarch", ref: { label: "1Ms 29:35; 49:8–12" } },
          { name: "Issaskar", relation: "poeg", desc: "Jaakobi viies poeg.", ref: { label: "1Ms 30:18" } },
          { name: "Sebulon", relation: "poeg", desc: "Jaakobi kuues poeg.", ref: { label: "1Ms 30:20" } },
          { name: "Daan", relation: "poeg", desc: "Bilha poeg.", ref: { label: "1Ms 30:6" } },
          { name: "Naftali", relation: "poeg", desc: "Bilha poeg.", ref: { label: "1Ms 30:8" } },
          { name: "Gaad", relation: "poeg", desc: "Silpa poeg.", ref: { label: "1Ms 30:11" } },
          { name: "Aaser", relation: "poeg", desc: "Silpa poeg.", ref: { label: "1Ms 30:13" } },
          { name: "Joosep", relation: "poeg", desc: "Raaheli poeg, Egiptuse asekuningas.", category: "patriarch", ref: { slug: "1-mooses", label: "1Ms 30:24; 37 – 50" } },
          { name: "Benjamin", relation: "poeg", desc: "Noorim poeg, Raaheli teine poeg.", ref: { label: "1Ms 35:18" } },
        ],
      },
      {
        name: "Juuda",
        category: "patriarch",
        desc: "Mesia hõimu esiisa. „Lõvi Juuda soost“ (Ilm 5:5).",
        ref: { label: "1Ms 38; 49:8–12" },
        branches: [
          { name: "Taamar", relation: "minia", desc: "Sünnitas Juudale Perese ja Serahi.", ref: { label: "1Ms 38" } },
        ],
      },
      { name: "Peres", category: "other", desc: "Juuda ja Taamari poeg, kuningliku liini esiisa.", ref: { label: "1Ms 38:29; Rt 4:18" } },
      { name: "Hesron", category: "other", desc: "Perese poeg.", ref: { label: "Rt 4:18; Mt 1:3" } },
      { name: "Ram", category: "other", desc: "Hesroni poeg.", ref: { label: "Rt 4:19; Mt 1:4" } },
      { name: "Amminadab", category: "other", desc: "Aaroni äi.", ref: { label: "4Ms 1:7; Mt 1:4" } },
      { name: "Nahsson", category: "other", desc: "Juuda hõimu vürst kõrbeteel.", ref: { label: "4Ms 2:3; Mt 1:4" } },
      { name: "Salmon", category: "other", desc: "Rahabi abikaasa.", ref: { label: "Rt 4:20; Mt 1:5" } },
      {
        name: "Boas",
        category: "other",
        desc: "Betlemma maaomanik, Ruti lunastaja.",
        ref: { slug: "rutt", label: "Rt 2 – 4" },
        branches: [
          { name: "Rutt", relation: "abikaasa", desc: "Moabi naine, Taaveti vanavanaema.", ref: { slug: "rutt", label: "Rt 1 – 4" } },
          { name: "Rahab", relation: "ema", desc: "Jeerikost päästetud naine, Salmoni naine.", ref: { label: "Jos 2; Mt 1:5" } },
        ],
      },
      { name: "Obed", category: "other", desc: "Boase ja Ruti poeg, Taaveti vanaisa.", ref: { label: "Rt 4:17; Mt 1:5" } },
      { name: "Isai", category: "other", desc: "Taaveti isa, Betlemast.", ref: { slug: "1-saamuel", label: "1Sm 16:1; 17:12" } },
    ],
  },
  {
    id: "egiptus-valjarand",
    title: "Egiptus ja väljaränd",
    span: "u 1800 – 1400 eKr",
    color: "#E8A33D",
    intro: "Joosepi, Moosese ja Aaroni põlvkonnad – orjusest tõotatud maale.",
    people: [
      {
        name: "Joosep",
        category: "patriarch",
        desc: "Jaakobi lemmikpoeg, müüdud Egiptusesse, sai vaarao asekuningaks.",
        ref: { slug: "1-mooses", label: "1Ms 37 – 50" },
        branches: [
          { name: "Manasse", relation: "poeg", desc: "Joosepi esmasündinu.", ref: { label: "1Ms 41:51" } },
          { name: "Efraim", relation: "poeg", desc: "Joosepi noorem poeg, sai esmasünniõnnistuse.", ref: { label: "1Ms 41:52; 48" } },
        ],
      },
      {
        name: "Mooses",
        year: "u 1450 eKr",
        category: "prophet",
        desc: "Iisraeli suurim prohvet, seaduste andja, viis rahva Egiptusest välja.",
        ref: { slug: "2-mooses", label: "2Ms 2 – 5Ms 34" },
        branches: [
          { name: "Sippora", relation: "abikaasa", desc: "Midjani preestri Jitro tütar.", ref: { label: "2Ms 2:21" } },
          { name: "Mirjam", relation: "õde", desc: "Prohvet, juhtis naisi laulu ja tantsuga.", ref: { label: "2Ms 15:20" } },
        ],
      },
      {
        name: "Aaron",
        category: "priest",
        desc: "Moosese vanem vend, esimene ülempreester.",
        ref: { slug: "2-mooses", label: "2Ms 4:14; 28 – 29" },
      },
      {
        name: "Joosua",
        category: "other",
        desc: "Moosese järglane, juhtis rahva Kaananimaale.",
        ref: { slug: "joosua", label: "Jos 1 – 24" },
      },
    ],
  },
  {
    id: "kohtumoistjad",
    title: "Kohtumõistjad",
    span: "u 1400 – 1050 eKr",
    color: "#5DAA8E",
    intro: "Rahva juhid enne kuningate aega (Kohtum. raamat).",
    people: [
      { name: "Deboora", category: "judge", desc: "Naissoost kohtumõistja ja prohvet, võitis Siisera.", ref: { slug: "kohtumoistjate", label: "Km 4 – 5" } },
      { name: "Giideon", category: "judge", desc: "Lõi 300 mehega midjanlasi.", ref: { slug: "kohtumoistjate", label: "Km 6 – 8" } },
      { name: "Simson", category: "judge", desc: "Kangelane vilistite vastu, naasiir.", ref: { slug: "kohtumoistjate", label: "Km 13 – 16" } },
      {
        name: "Saamuel",
        category: "prophet",
        desc: "Viimane kohtumõistja, prohvet, võidis kuningateks Sauli ja Taaveti.",
        ref: { slug: "1-saamuel", label: "1Sm 1 – 25" },
      },
    ],
  },
  {
    id: "kuningad",
    title: "Iisraeli kuningad",
    span: "u 1050 – 586 eKr",
    color: "#1D9E75",
    intro: "Saulist Sidkijani – Juuda kuninglik liin, millest sündis Messias.",
    people: [
      { name: "Saul", category: "king", desc: "Iisraeli esimene kuningas, Benjamiini hõimust.", ref: { slug: "1-saamuel", label: "1Sm 9 – 31" } },
      {
        name: "Taavet",
        year: "u 1010 – 970 eKr",
        category: "king",
        desc: "Iisraeli suurim kuningas, „mees Jumala südame järgi“.",
        ref: { slug: "2-saamuel", label: "1Sm 16 – 1Kn 2" },
        branches: [
          { name: "Batseba", relation: "abikaasa", desc: "Saalomoni ema.", ref: { label: "2Sm 11 – 12" } },
          { name: "Naatan", relation: "poeg", desc: "Taaveti poeg – Luuka evangeeliumi sugupuus Maarja liin.", ref: { label: "Lk 3:31" } },
          { name: "Absalom", relation: "poeg", desc: "Mässas isa vastu.", ref: { label: "2Sm 13 – 18" } },
        ],
      },
      { name: "Saalomon", category: "king", desc: "Tark kuningas, ehitas templi. Valitses 40 aastat.", ref: { slug: "1-kuningate", label: "1Kn 1 – 11" } },
      { name: "Rehabeam", category: "king", desc: "Tema ajal kuningriik jagunes Juuda ja Iisraeliks.", ref: { label: "1Kn 12; Mt 1:7" } },
      { name: "Abija", category: "king", desc: "Juuda kuningas.", ref: { label: "1Kn 15:1–8" } },
      { name: "Aasa", category: "king", desc: "Hea kuningas, valitses 41 aastat.", ref: { label: "1Kn 15:9–24" } },
      { name: "Joosafat", category: "king", desc: "Ustav kuningas, sõlmis liidu Ahabiga.", ref: { label: "1Kn 22" } },
      { name: "Jooram", category: "king", desc: "Abielus Iisebeli tütrega.", ref: { label: "2Kn 8:16–24" } },
      { name: "Ussija", category: "king", desc: "Valitses 52 aastat, suri pidalitõbisena.", ref: { label: "2Kn 15:1–7" } },
      { name: "Jootam", category: "king", desc: "Ustav kuningas.", ref: { label: "2Kn 15:32–38" } },
      { name: "Aahas", category: "king", desc: "Kummardas ebajumalaid.", ref: { label: "2Kn 16" } },
      { name: "Hiskija", category: "king", desc: "Suur reformaator, päästis Jeruusalemma assüürlastest.", ref: { label: "2Kn 18 – 20" } },
      { name: "Manasse", category: "king", desc: "Valitses 55 aastat, kahetses lõpus.", ref: { label: "2Kn 21:1–18" } },
      { name: "Ammon", category: "king", desc: "Valitses kaks aastat.", ref: { label: "2Kn 21:19–26" } },
      { name: "Joosija", category: "king", desc: "Reformaator – leidis templist seaduseraamatu.", ref: { label: "2Kn 22 – 23" } },
      { name: "Jekonja", category: "king", desc: "Viidi vangina Babüloniasse.", ref: { label: "2Kn 24:8–17; Mt 1:11" } },
    ],
  },
  {
    id: "pagendus",
    title: "Pagendus ja vaikus",
    span: "586 eKr – 4 eKr",
    color: "#8B6FB9",
    intro: "Babüloonia vangipõlv ja taastumine. Mattuse sugupuu vähem tuntud nimed.",
    people: [
      { name: "Sealtiel", category: "other", desc: "Jekonja poeg, sündinud vangipõlves.", ref: { label: "Mt 1:12; 1Aj 3:17" } },
      { name: "Serubabel", category: "other", desc: "Juhatas esimese rahva Babüloniast tagasi, ehitas teise templi.", ref: { slug: "esra", label: "Esr 2 – 6; Hg 1 – 2" } },
      { name: "Abiud", category: "other", desc: "Serubabeli poeg.", ref: { label: "Mt 1:13" } },
      { name: "Eliakim", category: "other", desc: "Abiudi poeg.", ref: { label: "Mt 1:13" } },
      { name: "Asor", category: "other", desc: "Eliakimi poeg.", ref: { label: "Mt 1:13" } },
      { name: "Saadok", category: "other", desc: "Asori poeg.", ref: { label: "Mt 1:14" } },
      { name: "Ahhim", category: "other", desc: "Saadoki poeg.", ref: { label: "Mt 1:14" } },
      { name: "Eliud", category: "other", desc: "Ahhimi poeg.", ref: { label: "Mt 1:14" } },
      { name: "Eleasar", category: "other", desc: "Eliudi poeg.", ref: { label: "Mt 1:15" } },
      { name: "Mattan", category: "other", desc: "Eleasari poeg.", ref: { label: "Mt 1:15" } },
      { name: "Jaakob (Joosepi isa)", category: "other", desc: "Mattani poeg, Joosepi isa.", ref: { label: "Mt 1:15–16" } },
    ],
  },
  {
    id: "uus-testament",
    title: "Messias tulek",
    span: "u 4 eKr",
    color: "#D4537E",
    intro: "Joosep, Maarja ja Jeesus Kristus – tõotuse täitumine.",
    people: [
      {
        name: "Joosep (Maarja mees)",
        category: "other",
        desc: "Naatsareti puusepp, Jeesuse kasuisa. Taaveti soost.",
        ref: { slug: "matteus", label: "Mt 1:16–25; Lk 2" },
      },
      {
        name: "Maarja",
        category: "other",
        desc: "Jeesuse ema, Eelija ja Sakariase sugulane.",
        ref: { slug: "luukas", label: "Lk 1:26–56; 2" },
        branches: [
          { name: "Eliisabet", relation: "sugulane", desc: "Ristija Johannese ema.", ref: { label: "Lk 1:5–25, 36" } },
          { name: "Ristija Johannes", relation: "sugulane", desc: "Messias eelkäija, tema kuulutaja.", category: "prophet", ref: { slug: "luukas", label: "Lk 1; Mt 3" } },
        ],
      },
      {
        name: "Jeesus Kristus",
        year: "u 4 eKr",
        category: "jesus",
        desc: "Lubatud Messias, Jumala Poeg. Sündinud Petlemmas, sai ristisurma ja tõusis üles.",
        ref: { slug: "matteus", label: "Mt 1:16–17; Lk 3:23–38" },
      },
    ],
  },
];

const CAT_COLORS: Record<Category, { bg: string; label: string }> = {
  patriarch: { bg: "#7F77DD", label: "Patriarh" },
  king: { bg: "#1D9E75", label: "Kuningas" },
  prophet: { bg: "#E8A33D", label: "Prohvet" },
  priest: { bg: "#B07BC9", label: "Preester" },
  judge: { bg: "#5DAA8E", label: "Kohtumõistja" },
  other: { bg: "#D85A30", label: "Esivanem" },
  jesus: { bg: "#D4537E", label: "Messias" },
};

interface SelectedPerson {
  name: string;
  category: Category;
  desc: string;
  ref?: { slug?: string; label: string };
  year?: string;
  relation?: string;
}

export default function JeesuseSugupuu() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedPerson | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const q = search.trim().toLowerCase();

  const filteredPeriods = useMemo(() => {
    if (!q) return PERIODS;
    return PERIODS.map((p) => ({
      ...p,
      people: p.people.filter(
        (person) =>
          person.name.toLowerCase().includes(q) ||
          person.desc.toLowerCase().includes(q) ||
          (person.branches || []).some(
            (b) => b.name.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q)
          )
      ),
    })).filter((p) => p.people.length > 0);
  }, [q]);

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const openPerson = (p: Person | Branch, relation?: string) => {
    setSelected({
      name: p.name,
      category: (p.category as Category) || "other",
      desc: p.desc,
      ref: p.ref,
      year: (p as Person).year,
      relation,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Jeesuse sugupuu
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aadamast Kristuseni – põhiliin perioodide kaupa. Klõpsa isikul, et näha
            piibli viidet ja lisainfot; ava harud, et näha vendi, õdesid ja teisi
            sugulasi.
          </p>
          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Otsi nime või kirjeldust..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {filteredPeriods.length === 0 && (
          <p className="text-center text-muted-foreground py-16">Vastet ei leitud.</p>
        )}

        <div className="space-y-10">
          {filteredPeriods.map((period) => (
            <section key={period.id}>
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: period.color }}
                />
                <h2 className="font-serif text-xl font-bold text-foreground">
                  {period.title}
                </h2>
                <span className="text-xs text-muted-foreground">{period.span}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 ml-6">{period.intro}</p>

              <ol className="relative ml-3 border-l-2 pl-6 space-y-3" style={{ borderColor: period.color + "55" }}>
                {period.people.map((person, idx) => {
                  const cat = CAT_COLORS[person.category];
                  const key = `${period.id}-${idx}-${person.name}`;
                  const hasBranches = !!person.branches?.length;
                  const isOpen = !!expanded[key];
                  return (
                    <li key={key} className="relative">
                      <span
                        className="absolute -left-[1.95rem] top-3 w-3 h-3 rounded-full ring-4 ring-background"
                        style={{ background: cat.bg }}
                      />
                      <div className="rounded-lg border border-border bg-card hover:border-primary/40 transition-all">
                        <div className="flex items-start gap-3 p-3">
                          <button
                            onClick={() => openPerson(person)}
                            className="flex-1 text-left min-w-0"
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-foreground">
                                {person.name}
                              </span>
                              <Badge
                                style={{ background: cat.bg, color: "#fff" }}
                                className="text-[10px] py-0 border-0"
                              >
                                {cat.label}
                              </Badge>
                              {person.year && (
                                <span className="text-[11px] text-muted-foreground">
                                  {person.year}
                                </span>
                              )}
                              {person.ref && (
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {person.ref.label}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {person.desc}
                            </p>
                          </button>
                          {hasBranches && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggle(key)}
                              className="flex-shrink-0 h-8 px-2 text-xs"
                            >
                              <Users className="h-3.5 w-3.5 mr-1" />
                              {person.branches!.length}
                              {isOpen ? (
                                <ChevronDown className="h-3.5 w-3.5 ml-1" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                              )}
                            </Button>
                          )}
                        </div>

                        <AnimatePresence initial={false}>
                          {hasBranches && isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 pt-1 border-t border-border/60 grid sm:grid-cols-2 gap-2">
                                {person.branches!.map((b, bi) => {
                                  const bc = CAT_COLORS[(b.category as Category) || "other"];
                                  return (
                                    <button
                                      key={`${key}-b-${bi}`}
                                      onClick={() => openPerson(b, b.relation)}
                                      className="text-left rounded-md border border-border/60 bg-background hover:bg-muted/50 p-2 transition-all"
                                    >
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span
                                          className="inline-block w-2 h-2 rounded-full"
                                          style={{ background: bc.bg }}
                                        />
                                        <span className="font-medium text-sm">
                                          {b.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {b.relation}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {b.desc}
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-serif text-left">
                  {selected.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    style={{ background: CAT_COLORS[selected.category].bg, color: "#fff" }}
                    className="border-0"
                  >
                    {CAT_COLORS[selected.category].label}
                  </Badge>
                  {selected.relation && (
                    <Badge variant="outline">{selected.relation}</Badge>
                  )}
                  {selected.year && <Badge variant="outline">{selected.year}</Badge>}
                </div>

                <p className="text-foreground leading-relaxed">{selected.desc}</p>

                {selected.ref && (
                  <div className="rounded-lg border border-border p-3 bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <BookOpen className="h-4 w-4" />
                      Piibli viide
                    </div>
                    <CommentaryView
                      html={`<p class="font-medium text-foreground">${selected.ref.label}</p>`}
                      showRefs={false}
                    />
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Klõpsa viitel, et näha kirjakohta.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Loe rohkem
                  </p>
                  <a
                    href={`https://piibel.ee/sonaraamat/${slugifyEt(selected.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full rounded-md border border-border p-3 hover:bg-muted/50 transition-all"
                  >
                    <span className="text-sm font-medium">piibel.ee sõnaraamat</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
