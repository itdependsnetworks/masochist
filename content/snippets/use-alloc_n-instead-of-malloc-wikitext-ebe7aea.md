---
title: Use ALLOC_N instead of malloc (wikitext, ebe7aea)
tags: snippets
---

There was a lone malloc call in the parser which is best replaced with ALLOC_N (the latter will automatically invoke the Ruby garbage collector if allocation fails, and will raise an exception if allocation fails again after that).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
