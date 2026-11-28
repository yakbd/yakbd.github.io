---
title: Quick start
---

# Quick start

One `.kbl.json` file holds the whole layout. `yakbd` reads the layout you already have into that file, checks it,
and builds it for each platform. Every command prints a report: errors, warnings, every loss (something a format or
platform cannot hold) and every choice taken from a default rule. A command with an error writes nothing.

## 1. Get a `.kbl.json` file

Convert the layout you have. yakbd reads MSKLC `.klc` files, CLDR keyboard XML, macOS `.keylayout` files, XKB
symbols files and installed Windows layout DLLs:

```sh
yakbd convert my-layout.klc my-layout.kbl.json          # or .xml, .keylayout, kbdmine.dll
yakbd convert -from xkb symbols-file my-layout.kbl.json # XKB files have no suffix
```

Or start from one of the [examples](https://github.com/yakbd/kbl-spec/tree/main/examples), or open a file in the
[editor](/editor/) and change it key by key.

## 2. Build it

Pick the platform with `-target`: `windows` (the default of `compile` and `installer`), `macos` or `xkb` (Linux).
`validate` shows the build's report without writing anything;
`installer` writes the file you hand out.

::: code-group

```sh [Windows]
yakbd validate -target windows my-layout.kbl.json
yakbd installer my-layout.kbl.json               # writes kbdmine-setup.exe (the DLL name + -setup.exe)
```

```sh [macOS]
yakbd validate -target macos my-layout.kbl.json
yakbd installer -target macos my-layout.kbl.json # writes the zip: the layout bundle and a README
```

```sh [Linux]
yakbd validate -target xkb my-layout.kbl.json
yakbd installer -target xkb my-layout.kbl.json   # writes the .tar.gz: the XKB files and install.sh
```

:::

Any computer builds for any platform. Choices the file does not make follow simple default rules, and the report
lists each one. When a default is not what you want, write the choice into the file: `yakbd pin` writes every
default into it, ready to edit (see [Targets](/cli/targets)).

## 3. Install it

- **Windows**: run the `-setup.exe`. It installs the layout for x64, x86 and ARM64 PCs, upgrades in place, and is
  listed under Installed apps. Replacing a layout installed by MSKLC? Read [Moving from MSKLC](./migrating-from-msklc)
  first. More in the [Windows guide](./windows).
- **macOS**: copy the bundle from the zip into `~/Library/Keyboard Layouts`, then add the layout in
  **System Settings › Keyboard › Text Input**. More in the [macOS guide](./macos).
- **Linux**: unpack the archive and run `install.sh` as yourself (no root), then pick the layout in your desktop's
  keyboard settings (GNOME, KDE Plasma, sway or X11). More in the [Linux guide](./linux).

## Next

- [Commands](/cli/): every command and its options.
- [The .kbl.json format](/spec/): what a file holds, with an example.
