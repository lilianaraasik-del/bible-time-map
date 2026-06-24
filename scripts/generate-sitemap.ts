// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://materjalid.piibel.ee";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Static public routes
const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/ajajoon", changefreq: "weekly", priority: "0.9" },
  { path: "/paigad", changefreq: "monthly", priority: "0.8" },
  { path: "/sundmused", changefreq: "monthly", priority: "0.8" },
  { path: "/kaardid/tabernaakel", changefreq: "monthly", priority: "0.7" },
  { path: "/jeesuse-sugupuu", changefreq: "monthly", priority: "0.7" },
  { path: "/eraamatud", changefreq: "weekly", priority: "0.8" },
  { path: "/sonaraamat", changefreq: "monthly", priority: "0.7" },
];

// Bible book routes — read slugs from the data modules at build time.
async function bookEntries(): Promise<SitemapEntry[]> {
  const [{ coreBookDetails }, { additionalBookDetails }] = await Promise.all([
    import("../src/data/coreBookDetails.ts"),
    import("../src/data/additionalBookDetails.ts"),
  ]);
  const slugs = Array.from(
    new Set([...Object.keys(coreBookDetails), ...Object.keys(additionalBookDetails)]),
  );
  const entries: SitemapEntry[] = [];
  for (const slug of slugs) {
    entries.push({ path: `/raamat/${slug}`, changefreq: "monthly", priority: "0.7" });
    entries.push({ path: `/raamat/${slug}/kommentaar`, changefreq: "monthly", priority: "0.5" });
  }
  return entries;
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const all = [...staticEntries, ...(await bookEntries())];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
