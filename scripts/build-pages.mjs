// Builds the English and Italian pages (en/index.html, it/index.html) from the Slovenian
// index.html and src/translations.json, then fills in the site URL and the robots setting.
// Netlify runs it after the CSS build (see netlify.toml). No dependencies.
//
// Environment:
//   URL             site address (Netlify sets it); replaces https://gostilna.netlify.app
//   SITE_INDEXABLE  "true" removes <meta name="robots" content="noindex"> so search engines index the site

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCE_URL = "https://gostilna.netlify.app";
const COLUMN = { en: 0, it: 1 };
const LOCALE = { sl: "sl_SI", en: "en_GB", it: "it_IT" };
const NOINDEX = '<meta content="noindex" name="robots"/>\n';

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Replace every text node and attribute (alt, placeholder, aria-label, label, title, content) whose
// whole value is a key in the dictionary. <script> and <style> blocks are left alone.
export function translate(html, lang, dictionary, used = new Set()) {
  const col = COLUMN[lang];
  return html
    .split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/)
    .map((part, i) => {
      if (i % 2) return part;
      part = part.replace(/>([^<]+)</g, (match, text) => {
        const key = text.trim();
        if (!key || !dictionary[key]) return match;
        used.add(key);
        return ">" + text.replace(key, escapeHtml(dictionary[key][col])) + "<";
      });
      return part.replace(/\b(alt|placeholder|aria-label|label|title|content)="([^"]*)"/g, (match, attr, value) => {
        if (!dictionary[value]) return match;
        used.add(value);
        return `${attr}="${escapeHtml(dictionary[value][col])}"`;
      });
    })
    .join("");
}

// Point a translated page at its own URL and language, and fix relative links for its folder.
// prefix: path back to the site root ("../" for /en/); langHref: where the SL / EN / IT switch links go.
export function localize(html, lang, { prefix = "../", langHref = { sl: "../", en: "../en/", it: "../it/" }, pageUrl } = {}) {
  pageUrl = pageUrl || `${SOURCE_URL}/${lang}/`;
  html = html
    .replace('<html lang="sl">', `<html lang="${lang}">`)
    .replace(`<link href="${SOURCE_URL}/" rel="canonical"/>`, `<link href="${pageUrl}" rel="canonical"/>`)
    .replace(`<meta content="${SOURCE_URL}/" property="og:url"/>`, `<meta content="${pageUrl}" property="og:url"/>`)
    .replace(
      '<meta content="sl_SI" property="og:locale"/>\n<meta content="en_GB" property="og:locale:alternate"/>\n<meta content="it_IT" property="og:locale:alternate"/>',
      [`<meta content="${LOCALE[lang]}" property="og:locale"/>`]
        .concat(Object.keys(LOCALE).filter((l) => l !== lang).map((l) => `<meta content="${LOCALE[l]}" property="og:locale:alternate"/>`))
        .join("\n")
    )
    .replace('id="formLanguage" name="language" type="hidden" value="sl"', `id="formLanguage" name="language" type="hidden" value="${lang}"`);

  // Language switch: mark this page as current and point the links at the right pages.
  html = html.replace(/<a [^>]*data-lang="(sl|en|it)"[^>]*>/g, (tag, code) => {
    tag = tag.replace(' aria-current="page"', "").replace(/href="[^"]*"/, `href="${langHref[code]}"`);
    return code === lang ? tag.replace("<a ", '<a aria-current="page" ') : tag;
  });

  // Relative links to files in the site root.
  const rel = (url) => (/^(#|[a-z]+:|\/|\.\.\/)/.test(url) || Object.values(langHref).includes(url) ? url : prefix + url);
  html = html
    .replace(/\b(href|src)="([^"]*)"/g, (m, attr, url) => `${attr}="${rel(url)}"`)
    .replace(/\b(srcset|imagesrcset)="([^"]*)"/g, (m, attr, list) =>
      `${attr}="${list.split(",").map((item) => item.trim().replace(/^(\S+)/, (u) => rel(u))).join(", ")}"`)
    .replace(/url\('(?!data:|[a-z]+:|\/)([^']+)'\)/g, (m, url) => `url('${prefix}${url}')`)
    .replace(new RegExp(`href="${prefix.replace(/\./g, "\\.")}(zasebnost|dostopnost)\\.html"`, "g"), `href="${prefix}$1.html#${lang}"`);
  return html;
}

export function finish(html, { siteUrl = SOURCE_URL, indexable = false } = {}) {
  html = html.split(SOURCE_URL).join(siteUrl);
  return indexable ? html.split(NOINDEX).join("") : html;
}

function main() {
  const siteUrl = (process.env.URL || SOURCE_URL).replace(/\/$/, "");
  const indexable = process.env.SITE_INDEXABLE === "true";
  const dictionary = JSON.parse(readFileSync(path.join(root, "src/translations.json"), "utf8"));
  const source = readFileSync(path.join(root, "index.html"), "utf8");
  const used = new Set();

  for (const lang of Object.keys(COLUMN)) {
    const html = finish(localize(translate(source, lang, dictionary, used), lang), { siteUrl, indexable });
    mkdirSync(path.join(root, lang), { recursive: true });
    writeFileSync(path.join(root, lang, "index.html"), html);
    console.log(`built ${lang}/index.html`);
  }
  for (const file of ["index.html", "zasebnost.html", "dostopnost.html", "404.html", "robots.txt", "sitemap.xml"]) {
    const target = path.join(root, file);
    if (!existsSync(target)) continue;
    const before = readFileSync(target, "utf8");
    const after = finish(before, { siteUrl, indexable });
    if (after !== before) writeFileSync(target, after);
  }

  const unused = Object.keys(dictionary).filter((key) => !used.has(key));
  if (unused.length) {
    console.warn(`\nThese translations match no text on the page (the Slovenian text changed?):\n- ${unused.join("\n- ")}`);
  }
  console.log(`site URL: ${siteUrl}, indexable: ${indexable}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
