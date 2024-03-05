---
title: Build-in uninstaller for old versions (Synergy, 0b7051e)
tags: snippets
---

Now that we don't have an installer we still need a way to clean up old versions of the software, so build-in an uninstallation facility. This first implementation is for local (non-root) installs only. A subsequent commit will add global uninstall capability.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
