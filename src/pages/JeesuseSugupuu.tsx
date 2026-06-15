import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Tree from "react-d3-tree";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RotateCcw, Search, BookOpen, ExternalLink } from "lucide-react";

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
                                    { name: "Boas", attributes: { category: "other", desc: "Ruuti lunastaja, Betlemma maavaldaja" }, children: [
                                      { name: "Obed", attributes: { category: "other", desc: "Boase ja Ruuti poeg" }, children: [
                                        { name: "Isai", attributes: { category: "other", desc: "Taaveti isa, Betlemast" }, children: [
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
                                                              { name: "Hiskija", attributes: { category: "king", desc: "Suur reformaatorkuningas" }, children: [
                                                                { name: "Manasse", attributes: { category: "king", desc: "Valitses 55 aastat" }, children: [
                                                                  { name: "Ammon", attributes: { category: "king", desc: "Kurjalt valitsenud" }, children: [
                                                                    { name: "Joosija", attributes: { category: "king", desc: "Reformaatorkuningas, leidis seaduseraamatu" }, children: [
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
                                                                                            { name: "Jaakob (Joosepi isa)", attributes: { category: "other", desc: "Mattani poeg, Joosepi isa" }, children: [
                                                                                              { name: "Joosep", attributes: { category: "other", desc: "Maarja mees, Jeesuse kasuisa" }, children: [
                                                                                                { name: "Jeesus Kristus", attributes: { category: "jesus", desc: "Messia. Sündinud Maarja kaudu u 4 eKr Petlemmas" }, children: [] }
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
                    { name: "Ruuben", attributes: { category: "patriarch", desc: "Jaakobi esimene poeg" }, children: [] },
                    { name: "Siimeon", attributes: { category: "patriarch", desc: "Jaakobi teine poeg" }, children: [] },
                    { name: "Leevi", attributes: { category: "patriarch", desc: "Preestrite hõimu esiisa" }, children: [
                      { name: "Mooses", attributes: { category: "other", desc: "Iisraeli suurim prohvet, seaduste andja" }, children: [] },
                      { name: "Aaron", attributes: { category: "other", desc: "Esimene ülempreester" }, children: [] }
                    ]},
                    { name: "Issaskar", attributes: { category: "patriarch", desc: "Jaakobi viies poeg" }, children: [] },
                    { name: "Sebulon", attributes: { category: "patriarch", desc: "Jaakobi kuues poeg" }, children: [] },
                    { name: "Daan", attributes: { category: "patriarch", desc: "Jaakobi seitsmes poeg" }, children: [] },
                    { name: "Naftali", attributes: { category: "patriarch", desc: "Jaakobi kaheksas poeg" }, children: [] },
                    { name: "Gad", attributes: { category: "patriarch", desc: "Jaakobi üheksas poeg" }, children: [] },
                    { name: "Aaser", attributes: { category: "patriarch", desc: "Jaakobi kümnes poeg" }, children: [] },
                    { name: "Joosep (Jaakobi poeg)", attributes: { category: "patriarch", desc: "Jaakobi lemmikpoeg, Egiptuse asekuberner" }, children: [
                      { name: "Manasse (Joosepi poeg)", attributes: { category: "patriarch", desc: "Joosepi esimene poeg" }, children: [] },
                      { name: "Efraim", attributes: { category: "patriarch", desc: "Joosepi teine poeg" }, children: [] }
                    ]},
                    { name: "Benjamiin", attributes: { category: "patriarch", desc: "Jaakobi noorim poeg" }, children: [
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

// Bible references per name → { slug, label }
const REFS: Record<string, { slug: string; label: string }> = {
  "Aadam": { slug: "1-mooses", label: "1Ms 2:7; 5:1–5" },
  "Noa": { slug: "1-mooses", label: "1Ms 6–9" },
  "Aabraham": { slug: "1-mooses", label: "1Ms 12; 17" },
  "Iisak": { slug: "1-mooses", label: "1Ms 21:1–7" },
  "Jaakob": { slug: "1-mooses", label: "1Ms 25:26; 32:28" },
  "Juuda": { slug: "1-mooses", label: "1Ms 29:35; 49:8–12" },
  "Ruuben": { slug: "1-mooses", label: "1Ms 29:32" },
  "Siimeon": { slug: "1-mooses", label: "1Ms 29:33" },
  "Leevi": { slug: "1-mooses", label: "1Ms 29:34" },
  "Issaskar": { slug: "1-mooses", label: "1Ms 30:18" },
  "Sebulon": { slug: "1-mooses", label: "1Ms 30:20" },
  "Daan": { slug: "1-mooses", label: "1Ms 30:6" },
  "Naftali": { slug: "1-mooses", label: "1Ms 30:8" },
  "Gad": { slug: "1-mooses", label: "1Ms 30:11" },
  "Aaser": { slug: "1-mooses", label: "1Ms 30:13" },
  "Joosep (Jaakobi poeg)": { slug: "1-mooses", label: "1Ms 30:24; 37–50" },
  "Manasse (Joosepi poeg)": { slug: "1-mooses", label: "1Ms 41:51" },
  "Efraim": { slug: "1-mooses", label: "1Ms 41:52" },
  "Benjamiin": { slug: "1-mooses", label: "1Ms 35:18" },
  "Mooses": { slug: "2-mooses", label: "2Ms 2:1–10" },
  "Aaron": { slug: "2-mooses", label: "2Ms 28" },
  "Peres": { slug: "1-mooses", label: "1Ms 38:29; Mt 1:3" },
  "Hesron": { slug: "matteus", label: "Mt 1:3; Rt 4:18" },
  "Ram": { slug: "matteus", label: "Mt 1:3–4; Rt 4:19" },
  "Amminadab": { slug: "matteus", label: "Mt 1:4; 4Ms 1:7" },
  "Nahsson": { slug: "matteus", label: "Mt 1:4; 4Ms 2:3" },
  "Salmon": { slug: "matteus", label: "Mt 1:4–5; Rt 4:20" },
  "Boas": { slug: "rutt", label: "Rt 2–4; Mt 1:5" },
  "Obed": { slug: "rutt", label: "Rt 4:17; Mt 1:5" },
  "Isai": { slug: "1-saamuel", label: "1Sm 16:1; Mt 1:5" },
  "Taavet": { slug: "1-saamuel", label: "1Sm 16; 2Sm 5; Mt 1:6" },
  "Saul": { slug: "1-saamuel", label: "1Sm 9–31" },
  "Saalomon": { slug: "1-kuningate", label: "1Kn 1–11; Mt 1:6" },
  "Rehabeam": { slug: "1-kuningate", label: "1Kn 12; Mt 1:7" },
  "Abija": { slug: "1-kuningate", label: "1Kn 15:1–8; Mt 1:7" },
  "Aasa": { slug: "1-kuningate", label: "1Kn 15:9–24; Mt 1:7" },
  "Joosafat": { slug: "1-kuningate", label: "1Kn 22; Mt 1:8" },
  "Jooram": { slug: "2-kuningate", label: "2Kn 8:16–24; Mt 1:8" },
  "Ussija": { slug: "2-kuningate", label: "2Kn 15:1–7; Mt 1:8" },
  "Jootam": { slug: "2-kuningate", label: "2Kn 15:32–38; Mt 1:9" },
  "Aahas": { slug: "2-kuningate", label: "2Kn 16; Mt 1:9" },
  "Hiskija": { slug: "2-kuningate", label: "2Kn 18–20; Mt 1:9" },
  "Manasse": { slug: "2-kuningate", label: "2Kn 21:1–18; Mt 1:10" },
  "Ammon": { slug: "2-kuningate", label: "2Kn 21:19–26; Mt 1:10" },
  "Joosija": { slug: "2-kuningate", label: "2Kn 22–23; Mt 1:10" },
  "Jekonja": { slug: "2-kuningate", label: "2Kn 24:8–17; Mt 1:11" },
  "Sealtiel": { slug: "matteus", label: "Mt 1:12; 1Aj 3:17" },
  "Serubabel": { slug: "esra", label: "Esr 2:2; Mt 1:12" },
  "Abiud": { slug: "matteus", label: "Mt 1:13" },
  "Eliakim": { slug: "matteus", label: "Mt 1:13" },
  "Asor": { slug: "matteus", label: "Mt 1:13–14" },
  "Saadok": { slug: "matteus", label: "Mt 1:14" },
  "Ahhim": { slug: "matteus", label: "Mt 1:14" },
  "Eliud": { slug: "matteus", label: "Mt 1:14–15" },
  "Eleasar": { slug: "matteus", label: "Mt 1:15" },
  "Mattan": { slug: "matteus", label: "Mt 1:15" },
  "Jaakob (Joosepi isa)": { slug: "matteus", label: "Mt 1:15–16" },
  "Joosep": { slug: "matteus", label: "Mt 1:16; Lk 2" },
  "Jeesus Kristus": { slug: "matteus", label: "Mt 1:16–17; Lk 3:23–38" },
};

function computeDepth(node: BibleNode, name: string, depth = 0): number | null {
  if (node.name === name) return depth;
  for (const c of node.children || []) {
    const r = computeDepth(c, name, depth + 1);
    if (r !== null) return r;
  }
  return null;
}

// Flatten tree to list with generation depth
interface FlatItem {
  name: string;
  attrs: NodeAttrs;
  generation: number;
  parent: string | null;
}
function flatten(node: BibleNode, gen = 0, parent: string | null = null, acc: FlatItem[] = []): FlatItem[] {
  acc.push({ name: node.name, attrs: node.attributes, generation: gen, parent });
  for (const c of node.children || []) flatten(c, gen + 1, node.name, acc);
  return acc;
}

interface Selected {
  name: string;
  attrs: NodeAttrs;
  generation: number;
}

export default function JeesuseSugupuu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 400, y: 60 });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Selected | null>(null);
  const [zoom, setZoom] = useState(0.45);
  const [resetKey, setResetKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"tree" | "list">("tree");

  useEffect(() => {
    setMounted(true);
    const update = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setTranslate({ x: width / 2, y: 60 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [resetKey, view]);

  const flat = useMemo(() => flatten(bibleTree), []);
  const matches = useMemo(() => {
    if (!search.trim()) return new Set<string>();
    const q = search.toLowerCase();
    return new Set(flat.filter((n) => n.name.toLowerCase().includes(q)).map((n) => n.name));
  }, [search, flat]);

  const handleReset = () => {
    setZoom(0.45);
    setResetKey((k) => k + 1);
  };

  const openNode = (name: string, attrs: NodeAttrs) => {
    const gen = computeDepth(bibleTree, name) ?? 0;
    setSelected({ name, attrs, generation: gen });
  };

  const renderNode = useCallback(
    ({ nodeDatum }: any) => {
      const cat = (nodeDatum.attributes?.category as Category) || "other";
      const colors = COLORS[cat];
      const isMatch = matches.has(nodeDatum.name);
      const dimmed = search.trim() && !isMatch;
      // truncate display name for the node rectangle
      const display = nodeDatum.name.length > 16 ? nodeDatum.name.slice(0, 15) + "…" : nodeDatum.name;
      return (
        <g
          style={{ cursor: "pointer", transition: "opacity 0.2s ease", opacity: dimmed ? 0.25 : 1 }}
          onClick={() => openNode(nodeDatum.name, nodeDatum.attributes)}
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
          />
          <text
            fill="#ffffff"
            stroke="none"
            textAnchor="middle"
            dy="0.35em"
            style={{ fontSize: 13, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500 }}
          >
            {display}
          </text>
        </g>
      );
    },
    [matches, search]
  );

  const filteredList = useMemo(() => {
    if (!search.trim()) return flat;
    const q = search.toLowerCase();
    return flat.filter(
      (n) => n.name.toLowerCase().includes(q) || n.attrs.desc.toLowerCase().includes(q)
    );
  }, [flat, search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-xl font-bold text-foreground mr-auto">Jeesuse sugupuu</h1>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Otsi nime või kirjeldust..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {view === "tree" && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Lähtesta vaade
            </Button>
          )}
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

      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="flex-1 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 pt-3">
          <TabsList>
            <TabsTrigger value="tree">Puu</TabsTrigger>
            <TabsTrigger value="list">Nimekiri</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tree" className="flex-1 mt-3">
          <motion.div
            ref={containerRef}
            className="bg-white border-t border-border"
            style={{ height: "calc(100vh - 240px)", minHeight: 500 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            key={resetKey}
          >
            {mounted && view === "tree" && (
              <Tree
                data={bibleTree as any}
                orientation="vertical"
                translate={translate}
                zoom={zoom}
                pathFunc="diagonal"
                renderCustomNodeElement={renderNode}
                separation={{ siblings: 1.1, nonSiblings: 1.3 }}
                nodeSize={{ x: 140, y: 70 }}
                collapsible={false}
                enableLegacyTransitions
                transitionDuration={250}
                scaleExtent={{ min: 0.15, max: 2 }}
              />
            )}
          </motion.div>
          <p className="text-xs text-muted-foreground text-center py-2">
            Lohista puud liigutamiseks · keri suumimiseks · klõpsa nimel, et näha detaile
          </p>
        </TabsContent>

        <TabsContent value="list" className="flex-1 mt-3">
          <div className="max-w-3xl mx-auto px-4 pb-12 space-y-2">
            {filteredList.map((item, idx) => {
              const colors = COLORS[item.attrs.category];
              const ref = REFS[item.name];
              return (
                <motion.button
                  key={`${item.name}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.015, 0.6) }}
                  onClick={() => openNode(item.name, item.attrs)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
                  >
                    {item.generation + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <Badge variant="outline" className="text-[10px] py-0">
                        {colors.label}
                      </Badge>
                      {ref && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {ref.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.attrs.desc}</p>
                  </div>
                </motion.button>
              );
            })}
            {filteredList.length === 0 && (
              <p className="text-center text-muted-foreground py-12">Vastet ei leitud.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-serif text-left">{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    style={{
                      background: COLORS[selected.attrs.category].bg,
                      color: "#fff",
                      border: `1px solid ${COLORS[selected.attrs.category].border}`,
                    }}
                  >
                    {COLORS[selected.attrs.category].label}
                  </Badge>
                  <Badge variant="outline">Põlvkond {selected.generation + 1}</Badge>
                </div>
                <p className="text-foreground leading-relaxed">{selected.attrs.desc}</p>
                {REFS[selected.name] && (
                  <div className="rounded-lg border border-border p-3 bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <BookOpen className="h-4 w-4" />
                      Piibli viide
                    </div>
                    <p className="font-medium text-foreground mb-3">{REFS[selected.name].label}</p>
                    <Button asChild size="sm" className="w-full">
                      <Link to={`/raamat/${REFS[selected.name].slug}`}>
                        Ava Piiblis
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
