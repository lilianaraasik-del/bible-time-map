// Uue Testamendi sündmused — Jeesuse elu, imeteod, õpetuslood ja apostlite teod.
// Iga sündmus seotud piibel.ee viite genereerimiseks slug + peatükk + (salm).

export type UtEventCategory =
  | "Jeesuse sünd ja lapsepõlv"
  | "Tervendamised"
  | "Loodusimed"
  | "Surnuist äratamised"
  | "Kurjadest vaimudest vabastamised"
  | "Tähendamissõnad"
  | "Õpetused ja kõned"
  | "Kannatuslugu ja ülestõusmine"
  | "Apostlite teod";

export interface UtEvent {
  title: string;
  category: UtEventCategory;
  bookSlug: string; // vastab src/lib/piibelLinks.ts slug'idele
  bookShort: string; // viite kuvamiseks (nt "Mt", "Mk", "Lk", "Jh", "Ap")
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

const ref = (e: UtEvent) => {
  const v = e.verseStart
    ? e.verseEnd
      ? `${e.verseStart}-${e.verseEnd}`
      : `${e.verseStart}`
    : "";
  return `${e.bookShort} ${e.chapter}${v ? ":" + v : ""}`;
};

export const formatRef = ref;

export const utEvents: UtEvent[] = [
  // === Jeesuse sünd ja lapsepõlv ===
  { title: "Ingli kuulutus Sakariasele", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "luuka", bookShort: "Lk", chapter: 1, verseStart: 5, verseEnd: 25 },
  { title: "Ingli kuulutus Maarjale", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "luuka", bookShort: "Lk", chapter: 1, verseStart: 26, verseEnd: 38 },
  { title: "Maarja külaskäik Eliisabeti juurde", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "luuka", bookShort: "Lk", chapter: 1, verseStart: 39, verseEnd: 56 },
  { title: "Ristija Johannese sünd", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "luuka", bookShort: "Lk", chapter: 1, verseStart: 57, verseEnd: 80 },
  { title: "Jeesuse sünd Petlemmas", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "luuka", bookShort: "Lk", chapter: 2, verseStart: 1, verseEnd: 20 },
  { title: "Karjased ja inglid", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "luuka", bookShort: "Lk", chapter: 2, verseStart: 8, verseEnd: 20 },
  { title: "Targade tulek idamaalt", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "matteus", bookShort: "Mt", chapter: 2, verseStart: 1, verseEnd: 12 },
  { title: "Põgenemine Egiptusesse", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "matteus", bookShort: "Mt", chapter: 2, verseStart: 13, verseEnd: 23 },
  { title: "12-aastane Jeesus templis", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "luuka", bookShort: "Lk", chapter: 2, verseStart: 41, verseEnd: 52 },
  { title: "Jeesuse ristimine", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "matteus", bookShort: "Mt", chapter: 3, verseStart: 13, verseEnd: 17 },
  { title: "Jeesuse kiusamine kõrbes", category: "Jeesuse sünd ja lapsepõlv", bookSlug: "matteus", bookShort: "Mt", chapter: 4, verseStart: 1, verseEnd: 11 },

  // === Tervendamised ===
  { title: "Kuningliku ametniku poja tervendamine", category: "Tervendamised", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 4, verseStart: 46, verseEnd: 54 },
  { title: "Peetruse ämma tervendamine", category: "Tervendamised", bookSlug: "markus", bookShort: "Mk", chapter: 1, verseStart: 29, verseEnd: 31 },
  { title: "Pidalitõbise puhastamine", category: "Tervendamised", bookSlug: "markus", bookShort: "Mk", chapter: 1, verseStart: 40, verseEnd: 45 },
  { title: "Halvatu tervendamine Kapernaumas", category: "Tervendamised", bookSlug: "markus", bookShort: "Mk", chapter: 2, verseStart: 1, verseEnd: 12 },
  { title: "Kuivanud käega mehe tervendamine", category: "Tervendamised", bookSlug: "matteus", bookShort: "Mt", chapter: 12, verseStart: 9, verseEnd: 13 },
  { title: "Pealiku sulase tervendamine", category: "Tervendamised", bookSlug: "matteus", bookShort: "Mt", chapter: 8, verseStart: 5, verseEnd: 13 },
  { title: "Verejooksuga naise tervendamine", category: "Tervendamised", bookSlug: "markus", bookShort: "Mk", chapter: 5, verseStart: 25, verseEnd: 34 },
  { title: "Kahe pimeda tervendamine", category: "Tervendamised", bookSlug: "matteus", bookShort: "Mt", chapter: 9, verseStart: 27, verseEnd: 31 },
  { title: "Kurttumma tervendamine", category: "Tervendamised", bookSlug: "markus", bookShort: "Mk", chapter: 7, verseStart: 31, verseEnd: 37 },
  { title: "Pimeda mehe tervendamine Betsaidas", category: "Tervendamised", bookSlug: "markus", bookShort: "Mk", chapter: 8, verseStart: 22, verseEnd: 26 },
  { title: "Sünnist saadik pimeda tervendamine", category: "Tervendamised", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 9, verseStart: 1, verseEnd: 41 },
  { title: "38 aastat haige mehe tervendamine Betsata tiigi ääres", category: "Tervendamised", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 5, verseStart: 1, verseEnd: 15 },
  { title: "Vesitõbise mehe tervendamine hingamispäeval", category: "Tervendamised", bookSlug: "luuka", bookShort: "Lk", chapter: 14, verseStart: 1, verseEnd: 6 },
  { title: "Küüruvajunud naise tervendamine", category: "Tervendamised", bookSlug: "luuka", bookShort: "Lk", chapter: 13, verseStart: 10, verseEnd: 17 },
  { title: "Kümne pidalitõbise tervendamine", category: "Tervendamised", bookSlug: "luuka", bookShort: "Lk", chapter: 17, verseStart: 11, verseEnd: 19 },
  { title: "Pime Bartimeuse tervendamine", category: "Tervendamised", bookSlug: "markus", bookShort: "Mk", chapter: 10, verseStart: 46, verseEnd: 52 },
  { title: "Malkuse kõrva tervendamine", category: "Tervendamised", bookSlug: "luuka", bookShort: "Lk", chapter: 22, verseStart: 50, verseEnd: 51 },

  // === Loodusimed ===
  { title: "Vee veiniks muutmine Kaanas", category: "Loodusimed", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 2, verseStart: 1, verseEnd: 11 },
  { title: "Imeline kalapüük", category: "Loodusimed", bookSlug: "luuka", bookShort: "Lk", chapter: 5, verseStart: 1, verseEnd: 11 },
  { title: "Tormi vaigistamine", category: "Loodusimed", bookSlug: "markus", bookShort: "Mk", chapter: 4, verseStart: 35, verseEnd: 41 },
  { title: "5000 mehe söötmine", category: "Loodusimed", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 6, verseStart: 1, verseEnd: 14 },
  { title: "Vee peal kõndimine", category: "Loodusimed", bookSlug: "matteus", bookShort: "Mt", chapter: 14, verseStart: 22, verseEnd: 33 },
  { title: "4000 mehe söötmine", category: "Loodusimed", bookSlug: "matteus", bookShort: "Mt", chapter: 15, verseStart: 32, verseEnd: 39 },
  { title: "Maksuraha kala suust", category: "Loodusimed", bookSlug: "matteus", bookShort: "Mt", chapter: 17, verseStart: 24, verseEnd: 27 },
  { title: "Viigipuu äraneedmine", category: "Loodusimed", bookSlug: "markus", bookShort: "Mk", chapter: 11, verseStart: 12, verseEnd: 25 },
  { title: "Teine imeline kalapüük (peale ülestõusmist)", category: "Loodusimed", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 21, verseStart: 1, verseEnd: 14 },

  // === Surnuist äratamised ===
  { title: "Naini lesknaise poja äratamine", category: "Surnuist äratamised", bookSlug: "luuka", bookShort: "Lk", chapter: 7, verseStart: 11, verseEnd: 17 },
  { title: "Jairuse tütre äratamine", category: "Surnuist äratamised", bookSlug: "markus", bookShort: "Mk", chapter: 5, verseStart: 21, verseEnd: 43 },
  { title: "Laatsaruse äratamine surnuist", category: "Surnuist äratamised", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 11, verseStart: 1, verseEnd: 44 },

  // === Kurjadest vaimudest vabastamised ===
  { title: "Kurja vaimuga mees Kapernauma sünagoogis", category: "Kurjadest vaimudest vabastamised", bookSlug: "markus", bookShort: "Mk", chapter: 1, verseStart: 21, verseEnd: 28 },
  { title: "Gadara seestunute vabastamine", category: "Kurjadest vaimudest vabastamised", bookSlug: "matteus", bookShort: "Mt", chapter: 8, verseStart: 28, verseEnd: 34 },
  { title: "Tumma seestunu vabastamine", category: "Kurjadest vaimudest vabastamised", bookSlug: "matteus", bookShort: "Mt", chapter: 9, verseStart: 32, verseEnd: 34 },
  { title: "Kaananlanna tütre vabastamine", category: "Kurjadest vaimudest vabastamised", bookSlug: "matteus", bookShort: "Mt", chapter: 15, verseStart: 21, verseEnd: 28 },
  { title: "Langetõbise poisi vabastamine", category: "Kurjadest vaimudest vabastamised", bookSlug: "markus", bookShort: "Mk", chapter: 9, verseStart: 14, verseEnd: 29 },

  // === Tähendamissõnad ===
  { title: "Külvaja tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 13, verseStart: 1, verseEnd: 23 },
  { title: "Nisu ja umbrohu tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 13, verseStart: 24, verseEnd: 30 },
  { title: "Sinepiivakese tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 13, verseStart: 31, verseEnd: 32 },
  { title: "Peidetud aarde tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 13, verseStart: 44 },
  { title: "Hinnalise pärli tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 13, verseStart: 45, verseEnd: 46 },
  { title: "Halastamatu sulase tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 18, verseStart: 21, verseEnd: 35 },
  { title: "Viinamäe töömeeste tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 20, verseStart: 1, verseEnd: 16 },
  { title: "Kümne neitsi tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 25, verseStart: 1, verseEnd: 13 },
  { title: "Talentide tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 25, verseStart: 14, verseEnd: 30 },
  { title: "Lammaste ja sikkude tähendamissõna", category: "Tähendamissõnad", bookSlug: "matteus", bookShort: "Mt", chapter: 25, verseStart: 31, verseEnd: 46 },
  { title: "Halastaja samaarlase tähendamissõna", category: "Tähendamissõnad", bookSlug: "luuka", bookShort: "Lk", chapter: 10, verseStart: 25, verseEnd: 37 },
  { title: "Kadunud lamba tähendamissõna", category: "Tähendamissõnad", bookSlug: "luuka", bookShort: "Lk", chapter: 15, verseStart: 1, verseEnd: 7 },
  { title: "Kadunud drahmi tähendamissõna", category: "Tähendamissõnad", bookSlug: "luuka", bookShort: "Lk", chapter: 15, verseStart: 8, verseEnd: 10 },
  { title: "Kadunud poja tähendamissõna", category: "Tähendamissõnad", bookSlug: "luuka", bookShort: "Lk", chapter: 15, verseStart: 11, verseEnd: 32 },
  { title: "Rikka mehe ja Laatsaruse tähendamissõna", category: "Tähendamissõnad", bookSlug: "luuka", bookShort: "Lk", chapter: 16, verseStart: 19, verseEnd: 31 },
  { title: "Variseri ja tölneri tähendamissõna", category: "Tähendamissõnad", bookSlug: "luuka", bookShort: "Lk", chapter: 18, verseStart: 9, verseEnd: 14 },
  { title: "Kurjade aednike tähendamissõna", category: "Tähendamissõnad", bookSlug: "markus", bookShort: "Mk", chapter: 12, verseStart: 1, verseEnd: 12 },

  // === Õpetused ja kõned ===
  { title: "Mäejutlus", category: "Õpetused ja kõned", bookSlug: "matteus", bookShort: "Mt", chapter: 5 },
  { title: "Õndsakskiitmised", category: "Õpetused ja kõned", bookSlug: "matteus", bookShort: "Mt", chapter: 5, verseStart: 1, verseEnd: 12 },
  { title: "Meie Isa palve", category: "Õpetused ja kõned", bookSlug: "matteus", bookShort: "Mt", chapter: 6, verseStart: 9, verseEnd: 13 },
  { title: "Vestlus Nikodeemosega — uussünd", category: "Õpetused ja kõned", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 3, verseStart: 1, verseEnd: 21 },
  { title: "Vestlus samaaria naisega kaevu juures", category: "Õpetused ja kõned", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 4, verseStart: 1, verseEnd: 42 },
  { title: "Hea Karjase kõne", category: "Õpetused ja kõned", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 10, verseStart: 1, verseEnd: 21 },
  { title: "Tõeline viinapuu", category: "Õpetused ja kõned", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 15, verseStart: 1, verseEnd: 17 },
  { title: "Õpetus rikkast noormehest", category: "Õpetused ja kõned", bookSlug: "matteus", bookShort: "Mt", chapter: 19, verseStart: 16, verseEnd: 30 },
  { title: "Suurim käsk", category: "Õpetused ja kõned", bookSlug: "markus", bookShort: "Mk", chapter: 12, verseStart: 28, verseEnd: 34 },
  { title: "Lese ohver kahest leptonist", category: "Õpetused ja kõned", bookSlug: "markus", bookShort: "Mk", chapter: 12, verseStart: 41, verseEnd: 44 },
  { title: "Õpetus lõpuajast (Õlimäe kõne)", category: "Õpetused ja kõned", bookSlug: "matteus", bookShort: "Mt", chapter: 24 },
  { title: "Sakkeuse pöördumine", category: "Õpetused ja kõned", bookSlug: "luuka", bookShort: "Lk", chapter: 19, verseStart: 1, verseEnd: 10 },

  // === Kannatuslugu ja ülestõusmine ===
  { title: "Kirgastamine mäel", category: "Kannatuslugu ja ülestõusmine", bookSlug: "matteus", bookShort: "Mt", chapter: 17, verseStart: 1, verseEnd: 13 },
  { title: "Sissesõit Jeruusalemma palmipuudepühal", category: "Kannatuslugu ja ülestõusmine", bookSlug: "matteus", bookShort: "Mt", chapter: 21, verseStart: 1, verseEnd: 11 },
  { title: "Templi puhastamine", category: "Kannatuslugu ja ülestõusmine", bookSlug: "matteus", bookShort: "Mt", chapter: 21, verseStart: 12, verseEnd: 17 },
  { title: "Maarja võiab Jeesust Betaanias", category: "Kannatuslugu ja ülestõusmine", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 12, verseStart: 1, verseEnd: 8 },
  { title: "Viimne õhtusöömaaeg", category: "Kannatuslugu ja ülestõusmine", bookSlug: "luuka", bookShort: "Lk", chapter: 22, verseStart: 7, verseEnd: 23 },
  { title: "Jalgade pesemine", category: "Kannatuslugu ja ülestõusmine", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 13, verseStart: 1, verseEnd: 17 },
  { title: "Palve Ketsemani aias", category: "Kannatuslugu ja ülestõusmine", bookSlug: "matteus", bookShort: "Mt", chapter: 26, verseStart: 36, verseEnd: 46 },
  { title: "Juuda äraandmine", category: "Kannatuslugu ja ülestõusmine", bookSlug: "matteus", bookShort: "Mt", chapter: 26, verseStart: 47, verseEnd: 56 },
  { title: "Peetruse salgamine", category: "Kannatuslugu ja ülestõusmine", bookSlug: "luuka", bookShort: "Lk", chapter: 22, verseStart: 54, verseEnd: 62 },
  { title: "Jeesus Pilaatuse ees", category: "Kannatuslugu ja ülestõusmine", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 18, verseStart: 28, verseEnd: 40 },
  { title: "Ristilöömine Kolgatal", category: "Kannatuslugu ja ülestõusmine", bookSlug: "luuka", bookShort: "Lk", chapter: 23, verseStart: 26, verseEnd: 49 },
  { title: "Matmine", category: "Kannatuslugu ja ülestõusmine", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 19, verseStart: 38, verseEnd: 42 },
  { title: "Tühi haud — ülestõusmine", category: "Kannatuslugu ja ülestõusmine", bookSlug: "matteus", bookShort: "Mt", chapter: 28, verseStart: 1, verseEnd: 10 },
  { title: "Emmause teel", category: "Kannatuslugu ja ülestõusmine", bookSlug: "luuka", bookShort: "Lk", chapter: 24, verseStart: 13, verseEnd: 35 },
  { title: "Toomase kahtlus", category: "Kannatuslugu ja ülestõusmine", bookSlug: "johannese-evangeelium", bookShort: "Jh", chapter: 20, verseStart: 24, verseEnd: 29 },
  { title: "Suur misjonikäsk", category: "Kannatuslugu ja ülestõusmine", bookSlug: "matteus", bookShort: "Mt", chapter: 28, verseStart: 16, verseEnd: 20 },
  { title: "Jeesuse taevasseminek", category: "Kannatuslugu ja ülestõusmine", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 1, verseStart: 6, verseEnd: 11 },

  // === Apostlite teod ===
  { title: "Püha Vaimu väljavalamine nelipühal", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 2, verseStart: 1, verseEnd: 41 },
  { title: "Halvatu tervendamine templi väravas", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 3, verseStart: 1, verseEnd: 10 },
  { title: "Hananias ja Safiira", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 5, verseStart: 1, verseEnd: 11 },
  { title: "Stefanose kivitamine", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 7, verseStart: 54, verseEnd: 60 },
  { title: "Filippus ja etiooplane", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 8, verseStart: 26, verseEnd: 40 },
  { title: "Sauluse pöördumine Damaskuse teel", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 9, verseStart: 1, verseEnd: 19 },
  { title: "Peetrus äratab Tabiita", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 9, verseStart: 36, verseEnd: 42 },
  { title: "Korneeliuse pöördumine", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 10 },
  { title: "Peetrus vanglast vabastatud", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 12, verseStart: 1, verseEnd: 19 },
  { title: "Pauluse esimene misjonireis", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 13 },
  { title: "Jeruusalemma kirikupea kogunemine", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 15, verseStart: 1, verseEnd: 35 },
  { title: "Paulus ja Siilas Filippi vanglas", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 16, verseStart: 16, verseEnd: 40 },
  { title: "Paulus Areopaagil", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 17, verseStart: 16, verseEnd: 34 },
  { title: "Eutühhose äratamine surnuist", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 20, verseStart: 7, verseEnd: 12 },
  { title: "Pauluse laevahukk", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 27 },
  { title: "Paulus Roomas", category: "Apostlite teod", bookSlug: "apostlite-teod", bookShort: "Ap", chapter: 28, verseStart: 11, verseEnd: 31 },
];

export const utEventCategories: UtEventCategory[] = [
  "Jeesuse sünd ja lapsepõlv",
  "Tervendamised",
  "Loodusimed",
  "Surnuist äratamised",
  "Kurjadest vaimudest vabastamised",
  "Tähendamissõnad",
  "Õpetused ja kõned",
  "Kannatuslugu ja ülestõusmine",
  "Apostlite teod",
];
