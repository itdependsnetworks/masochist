---
title: Avoid uninitialized use of variable (Synergy, 26d81a6)
tags: snippets
---

GCC warns here because in the event of an error the variable might be used prior to initialization. Fix by moving the initialize to the very top of the method body.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
