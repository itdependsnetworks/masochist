---
title: Fix drawing glitches in source list (gdiff, b001fe1)
tags: snippets
---

The cause of the drawing glitches was a missing super call in the drawRect: method in the subclass template. Not only are the glitches fixed but the background color now draws as well.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
