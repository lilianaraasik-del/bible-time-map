// Translates bookQuotes (ET) to EN and RU, merges into locale files under books.<slug>.quote.
// Run: LOVABLE_API_KEY=... bun run scripts/translate-book-quotes.ts
import { writeFileSync, readFileSync } from "node:fs";
import { bookQuotes } from "../src/data/bookQuotes";

const apiKey = process.env.LOVABLE_API_KEY;
if (!apiKey) throw new Error("LOVABLE_API_KEY puudub");

type Quote = { text: string; reference: string };

const slugs = Object.keys(bookQuotes);
console.log(`Quotes: ${slugs.length}`);

async function translateBatch(targetLang: "en" | "ru", batch: string[]): Promise<Record<string, Quote>> {
  const payload: Record<string, Quote> = {};
  for (const s of batch) payload[s] = bookQuotes[s];

  const langName = targetLang === "en" ? "English" : "Russian";
  const sys =
    `You are a professional Bible translator. Translate these Estonian Bible quotes into ${langName}. ` +
    `Use a widely-accepted Bible translation style (${targetLang === "en" ? "ESV/NIV style" : "Синодальный перевод style"}). ` +
    `For "reference", convert the Estonian book name to the standard ${langName} Bible book name. ` +
    `Examples: "1. Moosese 1:1" -> ${targetLang === "en" ? '"Genesis 1:1"' : '"Бытие 1:1"'}; ` +
    `"1. Ajaraamat 29:11" -> ${targetLang === "en" ? '"1 Chronicles 29:11"' : '"1 Паралипоменон 29:11"'}; ` +
    `"Ülemlaul 7:11" -> ${targetLang === "en" ? '"Song of Solomon 7:11"' : '"Песнь песней 7:11"'}. ` +
    `Keep ALL JSON keys identical (slugs, "text", "reference"). Return ONLY a JSON object, no markdown.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: JSON.stringify(payload) },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`AI gateway ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");
  return JSON.parse(content);
}

async function translateAll(targetLang: "en" | "ru"): Promise<Record<string, Quote>> {
  const CHUNK = 12;
  const out: Record<string, Quote> = {};
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
        console.log(`err (${attempt}):`, (e as Error).message);
        if (attempt >= 3) throw e;
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  return out;
}

function mergeIntoLocale(localePath: string, quotes: Record<string, Quote>) {
  const json = JSON.parse(readFileSync(localePath, "utf8"));
  json.books = json.books || {};
  for (const [slug, q] of Object.entries(quotes)) {
    json.books[slug] = { ...(json.books[slug] || {}), quote: q };
  }
  writeFileSync(localePath, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`Saved: ${localePath}`);
}

// ET — use originals
mergeIntoLocale("src/i18n/locales/et.json", bookQuotes);

const en = await translateAll("en");
mergeIntoLocale("src/i18n/locales/en.json", en);

const ru = await translateAll("ru");
mergeIntoLocale("src/i18n/locales/ru.json", ru);

console.log("Done!");
