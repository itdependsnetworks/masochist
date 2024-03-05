---
title: GC changes for WOHost class (WOCommon, d3a1e89)
tags: snippets
---

Get rid of retain/release calls, and use a simpler storage logic (no need for using NSValue wrappers any more; circular retain cycles are no longer an issue).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
