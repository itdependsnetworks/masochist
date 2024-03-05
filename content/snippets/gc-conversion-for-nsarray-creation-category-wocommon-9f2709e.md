---
title: GC conversion for NSArray creation category (WOCommon, 9f2709e)
tags: snippets
---

Under GC the "array" method is effecively the same as the "copy" method, so mark it as deprecated and add code documentation advising callers to just do a copy instead.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
