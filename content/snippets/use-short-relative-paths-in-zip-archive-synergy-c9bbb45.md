---
title: Use short relative paths in zip archive (Synergy, c9bbb45)
tags: snippets
---

Don't use absolute paths when preparing the zip archive (all the levels wind up in the extracted contents as well); instead keep the relative paths as short as possible by changing into the target build dir before preparing the archive.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
