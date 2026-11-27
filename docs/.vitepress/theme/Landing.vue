<script setup lang="ts">
import { ref } from "vue";
import { withBase } from "vitepress";

// One key of the example layout examples/latin-altgr-deadkeys.kbl.json in yakbd/kbl-spec.
const layers = [
  { id: "base", label: "no modifier", mods: "[[]]", out: "e" },
  { id: "shift", label: "Shift", mods: '[["shift"]]', out: "E" },
  { id: "altgr", label: "AltGr", mods: '[["altR"]]', out: "€" },
  { id: "altgrShift", label: "AltGr + Shift", mods: '[["shift", "altR"]]', out: "¢" },
] as const;
const active = ref<(typeof layers)[number]["id"]>("altgr");

const example =
  "https://github.com/yakbd/kbl-spec/blob/main/examples/latin-altgr-deadkeys.kbl.json";

const docs = [
  { href: "/guide/", title: "Install and quick start", text: "Download yakbd, or build it with Go, and make your first installer." },
  { href: "/guide/migrating-from-msklc", title: "Moving from MSKLC", text: "From a .klc file to an installed layout, without ever losing a working one." },
  { href: "/guide/recover-a-layout", title: "Recovering a layout", text: "Lost the source? Read the installed DLL back into an editable file." },
  { href: "/guide/windows-security-prompts", title: "Windows security prompts", text: "SmartScreen, Smart App Control and UAC: what you will see and why." },
  { href: "https://github.com/yakbd/yakbd-gui/releases/latest", title: "YAKBD Editor", text: "Download the desktop editor for .kbl.json files, for Windows, macOS and Linux." },
  { href: "/spec/windows", title: "Windows builds", text: "The default rules a Windows build follows, and how to pin them into a file." },
  { href: "/spec/", title: "The .kbl.json format", text: "What a layout file holds, with an example, and how to validate one." },
  { href: "/spec/format", title: "Specification", text: "Every field, the loss kinds, and the rules a schema cannot check." },
];
</script>

<template>
  <div class="landing">
    <section class="hero">
      <div class="hero-text">
        <h1>Your keyboard layout, built for every Windows PC.</h1>
        <p class="lead">
          YAKBD is a free, open-source file format and command-line tool for keyboard layouts. Bring a layout from
          Microsoft Keyboard Layout Creator (MSKLC) or Unicode CLDR, get one installer for x64, x86 and ARM64
          Windows, and read a report of everything that changed on the way.
        </p>
        <div class="actions">
          <a class="btn primary" :href="withBase('/guide/')">Install yakbd</a>
          <a class="btn" :href="withBase('/guide/migrating-from-msklc')">Moving from MSKLC</a>
        </div>
        <p class="meta">Runs on Windows, Linux and macOS · MIT-0 licence · preview release</p>
      </div>

      <figure class="keyfig" aria-labelledby="keyfig-caption">
        <div class="keycap" aria-hidden="true">
          <span
            v-for="l in layers"
            :key="l.id"
            :class="['legend', l.id, { on: active === l.id }]"
          >{{ l.out }}</span>
        </div>
        <div class="layer-pick" role="group" aria-label="Modifier keys held">
          <button
            v-for="l in layers"
            :key="l.id"
            type="button"
            :aria-pressed="active === l.id"
            @click="active = l.id"
          >{{ l.label }}</button>
        </div>
        <pre class="snippet" aria-label="How the E key is written in a .kbl.json file"><code><span class="c">"layers": [</span>
<span v-for="l in layers" :key="l.id" :class="['row', { on: active === l.id }]">  { "modifiers": {{ l.mods }},
    "bindings": { "KeyE": "{{ l.out }}" } },
</span><span class="c">]</span></code></pre>
        <figcaption id="keyfig-caption">
          The E key of an example layout: one entry per layer, in
          <a :href="example">a .kbl.json file</a> (shortened). Currently showing:
          <strong>{{ layers.find((l) => l.id === active)!.label }}</strong> types
          <strong>{{ layers.find((l) => l.id === active)!.out }}</strong>.
        </figcaption>
      </figure>
    </section>

    <section class="flow" aria-labelledby="flow-title">
      <h2 id="flow-title">One file in the middle</h2>
      <p class="section-lead">
        yakbd reads the layouts you already have into a <code>.kbl.json</code> file, and builds everything Windows
        needs from that file. You can edit the file, keep it in version control, and convert it back.
      </p>
      <ol class="flow-grid">
        <li class="col">
          <h3>What you have</h3>
          <ul>
            <li><strong>.klc</strong> file from MSKLC</li>
            <li><strong>CLDR</strong> Keyboard 3.0 XML</li>
            <li>An installed <strong>layout DLL</strong>, when the source is lost</li>
          </ul>
        </li>
        <li class="arrow" aria-hidden="true">
          <svg viewBox="0 0 48 24" width="48" height="24"><path d="M2 12h40m-8-8 8 8-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </li>
        <li class="col hub">
          <h3><code>my-layout.kbl.json</code></h3>
          <p>Every key on every layer, dead keys, and the exact choices a Windows build makes. Choices you leave out
          follow documented default rules.</p>
        </li>
        <li class="arrow" aria-hidden="true">
          <svg viewBox="0 0 48 24" width="48" height="24"><path d="M2 12h40m-8-8 8 8-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </li>
        <li class="col">
          <h3>What Windows gets</h3>
          <ul>
            <li>Layout <strong>DLLs</strong> for x64, x86 and ARM64</li>
            <li>One <strong>installer</strong> that picks the right ones</li>
            <li>A <strong>report</strong> of every loss and default</li>
          </ul>
        </li>
      </ol>
    </section>

    <section class="points" aria-labelledby="points-title">
      <h2 id="points-title">What you can count on</h2>
      <div class="points-grid">
        <dl>
          <div>
            <dt>Your MSKLC layouts keep working.</dt>
            <dd>MSKLC is no longer developed and runs only on Windows. yakbd reads its <code>.klc</code> files and
            builds them on Windows, Linux or macOS, including native ARM64 builds MSKLC cannot make.</dd>
          </div>
          <div>
            <dt>One installer for every Windows PC.</dt>
            <dd>It upgrades in place, is listed under "Installed apps", and takes <code>msiexec</code>'s switches
            and exit codes, so deployment tools can run it.</dd>
          </div>
          <div>
            <dt>Every loss is reported.</dt>
            <dd>When a format or Windows cannot hold part of a layout, the report says exactly what was dropped or
            changed, and your file says whether that is an error, a warning or fine.</dd>
          </div>
          <div>
            <dt>Lost the source?</dt>
            <dd>yakbd reads an installed layout DLL back into an editable file.</dd>
          </div>
        </dl>
        <div class="terminal">
          <pre aria-label="Example: three commands and the start of a report"><code><span class="p">$</span> yakbd convert my-layout.klc my-layout.kbl.json
<span class="p">$</span> yakbd validate -windows my-layout.kbl.json
<span class="dim">0 error(s), 1 warning(s), 17 accepted, 0 info; 3 loss(es), 15 default(s) used</span>
<span class="warn">/positions/NumpadDecimal: warning (loss):</span> NumpadDecimal has outputs with Shift; Windows turns Shift+number pad into navigation
<span class="p">$</span> yakbd installer my-layout.kbl.json
<span class="dim"># writes &lt;dll name&gt;-setup.exe, for example kbdmine-setup.exe</span></code></pre>
        </div>
      </div>
    </section>

    <section class="docs" aria-labelledby="docs-title">
      <h2 id="docs-title">Start here</h2>
      <ul class="doc-list">
        <li v-for="d in docs" :key="d.href">
          <a :href="d.href.startsWith('/') ? withBase(d.href) : d.href">
            <span class="doc-title">{{ d.title }}</span>
            <span class="doc-text">{{ d.text }}</span>
            <svg class="doc-arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h13m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
        </li>
      </ul>
    </section>

    <section class="status" aria-labelledby="status-title">
      <h2 id="status-title">A preview, tested on Windows</h2>
      <p>
        Commands, options and the format may still change before 1.0. Layouts built by yakbd have been tested in
        Windows 10 and Windows 11 virtual machines (x64 and x86): they load, type as expected, and install, upgrade
        and uninstall cleanly. ARM64 support is tested in emulation only. Windows is the only build target so far; other operating systems may follow, chosen by what users
        ask for.
      </p>
      <p class="links">
        <a href="https://github.com/yakbd/yakbd-cli/releases">Releases</a>
        <a href="https://github.com/yakbd/yakbd-cli">yakbd-cli on GitHub</a>
        <a href="https://github.com/yakbd/kbl-spec">kbl-spec on GitHub</a>
        <a href="https://yakbd.github.io/kbl-spec/schema/0.1/kbl.schema.json">JSON Schema</a>
        <a href="https://github.com/yakbd/.github/blob/main/CONTRIBUTING.md">Contributing</a>
      </p>
    </section>
  </div>
</template>

<style scoped>
.landing {
  --gutter: clamp(16px, 4vw, 48px);
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 var(--gutter) 96px;
  color: var(--vp-c-text-1);
}

h1 {
  font-size: clamp(2.25rem, 5.2vw, 3.75rem);
  line-height: 1.06;
  letter-spacing: -0.03em;
  font-weight: 700;
  text-wrap: balance;
  margin: 0;
}
h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-weight: 700;
  margin: 0 0 16px;
  text-wrap: balance;
}
h3 {
  font-size: 1rem;
  font-weight: 650;
  margin: 0 0 12px;
}
code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.875em;
}
a {
  color: var(--vp-c-brand-1);
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
  padding: clamp(40px, 8vw, 96px) 0 clamp(56px, 8vw, 104px);
}
.lead {
  font-size: 1.1875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 34em;
  margin: 24px 0 32px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.btn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 22px;
  border-radius: 22px;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  background: transparent;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}
.btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.btn.primary {
  background: var(--vp-button-brand-bg);
  border-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}
.btn.primary:hover {
  background: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
}
.meta {
  margin: 20px 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

/* The key figure */
.keyfig {
  margin: 0;
  display: grid;
  justify-items: center;
  gap: 20px;
}
.keycap {
  --cap: clamp(168px, 22vw, 216px);
  position: relative;
  width: var(--cap);
  height: var(--cap);
  border-radius: 22px;
  background: linear-gradient(180deg, var(--yk-key-side), var(--yk-key-side));
  border: 3px solid var(--yk-key-edge);
  box-shadow: 0 18px 32px -14px rgba(60, 35, 20, 0.45);
}
.keycap::before {
  /* the dished top of the key */
  content: "";
  position: absolute;
  inset: 8px 14px 22px;
  border-radius: 14px;
  background: var(--yk-key-top);
  box-shadow: inset 0 -2px 0 rgba(90, 58, 38, 0.12);
}
.legend {
  position: absolute;
  z-index: 1;
  font-family: var(--vp-font-family-base);
  font-weight: 600;
  line-height: 1;
  color: var(--yk-ink-2);
  font-size: calc(var(--cap) * 0.17);
  transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.legend.base { left: 22%; bottom: 26%; }
.legend.shift { left: 22%; top: 16%; }
.legend.altgr { right: 22%; bottom: 26%; }
.legend.altgrShift { right: 22%; top: 16%; }
.legend.on {
  color: var(--vp-c-brand-1);
  transform: scale(1.28);
}
.legend.on::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 3px;
  border-radius: 2px;
  background: var(--yk-yellow);
}
.layer-pick {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
.layer-pick button {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  border: 1px solid var(--vp-c-border);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
.layer-pick button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.layer-pick button[aria-pressed="true"] {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.snippet {
  width: 100%;
  margin: 0;
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--vp-code-block-bg);
  overflow-x: auto;
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.snippet code {
  font-size: inherit;
}

.snippet .row {
  display: block;
  border-radius: 4px;
  transition: background-color 0.25s, color 0.25s;
}
.snippet .row.on {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}
.keyfig figcaption {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
  text-align: center;
  max-width: 36em;
}

/* Sections */
section + section {
  border-top: 1px solid var(--vp-c-divider);
}
.flow,
.points,
.docs,
.status {
  padding: clamp(48px, 7vw, 88px) 0;
}
.section-lead {
  max-width: 40em;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0 0 40px;
}

.flow-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr auto 1.15fr auto 1fr;
  align-items: center;
  gap: 16px;
}
.flow-grid .col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  color: var(--vp-c-text-2);
  line-height: 1.45;
}
.flow-grid .col li {
  padding-left: 16px;
  position: relative;
}
.flow-grid .col li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--yk-yellow);
}
.flow-grid .col li strong {
  color: var(--vp-c-text-1);
}
.flow-grid .hub {
  padding: 24px;
  border-radius: 16px;
  background: var(--vp-c-bg-alt);
  border: 2px solid var(--vp-c-brand-1);
}
.flow-grid .hub h3 code {
  font-size: 0.95rem;
  color: var(--vp-c-brand-1);
}
.flow-grid .hub p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  font-size: 0.9375rem;
}
.flow-grid .arrow {
  color: var(--vp-c-brand-1);
  display: flex;
  justify-content: center;
}

.points-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
  margin-top: 32px;
}
.points dl {
  margin: 0;
  display: grid;
  gap: 28px;
}
.points dt {
  font-weight: 650;
  font-size: 1.0625rem;
  margin-bottom: 6px;
}
.points dd {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.terminal pre {
  margin: 0;
  padding: 20px 22px;
  border-radius: 14px;
  background: #211a16;
  color: #eadfd2;
  font-size: 0.78125rem;
  line-height: 1.75;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  box-shadow: 0 16px 30px -18px rgba(40, 24, 14, 0.6);
}
.dark .terminal pre {
  background: #120e0c;
  box-shadow: none;
  border: 1px solid var(--vp-c-divider);
}
.terminal .p {
  color: #f5b82e;
  user-select: none;
}
.terminal .dim {
  color: #a89585;
}
.terminal .warn {
  color: #f2bf8d;
}

.doc-list {
  list-style: none;
  margin: 24px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
}
.doc-list li {
  border-bottom: 1px solid var(--vp-c-divider);
}
.doc-list a {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 16px;
  padding: 18px 4px;
  text-decoration: none;
  color: inherit;
}
.doc-title {
  font-weight: 650;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}
.doc-text {
  grid-column: 1;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-top: 4px;
}
.doc-arrow {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  color: var(--vp-c-text-3);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s;
}
.doc-list a:hover .doc-title,
.doc-list a:hover .doc-arrow {
  color: var(--vp-c-brand-1);
}
.doc-list a:hover .doc-arrow {
  transform: translateX(4px);
}

.status p {
  max-width: 44em;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0;
}
.status .links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-top: 24px;
}
.status .links a {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 860px) {
  .hero,
  .points-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .flow-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .flow-grid .arrow svg {
    transform: rotate(90deg);
  }
  .doc-list {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .legend,
  .snippet .row,
  .doc-arrow {
    transition: none;
  }
}
</style>
