---
title: GC changes for NSFileManager+WOPathUtilities category (WOCommon, 0a2b28e)
tags: snippets
---

Under GC and Leopard it no longer makes any sense to use the WO_RELEASE macro; use CFRelease instead.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
