---
title: Fix inappropriate 1-pixel inset inside grouping views (gdiff, 6c01eb2)
tags: snippets
---

Fix alignment bug introduced along with the addition of upper and lower borders. Only the outermost subviews need to be inset by one pixel; additional subviews nested inside the outermost subviews automatically inherit that base positioning and therefore shouldn't specify an additional inset.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
