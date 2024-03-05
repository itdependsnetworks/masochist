---
title: Remove special case for PRE in the "pop excess elements" function (wikitext, 504bb6e)
tags: snippets
---

By explicitly popping back to the closest BLOCKQUOTE block (if any) we can avoid the need to supply special case code in the "pop excess elements" function.

This is better because it keeps the logic for the PRE case more localized.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
