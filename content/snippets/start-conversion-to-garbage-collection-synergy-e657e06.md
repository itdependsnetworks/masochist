---
title: Start conversion to Garbage Collection (Synergy, e657e06)
tags: snippets
---

As first phase, replace dealloc methods with finalize ones; in fact many of the dealloc methods could be entirely removed, and were.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
