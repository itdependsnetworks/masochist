---
title: Avoid void pointer arithmetic in WOCreateFSRefArrayFromAEDesc() (REnamer, 2fe20b9)
tags: snippets
---

This code reads more nicely and is perhaps less error prone if we do it without void pointer arithmetic.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
