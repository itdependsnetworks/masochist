---
title: Avoid stat calls (buildtools, c639a41)
tags: snippets
---

Shave off some lines and clean up the code a little by avoiding the stat invocations and using the -nt and -ot test primaries instead.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
