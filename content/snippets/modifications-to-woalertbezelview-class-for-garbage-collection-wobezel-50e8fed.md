---
title: Modifications to WOAlertBezelView class for garbage collection (WOBezel, 50e8fed)
tags: snippets
---

Remove autorelease message send which is now a no-op under garbage collection.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
