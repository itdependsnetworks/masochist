---
title: Tighten up module message sends (wikitext, 8cba11d)
tags: snippets
---

Pass in the module rather than just using "self". Although passing self was harmless (because the conversion methods never references it), passing in the module is technically more correct.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
