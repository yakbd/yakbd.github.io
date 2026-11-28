import { defineConfig } from "vitepress";
import { slug } from "github-slugger";
import sources from "../../sources.json" with { type: "json" };

const title = (out: string) => sources.pages.find((p) => p.out === out)!.title;

export default defineConfig({
  lang: "en",
  title: "YAKBD",
  titleTemplate: ":title · YAKBD",
  description:
    "YAKBD is an open-source keyboard layout designer: design a layout once in an open format and build native, installable layouts. Windows, macOS and Linux today; keyboard tools such as Keyman later.",
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
      { text: "Download", link: "https://github.com/yakbd/yakbd-cli/releases/latest" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: title("guide/index.md"), link: "/guide/" },
            { text: title("guide/migrating-from-msklc.md"), link: "/guide/migrating-from-msklc" },
            { text: title("guide/recover-a-layout.md"), link: "/guide/recover-a-layout" },
            { text: title("guide/macos.md"), link: "/guide/macos" },
            { text: title("guide/linux.md"), link: "/guide/linux" },
            { text: title("guide/windows-security-prompts.md"), link: "/guide/windows-security-prompts" },
            { text: title("guide/code-signing-policy.md"), link: "/guide/code-signing-policy" },
          ],
        },
        {
          text: "More on GitHub",
          items: [
            { text: "Releases", link: "https://github.com/yakbd/yakbd-cli/releases/latest" },
            { text: "Installers and their command line", link: "https://github.com/yakbd/yakbd-cli/blob/main/docs/installer-cli.md" },
            { text: "All tool documentation", link: "https://github.com/yakbd/yakbd-cli/tree/main/docs" },
            { text: "Contributing", link: "https://github.com/yakbd/.github/blob/main/CONTRIBUTING.md" },
          ],
        },
      ],
      "/editor/": [
        {
          text: "Editor",
          items: [
            { text: title("editor/index.md"), link: "/editor/" },
            { text: title("editor/verified.md"), link: "/editor/verified" },
          ],
        },
        {
          text: "More on GitHub",
          items: [
            { text: "Repository", link: "https://github.com/yakbd/yakbd-gui" },
            { text: "Contributing", link: "https://github.com/yakbd/.github/blob/main/CONTRIBUTING.md" },
          ],
        },
      ],
      "/spec/": [
        {
          text: "Format",
          items: [
            { text: title("spec/index.md"), link: "/spec/" },
            { text: title("spec/format.md"), link: "/spec/format" },
            { text: title("spec/windows.md"), link: "/spec/windows" },
            { text: title("spec/macos.md"), link: "/spec/macos" },
            { text: title("spec/xkb.md"), link: "/spec/xkb" },
            { text: title("spec/compatibility.md"), link: "/spec/compatibility" },
          ],
        },
        {
          text: "Schema and more",
          items: [
            { text: "JSON Schema", link: "https://yakbd.github.io/kbl-spec/schema/0.1/kbl.schema.json" },
            { text: "Examples", link: "https://github.com/yakbd/kbl-spec/tree/main/examples" },
            { text: "Design decisions", link: "https://github.com/yakbd/kbl-spec/blob/main/DECISIONS.md" },
            { text: "Repository", link: "https://github.com/yakbd/kbl-spec" },
          ],
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
