---
title: Modify NSCursor category for garbage collection (WOBezel, 73e0de7)
tags: snippets
---

Change previously static local variables to globals so that the desired singleton behaviour can be achieved under garbage collection (ie. once initialized, the custom cursors will act as singletons and be available for the duration of execution).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
