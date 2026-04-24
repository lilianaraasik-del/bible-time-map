import JSZip from "jszip";

const XML_MIME_TYPES = new Set(["application/xhtml+xml", "text/html", "application/xml", "text/xml"]);

function dirname(path: string) {
  const normalized = path.replace(/\\/g, "/");
  const idx = normalized.lastIndexOf("/");
  return idx >= 0 ? normalized.slice(0, idx + 1) : "";
}

function resolvePath(basePath: string, target: string) {
  if (!target || /^([a-z]+:|#|data:|mailto:|tel:)/i.test(target)) return target;
  const normalizedBase = basePath.split("/").filter(Boolean);
  const normalizedTarget = target.split("/");
  const parts = target.startsWith("/") ? [] : normalizedBase;

  for (const part of normalizedTarget) {
    if (!part || part === ".") continue;
    if (part === "..") {
      parts.pop();
      continue;
    }
    parts.push(part);
  }

  return parts.join("/");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function bufferToDataUrl(buffer: ArrayBuffer, mimeType: string) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return `data:${mimeType};base64,${btoa(binary)}`;
}

function rewriteCssUrls(css: string, basePath: string, resourceMap: Map<string, string>) {
  return css.replace(/url\(([^)]+)\)/gi, (full, rawValue: string) => {
    const cleaned = rawValue.trim().replace(/^['"]|['"]$/g, "");
    const resolved = resourceMap.get(resolvePath(basePath, cleaned));
    return resolved ? `url("${resolved}")` : full;
  });
}

function rewriteDocumentLinks(doc: Document, basePath: string, resourceMap: Map<string, string>, chapterAnchors: Map<string, string>) {
  const attributes = [
    { name: "src", selector: "[src]" },
    { name: "href", selector: "[href]" },
    { name: "xlink:href", selector: "[xlink\\:href]" },
  ];

  for (const { name, selector } of attributes) {
    doc.querySelectorAll(selector).forEach((node) => {
      const rawValue = node.getAttribute(name);
      if (!rawValue) return;
      const [pathPart, hashPart] = rawValue.split("#");

      if (!pathPart) {
        if (hashPart) node.setAttribute(name, `#${hashPart}`);
        return;
      }

      const resolvedPath = resolvePath(basePath, pathPart);
      const mappedResource = resourceMap.get(resolvedPath);
      if (mappedResource) {
        node.setAttribute(name, hashPart ? `${mappedResource}#${hashPart}` : mappedResource);
        return;
      }

      const chapterAnchor = chapterAnchors.get(resolvedPath);
      if (chapterAnchor) {
        node.setAttribute(name, hashPart ? `#${hashPart}` : `#${chapterAnchor}`);
      }
    });
  }

  // SVG <image> elemendid kasutavad sageli xlink:href, aga HTML parser
  // kaotab namespace'i. Käime eraldi kõik SVG image/use elemendid läbi
  // ja proovime kõiki võimalikke atribuudinimesid.
  doc.querySelectorAll("image, use").forEach((node) => {
    const candidates = ["href", "xlink:href", "xlink\\:href"];
    for (const attr of candidates) {
      const rawValue = node.getAttribute(attr) || node.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!rawValue) continue;
      const [pathPart, hashPart] = rawValue.split("#");
      if (!pathPart) continue;
      const resolved = resourceMap.get(resolvePath(basePath, pathPart));
      if (!resolved) continue;
      const finalValue = hashPart ? `${resolved}#${hashPart}` : resolved;
      try {
        node.setAttribute(attr, finalValue);
      } catch {
        // ignore invalid attribute names
      }
      try {
        node.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", finalValue);
      } catch {
        // ignore
      }
      break;
    }
  });
}

export async function extractEpubAsHtml(buffer: ArrayBuffer, title: string) {
  const zip = await JSZip.loadAsync(buffer);
  const containerXml = await zip.file("META-INF/container.xml")?.async("string");

  if (!containerXml) {
    throw new Error("EPUB container.xml puudub.");
  }

  const containerDoc = new DOMParser().parseFromString(containerXml, "application/xml");
  const rootfilePath = containerDoc.querySelector("rootfile")?.getAttribute("full-path");
  if (!rootfilePath) {
    throw new Error("EPUB juurfaili ei leitud.");
  }

  const opfXml = await zip.file(rootfilePath)?.async("string");
  if (!opfXml) {
    throw new Error("EPUB OPF faili ei leitud.");
  }

  const opfDoc = new DOMParser().parseFromString(opfXml, "application/xml");
  const opfDir = dirname(rootfilePath);
  const manifestNodes = Array.from(opfDoc.getElementsByTagNameNS("http://www.idpf.org/2007/opf", "item"));
  const spineNodes = Array.from(opfDoc.getElementsByTagNameNS("http://www.idpf.org/2007/opf", "itemref"));

  const manifest = new Map(
    manifestNodes.map((node) => [
      node.getAttribute("id") || "",
      {
        href: resolvePath(opfDir, node.getAttribute("href") || ""),
        mediaType: node.getAttribute("media-type") || "application/octet-stream",
      },
    ])
  );

  const chapterAnchors = new Map<string, string>();
  const chapterPaths = spineNodes
    .map((node, index) => {
      const manifestItem = manifest.get(node.getAttribute("idref") || "");
      if (!manifestItem?.href) return null;
      const anchor = `chapter-${index + 1}`;
      chapterAnchors.set(manifestItem.href, anchor);
      return { ...manifestItem, anchor };
    })
    .filter((item): item is { href: string; mediaType: string; anchor: string } => Boolean(item));

  const resourceMap = new Map<string, string>();

  for (const [relativePath, entry] of manifest.entries()) {
    if (!entry.href || XML_MIME_TYPES.has(entry.mediaType) || entry.mediaType === "text/css") continue;
    const file = zip.file(entry.href);
    if (!file) continue;
    const data = await file.async("arraybuffer");
    resourceMap.set(entry.href, bufferToDataUrl(data, entry.mediaType));
  }

  const styles: string[] = [];
  for (const entry of manifest.values()) {
    if (entry.mediaType !== "text/css") continue;
    const css = await zip.file(entry.href)?.async("string");
    if (!css) continue;
    styles.push(rewriteCssUrls(css, dirname(entry.href), resourceMap));
  }

  const sections: string[] = [];
  for (const chapter of chapterPaths) {
    const chapterText = await zip.file(chapter.href)?.async("string");
    if (!chapterText) continue;

    const cleanedChapterText = chapterText.replace(/^<\?xml[^>]*>\s*/i, "");
    const parser = new DOMParser();
    let chapterDoc = parser.parseFromString(cleanedChapterText, chapter.mediaType === "application/xhtml+xml" ? "application/xhtml+xml" : "text/html");
    if (chapterDoc.querySelector("parsererror")) {
      chapterDoc = parser.parseFromString(cleanedChapterText, "text/html");
    }

    rewriteDocumentLinks(chapterDoc, dirname(chapter.href), resourceMap, chapterAnchors);

    const inlineStyles = Array.from(chapterDoc.querySelectorAll("style"))
      .map((node) => rewriteCssUrls(node.textContent || "", dirname(chapter.href), resourceMap))
      .join("\n");

    chapterDoc.querySelectorAll('link[rel="stylesheet"]').forEach((node) => node.remove());
    chapterDoc.querySelectorAll("script").forEach((node) => node.remove());

    const bodyHtml = chapterDoc.body?.innerHTML || chapterDoc.documentElement?.innerHTML || cleanedChapterText;

    sections.push(`
      <section id="${chapter.anchor}" class="epub-chapter">
        ${inlineStyles ? `<style>${inlineStyles}</style>` : ""}
        ${bodyHtml}
      </section>
    `);
  }

  return `
    <style>
      .epub-reader-root {
        color-scheme: light;
        background: #ffffff;
        color: #111827;
        font-family: Georgia, serif;
        line-height: 1.7;
        padding: 24px clamp(16px, 4vw, 40px) 48px;
        max-width: 920px;
        margin: 0 auto;
        word-break: break-word;
      }
      .epub-reader-root img,
      .epub-reader-root svg,
      .epub-reader-root video,
      .epub-reader-root audio,
      .epub-reader-root iframe { max-width: 100%; height: auto; }
      .epub-reader-root a { color: inherit; }
      .epub-reader-root .epub-chapter { margin: 0 auto 2.5rem; }
      .epub-reader-root .epub-chapter + .epub-chapter { padding-top: 2rem; border-top: 1px solid #e5e7eb; }
    </style>
    ${styles.map((style) => `<style>${style}</style>`).join("\n")}
    <div class="epub-reader-root" aria-label="${escapeHtml(title)}">
      ${sections.join("\n")}
    </div>`;
}