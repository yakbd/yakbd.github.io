---
title: The .kbl.json format
---

# The .kbl.json format

`.kbl.json` is an open JSON format for keyboard layouts. One file holds everything needed to build one layout: what
each key types with each combination of modifier keys, the dead keys (accent keys that change the next key pressed),
and, per platform, the exact choices a build makes. The `yakbd` tool converts layouts to and from it and builds it
into native layouts.

## Why it exists

Every platform has its own layout format: Windows a DLL, usually made from an MSKLC `.klc` file; macOS a
`.keylayout` file; Linux XKB symbols and Compose files. Each can express things the others cannot, and a layout made
for one is hard to move to another.

Unicode CLDR has a good, platform-neutral keyboard format, [CLDR Keyboard 3.0](https://www.unicode.org/reports/tr35/tr35-keyboards.html).
But a CLDR keyboard describes a language's layout, not how to build it for a given system: which key codes, which
file name, how Caps Lock behaves on each key.

A `.kbl.json` file describes one concrete layout. Its main part is platform-neutral and holds everything a CLDR
Keyboard 3.0 file holds: the format is a superset of it. Next to it, one section per platform (`targets.windows`,
`targets.macos`, `targets.xkb`) holds the choices only that platform's build needs. Where a section is silent, a
small set of documented default rules decides, so a program needs only the file and the specification.

- **Losses are reported.** When a format or platform cannot hold part of a layout, the tool lists exactly what was
  dropped or changed, by kind of loss. The file says per kind whether that is an error, a warning or fine (`onLoss`).
- **Files are self-contained.** The layout data never refers to another file.
- **Defaults can be written into the file.** `yakbd pin` writes the result of every default rule of a platform into
  the file, which then states every choice itself.

## A small example

An excerpt of [`minimal-qwerty.kbl.json`](https://github.com/yakbd/kbl-spec/blob/main/examples/minimal-qwerty.kbl.json),
shortened (`…` marks what is left out):

```json
{
  "$schema": "https://yakbd.github.io/kbl-spec/schema/0.1/kbl.schema.json",
  "kbl": "0.1",
  "metadata": {
    "id": "en-t-k0-kblmin",
    "name": "Minimal QWERTY (example)",
    "version": "0.1.0",
    "license": "MIT-0",
    …
  },
  "positions": {
    "Escape": { "scanCode": "01", "name": "Esc" },
    "Digit1": { "scanCode": "02" },
    …
  },
  "hardware": {
    "layers": [
      { "id": "base",  "modifiers": [[]],        "bindings": { "Digit1": "1", "KeyQ": "q", … } },
      { "id": "shift", "modifiers": [["shift"]], "bindings": { "Digit1": "!", "KeyQ": "Q", … } },
      …
    ]
  },
  "targets": {
    "windows": { "registration": { "langId": "0409" } }
  }
}
```

- `metadata.id` is a BCP 47 language tag, the kind of identifier CLDR uses for its keyboards.
- `positions` names the physical keys (the W3C `KeyboardEvent.code` names) with the scan code each one sends.
- `hardware.layers` lists the layers of a physical keyboard. `modifiers` says which modifier sets select a layer
  (each inner array is one set held together; `[[]]` is no modifier), and `bindings` what each key types there.
- `targets.windows` holds only the Windows language id. Everything else a Windows build needs comes from the
  [Windows default rules](./windows), and the build reports each default it used.

More [examples](https://github.com/yakbd/kbl-spec/tree/main/examples) show AltGr and dead keys, a layout imported
from CLDR, most Windows features, the macOS Option layer and Linux Caps Lock handling.

## Validating a file

The JSON Schema (draft 2020-12) of each version is published at its own address, which is also its `$id`:

- 0.1: `https://yakbd.github.io/kbl-spec/schema/0.1/kbl.schema.json`
- 0.2: `https://yakbd.github.io/kbl-spec/schema/0.2/kbl.schema.json`
- `https://yakbd.github.io/kbl-spec/schema/latest/kbl.schema.json` serves the newest version and moves with each
  new minor version, so name a versioned address in a file's `$schema`.

Any draft 2020-12 validator works, for example:

```sh
npx ajv-cli@5.0.0 validate --spec=draft2020 -s kbl.schema.json -d my-layout.kbl.json
```

The schema checks the structure. Rules that relate parts of a file to each other (a key that names a dead key needs
that dead key in the same file) are in [Validation rules beyond the schema](./format#19-validation-rules-beyond-the-schema),
and `yakbd validate` checks them all.

## Versions

- **0.1** (preview) holds the platform-neutral layout and the Windows target.
- **0.2** (preview) adds the macOS target (`targets.macos`) and the Linux target (`targets.xkb`) and changes nothing
  in 0.1: a 0.1 file means the same in 0.2, and tools write 0.2 only for a file that uses something new.
- Each later platform (Android, iOS, ChromeOS, Keyman are planned) comes with a new minor version.

What stays stable and how changes are announced: [Compatibility](./compatibility). What is tested and the
changelog: [Status and changelog](./status).

## The documents

| document | what it covers |
|---|---|
| [Specification](./format) | every field and what it means, the loss kinds, the validation rules |
| [Windows builds](./windows), [Windows installation](./windows-install) | how a file becomes a Windows layout DLL and how it is installed |
| [macOS builds](./macos) | how a file becomes a macOS layout bundle |
| [Linux (XKB) builds](./xkb) | how a file becomes an XKB layout and a Compose file |
| Coverage: [CLDR](./coverage/cldr-keyboard3), [Windows](./coverage/windows), [macOS](./coverage/macos), [XKB](./coverage/xkb) | every part of each format and where it goes in `.kbl.json` |
| [Design decisions](./decisions) | the decisions behind the format, numbered, each with its reason |
| [Compatibility](./compatibility) | what 0.x promises |
