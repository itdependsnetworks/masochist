---
title: Remove unnecessary key/value observing (REnamer, 30a1b9e)
tags: snippets
---

We were doing some unnecessary (but harmless) key/value observing; I suspect this is a legacy from a very old version of the codebase. Clean out the cruft.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
