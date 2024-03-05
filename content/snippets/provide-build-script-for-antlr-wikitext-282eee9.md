---
title: Provide build script for ANTLR (wikitext, 282eee9)
tags: snippets
---

Make the ANTLR build process less error prone by doing it all in a reproducible script which cleans, extracts the tar archives, applies the patches, works around the build bug, and builds both ANTLR itself and the C target runtime.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
