---
title: Simplify WONotificationCenter class (WOCommon, a0dd82c)
tags: snippets
---

Thanks to new API in Leopard we can replace about 150 lines of very complex code (that plays with threads, run loops, mach ports etc) with only 25 lines of very simple code. This should be a much more robust implementation with far fewer limitations.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
