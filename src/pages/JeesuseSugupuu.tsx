import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import Tree from "react-d3-tree";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Search } from "lucide-react";

type Category = "patriarch" | "king" | "other" | "jesus";

interface NodeAttrs {
  category: Category;
  desc: string;
}

interface BibleNode {
  name: string;
  attributes: NodeAttrs;
  children: BibleNode[];
}

const bibleTree: BibleNode = {
  name: "Aadam",
  attributes: { category: "patriarch", desc: "Esimene inimene, inimkonna esiisa" },
  children: [
    {
      name: "Noa",
      attributes: { category: "patriarch", desc: "Elas üle suure veeuputuse" },
      children: [
        {
          name: "Aabraham",
          attributes: { category: "patriarch", desc: "Iisraeli rahva esiisa, u 2000 eKr" },
          children: [
            {
              name: "Iisak",
              attributes: { category: "patriarch", desc: "Aabrahamile tõotatud poeg" },
              children: [
                {
                  name: "Jaakob",
                  attributes: { category: "patriarch", desc: "Iisraeli 12 hõimu esiisa" },
                  children: [
                    {
                      name: "Juuda",
                      attributes: { category: "patriarch", desc: "Juuda hõimu esiisa" },
                      children: [
                        { name: "Peres", attributes: { category: "other", desc: "Juuda ja Tamaari poeg" }, children: [
                          { name: "Hesron", attributes: { category: "other", desc: "Perese poeg" }, children: [
                            { name: "Ram", attributes: { category: "other", desc: "Hesroni poeg" }, children: [
                              { name: "Amminadab", attributes: { category: "other", desc: "Rami poeg" }, children: [
                                { name: "Nahsson", attributes: { category: "other", desc: "Juuda hõimu vürst" }, children: [
                                  { name: "Salmon", attributes: { category: "other", desc: "Rahabi abikaasa" }, children: [
                                    { name: "Boas", attributes: { category: "other", desc: "Ruuti lunastaja, Betsleemi maavaldaja" }, children: [
                                      { name: "Obed", attributes: { category: "other", desc: "Boase ja Ruuti poeg" }, children: [
                                        { name: "Isai", attributes: { category: "other", desc: "Taaveti isa, Betslehemist" }, children: [
                                          { name: "Taavet", attributes: { category: "king", desc: "Iisraeli suurim kuningas, u 1010–970 eKr" }, children: [
                                            { name: "Saalomon", attributes: { category: "king", desc: "Tark kuningas, templi ehitaja" }, children: [
                                              { name: "Rehabeam", attributes: { category: "king", desc: "Kuningriik jagunes tema ajal" }, children: [
                                                { name: "Abija", attributes: { category: "king", desc: "Juuda kuningas" }, children: [
                                                  { name: "Aasa", attributes: { category: "king", desc: "Valitses 41 aastat" }, children: [
                                                    { name: "Joosafat", attributes: { category: "king", desc: "Ustav kuningas" }, children: [
                                                      { name: "Jooram", attributes: { category: "king", desc: "Juuda kuningas" }, children: [
                                                        { name: "Ussija", attributes: { category: "king", desc: "Valitses 52 aastat" }, children: [
                                                          { name: "Jootam", attributes: { category: "king", desc: "Ustav kuningas" }, children: [
                                                            { name: "Aahas", attributes: { category: "king", desc: "Ebajumalaid kummardanud" }, children: [
                                                              { name: "Hiskija", attributes: { category: "king", desc: "Suur reformaatorkuingas" }, children: [
                                                                { name: "Manasse", attributes: { category: "king", desc: "Valitses 55 aastat" }, children: [
                                                                  { name: "Ammon", attributes: { category: "king", desc: "Kurjalt valitsenud" }, children: [
                                                                    { name: "Joosija", attributes: { category: "king", desc: "Reformaatorkuingas, leidis seaduseraamatu" }, children: [
                                                                      { name: "Jekonja", attributes: { category: "other", desc: "Viimane kuningas enne Babülooniat" }, children: [
                                                                        { name: "Sealtiel", attributes: { category: "other", desc: "Jekonja poeg" }, children: [
                                                                          { name: "Serubabel", attributes: { category: "other", desc: "Juhatas rahva Babülooniast tagasi" }, children: [
                                                                            { name: "Abiud", attributes: { category: "other", desc: "Serubabeli poeg" }, children: [
                                                                              { name: "Eliakim", attributes: { category: "other", desc: "Abiudi poeg" }, children: [
                                                                                { name: "Asor", attributes: { category: "other", desc: "Eliakimi poeg" }, children: [
                                                                                  { name: "Saadok", attributes: { category: "other", desc: "Asori poeg" }, children: [
                                                                                    { name: "Ahhim", attributes: { category: "other", desc: "Saadoki poeg" }, children: [
                                                                                      { name: "Eliud", attributes: { category: "other", desc: "Ahhimi poeg" }, children: [
                                                                                        { name: "Eleasar", attributes: { category: "other", desc: "Eliudi poeg" }, children: [
                                                                                          { name: "Mattan", attributes: { category: "other", desc: "Eleasari poeg" }, children: [
                                                                                            { name: "Jaakob", attributes: { category: "other", desc: "Mattani poeg" }, children: [
                                                                                              { name: "Joosep", attributes: { category: "other", desc: "Maarja mees, Jeesuse kasuisa" }, children: [
                                                                                                { name: "Jeesus Kristus", attributes: { category: "jesus", desc: "Messia. Sündinud Maarja kaudu u 4 eKr Betslehemis" }, children: [] }
                                                                                              ]}
                                                                                            ]}
                                                                                          ]}
                                                                                        ]}
                                                                                      ]}
                                                                                    ]}
                                                                                  ]}
                                                                                ]}
                                                                              ]}
                                                                            ]}
                                                                          ]}
                                                                        ]}
                                                                      ]}
                                                                    ]}
                                                                  ]}
                                                                ]}
                                                              ]}
                                                            ]}
                                                          ]}
                                                        ]}
                                                      ]}
                                                    ]}
                                                  ]}
                                                ]}
                                              ]}
                                            ]}
                                          ]}
                                        ]}
                                      ]}
                                    ]}
                                  ]}
                                ]}
                              ]}
                            ]}
                          ]}
                        ]}
                      ]
                    },
                    { name: "Ruuben", attributes: { category: "patriarch", desc: "Jaakobuse esimene poeg" }, children: [] },
                    { name: "Siimeon", attributes: { category: "patriarch", desc: "Jaakobuse teine poeg" }, children: [] },
                    { name: "Leevi", attributes: { category: "patriarch", desc: "Preestrite hõimu esiisa" }, children: [
                      { name: "Mooses", attributes: { category: "other", desc: "Iisraeli suurim prohvet, seaduste andja" }, children: [] },
                      { name: "Aaron", attributes: { category: "other", desc: "Esimene ülempreester" }, children: [] }
                    ]},
                    { name: "Issaskar", attributes: { category: "patriarch", desc: "Jaakobuse viies poeg" }, children: [] },
                    { name: "Sebulon", attributes: { category: "patriarch", desc: "Jaakobuse kuues poeg" }, children: [] },
                    { name: "Daan", attributes: { category: "patriarch", desc: "Jaakobuse seitsmes poeg" }, children: [] },
                    { name: "Naftali", attributes: { category: "patriarch", desc: "Jaakobuse kaheksas poeg" }, children: [] },
                    { name: "Gad", attributes: { category: "patriarch", desc: "Jaakobuse üheksas poeg" }, children: [] },
                    { name: "Aaser", attributes: { category: "patriarch", desc: "Jaakobuse kümnes poeg" }, children: [] },
                    { name: "Joosep", attributes: { category: "patriarch", desc: "Jaakobuse lemmikpoeg, Egiptuse asekuberner" }, children: [
                      { name: "Manasse", attributes: { category: "patriarch", desc: "Joosepi esimene poeg" }, children: [] },
                      { name: "Efraim", attributes: { category: "patriarch", desc: "Joosepi teine poeg" }, children: [] }
                    ]},
                    { name: "Benjamiin", attributes: { category: "patriarch", desc: "Jaakobuse noorim poeg" }, children: [
                      { name: "Saul", attributes: { category: "king", desc: "Iisraeli esimene kuningas" }, children: [] }
                    ]}
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const COLORS: Record<Category, { bg: string; border: string; label: string }> = {
  patriarch: { bg: "#7F77DD", border: "#534AB7", label: "Patriarh" },
  king: { bg: "#1D9E75", border: "#0F6E56", label: "Kuningas" },
  other: { bg: "#D85A30", border: "#993C1D", label: "Esivane" },
  jesus: { bg: "#D4537E", border: "#993356", label: "Messia" },
};

function computeDepth(node: BibleNode, name: string, depth = 0): number | null {
  if (node.name === name) return depth;
  for (const c of node.children || []) {
    const r = computeDepth(c, name, depth + 1);
    if (r !== null) return r;
  }
  return null;
}

function collectNames(node: BibleNode, acc: string[] = []): string[] {
  acc.push(node.name);
  for (const c of node.children || []) collectNames(c, acc);
  return acc;
}

export default function JeesuseSugupuu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 400, y: 80 });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ name: string; attrs: NodeAttrs; generation: number } | null>(null);
  const [zoom, setZoom] = useState(0.7);
  const [resetKey, setResetKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setTranslate({ x: width / 2, y: 80 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [resetKey]);

  const allNames = useMemo(() => collectNames(bibleTree), []);
  const matches = useMemo(() => {
    if (!search.trim()) return new Set<string>();
    const q = search.toLowerCase();
    return new Set(allNames.filter((n) => n.toLowerCase().includes(q)));
  }, [search, allNames]);

  const handleReset = () => {
    setZoom(0.7);
    setResetKey((k) => k + 1);
  };

  const renderNode = useCallback(
    ({ nodeDatum }: any) => {
      const cat = (nodeDatum.attributes?.category as Category) || "other";
      const colors = COLORS[cat];
      const isMatch = matches.has(nodeDatum.name);
      const dimmed = search.trim() && !isMatch;
      return (
        <g
          style={{ cursor: "pointer", transition: "opacity 0.2s ease", opacity: dimmed ? 0.3 : 1 }}
          onClick={() => {
            const gen = computeDepth(bibleTree, nodeDatum.name) ?? 0;
            setSelected({ name: nodeDatum.name, attrs: nodeDatum.attributes, generation: gen });
          }}
        >
          <rect
            x={-60}
            y={-18}
            width={120}
            height={36}
            rx={10}
            ry={10}
            fill={colors.bg}
            stroke={isMatch ? "#fbbf24" : colors.border}
            strokeWidth={isMatch ? 3 : 1.5}
            style={{ transition: "all 0.2s ease" }}
          />
          <text
            fill="#ffffff"
            stroke="none"
            textAnchor="middle"
            dy="0.35em"
            style={{ fontSize: 13, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500 }}
          >
            {nodeDatum.name}
          </text>
        </g>
      );
    },
    [matches, search]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-xl font-bold text-foreground mr-auto">Jeesuse sugupuu</h1>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Otsi nime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Lähtesta vaade
          </Button>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3 flex flex-wrap items-center gap-3 text-xs">
          {(Object.keys(COLORS) as Category[]).map((c) => (
            <div key={c} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3.5 h-3.5 rounded"
                style={{ background: COLORS[c].bg, border: `1.5px solid ${COLORS[c].border}` }}
              />
              <span className="text-muted-foreground">{COLORS[c].label}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        ref={containerRef}
        className="flex-1 bg-white"
        style={{ minHeight: "calc(100vh - 200px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        key={resetKey}
      >
        {mounted && (
          <Tree
            data={bibleTree as any}
            orientation="vertical"
            translate={translate}
            zoom={zoom}
            pathFunc="diagonal"
            renderCustomNodeElement={renderNode}
            separation={{ siblings: 1.2, nonSiblings: 1.4 }}
            nodeSize={{ x: 140, y: 80 }}
            collapsible={false}
            enableLegacyTransitions
            transitionDuration={300}
          />
        )}
      </motion.div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-serif">{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <Badge
                  style={{
                    background: COLORS[selected.attrs.category].bg,
                    color: "#fff",
                    border: `1px solid ${COLORS[selected.attrs.category].border}`,
                  }}
                >
                  {COLORS[selected.attrs.category].label}
                </Badge>
                <p className="text-foreground leading-relaxed">{selected.attrs.desc}</p>
                <div className="text-sm text-muted-foreground">
                  Põlvkond: <span className="font-semibold text-foreground">{selected.generation + 1}</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
