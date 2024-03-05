---
title: Add WOMakeCollectable function (WOPublic, 1035d53)
tags: snippets
---

It's not safe to pass NULL values to CFMakeCollectable, so this wrapper function performs a check before doing so. It can be used in places where an explicit check would only add clutter.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
