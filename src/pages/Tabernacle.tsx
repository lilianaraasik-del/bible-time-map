import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderWithBibleRefs } from "@/lib/bibleRefs";

type Hotspot = {
  id: string;
  name: string;
  shortName: string;
  x: number; // SVG koordinaat
  y: number;
  w: number;
  h: number;
  shape?: "rect" | "circle";
  color: string;
  description: string;
  refs: string[];
  details: string[];
};

// Tabernaakli ala on 100 küünart pikk × 50 küünart lai (≈45 × 22,5 m).
// SVG viewBox: 0 0 1000 500 (1 küünar = 10 ühikut). Sissepääs idast (paremalt).
const HOTSPOTS: Hotspot[] = [
  {
    id: "court",
    name: "Õu (esik)",
    shortName: "Õu",
    x: 0,
    y: 0,
    w: 1000,
    h: 500,
    color: "hsl(45 60% 75%)",
    description:
      "Tabernaakli õu oli 100 küünart pikk ja 50 küünart lai (≈45 × 22,5 m), ümbritsetud valgest linasest eesriidest, mis rippus 60 vasksamba küljes. Sissepääs oli idaküljel, värvilise (sinine, purpurpunane, helepunane) eesriide taga.",
    refs: ["2Ms 27:9-19", "2Ms 38:9-20"],
    details: [
      "Sambad olid vasest, hõbedaste konksude ja võrudega.",
      "Õue eesriide kõrgus oli 5 küünart (≈2,25 m) – nii kõrge, et keegi väljast sisse ei näinud.",
      "Sissepääs oli ainult idast – sümboliseerides, et inimene tuleb Jumala juurde Tema ettenähtud teel.",
    ],
  },
  {
    id: "altar",
    name: "Põletusohvrialtar",
    shortName: "Altar",
    x: 780,
    y: 200,
    w: 100,
    h: 100,
    color: "hsl(15 70% 45%)",
    description:
      "Akaatsiapuust ehitatud ja vasega ülekaetud altar, 5 × 5 küünart ja 3 küünart kõrge. Igas nurgas oli sarv, ja külgedel olid rõngad kandepuude jaoks. Siin põletati looma- ja teraviljaohvrid.",
    refs: ["2Ms 27:1-8", "3Ms 1:1-9"],
    details: [
      "Altari tuli pidi põlema lakkamatult (3Ms 6:13).",
      "Sarved sümboliseerisid jõudu ja varjupaika – pagev inimene võis nendest kinni haarata (1Kn 1:50).",
      "Vask viitab kohtumõistmisele patu üle.",
    ],
  },
  {
    id: "laver",
    name: "Vaskpesemisnõu",
    shortName: "Pesemisnõu",
    x: 640,
    y: 220,
    w: 60,
    h: 60,
    shape: "circle",
    color: "hsl(200 50% 55%)",
    description:
      "Vaskpesemisnõu seisis altari ja telgi vahel. Preestrid pidid enne pühamusse sisenemist või altaril teenimist pesema oma käsi ja jalgu, et nad ei sureks.",
    refs: ["2Ms 30:17-21", "2Ms 38:8"],
    details: [
      "Tehti kohtumistelgi juures teeninud naiste vaskpeeglitest.",
      "Sümboliseerib pühitsemist ja igapäevast puhastumist enne Jumala ette astumist.",
      "Uues Testamendis seostatakse seda Sõna pesuga (Ef 5:26).",
    ],
  },
  {
    id: "holy",
    name: "Pühamu (Püha paik)",
    shortName: "Pühamu",
    x: 200,
    y: 150,
    w: 300,
    h: 200,
    color: "hsl(280 30% 55%)",
    description:
      "Telgi esimene osa, 20 × 10 küünart. Ainult preestrid tohtisid siia siseneda. Sees olid lauasaiad, kuldküünlajalg ja suitsutusaltar.",
    refs: ["2Ms 26:33", "Hb 9:2"],
    details: [
      "Telgi seinad olid 48 akaatsiapuust lauast, ülekaetud kullaga.",
      "Katuseks oli neli kihti: linane, kitsekarvane, jäärnahkne ja merilehmanahkne.",
      "Ühelgi loomulikul valgusel siia ligipääsu polnud – ainult kuldküünlajala valgus.",
    ],
  },
  {
    id: "table",
    name: "Vaateleibade laud",
    shortName: "Vaateleibade laud",
    x: 230,
    y: 175,
    w: 70,
    h: 40,
    color: "hsl(45 80% 55%)",
    description:
      "Akaatsiapuust laud, ülekaetud puhta kullaga. Sellel olid alati 12 vaateleiba (Iisraeli sugukondade arvu järgi), mida vahetati igal hingamispäeval.",
    refs: ["2Ms 25:23-30", "3Ms 24:5-9"],
    details: [
      "Laud asus pühamus põhjapoolsel küljel.",
      "12 leiba sümboliseerisid Iisraeli 12 suguharu Jumala ees.",
      "Jeesus nimetas end \"eluleivaks\" (Jh 6:35).",
    ],
  },
  {
    id: "lampstand",
    name: "Kuldküünlajalg (menoraa)",
    shortName: "Menoraa",
    x: 400,
    y: 270,
    w: 60,
    h: 50,
    color: "hsl(50 95% 55%)",
    description:
      "Ühest tükist sepistatud puhtast kullast seitsme haruga küünlajalg. Põles pidevalt oliivõliga ja oli ainus valgusallikas pühamus.",
    refs: ["2Ms 25:31-40", "3Ms 24:1-4"],
    details: [
      "7 lampi – täiuse ja Jumala Vaimu sümbol (Sk 4:2-6).",
      "Mandlilillede kujundus harudel – elu ja õitsenguga seotud.",
      "Jeesus: \"Mina olen maailma valgus\" (Jh 8:12).",
    ],
  },
  {
    id: "incense",
    name: "Suitsutusaltar",
    shortName: "Suitsutus",
    x: 470,
    y: 235,
    w: 30,
    h: 30,
    color: "hsl(30 80% 50%)",
    description:
      "Väike akaatsiapuust altar (1 × 1 × 2 küünart), ülekaetud kullaga. Asetses vahetult vahetelgi eesriide ees. Hommikul ja õhtul põletati siin lõhnasuitsutust.",
    refs: ["2Ms 30:1-10", "Ilm 8:3-4"],
    details: [
      "Suitsutus sümboliseerib pühade palveid (Ps 141:2; Ilm 5:8).",
      "Üks kord aastas (lepituspäeval) määriti sarvi vere­ga (3Ms 16:18-19).",
      "Sakarja sai siin ingli ilmutuse (Lk 1:8-13).",
    ],
  },
  {
    id: "veil",
    name: "Vahetelgi eesriie",
    shortName: "Eesriie",
    x: 200,
    y: 145,
    w: 8,
    h: 210,
    color: "hsl(330 60% 45%)",
    description:
      "Sinise, purpurpunase ja helepunase lõnga ning kalliskividega tikitud linane eesriie, mis eraldas Pühamu ja Kõige­pühama. Sellele oli tikitud keerubid.",
    refs: ["2Ms 26:31-33", "Hb 10:19-20"],
    details: [
      "Sümboliseeris pattu, mis eraldab inimese Jumalast.",
      "Jeesuse surma hetkel rebenes templi eesriie ülevalt alla (Mt 27:51).",
      "Heebrealastele kiri näeb selles Kristuse ihu.",
    ],
  },
  {
    id: "holyofholies",
    name: "Kõige­püham paik",
    shortName: "Kõigepüham",
    x: 100,
    y: 175,
    w: 100,
    h: 150,
    color: "hsl(0 65% 35%)",
    description:
      "Telgi tagumine, 10 × 10 × 10 küünart kuubi­kujuline ruum. Siia tohtis siseneda ainult ülempreester, ja sedagi vaid kord aastas lepituspäeval (Joom Kippur).",
    refs: ["2Ms 26:33-34", "3Ms 16", "Hb 9:7"],
    details: [
      "Jumala kohaloleku (Šekiina) püsiv asupaik.",
      "Sees oli ainult Seaduselaegas ja selle kohal lepituskaas.",
      "Ülempreester sisenes kord aastas vere ja suitsutusega (3Ms 16:12-15).",
    ],
  },
  {
    id: "ark",
    name: "Seaduselaegas",
    shortName: "Laegas",
    x: 130,
    y: 230,
    w: 50,
    h: 35,
    color: "hsl(45 100% 50%)",
    description:
      "Akaatsiapuust kast, ülekaetud kullaga seest ja väljast (2½ × 1½ × 1½ küünart). Kaaneks oli puhtast kullast lepituskaas, mille otstes olid kaks tiibadega keerubi.",
    refs: ["2Ms 25:10-22", "Hb 9:4"],
    details: [
      "Sees: kivilauad, mannakruus ja Aaroni õitsenud kepp (Hb 9:4).",
      "Laeka kohal kahe keerubi vahel kõneles Jumal Moosesega (2Ms 25:22; 4Ms 7:89).",
      "Lepituskaanele piserdati lepituspäeval verd (3Ms 16:14-15) – ettekuju Kristuse lepitustööst (Rm 3:25).",
    ],
  },
];

const FACTS = [
  {
    title: "Mõõtmed ja materjal",
    body:
      "Tabernaakel ehk \"kohtumistelk\" oli liikuv pühamu, mille Mooses lasi ehitada Siinai mäe juures Jumala antud kava järgi (2Ms 25:8-9). Telk ise oli 30 × 10 × 10 küünart (≈13,5 × 4,5 × 4,5 m), õu 100 × 50 küünart.",
  },
  {
    title: "Annetused",
    body:
      "Rahvas tõi vabatahtlikult kulda, hõbedat, vaske, sinist, purpurpunast ja helepunast lõnga, peent linast, kitsekarvu, jäärnahku, merilehmanahku, akaatsiapuud, õli, lõhnaaineid ja kalliskive (2Ms 25:1-7; 35:4-29). Lõpuks oli annetusi nii palju, et Mooses pidi rahval keelama veel toomast (2Ms 36:5-7).",
  },
  {
    title: "Meistrid",
    body:
      "Peameistriks määras Jumal Betsaleeli Juuda suguharust ja tema abiliseks Oholiabi Daani suguharust – mõlemad täidetud Jumala Vaimuga oskuslikuks tööks (2Ms 31:1-11; 35:30-35).",
  },
  {
    title: "Püstitamine",
    body:
      "Tabernaakel pandi kokku esimese kuu esimesel päeval, teisel aastal pärast Egiptusest lahkumist (2Ms 40:17). Selle täitis Jumala auhiilguse pilv (2Ms 40:34-38), mis juhtis rahva rändamist – kui pilv tõusis, asuti teele.",
  },
  {
    title: "Hilisem ajalugu",
    body:
      "Pärast Tõotatud maale jõudmist seisis tabernaakel pikalt Siilos (Jos 18:1; 1Sm 1:3), hiljem Noobis (1Sm 21) ja Gibeonis (1Aj 16:39; 2Aj 1:3), kuni Saalomon ehitas Jeruusalemma templi ning Seaduselaegas viidi sinna (1Kn 8:1-9).",
  },
  {
    title: "Tähendus Uues Testamendis",
    body:
      "Heebrealastele kiri tõlgendab tabernaaklit Kristuse ülempreesterliku töö ettekujuna: maine telk on \"taevaste asjade kuju ja vari\" (Hb 8:5; 9:11-12,23-24). Johannes kirjutab, et Sõna sai lihaks ja \"asus elama (kr eskēnōsen – \"telkis\") meie keskel\" (Jh 1:14).",
  },
];

export default function Tabernacle() {
  const [active, setActive] = useState<Hotspot | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="space-y-3">
          <Badge variant="secondary">Interaktiivne kaart</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
            Tabernaakel – Moosese kohtumistelk
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Liikuv pühamu, mille Iisraeli rahvas ehitas kõrbes Siinai mäe juures Jumala antud kava
            järgi. Kliki plaanil olevatel elementidel, et lugeda nende tähendust ja piiblikohti.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Tabernaakli põrandaplaan</CardTitle>
            <p className="text-sm text-muted-foreground">
              Vaade ülalt. Sissepääs idast (paremalt). Kliki elemendil.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-[2fr_1fr] gap-6">
              <div className="rounded-lg border-2 border-border bg-[hsl(45_50%_92%)] dark:bg-[hsl(45_20%_15%)] p-3 overflow-hidden">
                <svg
                  viewBox="0 0 1000 500"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Tabernaakli interaktiivne plaan"
                >
                  {/* Õu */}
                  <rect
                    x="5"
                    y="5"
                    width="990"
                    height="490"
                    fill="hsl(45 55% 80%)"
                    stroke="hsl(45 30% 40%)"
                    strokeWidth="3"
                    onClick={() => setActive(HOTSPOTS[0])}
                    className="cursor-pointer hover:fill-[hsl(45_70%_72%)] transition-colors"
                  />
                  {/* Sissepääsu märk idas */}
                  <rect
                    x="990"
                    y="200"
                    width="10"
                    height="100"
                    fill="hsl(220 60% 45%)"
                  />
                  <text x="970" y="260" textAnchor="end" fontSize="14" fill="hsl(220 60% 30%)">
                    sissepääs →
                  </text>

                  {/* Altar */}
                  <rect
                    {...rectProps(HOTSPOTS[1])}
                    onClick={() => setActive(HOTSPOTS[1])}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    stroke="hsl(15 70% 25%)"
                    strokeWidth="2"
                  />
                  {/* Sarved */}
                  {[0, 1].map((i) =>
                    [0, 1].map((j) => (
                      <circle
                        key={`${i}-${j}`}
                        cx={780 + i * 100}
                        cy={200 + j * 100}
                        r="6"
                        fill="hsl(15 70% 25%)"
                        pointerEvents="none"
                      />
                    ))
                  )}

                  {/* Pesemisnõu */}
                  <circle
                    cx="670"
                    cy="250"
                    r="30"
                    fill="hsl(200 50% 55%)"
                    stroke="hsl(200 50% 30%)"
                    strokeWidth="2"
                    onClick={() => setActive(HOTSPOTS[2])}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />

                  {/* Telgi seinad (Pühamu + Kõige­püham) */}
                  <rect
                    x="100"
                    y="150"
                    width="400"
                    height="200"
                    fill="hsl(280 25% 60%)"
                    stroke="hsl(280 40% 25%)"
                    strokeWidth="3"
                  />
                  {/* Pühamu klikkala */}
                  <rect
                    x="208"
                    y="150"
                    width="292"
                    height="200"
                    fill="hsl(280 30% 55%)"
                    onClick={() => setActive(HOTSPOTS[3])}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Kõige­püham klikkala */}
                  <rect
                    x="100"
                    y="150"
                    width="100"
                    height="200"
                    fill="hsl(0 65% 35%)"
                    onClick={() => setActive(HOTSPOTS[8])}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Eesriie */}
                  <rect
                    x="200"
                    y="150"
                    width="8"
                    height="200"
                    fill="hsl(330 60% 45%)"
                    onClick={() => setActive(HOTSPOTS[7])}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />

                  {/* Laud */}
                  <rect
                    {...rectProps(HOTSPOTS[4])}
                    onClick={() => setActive(HOTSPOTS[4])}
                    stroke="hsl(45 80% 30%)"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Menoraa */}
                  <rect
                    {...rectProps(HOTSPOTS[5])}
                    rx="6"
                    onClick={() => setActive(HOTSPOTS[5])}
                    stroke="hsl(50 95% 30%)"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Suitsutusaltar */}
                  <rect
                    {...rectProps(HOTSPOTS[6])}
                    onClick={() => setActive(HOTSPOTS[6])}
                    stroke="hsl(30 80% 25%)"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Laegas */}
                  <rect
                    {...rectProps(HOTSPOTS[9])}
                    onClick={() => setActive(HOTSPOTS[9])}
                    stroke="hsl(45 100% 25%)"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Keerubid laeka peal */}
                  <circle cx="140" cy="240" r="6" fill="hsl(45 100% 25%)" pointerEvents="none" />
                  <circle cx="170" cy="240" r="6" fill="hsl(45 100% 25%)" pointerEvents="none" />

                  {/* Sildid */}
                  <text x="830" y="260" textAnchor="middle" fontSize="13" fill="white" pointerEvents="none">Altar</text>
                  <text x="670" y="255" textAnchor="middle" fontSize="11" fill="white" pointerEvents="none">Pesu</text>
                  <text x="350" y="135" textAnchor="middle" fontSize="13" fill="hsl(280 40% 25%)" pointerEvents="none">Pühamu</text>
                  <text x="150" y="135" textAnchor="middle" fontSize="13" fill="hsl(0 65% 30%)" pointerEvents="none">Kõige­püham</text>
                </svg>
              </div>

              <div className="space-y-3">
                {active ? (
                  <div className="space-y-3">
                    <div>
                      <Badge>{active.shortName}</Badge>
                      <h3 className="font-serif text-2xl font-bold text-primary mt-2">
                        {active.name}
                      </h3>
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      {renderWithBibleRefs(active.description)}
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/85">
                      {active.details.map((d, i) => (
                        <li key={i} className="leading-relaxed">
                          • {renderWithBibleRefs(d)}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Piiblikohad
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {active.refs.map((r) => (
                          <span key={r} className="text-sm">
                            {renderWithBibleRefs(r)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground space-y-2">
                    <p>Vali plaanilt element, et näha selgitust.</p>
                    <ul className="text-sm space-y-1">
                      {HOTSPOTS.map((h) => (
                        <li key={h.id}>
                          <button
                            onClick={() => setActive(h)}
                            className="text-primary hover:underline text-left"
                          >
                            • {h.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Ülevaade</TabsTrigger>
            <TabsTrigger value="elements">Elemendid</TabsTrigger>
            <TabsTrigger value="meaning">Tähendus</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {FACTS.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 leading-relaxed">
                    {renderWithBibleRefs(f.body)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="elements" className="grid md:grid-cols-2 gap-4">
            {HOTSPOTS.map((h) => (
              <Card key={h.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded"
                      style={{ background: h.color }}
                    />
                    {h.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {renderWithBibleRefs(h.description)}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {h.refs.map((r, i) => (
                      <span key={i} className="mr-2">
                        {renderWithBibleRefs(r)}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="meaning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kristuse ettekuju</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-foreground/90 leading-relaxed">
                <p>
                  {renderWithBibleRefs(
                    "Heebrealastele kiri näitab, et tabernaakel oli \"taevaste asjade kuju ja vari\" (Hb 8:5). Iga element osutab Kristusele:"
                  )}
                </p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>{renderWithBibleRefs("Värav (sissepääs idast) – Jeesus on uks (Jh 10:9).")}</li>
                  <li>{renderWithBibleRefs("Põletusohvrialtar – Kristuse rist (Hb 13:10-12).")}</li>
                  <li>{renderWithBibleRefs("Pesemisnõu – Sõna pesu ja uuestisünd (Ef 5:26; Tt 3:5).")}</li>
                  <li>{renderWithBibleRefs("Pakileivad – Kristus, eluleib (Jh 6:35).")}</li>
                  <li>{renderWithBibleRefs("Menoraa – maailma valgus (Jh 8:12).")}</li>
                  <li>{renderWithBibleRefs("Suitsutusaltar – pühade palved (Ilm 8:3-4).")}</li>
                  <li>{renderWithBibleRefs("Eesriie – Kristuse ihu, mille kaudu pääseme Isa juurde (Hb 10:19-20).")}</li>
                  <li>{renderWithBibleRefs("Lepituskaas – Kristus, lepitusohver (Rm 3:25).")}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function rectProps(h: Hotspot) {
  return { x: h.x, y: h.y, width: h.w, height: h.h, fill: h.color };
}
