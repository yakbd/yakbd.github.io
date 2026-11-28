---
title: YAKBD Editor
---

# YAKBD Editor

The YAKBD Editor is a desktop editor for `.kbl.json` layout files, for Windows, macOS and Linux. It shows the layout
as a keyboard, layer by layer, and lets you change what each key types, the dead keys, the metadata and the build
choices of each platform. Checking, converting and building are done by the [`yakbd` tool](/guide/), which ships
inside the editor: the editor never makes a platform decision itself.

[Download the editor](/guide/#the-editor) · [Latest release](https://github.com/yakbd/yakbd-gui/releases/latest)

<figure class="shot">
  <img class="only-light" src="/images/editor-light.png" alt="The YAKBD Editor: a layout on a keyboard picture, the key panel and the problems list">
  <img class="only-dark" src="/images/editor-dark.png" alt="The YAKBD Editor in dark appearance">
</figure>

## What it does

- **Open** `.kbl.json` files. MSKLC `.klc` files, CLDR keyboard XML and Windows layout DLLs open as a new, unsaved
  layout, with the report of what the conversion changed.
- **Save** writes your edits and nothing else: an untouched file saves byte for byte, and an edit changes only the
  lines of the edited value, in the file's own formatting.
- **Keyboard**: the layout on a keyboard picture, one layer at a time. Dead keys, keys that fall back to the layer
  without Caps Lock, and keys that type nothing are marked. Arrow keys move between keys, Enter edits.
- **Key panel**: what the key does in the current layer (text, code points, dead key, nothing), its scan code and
  name, and every layer at a glance.
- **Dead keys**: the composition tables, the character each dead key stands for, and what happens without a match.
- **Forms** for the metadata, the behaviour and each platform's build choices (Windows, macOS, Linux and the
  others), made from the format's JSON Schema. An empty field leaves the choice to the default rule.
- **JSON**: any part of the file as JSON, for what the forms do not cover.
- **Problems**: `yakbd validate` runs for the chosen platform shortly after every change; each problem, loss and
  defaulted choice links to the field it concerns. **Pin Defaults** writes those choices into the file.
- **Build** and **Build Installer** run `yakbd compile` and `yakbd installer` for the chosen platform: the Windows
  installer, the macOS zip or the Linux archive.
- Undo and redo for every edit, recent files, light and dark appearance.

## Platforms

| | Windows | macOS | Linux |
|---|---|---|---|
| runs on | Windows, x64 and ARM64 | macOS 14.4 or later, Apple silicon and Intel | x86-64 with glibc 2.35 or later (Ubuntu 22.04+, Debian 12+, Fedora) |
| builds for | Windows, macOS and Linux | Windows, macOS and Linux | Windows, macOS and Linux |
| style | Fluent (WinUI 3) | native macOS controls, the system menu bar | Fusion, with the desktop's theme where it has one |
| light and dark | follows Windows | follows macOS | follows the desktop; View › Appearance forces one |

Pick the platform a layout is checked and built for under **Layout › Target**, or in the list beside Validate:
[Targets in the editor](./targets). Android, iOS, ChromeOS and Keyman are planned; the editor gets each one
through the `yakbd` tool.

## More

- [Building the editor](./building) from source.
- [What is verified](./verified): what was checked on which system, and what still needs a person.
- [Code signing policy](./code-signing-policy).
