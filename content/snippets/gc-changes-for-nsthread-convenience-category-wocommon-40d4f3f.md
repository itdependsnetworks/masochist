---
title: GC changes for NSThread convenience category (WOCommon, 40d4f3f)
tags: snippets
---

Basically just removing the release messages, using "drain" instead of "release" on autorelease pools, and relying on the "invalidate" method to remove the connection's ports from the run loop.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
