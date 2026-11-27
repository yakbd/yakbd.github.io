// Checks every link of the built site (docs/.vitepress/dist): each internal link must reach a page, and its
// #fragment an id on that page. With --external it also requests every external link once; a link into a yakbd
// repository's Markdown file must also name a heading that exists there.
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { slug } from "github-slugger";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", ".vitepress", "dist");
const external = process.argv.includes("--external");

const decode = (s) =>
  s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

const pages = new Map(); // route file (relative, posix) -> { ids, links }
for await (const file of walk(dist)) {
  const html = await readFile(file, "utf8");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decode(m[1])));
  const links = [...html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)].map((m) => decode(m[1]));
  pages.set(relative(dist, file).split("\\").join("/"), { ids, links });
}

function target(fromFile, href) {
  const [path, frag = ""] = href.split("#");
  if (path === "") return { file: fromFile, frag: decodeURIComponent(frag) };
  let p = path.startsWith("/") ? path.slice(1) : posix.join(posix.dirname(fromFile), path);
  p = posix.normalize(p);
  if (p === "." || p === "") p = "index.html";
  else if (p.endsWith("/")) p += "index.html";
  else if (!posix.extname(p)) p += ".html";
  return { file: p, frag: decodeURIComponent(frag) };
}

const errors = [];
const warnings = [];
const fail = (url, msg) => (/^https:\/\/(github\.com|raw\.githubusercontent\.com)\/yakbd\/|^https:\/\/yakbd\.github\.io\//.test(url) ? errors : warnings).push(msg);
const externals = new Map(); // url -> first page using it
for (const [file, { links }] of pages) {
  for (const href of links) {
    if (href === "" || href.startsWith("mailto:")) continue;
    // Releases are linked as releases/latest (downloads as releases/latest/download/<name>), never by tag.
    if (/\/releases\/tag\/|\/releases\/download\/|\/(blob|tree)\/v[0-9]/.test(href)) {
      errors.push(`${file}: link pinned to a release tag, use releases/latest: ${href}`);
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) {
      if (!externals.has(href)) externals.set(href, file);
      continue;
    }
    const t = target(file, href);
    if (t.file.startsWith("assets/") || /\.(png|svg|json|ico|txt|xml)$/.test(t.file)) {
      if (!existsSync(join(dist, t.file))) errors.push(`${file}: missing file ${href}`);
      continue;
    }
    const page = pages.get(t.file);
    if (!page) errors.push(`${file}: no page for ${href}`);
    else if (t.frag && !page.ids.has(t.frag)) errors.push(`${file}: no #${t.frag} on ${t.file} (${href})`);
  }
}
console.log(`${pages.size} pages, ${[...pages.values()].reduce((n, p) => n + p.links.length, 0)} links, ${externals.size} external URLs`);

if (external) {
  const rawCache = new Map();
  for (const [url, file] of externals) {
    const [base, frag] = url.split("#");
    let res;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        res = await fetch(base, { method: "GET", redirect: "follow", headers: { "user-agent": "link-check" } });
        if (res.ok || ![429, 502, 503].includes(res.status)) break;
      } catch (e) {
        res = { ok: false, status: e.cause?.code ?? e.message };
      }
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
    if (!res.ok && typeof res.status !== "number") {
      fail(url, `${file}: ${url}: ${res.status}`);
      continue;
    }
    if (!res.ok) {
      fail(url, `${file}: ${url}: HTTP ${res.status}`);
      continue;
    }
    const m = base.match(/^https:\/\/github\.com\/yakbd\/([^/]+)\/blob\/([^/]+)\/(.+\.md)$/);
    if (frag && m) {
      const rawUrl = `https://raw.githubusercontent.com/yakbd/${m[1]}/${m[2]}/${m[3]}`;
      if (!rawCache.has(rawUrl)) rawCache.set(rawUrl, await (await fetch(rawUrl)).text());
      const ids = new Set();
      const seen = new Map();
      let fence = false;
      for (const line of rawCache.get(rawUrl).split("\n")) {
        if (/^\s{0,3}(```|~~~)/.test(line)) fence = !fence;
        const h = !fence && line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
        if (!h) continue;
        const text = h[1].replace(/`/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_]/g, "");
        const s = slug(text);
        const n = seen.get(s) ?? 0;
        ids.add(n ? `${s}-${n}` : s);
        seen.set(s, n + 1);
      }
      if (!ids.has(decodeURIComponent(frag))) errors.push(`${file}: ${url}: no heading #${frag}`);
    }
    console.log(`ok ${res.status} ${url}`);
  }
}

if (warnings.length) console.warn(`warning (not a yakbd link, check by hand):\n${warnings.join("\n")}`);
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`${errors.length} broken link(s)`);
  process.exit(1);
}
console.log("links ok");
