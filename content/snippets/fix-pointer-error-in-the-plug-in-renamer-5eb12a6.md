---
title: Fix pointer error in the plug-in (REnamer, 5eb12a6)
tags: snippets
---

We were copying to argv\[1\] when we really wanted to copy to &argv\[1\].

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
