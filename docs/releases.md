---
title: What's new
---

# What's new

One short entry per release, newest first. Downloads are always on the latest release pages:
[yakbd](https://github.com/yakbd/yakbd-cli/releases/latest) (the tool) and
[YAKBD Editor](https://github.com/yakbd/yakbd-gui/releases/latest); how to install them is in [Install](/guide/).
The format's own changelog is [Status and changelog](/spec/status).

## 0.2.0-preview.1 (2026-11-28): macOS and Linux

yakbd and the YAKBD Editor 0.2.0-preview.1, format 0.2 (preview). The editor downloads are now
`yakbd-gui.dmg` and `yakbd-gui-x86_64.AppImage`.

- **macOS**: `yakbd installer -target macos` builds a layout bundle and a zip with install steps, on any computer.
  `.keylayout` files convert to and from `.kbl.json`. [macOS guide](/guide/macos)
- **Linux (XKB)**: `yakbd installer -target xkb` builds an archive with the XKB symbols, Compose and registry files
  and an install script that needs no root, for Wayland and X11. XKB symbols files convert to and from `.kbl.json`.
  [Linux guide](/guide/linux)
- **`-target`** on `compile`, `installer`, `pin` and `validate` picks the platform; Windows stays the default.
  [Targets](/cli/targets)
- **Editor**: pick Windows, macOS or Linux under Layout › Target; Validate, Pin Defaults and Build follow it, with
  forms for the macOS and Linux choices. [Targets in the editor](/editor/targets)
- **Format 0.2** adds `targets.macos` and `targets.xkb` and their loss kinds; 0.1 files are unchanged and stay 0.1.
  [The format](/spec/)

## 0.1.0-preview.3 (2026-11-27)

yakbd and the YAKBD Editor, Windows.

- yakbd converts MSKLC `.klc` files, CLDR keyboard XML and installed layout DLLs to `.kbl.json` and back, and builds
  Windows layout DLLs for x64, x86 and ARM64 with one installer per layout.
- `yakbd-cli-setup.exe` and `yakbd-gui-setup.exe` install the tool and the editor on Windows; the tool also comes
  for macOS and Linux, the editor as a macOS disk image and a Linux AppImage.
- Format 0.1 (preview) with the Windows target.
