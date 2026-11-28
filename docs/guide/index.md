---
title: Install
---

# Install

YAKBD comes as two programs. **`yakbd`** is the command-line tool that converts, checks and builds layouts. The
**YAKBD Editor** is a desktop editor for `.kbl.json` files; it ships with `yakbd` inside and runs it for every check
and build. Both are free (MIT-0) and run on Windows, macOS and Linux.

Every computer can build for every target: a Linux PC builds a Windows installer, a Windows PC builds a macOS
layout bundle. You install the layout on the computer that types with it.

## The yakbd tool

From the [latest release](https://github.com/yakbd/yakbd-cli/releases/latest):

| your computer | download | then |
|---|---|---|
| Windows (x64, x86, ARM64) | [`yakbd-cli-setup.exe`](https://github.com/yakbd/yakbd-cli/releases/latest/download/yakbd-cli-setup.exe) | Run it. It installs `yakbd.exe` for your PC into `Program Files\YAKBD\CLI` and can put it on the PATH. Unattended: `yakbd-cli-setup.exe /quiet /norestart` from an elevated prompt. |
| macOS (Intel and Apple silicon) | `yakbd-…-macos.tar.gz` | Unpack it and put `yakbd` on your PATH (one universal binary). |
| Linux x86-64 | `yakbd-…-linux-amd64.tar.gz` | Unpack it and put `yakbd` on your PATH. |
| Linux ARM64 | `yakbd-…-linux-arm64.tar.gz` | Unpack it and put `yakbd` on your PATH. |

Each archive holds `yakbd`, `LICENSE` and `NOTICE`. With Go 1.26 or later you can build it yourself instead:

```sh
go install github.com/yakbd/yakbd-cli/cmd/yakbd@latest
```

Releases are not code-signed, so Windows may warn about an installer: [Windows security prompts](./windows-security-prompts)
explains each prompt. Uninstall from **Settings › Apps › Installed apps**, entry **YAKBD**.

## The editor

From the [latest editor release](https://github.com/yakbd/yakbd-gui/releases/latest):

| your computer | download | then |
|---|---|---|
| Windows (x64, ARM64) | [`yakbd-gui-setup.exe`](https://github.com/yakbd/yakbd-gui/releases/latest/download/yakbd-gui-setup.exe) | Installs the editor and the `yakbd` tool together into `Program Files\YAKBD`. On 32-bit Windows only the tool can be installed. |
| macOS 14.4 or later | `YAKBD-Editor-….dmg` | Drag **YAKBD Editor** to Applications. The app is not code-signed, so macOS blocks it the first time: open it once, then click **Open Anyway** in **System Settings › Privacy & Security**. |
| Linux x86-64 (glibc 2.35 or later) | `YAKBD-Editor-…-x86_64.AppImage` | Make it executable and run it. It needs FUSE 2, or run it with `--appimage-extract-and-run`. |

On a minimal Linux system the AppImage may miss a few libraries every desktop has. On Debian or Ubuntu:

```sh
sudo apt install libgl1 libegl1 libxkbcommon0 libfontconfig1 libdbus-1-3 libglib2.0-0 libgssapi-krb5-2
# under X11 also:
sudo apt install libxcb-cursor0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-render-util0 libxcb-shape0 libxcb-xkb1 libxkbcommon-x11-0
```

On Fedora, the X11 set is `sudo dnf install xcb-util-cursor xcb-util-wm xcb-util-image xcb-util-keysyms xcb-util-renderutil libxkbcommon-x11`.

The Windows installers of the tool and the editor are one product: each one sees, upgrades or keeps what the other
installed. Their switches (`/quiet`, `ADDLOCAL`, `REMOVE`, `ADDTOPATH`) are in
[Installer command line](/cli/installer-cli). To build the editor yourself, see
[Building the editor](/editor/building).

## Checking a download

Every release has a `SHA256SUMS` file and a build provenance attestation for each file. With the GitHub CLI:

```sh
gh attestation verify yakbd-cli-setup.exe -R yakbd/yakbd-cli
gh attestation verify yakbd-gui-setup.exe -R yakbd/yakbd-gui
```

[Releases and checking a download](/cli/release#3-how-to-check-a-downloaded-file) has the details;
[Not code-signed](./code-signing-policy) says why releases carry no signature and what to click.

## Status

Everything is a preview: commands, options and the format may still change before 1.0.

- **Windows**: layouts built by yakbd are tested in Windows 10 and 11 virtual machines (x64 and x86): they load,
  type as expected, and install, upgrade and uninstall cleanly. ARM64 is tested in emulation only. Every CLDR
  release 49 keyboard imports and builds.
- **macOS**: bundles are installed, selected and typed by script on GitHub's macOS 15 and 26 runners (Apple silicon).
  Not tested yet: the steps in System Settings by hand, Intel Macs.
- **Linux**: test layouts are typed under libxkbcommon (Debian 13, Ubuntu 26.04, Fedora 45, Arch Linux), X11, weston,
  sway, KWin and mutter in containers. Not tested yet: a full GNOME Shell session, IBus, real keyboards.

The editor: [What is verified](/editor/verified). The format: [Status and changelog](/spec/status).

## Next

[Quick start](./quick-start): from a layout file to an installed layout on Windows, macOS and Linux.
