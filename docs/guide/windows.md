---
title: Windows
---

# Windows

yakbd builds a native Windows keyboard layout from a `.kbl.json` file: a layout DLL for each Windows architecture
(x64, x86, ARM64 and the WOW64 build 64-bit Windows needs for 32-bit programs) and one installer that carries them
all. It also reads MSKLC `.klc` files, CLDR keyboard XML and installed layout DLLs, and writes `.klc` files. It runs
on Windows, macOS and Linux; no Microsoft tool is needed.

## Build

```sh
yakbd validate -target windows my-layout.kbl.json   # the build's report, nothing written
yakbd compile my-layout.kbl.json         # the DLLs, each architecture in a folder of its own
yakbd installer my-layout.kbl.json       # one installer, for example kbdmine-setup.exe
yakbd installer my-layout.klc            # straight from a .klc file
yakbd pin my-layout.kbl.json pinned.kbl.json   # every Windows default written into the file
```

What the file does not state (the DLL name, Windows key codes, Caps Lock per key and more) follows the default
rules in [Windows builds](/spec/windows), and the report lists each one. The Windows language id
(`targets.windows.registration.langId`, for example `0409`) has no default: the file must name it.

## Install

Run the installer on the PC that types with the layout. It installs the right DLL for the PC, registers the layout,
adds it to the input list of the user who runs it, upgrades an older version in place, and is listed under
**Settings › Apps › Installed apps**. It takes `msiexec`'s switches and exit codes, so deployment tools can run it
unattended: [Installer command line](/cli/installer-cli). What it changes on the PC: [Windows installers](/cli/installer).

The installers are not code-signed, so SmartScreen or Smart App Control may stop them:
[Windows security prompts](./windows-security-prompts).

## More

- [Moving from MSKLC](./migrating-from-msklc): from a `.klc` file to an installed layout, without ever losing a
  working one.
- [Recovering a layout](./recover-a-layout): lost the source? Read the installed DLL back into an editable file.
- [CLDR keyboards](/cli/cldr): importing CLDR Keyboard 3.0 files and building them for Windows.
- [Windows builds](/spec/windows) and [Windows installation](/spec/windows-install): the rules a build and an
  installer follow, in the format's specification.
