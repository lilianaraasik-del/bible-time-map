// Genereerib raamatudetailide tõlked (ET → EN, ET → RU) Lovable AI Gateway kaudu.
// Käivita: LOVABLE_API_KEY=... bun run scripts/translate-books.ts
import { writeFileSync, readFileSync } from "node:fs";
import { coreBookDetails } from "../src/data/coreBookDetails";
import { additionalBookDetails } from "../src/data/additionalBookDetails";

const apiKey = process.env.LOVABLE_API_KEY;
if (!apiKey) throw new Error("LOVABLE_API_KEY puudub");

type Details = {
  overview: string;
  authorFacts: string[];
  additionalFacts: string[];
  breakdowns: { title: string; description: string }[];
};

const merged = { ...coreBookDetails, ...additionalBookDetails };
const etDetails: Record<string, Details> = {};
for (const [slug, d] of Object.entries(merged)) {
  etDetails[slug] = {
    overview: d.overview,
    authorFacts: d.authorFacts,
    additionalFacts: d.additionalFacts,
    breakdowns: d.breakdowns.map((b) => ({ title: b.title, description: b.description })),
  };
}

const slugs = Object.keys(etDetails);
console.log(`Raamatuid kokku: ${slugs.length}`);

async function translateBatch(targetLang: "en" | "ru", batch: string[]): Promise<Record<string, Details>> {
  const payload: Record<string, Details> = {};
  for (const s of batch) payload[s] = etDetails[s];

  const langName = targetLang === "en" ? "English" : "Russian";
  const sys =
    `You are a professional Bible scholar and translator. Translate the following Estonian Bible book overview data into ${langName}. ` +
    `Keep ALL JSON keys identical (slugs, "overview", "authorFacts", "additionalFacts", "breakdowns", "title", "description"). ` +
    `Translate ONLY the string VALUES. Preserve Bible reference style (e.g. "2Ms 17:8–13", "Jos 24:15"). ` +
    `Keep chapter markers like "(ptk 1-3)" translated naturally: English use "(ch. 1-3)", Russian use "(гл. 1-3)". ` +
    `Use accurate Bible book and character names in the target language (e.g. Estonian "Mooses" = English "Moses" / Russian "Моисей"; "Iisrael" = "Israel"/"Израиль"). ` +
    `Return ONLY a JSON object with the same shape, no commentary, no markdown fences.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: JSON.stringify(payload) },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway ${res.status}: ${t}`);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Tühi vastus");
  return JSON.parse(content);
}

async function translateAll(targetLang: "en" | "ru"): Promise<Record<string, Details>> {
  const CHUNK = 6;
  const out: Record<string, Details> = {};
  for (let i = 0; i < slugs.length; i += CHUNK) {
    const batch = slugs.slice(i, i + CHUNK);
    process.stdout.write(`[${targetLang}] ${i + 1}-${i + batch.length}/${slugs.length}... `);
    let attempt = 0;
    while (true) {
      try {
        const result = await translateBatch(targetLang, batch);
        Object.assign(out, result);
        console.log("OK");
        break;
      } catch (e) {
        attempt++;
        console.log(`viga (${attempt}):`, (e as Error).message);
        if (attempt >= 3) throw e;
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  return out;
}

function mergeIntoLocale(localePath: string, details: Record<string, Details>) {
  const json = JSON.parse(readFileSync(localePath, "utf8"));
  json.books = json.books || {};
  for (const [slug, d] of Object.entries(details)) {
    json.books[slug] = { ...(json.books[slug] || {}), details: d };
  }
  writeFileSync(localePath, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`Salvestasin: ${localePath}`);
}

// ET — kasutame algset
mergeIntoLocale("src/i18n/locales/et.json", etDetails);

// EN
const en = await translateAll("en");
mergeIntoLocale("src/i18n/locales/en.json", en);

// RU
const ru = await translateAll("ru");
mergeIntoLocale("src/i18n/locales/ru.json", ru);

console.log("Valmis!");
