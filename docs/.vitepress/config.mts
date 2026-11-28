import { defineConfig } from "vitepress";
import { slug } from "github-slugger";
import sources from "../../sources.json" with { type: "json" };

// A sidebar entry for a page fetched from another repository (sources.json "pages"): its title and route.
function page(out: string, text?: string) {
  const p = sources.pages.find((p) => p.out === out);
  if (!p) throw new Error(`config.mts: ${out} is not a page in sources.json`);
  return { text: text ?? p.title, link: "/" + out.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "") };
}

export default defineConfig({
  lang: "en",
  title: "YAKBD",
  titleTemplate: ":title · YAKBD",
  description:
    "YAKBD is an open-source keyboard layout designer: design a layout once in an open format and build native, installable layouts for Windows, macOS and Linux. Android, iOS, ChromeOS and Keyman are planned.",
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/icon.png" }],
    ["meta", { name: "theme-color", content: "#fbf7f1", media: "(prefers-color-scheme: light)" }],
    ["meta", { name: "theme-color", content: "#1b1613", media: "(prefers-color-scheme: dark)" }],
  ],
  markdown: {
    // Heading ids as GitHub makes them, so links written for GitHub ("SPEC.md#173-loss-kinds") work here too.
    anchor: { slugify: (s: string) => slug(s) },
    // The pages fetched from the other repositories are plain Markdown: a "<file>" in their text is text, not HTML.
    config(md) {
      const fetched = new Set(sources.pages.map((p) => p.out));
      const parse = md.parse.bind(md);
      md.parse = (src, env) => {
        if (!fetched.has(env?.relativePath)) return parse(src, env);
        md.set({ html: false });
        try {
          return parse(src, env);
        } finally {
          md.set({ html: true });
        }
      };
    },
  },
  themeConfig: {
    logo: { src: "/icon.png", alt: "" },
    nav: [
      { text: "Guide", link: "/guide/", activeMatch: "^/guide/" },
      { text: "Editor", link: "/editor/", activeMatch: "^/editor/" },
      { text: "Format", link: "/spec/", activeMatch: "^/spec/" },
      { text: "CLI reference", link: "/cli/", activeMatch: "^/cli/" },
      { text: "What's new", link: "/releases" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Get started",
          items: [
            { text: "Install", link: "/guide/" },
            { text: "Quick start", link: "/guide/quick-start" },
          ],
        },
        {
          text: "Windows",
          items: [
            { text: "Windows", link: "/guide/windows" },
            page("guide/migrating-from-msklc.md"),
            page("guide/recover-a-layout.md"),
            page("guide/windows-security-prompts.md"),
          ],
        },
        { text: "macOS", items: [page("guide/macos.md")] },
        { text: "Linux", items: [page("guide/linux.md")] },
        {
          text: "More",
          items: [
            page("guide/code-signing-policy.md"),
            { text: "What's new", link: "/releases" },
            { text: "Contributing", link: "/contributing" },
          ],
        },
      ],
      "/editor/": [
        {
          text: "Editor",
          items: [
            { text: "YAKBD Editor", link: "/editor/" },
            { text: "Install", link: "/guide/#the-editor" },
            page("editor/targets.md"),
            page("editor/building.md"),
            page("editor/verified.md"),
            page("editor/code-signing-policy.md"),
          ],
        },
        {
          text: "On GitHub",
          items: [{ text: "yakbd-gui", link: "https://github.com/yakbd/yakbd-gui" }],
        },
      ],
      "/spec/": [
        {
          text: "Format",
          items: [
            { text: "Overview", link: "/spec/" },
            page("spec/format.md"),
            page("spec/compatibility.md"),
            page("spec/status.md"),
            page("spec/decisions.md"),
          ],
        },
        {
          text: "Targets",
          items: [
            page("spec/windows.md"),
            page("spec/windows-install.md"),
            page("spec/macos.md"),
            page("spec/xkb.md"),
          ],
        },
        {
          text: "Coverage",
          items: [
            page("spec/coverage/cldr-keyboard3.md", "CLDR Keyboard 3.0"),
            page("spec/coverage/windows.md", "Windows"),
            page("spec/coverage/macos.md", "macOS"),
            page("spec/coverage/xkb.md", "Linux (XKB)"),
          ],
        },
        {
          text: "On GitHub",
          items: [
            { text: "JSON Schema 0.1", link: "https://yakbd.github.io/kbl-spec/schema/0.1/kbl.schema.json" },
            { text: "JSON Schema 0.2", link: "https://yakbd.github.io/kbl-spec/schema/0.2/kbl.schema.json" },
            { text: "Examples", link: "https://github.com/yakbd/kbl-spec/tree/main/examples" },
            { text: "kbl-spec", link: "https://github.com/yakbd/kbl-spec" },
          ],
        },
      ],
      "/cli/": [
        {
          text: "CLI reference",
          items: [
            page("cli/index.md"),
            page("cli/targets.md"),
            page("cli/report-file.md"),
          ],
        },
        {
          text: "Windows",
          items: [
            page("cli/installer.md"),
            page("cli/installer-cli.md"),
            page("cli/cldr.md"),
            page("cli/dll-import.md"),
          ],
        },
        {
          text: "Releases",
          items: [page("cli/release.md"), { text: "What's new", link: "/releases" }],
        },
        {
          text: "On GitHub",
          items: [{ text: "yakbd-cli", link: "https://github.com/yakbd/yakbd-cli" }],
        },
      ],
    },
    outline: { level: [2, 3], label: "On this page" },
    socialLinks: [{ icon: "github", link: "https://github.com/yakbd", ariaLabel: "YAKBD on GitHub" }],
    search: { provider: "local" },
    footer: {
      message: "Free and open source under the MIT-0 licence.",
      copyright: "The YAKBD contributors",
    },
  },
});
