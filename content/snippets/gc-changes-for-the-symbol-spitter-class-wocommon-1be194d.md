---
title: GC changes for the symbol spitter class (WOCommon, 1be194d)
tags: snippets
---

Remove the dealloc method entirely, as it is now redundant under GC.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
