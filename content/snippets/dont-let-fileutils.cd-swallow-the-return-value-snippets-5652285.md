---
title: Don't let FileUtils.cd swallow the return value (snippets, 5652285)
tags: snippets
---

Explicitly return the value from the block (the block itself) will evaluate to nil.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
