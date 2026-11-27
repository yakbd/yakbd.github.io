// Fetches the documentation pages listed in sources.json from the public yakbd repositories, at the exact
// commits pinned there, into docs/ (those output paths are ignored by git: the repositories are the only source).
// Relative links are rewritten: to this site's page when the target is one of the fetched pages, otherwise to
// the file on GitHub at the pinned commit. GitHub links to a fetched page (on main) point to this site instead.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = posix.join(dirname(fileURLToPath(import.meta.url)).replaceAll("\\", "/"), "..");
const sources = JSON.parse(await readFile(posix.join(root, "sources.json"), "utf8"));
const org = "yakbd";

const raw = (repo, path) => `https://raw.githubusercontent.com/${org}/${repo}/${sources.repos[repo]}/${path}`;
const blob = (repo, path) =>
  `https://github.com/${org}/${repo}/${path.endsWith("/") || path === "" ? "tree" : "blob"}/${sources.repos[repo]}/${path}`;

// "repo:path" of every fetched page -> its route on this site
const routes = new Map();
for (const p of sources.pages) {
  routes.set(`${p.repo}:${p.path}`, "/" + p.out.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, ""));
}

async function get(repo, path) {
  const url = raw(repo, path);
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (attempt >= 3 || res.status === 404) throw new Error(`${url}: HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
}

function rewriteHref(href, repo, path) {
  // Links to a repository under its old name go to its new name ("renamed" in sources.json).
  href = href.replace(/^https:\/\/github\.com\/yakbd\/([^/#?]+)/, (m, r) =>
    sources.renamed?.[r] ? `https://github.com/${org}/${sources.renamed[r]}` : m);
  // GitHub links to a page this site carries, on main, go to the site page.
  const gh = href.match(/^https:\/\/github\.com\/yakbd\/([^/]+)\/blob\/main\/([^#?]+)(#.*)?$/);
  if (gh) {
    const route = routes.get(`${gh[1]}:${gh[2]}`);
    return route ? route + (gh[3] ?? "") : href;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#") || href.startsWith("//")) return href;
  const [target, frag = ""] = href.split(/(?=#)/);
  let resolved = posix.normalize(posix.join(posix.dirname(path), target));
  if (resolved.startsWith("..")) throw new Error(`${repo}/${path}: link leaves the repository: ${href}`);
  if (resolved === ".") resolved = "";
  if (target.endsWith("/") && resolved && !resolved.endsWith("/")) resolved += "/";
  const route = routes.get(`${repo}:${resolved}`);
  return route ? route + frag : blob(repo, resolved) + frag;
}

function rewrite(markdown, repo, path) {
  let fence = null;
  return markdown
    .split("\n")
    .map((line) => {
      const f = line.match(/^\s{0,3}(`{3,}|~{3,})/);
      if (f) {
        if (!fence) fence = f[1];
        else if (f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
        return line;
      }
      if (fence) return line;
      line = line.replace(/^(\s{0,3}\[[^\]]+\]:\s*)(\S+)/, (_, a, h) => a + rewriteHref(h, repo, path));
      return line.replace(/\]\((<?)([^)\s>]+)(>?)((?:\s+"[^"]*")?)\)/g, (_, lt, h, gt, title) =>
        `](${lt}${rewriteHref(h, repo, path)}${gt}${title})`);
    })
    .join("\n");
}

for (const p of sources.pages) {
  const text = (await get(p.repo, p.path)).toString("utf8");
  const commit = sources.repos[p.repo];
  const page = [
    "---",
    `title: ${JSON.stringify(p.title)}`,
    `source: ${JSON.stringify({ repo: `${org}/${p.repo}`, path: p.path, commit, url: blob(p.repo, p.path) })}`,
    "---",
    "",
    // The pages are plain Markdown: nothing in them is a Vue template.
    "::: v-pre",
    "",
    rewrite(text, p.repo, p.path).trimEnd(),
    "",
    ":::",
    "",
  ].join("\n");
  const out = posix.join(root, "docs", p.out);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page);
  console.log(`${org}/${p.repo}@${commit.slice(0, 7)} ${p.path} -> docs/${p.out}`);
}

for (const f of sources.files) {
  const out = posix.join(root, "docs", f.out);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, await get(f.repo, f.path));
  console.log(`${org}/${f.repo}@${sources.repos[f.repo].slice(0, 7)} ${f.path} -> docs/${f.out}`);
}
